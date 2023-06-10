import axios from 'axios';
import React,{useState,useEffect} from 'react'
import { BASE_URL } from '../utils/constans';

const PaymentMethod = () => {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const reset = async () => {
        setLoading(true)
        await axios.post(`${BASE_URL}/admin/init/initPayment`).then(response => {
            if(response.data.success){
                alert(response.data.message)
                getItems()
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setLoading(false)
    }

    const getItems = async () =>{
        setLoading(true)
        await axios.get(`${BASE_URL}/admin/payment/getPayments`).then(response => {
            if(response.data.success){
                setItems(response.data.data)
            }else{
                alert(response.data.message)
            }
        }).catch(err =>{
            alert(err.message)
        })
        setLoading(false)
    }

    const changeItem = async (id,value) => {
        setLoading(true)
        const data = {id:id,value:!value}
        await axios.post(`${BASE_URL}/admin/payment/updateMethod`,data).then(response => {
            if(response.data.success){
                // alert(response.data.message)
                alert(response.data.message);
                getItems()
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })


        // setItems(prevState => {
        //     const newState = [...prevState];
        //     newState.map(item => {
        //         if(item.name === name){
        //             item.value = !value
        //         }
        //     })
        //     return newState;
        // });

        setLoading(false)
      
    }

    useEffect(() => {
        getItems()
    }, [])
    

  return (
    <div>
        <div>
            <button onClick={() => {reset()}}>تنظیمات اولیه</button>
        </div>

        <div className='mt30'>
            {items.map((item,index) => 
            <div className='mt10' key={index}>
                <span>{item.title}</span>
                <input type="checkbox" defaultValue={Boolean(item.enable)} defaultChecked={Boolean(item.enable)} onChange={(e) => {changeItem(item._id,Boolean(item.enable))}} />
            </div>
            )}
        </div>
    </div>
  )
}

export default PaymentMethod