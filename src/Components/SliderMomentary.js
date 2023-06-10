import { Button } from 'antd'
import axios from 'axios';
import React,{useState,useEffect} from 'react'
import { BASE_URL } from '../utils/constans';

const SliderMomentary = () => {
    const [data, setdata] = useState({
        slider_momentary_enable:true,
        slider_momentary_number:5,
    })
    const [loading, setLoading] = useState(false);
    console.log(data)

    const getData = async () => {
        setLoading(true)
        await axios.post(`${BASE_URL}/admin/option/getOptionByname`,{name:"slider_moment"}).then(response => {
          if(response.data.success){
            setdata(response.data.data.value)
          }else{
            alert(response.data.message)
          }
        }).catch(err => {
          console.log(err.message)
        })
        setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [])

    const saveData = async () => {
       setLoading(true)
       const data1 = {
        slider_momentary_enable:data.slider_momentary_enable,
        slider_momentary_number:data.slider_momentary_number,
        name:"slider_moment"
       }
       await axios.post(`${BASE_URL}/admin/option/initSettingsWebsite`,data1).then(response => {
        if(response.data.success){
          alert(response.data.message)
          getData();
        }else{
          alert(response.data.message)
        }
       }).catch(err => {
        console.log(err.message)
       })
       setLoading(false)

    }
    
    

  return (
    <>
       {
        loading ?
        <h1>loading ...</h1>
        :
    <div>
        <div >
            <label>فعال ؟ </label>
            <input checked={data.slider_momentary_enable} onChange={(e) => setdata({...data,slider_momentary_enable:!data.slider_momentary_enable})} type="checkbox" />
        </div>

        <div className='mt10'>
            <label>تعداد نمایش محصولات</label>
            <input type="number" value={data.slider_momentary_number} onChange={(e) => setdata({...data,slider_momentary_number:e.target.value})} />
        </div>
        <Button onClick={() => {saveData()}} style={{marginTop:"20px"}}> دخیره </Button>
    </div>

       }
    </>
    
  )
}

export default SliderMomentary