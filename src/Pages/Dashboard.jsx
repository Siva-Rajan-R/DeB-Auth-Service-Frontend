import { DashBoardNavBar } from '../Sections/DashboardNavbar'
import { IceBlueButton } from '../Components/Buttons'
import { SecretsCard } from '../Components/SecretsCard'
import { SecretsGenerationDialog } from '../Components/Dialogs'
import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNetworkCalls } from '../Utils/NetworkCalls'
import { AuthContext } from '../Contexts/UserContext'


export const DashboardPage = () => {
  const [secrets,setSecrets]=useState([])
  const [dialogOpen,setDialogOpen]=useState(false)
  const {call}=useNetworkCalls()
  const { isSecretsAdded }=useContext(AuthContext)

  const getSecrets=async()=>{
      const res=await call({method:'GET',path:'/user/secrets'})
      console.log("users :",res)
      var secretsComponent=[];
      if(res){
        res.secrets.map((items,index)=>{
          secretsComponent.push(
            <center key={index} className='mb-20'>
                <SecretsCard 
                    credIndex={index} 
                    apikey={items.apikey} 
                    clientSecret={items.client_secret} 
                    brandingName={items.configurations.branding}
                    canChangeBranding={res.branding}
                    redirecturl={items.configurations.redirect_url}
                    authMethods={items.configurations.auth_methods}
                />
            </center>
          )
      })
        
      }
      setSecrets(secretsComponent)
      return res
  }

  useEffect(()=>{
    getSecrets()
    if (!Cookies.get('user_name')){
      window.location.href='/'
      console.warn("Your Token expierd , Please Sign-in")
    }
  },[isSecretsAdded])

  return (
    <div className=''>
        <DashBoardNavBar></DashBoardNavBar>
        { secrets.length===0 ? 
        <div className='flex flex-col justify-center items-center h-full'>
            <p className='mb-5'>There is no secrets you have,</p>
            <IceBlueButton btnName={"Generate your first secrets"} btnClassName={'text-[18px] font-semibold'} onclickFunc={()=>{setDialogOpen(true)}}></IceBlueButton>
            <center><SecretsGenerationDialog canOpen={dialogOpen} canOpenFunc={setDialogOpen}></SecretsGenerationDialog></center>
          </div>
          : <div className='w-full h-full mt-10'>
              {...secrets}
            
        </div>
        }

    </div>
  )
}
