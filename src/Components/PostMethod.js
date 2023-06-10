import axios from 'axios';
import React,{useState , useEffect} from 'react'
import { BASE_URL } from '../utils/constans';
import './addp.css'

const PostMethod = () => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [items, setItems] = useState('');

    const getItems = async () => {
        await axios.get(`${BASE_URL}/admin/postmethod/getMethods`).then(response => {
            if(response.data.success){
                setItems(response.data.data)
                
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
    }

    const addPost = async () => {
        const data = {
            name,price
        }

        await axios.post(`${BASE_URL}/admin/postmethod/addMethod`,data).then(response => {
            if(response.data.success){
                alert(response.data.message)
                getItems();
                setName('');
                setPrice('');
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
        <h2>شیوه های ارسال</h2>

        <div className='item'>
            <div className='ddf'>
                <span>نام</span>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className='ddf'>
                <span>هزینه ارسال</span>
                <input value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <button onClick={() => {addPost()}}>افزودن</button>
        </div>

        <div>
            {
               items.length > 0 &&  items.map((item,index) => 
                    <div key={index}>
                        <span>{item.name}</span>
                        -
                        <span>{item.price}</span>

                    </div>
                )
            }
        </div>
    </div>
  )
}

export default PostMethod