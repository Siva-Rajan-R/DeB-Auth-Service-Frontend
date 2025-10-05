import { createContext, useState } from 'react'


export const AuthContext = createContext()


export const AuthContextProvider = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSecretsAdded,setSecretsAdded]=useState(false)

    const value = {
        isLoggedIn,setIsLoggedIn,isSecretsAdded,setSecretsAdded
    }

  return (
   <AuthContext.Provider value={value}>
        {props.children}
   </AuthContext.Provider>
  )
}
