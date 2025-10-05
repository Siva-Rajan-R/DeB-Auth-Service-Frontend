import { useContext, useEffect, useState,useRef } from 'react'
import { IceBlueButton } from './Buttons'
import { SecretsInputBox } from './SecretsInputBox'
import { Copy, Lock } from 'lucide-react' // icon library
import { SecretsGenerationDialog, SecretsRegenerateDialog, SecretsRemoveDialog } from './Dialogs'
import { useNetworkCalls } from '../Utils/NetworkCalls'
import { AuthContext } from '../Contexts/UserContext'


const copyToClipboard = (inputTxt) => {
    navigator.clipboard.writeText(inputTxt)
    alert(`${inputTxt} Copied Successfully`)
}

const AUTH_METHODS = [
    { label: "Google", value: "google" },
    { label: "GitHub", value: "github" },
    { label: "Facebook", value: "facebook" },
    { label: "OTP", value: "otp" },
]



export const SecretsCard = ({credIndex,apikey="",clientSecret="",canChangeBranding=false, brandingName="De-Buggers",redirecturl="",authMethods=[]}) => {
    const [selectedMethods, setSelectedMethods] = useState(authMethods)
    const {isSecretsAdded,setSecretsAdded}=useContext(AuthContext)
    const [openDialog,setOpenDialog]=useState(false)
    const [isSaving,setSaving]=useState(false)
    const [canShowSave,setCanShowSave]=useState(false)
    const [openRemoveDialog,setRemoveDialog]=useState(false)
    const [openRevokeDialog,setRevokeDialog]=useState(false)
    const [brandText,setbrandingText]=useState(brandingName)
    const [redirectUrl,setredirectUrl]=useState(redirecturl)
    const {call}=useNetworkCalls()
    const [iframeKey, setIframeKey] = useState(0);

    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const updateConfigurations=async()=>{
        setSaving(true)
        const res=await call({method:'put',path:'/user/secrets/config',withCred:true,data:{apikey:apikey,config:{redirect_url:redirectUrl,branding:brandText,auth_methods:selectedMethods}}})
        if (res){
            console.log("Added Successfully");
            setIframeKey(prev => prev + 1);
        }
        else{
            setbrandingText(brandingName)
            setredirectUrl(redirecturl)
            setSelectedMethods(authMethods)
        }
        setSaving(false)
        setCanShowSave(false)
        console.log('isConfig updated  : ',res)
    }
    
    const toggleMethod = (value) => {
        setSelectedMethods(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        )
        console.log('selected auth methods :',selectedMethods);
    }

    const filteredMethods = AUTH_METHODS.filter(method =>
        method.label.toLowerCase()
    )

    useEffect(()=>{
        
        if(redirectUrl!=redirecturl || brandText!=brandingName || selectedMethods.length!=authMethods.length){
            setCanShowSave(true)
        }
        else{
            setCanShowSave(false)
        }
        
    },[redirectUrl,brandText,selectedMethods])

    

    return (
        <div className='w-190 h-172 flex flex-col rounded-2xl p-5 border-l-2 border-r-2 border-cyan-400'>
            {/* Save Button Section */}
            <div className='flex justify-between mb-5'>
                <h1 className='font-bold text-2xl bg-gradient-to-r from-cyan-200 via-cyan-300 to-cyan-400 bg-clip-text text-transparent'>
                    {`#Credentials-${credIndex+1}`}
                </h1>
                {canShowSave && <IceBlueButton btnName={isSaving? "Saving..." : 'Save'} btnClassName={"text-12 font-semibold text-cyan-400"} onclickFunc={()=>updateConfigurations()}/>}
            </div>

            {/* Config & Demo Login */}
            <div className='w-full h-80 flex justify-evenly mb-2 border-b-2 border-purple-400 rounded-2xl pb-2'>
                {/* Configuration */}
                <div className='w-85 h-full flex flex-col border-r-2 border-purple-400 pr-2'>
                    {/* Redirect */}
                    <div className='w-full h-25 mb-2'>
                        <div className='flex justify-evenly items-center'>
                            <h1 className='w-50 font-bold bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-transparent flex'>
                                Redirect Url :
                            </h1>
                            <SecretsInputBox
                                isForSecret={false}
                                isReadOnly={false}
                                inputTxt={redirectUrl}
                                setValueState={setredirectUrl}
                                placeholder={'https://auth.debuggers.com/redirect'}
                            />
                        </div>
                        <div className='flex justify-center items-center mt-5'>
                            <h1 className='w-50 font-bold bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-transparent flex'>
                                Branding :
                            </h1>
                            <SecretsInputBox
                                icon={canChangeBranding ? null : <Lock size={16} className='text-purple-300 cursor-pointer' />}
                                isForSecret={false}
                                inputTxt={brandText}
                                isReadOnly={!canChangeBranding}
                                setValueState={setbrandingText}
                                placeholder='Your company'
                            />
                        </div>
                    </div>

                    {/* Auth Method Search */}
                    <div className='w-full h-10 mb-2 flex justify-start'>
                        <h1 className='font-bold text-2xl bg-gradient-to-r from-cyan-200 via-cyan-300 to-cyan-400 bg-clip-text text-transparent w-fit'>
                            #Auth Methods
                        </h1>
                    </div>

                    {/* Auth Methods */}
                    <div className='w-full h-full flex-1 p-2 overflow-auto rounded'>
                        {filteredMethods.map(method => (
                            <label key={method.value} className='flex items-center gap-2 text-white cursor-pointer mb-1'>
                                <input
                                    type="checkbox"
                                    checked={selectedMethods.includes(method.value)}
                                    onChange={() => toggleMethod(method.value)}
                                    className='w-4 h-4 accent-cyan-400'
                                />
                                {method.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Demo Login Page */}
                <div className="bg-white/20 w-85 h-full rounded-2xl overflow-hidden">
                    <iframe
                        key={iframeKey}
                        src={`${backend_url}/user/auth/preview?apikey=${apikey}`}
                        className="w-full h-full"
                        title="Login Page"
                    ></iframe>
                </div>



            </div>

            {/* Secrets Section */}
            <div className='w-full h-full flex-1 flex flex-col'>
                {/* Secrets Heading */}
                <div className='w-full h-8 mb-2 flex'>
                    <h1 className='font-bold text-2xl bg-gradient-to-r from-cyan-200 via-cyan-300 to-cyan-400 bg-clip-text text-transparent w-fit'>
                        #Secrets
                    </h1>
                </div>

                {/* Secrets Inputs */}
                <div className='w-full h-30 mb-2'>
                    <div className='flex justify-evenly items-center'>
                        <h1 className='w-50 font-bold text-xl bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-transparent flex'>
                            Api Key :
                        </h1>
                        <SecretsInputBox
                            icon={<Copy size={16} className='text-purple-300 cursor-pointer' />}
                            iconFunc={copyToClipboard}
                            inputTxt={apikey}
                        />
                    </div>
                    <div className='flex justify-center items-center mt-5'>
                        <h1 className='w-50 font-bold text-xl bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-transparent flex'>
                            Client Secret :
                        </h1>
                        <SecretsInputBox
                            icon={<Copy size={16} className='text-purple-300 cursor-pointer' />}
                            iconFunc={copyToClipboard}
                            inputTxt={clientSecret}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='w-full flex-1 h-full flex justify-evenly'>
                    <IceBlueButton
                        btnName={'Revoke'}
                        shadowColor='shadow-yellow-300'
                        btnClassName={'text-xl font-semibold text-yellow-300'}
                        onclickFunc={()=>{setRevokeDialog(true)}}
                    />
                    <IceBlueButton
                        btnName={'Remove'}
                        shadowColor='shadow-red-300'
                        btnClassName={'text-xl font-semibold text-red-300'}
                        onclickFunc={()=>{setRemoveDialog(true)}}
                    />
                </div>

                <div className='w-full h-full flex-1 mt-5' onClick={()=>{setOpenDialog(true)}}>
                    <div className={`bg-transparent shadow-sm border-1 border-cyan-400 shadow-cyan-400 h-full rounded-xl flex justify-center items-center px-10 cursor-pointer w-full`}>
                        <h1 className='text-cyan-400 font-semibold'>{'Generate Another Apikey'}</h1>
                    </div>


                </div>
            </div>
            <center><SecretsGenerationDialog canOpen={openDialog} canOpenFunc={setOpenDialog}></SecretsGenerationDialog></center>
            <center><SecretsRemoveDialog canOpen={openRemoveDialog} canOpenFunc={setRemoveDialog} apikey={apikey}></SecretsRemoveDialog></center>
            <center><SecretsRegenerateDialog canOpen={openRevokeDialog} canOpenFunc={setRevokeDialog} apikey={apikey}></SecretsRegenerateDialog></center>
        </div>
    )
}
