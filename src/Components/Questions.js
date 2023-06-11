import { Modal } from 'antd'
import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { BASE_URL } from '../utils/constans'

const Questions = () => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState({
        status:"",
        open:false,
        responseMessage:"",
        id:null
    })

    const getComments = async () => {
        setLoading(true)    
        await axios.post(`${BASE_URL}/admin/comment/getAllQuestions`).then(response => {
            if(response.data.success){
                setComments(response.data.data)
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setLoading(false)
    }

    useEffect(() => {
        getComments()
    }, [])

    const handleOk = async () => {
        setLoading(true)
        await axios.post(`${BASE_URL}/admin/comment/updateQuestion`,options).then(response => {
            if(response.data.success){
                alert(response.data.message)
                getComments()
                setOptions({
                    status:"",
                    open:false,
                    responseMessage:""
                })
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setLoading(false)
        
    }

    const deleteItem = async (data) => {
        setLoading(true)
        await axios.post(`${BASE_URL}/admin/comment/deleteItem`,{id:data}).then(response => {
            if(response.data.success){
                alert(response.data.message)
                getComments()
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setLoading(false)
    }


  return (
    <>
    {
        loading ?
        <h2>loading ...</h2>
        :

        <div>
            <div>
                    <table className='tblMe'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>کاربر</th>
                                <th>سوال</th>
                                <th>پاسخ دهنده</th>
                                <th>پاسخ</th>
                                <th>وضعیت</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                comments.length > 0 &&  comments.map((item,index) => 
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item._id}</td>
                                    <td>{item.message}</td>
                                    <td>{item.userResponseId}</td>
                                    <td>{item.responseMessage}</td>
                                    <td>{item.status}
                                        
                                    </td>
                                    <td>
                                        <button onClick={() => {deleteItem(item._id)}}>حذف</button>
                                        <button onClick={() => setOptions({...options,open:true,status:item.status,responseMessage:item.responseMessage,id:item._id})}>ویرایش</button>
                                    </td>

                                </tr>
                                )
                            }
                        </tbody>
                    </table>
            </div>
            <Modal
                title="ویرایش سوال"
                
                open={options.open}
                onOk={() => handleOk()}
                onCancel={() => setOptions({...options,open:false})}
                width={1000}
                style={{direction:'rtl',maxHeight:"60vh"}}
                >
                <div className='mt20'>
                    <div className='xcvnn'>
                        <label>وضعیت</label>
                        <select value={options.status} onChange={(e) => setOptions({...options,status:e.target.value})}>
                            <option  value={"pending"}>درحال بررسی</option>
                            <option  value={"publish"}>منتشر شده</option>
                            <option  value={"drop"}>رد شده</option>
                        </select>
                    </div>

                    <div className='xcvnn'>
                        <label>پاسخ</label> 
                        <textarea value={options.responseMessage} onChange={(e) => setOptions({...options,responseMessage:e.target.value})}></textarea>
                    </div>
                </div>
            </Modal>
        </div>
    }
    </>
  )
}

export default Questions