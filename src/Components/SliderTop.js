import { Button, Modal } from 'antd'
import axios from 'axios'
import React,{useContext, useEffect , useState} from 'react'
import OtherContext from '../Context/GlobalContext'
import { BASE_URL } from '../utils/constans'
import UploadCenterSingle from './UploadCenterSingle'

const SliderTop = () => {
    const [data, setdata] = useState([]);
    const {singleImage} = useContext(OtherContext);
    const [link, setLink] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setloading] = useState(false);


    const getData = async () => {
        await axios.get(`${BASE_URL}/user/option/getSliderTop`).then(response => {
            if(response.data.success){
                setdata(response.data.data)
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            console.log(err.message)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    const saveSlider = async () => {
        setloading(true)
        if(singleImage === "" || singleImage === " "){
            alert("لطفا یک عکس را انتخاب کنید")
            setloading(false)
            return
        }
        const data = {
            link,
            image:singleImage
        }

        await axios.post(`${BASE_URL}/admin/option/addSliderTop`,data).then(response =>{
            if(response.data.success){
                alert(response.data.message)
                getData()
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setloading(false)
    }

    const deleteItem = async (data) => {
        setloading(true)
        await axios.post(`${BASE_URL}/admin/option/deleteItem`,{id:data}).then(response => {
            if(response.data.success){
                alert(response.data.message)
                getData()
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setloading(false)
    }


    

  return (
    <>
    {
        loading ?

        <p>Loading ...</p>

        :

        <div>
        <h3>عکس جدید</h3>
        <div>
            <label>لینک</label>
            <input onChange={(e) => {setLink(e.target.value)}} />
            <Button onClick={() => setOpen(true)}>انتخاب عکس</Button>
        </div>
        <Button onClick={() => saveSlider()} style={{marginTop:"10px"}}>افزودن</Button>
        <Modal
          title="انتخاب عکس"
          centered
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={1000}
          style={{direction:'rtl'}}
        >
          <UploadCenterSingle />
        </Modal>

        <div>
            {
                data.map((item,index) => 
                <div className='vImsh' key={index}>
                    <span>{item.link}</span>
                    <img src={`${BASE_URL}${item.image}`} />
                    <span onClick={() => {deleteItem(item._id)}} className='delItt'>حذف</span>
                </div>
                )
            }
        </div>

        
    </div>
    }
    </>
  )
}

export default SliderTop