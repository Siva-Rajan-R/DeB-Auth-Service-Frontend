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
        <div className='w-full max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-cyan-400/30 shadow-2xl shadow-cyan-400/20'>
            {/* Header Section */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3'>
                <h1 className='font-bold text-2xl sm:text-3xl bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent'>
                    {`Credentials #${credIndex+1}`}
                </h1>
                {canShowSave && (
                    <IceBlueButton 
                        btnName={isSaving? "Saving..." : 'Save Changes'} 
                        btnClassName={"text-sm sm:text-base font-semibold text-cyan-400 px-4 py-2"} 
                        onclickFunc={()=>updateConfigurations()}
                    />
                )}
            </div>

            {/* Mobile Preview Only */}
            <div className="lg:hidden bg-black/30 rounded-xl overflow-hidden mb-6 border border-cyan-400/20">
                <div className="bg-cyan-400/10 py-2 px-4 border-b border-cyan-400/20">
                    <h3 className="text-cyan-300 font-semibold text-sm">Login Preview</h3>
                </div>
                <div className="w-full h-100">
                    <iframe
                        key={iframeKey}
                        src={`${backend_url}/user/auth/preview?apikey=${apikey}`}
                        className="w-full h-full"
                        title="Login Page Preview"
                    />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                {/* Left Column - Configuration */}
                <div className='space-y-6'>
                    {/* Configuration Card */}
                    <div className='bg-black/20 rounded-xl p-4 sm:p-5 border border-purple-400/30'>
                        <h2 className='font-bold text-xl sm:text-2xl bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent mb-4 flex items-center gap-2'>
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            Configuration
                        </h2>
                        
                        <div className='space-y-4'>
                            {/* Redirect URL */}
                            <div className='space-y-2'>
                                <label className='text-purple-300 font-medium text-sm'>Redirect URL</label>
                                <SecretsInputBox
                                    isForSecret={false}
                                    isReadOnly={false}
                                    inputTxt={redirectUrl}
                                    setValueState={setredirectUrl}
                                    placeholder={'https://yourdomain.com/auth/callback'}
                                    className="w-full"
                                />
                            </div>

                            {/* Branding */}
                            <div className='space-y-2'>
                                <label className='text-purple-300 font-medium text-sm'>Brand Name</label>
                                <SecretsInputBox
                                    icon={canChangeBranding ? null : <Lock size={16} className='text-purple-400' />}
                                    isForSecret={false}
                                    inputTxt={brandText}
                                    isReadOnly={!canChangeBranding}
                                    setValueState={setbrandingText}
                                    placeholder='Your Company Name'
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Auth Methods */}
                        <div className='mt-6'>
                            <h3 className='font-bold text-lg sm:text-xl bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent mb-3'>
                                Authentication Methods
                            </h3>
                            <div className='grid grid-cols-2 sm:grid-cols-2 gap-2'>
                                {filteredMethods.map(method => (
                                    <label key={method.value} className='flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer'>
                                        <input
                                            type="checkbox"
                                            checked={selectedMethods.includes(method.value)}
                                            onChange={() => toggleMethod(method.value)}
                                            className='w-4 h-4 accent-cyan-400 rounded'
                                        />
                                        <span className='text-white text-sm'>{method.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Secrets Card */}
                    <div className='bg-black/20 rounded-xl p-4 sm:p-5 border border-cyan-400/30'>
                        <h2 className='font-bold text-xl sm:text-2xl bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center gap-2'>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            API Secrets
                        </h2>

                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <label className='text-cyan-300 font-medium text-sm'>API Key</label>
                                <SecretsInputBox
                                    icon={<Copy size={16} className='text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors' />}
                                    iconFunc={() => copyToClipboard(apikey)}
                                    inputTxt={apikey}
                                    className="w-full"
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-cyan-300 font-medium text-sm'>Client Secret</label>
                                <SecretsInputBox
                                    icon={<Copy size={16} className='text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors' />}
                                    iconFunc={() => copyToClipboard(clientSecret)}
                                    inputTxt={clientSecret}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                            <button
                                onClick={() => setRevokeDialog(true)}
                                className='flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-200 text-yellow-300 py-3 px-4 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95'
                            >
                                Revoke Keys
                            </button>
                            <button
                                onClick={() => setRemoveDialog(true)}
                                className='flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-400/50 text-red-300 py-3 px-4 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95'
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Desktop Preview */}
                <div className="hidden lg:block">
                    <div className="bg-black/30 rounded-xl overflow-hidden border border-cyan-400/20 h-full">
                        <div className="bg-cyan-400/10 py-3 px-4 border-b border-cyan-400/20">
                            <h3 className="text-cyan-300 font-semibold">Live Login Preview</h3>
                        </div>
                        <div className="w-full h-[500px]">
                            <iframe
                                key={iframeKey}
                                src={`${backend_url}/user/auth/preview?apikey=${apikey}`}
                                className="w-full h-full"
                                title="Login Page Preview"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Generate New API Key */}
            <div 
                className='bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-xl p-4 cursor-pointer hover:from-cyan-500/15 hover:to-purple-500/15 transition-all group'
                onClick={() => setOpenDialog(true)}
            >
                <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center group-hover:bg-cyan-400/30 transition-colors">
                        <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                    </div>
                    <span className='text-cyan-300 font-semibold text-lg'>Generate New API Key</span>
                </div>
            </div>

            {/* Dialogs */}
            <SecretsGenerationDialog canOpen={openDialog} canOpenFunc={setOpenDialog} />
            <SecretsRemoveDialog canOpen={openRemoveDialog} canOpenFunc={setRemoveDialog} apikey={apikey} />
            <SecretsRegenerateDialog canOpen={openRevokeDialog} canOpenFunc={setRevokeDialog} apikey={apikey} />
        </div>
    )
}