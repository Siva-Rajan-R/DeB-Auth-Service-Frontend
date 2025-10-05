import { useContext, useState } from 'react'
import { AlertDialog } from './AlertDialog'
import { useNetworkCalls } from '../Utils/NetworkCalls'
import { AuthContext } from '../Contexts/UserContext'
import { DialogContents } from '../Constants/index'
import { SecretsInputBox } from './SecretsInputBox'


export const SecretsGenerationDialog = ({canOpenFunc,canOpen=false}) => {
    const [inptxt,setInpText]=useState('')
    const [isLoading,setLoading]=useState(false)
    const { call }=useNetworkCalls()
    const { isSecretsAdded,setSecretsAdded } = useContext(AuthContext)

    const generateSecrets=async()=>{
        setLoading(true)
        const res=await call({
            method:'post',
            path:'/user/secrets',
            withCred:true,
            data:{redirect_url:inptxt,auth_methods:['google','github','otp'],branding:'sling bag'}
        })

        if (res){
            console.log("your secrets :",res);
            setSecretsAdded(!isSecretsAdded)
        }
        setLoading(false)
        canOpenFunc(false)
    }

    const sceretsGenerateContent=(
        <div className="flex flex-col space-y-4 px-4 py-2">
            <div className="flex flex-col items-center text-center space-y-2">
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-300 to-blue-500 shadow-md shadow-blue-400">
                    <span className="text-white text-2xl">🔑</span>
                </div>
                <p className="text-sm text-white leading-relaxed font-semibold">
                    Provide a <span className="text-purple-400 font-bold">Redirect URL</span> to generate your API key.
                </p>
            </div>

            <SecretsInputBox
                placeholder="Enter redirect url..."
                isForSecret={false}
                isReadOnly={false}
                inputTxt={inptxt}
                setValueState={setInpText}
            />

            <div className="rounded-md bg-purple-900/30 border border-purple-500 p-2 text-xs text-purple-300 text-center">
                ⚡ This API key will be linked to the redirect URL. You can update it anytime.
            </div>
        </div>
    );

    return (
        <div>
            <AlertDialog
                isOpen={canOpen}
                content={sceretsGenerateContent}
                confirmText={isLoading ? 'Generating...' : 'Generate'}
                title="Generate Apikey"
                onCancel={()=>canOpenFunc(false)}
                onConfirm={()=>generateSecrets()}
            />
        </div>
    )
}


export const SecretsRegenerateDialog = ({ canOpenFunc, canOpen = false, apikey }) => {

  const { isSecretsAdded, setSecretsAdded } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const { call } = useNetworkCalls();

  const regenerateSecrets = async () => {
    setLoading(true);
    const res = await call({
      method: "PUT", // regeneration is usually a POST
      path: `/user/secrets/revoke`,
      withCred: true,
      data:{apikey:apikey}
    });

    if (res) {
      console.log("your secrets regenerated :", res);
      setSecretsAdded(!isSecretsAdded);
    }
    setLoading(false);
    canOpenFunc(false);
  };


  return (
    <div>
      <AlertDialog
        isOpen={canOpen}
        content={DialogContents.secretsRevokeContent}
        confirmText={isLoading ? "Revoking..." : "Revoke"}
        title="Revoke Secrets ?"
        onCancel={() => canOpenFunc(false)}
        onConfirm={() => regenerateSecrets()}
      />
    </div>
  );
};


export const SecretsRemoveDialog = ({canOpenFunc,canOpen=false,apikey}) => {

    const { isSecretsAdded,setSecretsAdded } =useContext(AuthContext)
    const [isLoading,setLoading]=useState(false)
    const { call }=useNetworkCalls()

    const removeSecrets=async()=>{
        setLoading(true)
        const res=await call({method:'delete',path:`/user/secrets/remove?apikey=${apikey}`,withCred:true})

        if (res){
            console.log("your secrets removed :",res);
            setSecretsAdded(!isSecretsAdded)
        }
        setLoading(false)
        canOpenFunc(false)
    }

    
    return (
        <div>
            <AlertDialog 
              isOpen={canOpen} 
              content={DialogContents.SecretsRemoveContent} 
              confirmText={isLoading? 'Removing...' : 'Remove'} 
              title='Remove Secrets ?' 
              onCancel={()=>{canOpenFunc(false)}} 
              onConfirm={()=>removeSecrets()}
            />
        </div>
    )
}

