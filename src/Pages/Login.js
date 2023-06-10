import { Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../Context/Auth'
import {Navigate, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../utils/constans'

const SendSms = () => {
  const {sendSmsCon } = useContext(AuthContext)
  const [num, setNum] = useState('');

  return(
    <>
      <p>mobile</p>
      <input onChange={(e) => setNum(e.target.value)} placeholder='0916***4864'/>
      <button onClick={() => sendSmsCon(num) }>Send Code</button>
    </>
  )
}

const Verify = () => {
  const [cod, setCod] = useState('');
  const { number , setIsSend } = useContext(AuthContext);
  const navigate = useNavigate()

  const checkSmsCode = async (mobile,code) => {
    const data = {mobile:mobile,code:code};
    await axios.post(`${BASE_URL}/auth/checkOtp`,data,{withCredentials:true}).then((response) => {
        if(response.data.success){
          navigate("/")
          setIsSend(false)
        }else{
          // setError(response.data.message)
          alert(response.data.message)
        }
        
    }).catch(err => {
        alert(err.message)
    })
    
}

  return(
    <>
      <p>Check Code</p>
      <input onChange={(e) => setCod(e.target.value)}/>
      <button onClick={() => checkSmsCode(number,cod) }>Send Code</button>
    </>
  )
}

const Login = () => {
  const {isSend,error,user} = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user])
  
  
  return (
    <div>
        {/* {user && (
          <Navigate to="/" replace={true} />
        )} */}
      {
        (isSend)?
          <Verify />
        :
          <SendSms />
      }

      {
        error && <p>{error}</p>
      }

    </div>
  )
}

export default Login