import React,{useState,useEffect,useContext} from 'react'
import { Select , Button ,Modal } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../utils/constans';
import Loading from './Loading';
import OtherContext from '../Context/GlobalContext';
import UploadCenterSingle from './UploadCenterSingle';
import ViewCatChils from './ViewCatChils';

const AddCategory = () => {
  const {singleImage} = useContext(OtherContext);
  const [open, setOpen] = useState(false);
  const [categoryData, setCategoryData] = useState({
    title:'',
    parent:null,
    image:""
  });

  const [categories, setCategories] = useState(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    getCategory()
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const successMo = () => {
    Modal.success({
      content: 'دسته بندی با موفقیت حذف شد !!!',
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getCategory = async () => {
    setLoad(true)
    await axios.get(`${BASE_URL}/user/category/getAllCategory1`).then(response => {
      if(response.data.success){
        let x = response.data.data;
        x.unshift({_id:null,title:'بدون والد'})
        setCategories(x)
        setLoad(false)
      }else{
        alert(response.data.message)
      }
      setLoad(false)
    }).catch(err => {
      alert(err.message)
    })
  }
  
  const handleChange = (value) => {
    setCategoryData({
      ...categoryData,parent:value
    })
  };

  const AddCategory = async () => {
    // console.log(categoryData)
    const data = {
      title:categoryData.title,
      parent:categoryData.parent,
      image:singleImage
    }
    setLoad(true)
    await axios.post(`${BASE_URL}/admin/category/addCategory`,data,{
      headers:{
        accessToken:`bearer ${localStorage.getItem('@token')}`
      }
    }).then(response => {
      if(response.data.success){
        alert(response.data.message)
        getCategory()
      }else{
        alert(response.data.message)
      }
      setLoad(false)
    }).catch(err => {
      alert(err.message)
    })
  }



  return (

    <>

    {
      (load) ?
      <Loading />
      :

      <div>
        <h3>افزودن دسته بندی</h3>
        <div className='item'>
          <label>نام دسته بندی</label>
          <input style={{marginLeft:'10px'}} value={categoryData.title} onChange={(e) => setCategoryData({...categoryData,title:e.target.value})}/>
          <label>دسته والد</label>
          <Select
          defaultValue="بدون والد"
          style={{width: 120,}}
          onChange={handleChange}
          fieldNames={{ label: 'title', value: '_id'}}
          options={categories}
          />

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
          <Button style={{marginRight:"10px"}} onClick={() => setOpen(true)}>انتخاب عکس</Button>
          {
            (singleImage !== "") && 
            <div className='srcdd'>
              <img src={`${BASE_URL}${singleImage}`} style={{width:"100%",height:"100%"}} />
            </div>
          }
          

          <Button className='mr20' onClick={() => AddCategory() } type='primary'>
          افزودن دسته
          </Button>
        </div>

        {categories && <ViewCatChils cats={categories}/>}  

      </div>
    }
    
    </>
    
  )
}

export default AddCategory