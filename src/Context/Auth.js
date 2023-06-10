import axios from "axios";
import React,{ createContext, useContext , useState , useEffect } from "react";
import { BASE_URL } from "../utils/constans";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const [number, setNumber] = useState(null);

    const isLog = async() => {
        await axios.get(`${BASE_URL}/auth/isLogin`,{withCredentials:true}).then(response => {
            if(response.data.success){
              setUser(response.data.user)
            }else{
              setUser(false)
            }
        }).catch(err => {
          console.log('ccccccc')
        })
    }
    
    useEffect(() => {
        isLog()
    } ,[])


    const sendSmsCon = async (mobile) => {
        const mobile1 = {mobile:mobile}
        await axios.post(`${BASE_URL}/auth/getOtp`,mobile1,{withCredentials:true}).then((response) => {
            if(response.data.success){
                setIsSend(true)
                setError(null)
                setNumber(mobile)
            }else{
                setIsSend(false)
                setError(response.data.message)
            } 
        }).catch(err => {
            alert(err.message)
        })
    }

    


    return (
        <AuthContext.Provider value={{ user, error, loading ,isSend,number ,  sendSmsCon  , setUser , setIsSend}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;