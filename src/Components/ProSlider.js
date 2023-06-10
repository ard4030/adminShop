import { Button } from 'antd'
import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { BASE_URL } from '../utils/constans'

const ProSlider = () => {
    const [categorys, setCategorys] = useState([])
    const [loading, setLoading] = useState(false)
    // const [cating, setCating] = useState([])
    const [options, setOptions] = useState({
        slider_pro_enable:true,
        slider_pro_number:5,
        name:"slider_pro",
        cats:[]
    })

    const getCats = async () => {
        setLoading(true)
        await axios.get(`${BASE_URL}/user/category/getAllCategory1`).then(response => {
            if(response.data.success){
              setCategorys(response.data.data)
            }else{
              alert(response.data.message)
            }
          }).catch(err => {
            alert(err.message)
          })
        setLoading(false)
    }

    const getOptions = async () => {
        setLoading(true)
        await axios.post(`${BASE_URL}/admin/option/getOptionByname`,{name:"slider_pro"}).then(response => {
            if(response.data.success){
                setOptions(response.data.data.value)
            }else{
              alert(response.data.message)
            }
          }).catch(err => {
            console.log(err.message)
          })
        setLoading(false)
    }

    useEffect(() => {
        getCats()
        getOptions()
    }, [])

    const changeVal = (e) => {
        if(options.cats.length > 4){
            alert("حداکثر 5 دسته بندی")
            return 
        }
        const newValue = e.target.value;
        if (!options.cats.includes(newValue)) {
        //   setCating([...cating, newValue]);
          setOptions({...options,cats:[...options.cats, newValue]})
        } else {
            setOptions({...options,cats:options.cats.filter(item => item !== newValue)})
        //   setCating(cating.filter(item => item !== newValue));
        }
    };

    const delItem = (newValue) => {
        // console.log(newValue)
        // setCating(cating.filter(item => item !== newValue));
        setOptions({...options,cats:options.cats.filter(item => item !== newValue)})
    }

    const Savedata = async () => {
        setLoading(false)
        console.log(options)
        const data = options;
        data.name = "slider_pro"
        
        await axios.post(`${BASE_URL}/admin/option/initSettingsWebsite1`,data).then(response => {
         if(response.data.success){
           alert(response.data.message)
           getOptions();
         }else{
           alert(response.data.message)
         }
        }).catch(err => {
         console.log(err.message)
        })
        setLoading(true)
 
    }

    
    

  return (
    <>
    {
        loading ? 
        <h1>Loading ...</h1>
        :
        <div>
            <div className='xcvnn'>
                <label>انتخاب دسته ها </label>
                <select onChange={changeVal}>
                    {
                        categorys.map((item,index) => 
                        (item.parent === null) &&  
                        <option name={item.title} className={`${options.cats.includes(item._id) && "csd"}`} value={item._id} key={index}>
                            {item.title}
                        </option>
                        )
                    }
                </select>
                
                {
                    categorys.map((item,index) => 
                    (options.cats.includes(item._id)) && 
                    <span className='bbdg' key={index}>
                        {item.title} 
                        <span onClick={() => {delItem(item._id)}} className='del11'>حذف</span>
                    </span>
                    )
                }
            </div>

            <div className='xcvnn'>
                <label>تعداد اسلاید ها</label>
                <input type="number" value={options.slider_pro_number} onChange={(e) => setOptions({...options,slider_pro_number:parseInt(e.target.value)})} />
            </div>

            <div className='xcvnn'>
                <label>فعال</label>
                <input type="checkbox" checked={options.slider_pro_enable} onChange={(e) => setOptions({...options,slider_pro_enable:!options.slider_pro_enable})} />
            </div>

            <Button onClick={() => {Savedata()}}>ذخیره تغییرات</Button>
        </div>
    }
    </>
  )
}

export default ProSlider