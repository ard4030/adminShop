import axios from 'axios';
import React,{useState , useEffect} from 'react'
import { BASE_URL } from '../utils/constans';
import './addp.css'

const Discount = () => {

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [type, setType] = useState('naghdi');
    const [datec, setDatec] = useState('');
    const [datee, setDatee] = useState('');
    const [status, setStatus] = useState('pending');
    const [value, setValue] = useState('');
    const [items, setItems] = useState([]);

    const saveDiscount = async () => {
        const data = {
            name,code,type,datec,datee,status,value
        }

        await axios.post(`${BASE_URL}/admin/discount/addDiscount`,data).then(response => {
            if(response.data.success){
                alert(response.data.message)
                getItems()
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
    }

    const getItems = async () => {
        await axios.get(`${BASE_URL}/admin/discount/getDiscounts`).then(response => {
            if(response.data.success){
                setItems(response.data.data)
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
    }

    useEffect(() => {
        getItems();
    }, [])
    


  return (
    <div>
        <h2>کد های تخفیف</h2>
        <div className='item'>
            <div className='ddf'>
                <span>نام</span>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='ddf'>
                <span>کد</span>
                <input value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className='ddf'>
                <span>مقدار</span>
                <input value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div className='ddf'>
                <span>نوع</span>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value={'naghdi'}>مبلغی</option>
                    <option value={'darsadi'}>درصدی</option>\
                </select>
            </div>
            <div className='ddf'>
                <span>تاریخ شروع</span>
                <input type={"date"} value={datec} onChange={(e) => setDatec(e.target.value)} />
            </div>
            <div className='ddf'>
                <span>تاریخ پایان</span>
                <input type={"date"} value={datee} onChange={(e) => setDatee(e.target.value)} />
            </div>
            <div className='ddf'>
                <span>وضعیت</span>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value={'pending'}>غیرفعال</option>
                    <option value={'publish'}>فعال</option>\
                </select>
            </div>
            <div className='ddf mt30'>
                <button onClick={() => saveDiscount()}>افزودن</button>
            </div>
        </div>
        <div>
            {
                items && items.map((item,index) => 
                <div key={index}>
                    {item.name} - {item.code} - {item.type} - {item.value} - {item.status} - {item.start_date} - {item.end_date}
                </div>
                )
            }
        </div>
    </div>
  )
}

export default Discount