import { Modal } from 'antd'
import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { BASE_URL } from '../utils/constans'

const Comments = () => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState({
        status:"",
        open:false,
        message:"",
        id:null,
        rate:0,
        noavari:0,
        emkanat:0,
        keyfiat:0,
        sohoolat:0,
        arzesh:0
    })

    const getComments = async () => {
        setLoading(true)    
        await axios.post(`${BASE_URL}/admin/comment/getAllComments`).then(response => {
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
        await axios.post(`${BASE_URL}/admin/comment/updateComment`,options).then(response => {
            if(response.data.success){
                alert(response.data.message)
                getComments()
                setOptions({
                    status:"",
                    open:false,
                    message:"",
                    id:null,
                    rate:0,
                    noavari:0,
                    emkanat:0,
                    keyfiat:0,
                    sohoolat:0,
                    arzesh:0
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
        await axios.post(`${BASE_URL}/admin/comment/deleteComment`,{id:data}).then(response => {
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
                                <th>نظر</th>
                                <th>امتیاز محصول</th>
                                <th>نوآورری</th>
                                <th>امکانات</th>
                                <th>کیفیت</th>
                                <th>سهولت</th>
                                <th>ارزش</th>
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
                                    <td>{item.rate}</td>
                                    <td>{item.noavari}</td>
                                    <td>{item.emkanat}</td>
                                    <td>{item.keyfiat}</td>
                                    <td>{item.sohoolat}</td>
                                    <td>{item.arzesh}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button onClick={() => {deleteItem(item._id)}}>حذف</button>
                                        <button onClick={() => setOptions(
                                            {...options,
                                                open:true,
                                                status:item.status,
                                                rate:item.rate,
                                                id:item._id,
                                                noavari:item.noavari,
                                                emkanat:item.emkanat,
                                                keyfiat:item.keyfiat,
                                                sohoolat:item.sohoolat,
                                                arzesh:item.arzesh,
                                                message:item.message
                                            }
                                            )}>ویرایش</button>
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
                        <label>نظر</label> 
                        <textarea value={options.message} onChange={(e) => setOptions({...options,message:e.target.value})}></textarea>
                    </div>

                    <div className='xcvnn'>
                        <label>امتیاز</label> 
                        <input type={'number'} value={options.rate} onChange={(e) => setOptions({...options,rate:e.target.value})}/>
                    </div>

                    <div className='xcvnn'>
                        <label>نوآورری</label> 
                        <input type={'number'} value={options.noavari} onChange={(e) => setOptions({...options,noavari:e.target.value})}/>
                    </div>

                    <div className='xcvnn'>
                        <label>امکانات</label> 
                        <input type={'number'} value={options.emkanat} onChange={(e) => setOptions({...options,emkanat:e.target.value})}/>
                    </div>

                    <div className='xcvnn'>
                        <label>کیفیت</label> 
                        <input type={'number'} value={options.keyfiat} onChange={(e) => setOptions({...options,keyfiat:e.target.value})}/>
                    </div>

                    <div className='xcvnn'>
                        <label>سهولت</label> 
                        <input type={'number'} value={options.sohoolat} onChange={(e) => setOptions({...options,sohoolat:e.target.value})}/>
                    </div>
                </div>
            </Modal>
        </div>
    }
    </>
  )
}

export default Comments