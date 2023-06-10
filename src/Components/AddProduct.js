import axios from 'axios';
import React,{useState,useEffect, useContext} from 'react'
import { Cascader , Button , Modal } from 'antd';
import './addp.css'
import AuthContext from '../Context/Auth';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../utils/constans';
import ViewContext from '../Context/View';
import Loading from './Loading';
import UploadCenter from './UploadCenter';
import OtherContext from '../Context/GlobalContext';

// upload


const AddProduct = () => {
  const {user} = useContext(AuthContext)
  const {show,SettingShow} = useContext(ViewContext)
  const [category, setCategory] = useState(null);
  const [priceAdd, setPriceAdd] = useState(0);
  const [category1, setCategory1] = useState([]);
  const [isEdit, setIsEdit] = useState(null);
  const [pic, setPic] = useState('');
  const [name, setName] = useState(null);
  const [colors, setColors] = useState([]);
  const [val, setVal] = useState(null);
  const [load, setLoad] = useState(false);
  const [technicalSpecifications,setTechnicalSpecifications] = useState([]);
  const [title,setTitle] = useState(false);
  const [reff,setReff] = useState(false);
  const [quantity,setQuantity] = useState(0);
  const [addonItem,setAddonItem] = useState([]);
  const [open, setOpen] = useState(false);

  const [data,setData] = useState({
    p_name:'',
    e_name:'',
    category:'',
    priceAsli:0,
    description:'',
    images:[],
    id:null,
    quantity:0,
    momentary:false,
    discount:{
      type:"naghdi",
      datec:'',
      datee:"",
      value:""
    }
  });
  const navigate = useNavigate();
  const {selectImagesDetail,productImages,setSelected,selected} = useContext(OtherContext)

  const getProduct = async (id) => {
    setLoad(true)
    await axios.post(`${BASE_URL}/user/product/getProductById`,{id}).then(resp => {
      if(resp.data.success){
        const product = resp.data.data[0];
        let x = [];
        resp.data.data[0].parents.forEach(element => {
          x.push(element.id)
        });
        setCategory1(x.reverse())
        setIsEdit(true)
        setData({
          p_name:product.p_name,
          e_name:product.e_name,
          category:product.category,
          vishegiha:product.vishegiha,
          priceAsli:product.priceAsli,
          description:product.description,
          images:product.images,
          id:product._id,
          quantity:product.quantity,
          momentary:product.momentary,
          discount:product.discount
        });
        setTechnicalSpecifications(product.technicalSpecifications)
        setColors(product.colors)
        setAddonItem(product.addonItem)  
        setSelected(product.images) 
      }else{
        alert(resp.data.message)
      }
    }).catch(err => {
      alert(err.message)
    })
    setLoad(false)
  }

  useEffect(() => {
    if(!category) getCats();
    if (!user) navigate("/login");
    if(show.id){
      SettingShow({id:null,name:"addproduct",comp:<AddProduct />})
      setSelected([])
      getProduct(show.id)
    }

  }, [data])

  const getCats = async () => {
    setLoad(true)
    await axios.get(`${BASE_URL}/user/category/getAllCategory1`,{
      headers:{
        accessToken:`bearer ${localStorage.getItem('@token')}`
      }
    }).then(response => {
      setCategory(response.data.data)
      setLoad(false)
    }).catch(err => {
      alert(err.message)
      setLoad(false)
    })
  }

  const getFeat = async (id) => { 

    await axios.post(`${BASE_URL}/admin/category/getFeatById`,{id}).then(response => {
        if(response.data.success){
          setTechnicalSpecifications(response.data.data ? response.data.data.technicalSpecifications : [] )
        }else{
          setTechnicalSpecifications([])
            alert(response.data.message)
        }
    }).catch(err => {
        alert(err.message)
    })
  }

  const onChange = (value) => {
    setCategory1(value)
    setData({...data,category:value[value.length -1]})
    getFeat(value)

  };

  const SaveData = async () => {
    if(data.category === ""){
      alert('لطفا دسته بندی را انتخاب کنید')
    }else{
      data.technicalSpecifications = technicalSpecifications;
      data.colors = colors;
      data.addonItem = addonItem;
      data.images = selected;
      await axios.post(`${BASE_URL}/admin/product/addProduct`,data,{
        headers:{
          accessToken:`bearer ${localStorage.getItem('@token')}`
        }
      }).then(response => {
        if(response.data.success){
          alert(response.data.message)
          setData({
            p_name:'',
            e_name:'',
            category:'',
            priceAsli:0,
            description:'',
            images:[],
            quantity:0,
            discount:{
              type:"naghdi",
              datec:'',
              datee:"",
              value:""
            }
          })
          setTechnicalSpecifications([])
          setCategory(null)
          setAddonItem([])
        }else if(response.data.messages){
            alert(JSON.stringify(response.data.messages))
        }else{
          alert(response.data.message)
        }
      }).catch(err => {
        alert(err.message)
      })
    }
  }

  const editItem = (event, specIndex, valueIndex) => {
    const { name, key,value } = event.target;
    setTechnicalSpecifications(prevState => {
      const newState = [...prevState];
      newState[specIndex].specs[valueIndex].value = value;
      return newState;
    });

  }

  const AddAddon = () => {
    if(!title){
        alert('نام دسته بندی ویژگی نمیتواند خالی باشد')
        return
    }
    let x = addonItem.filter(item => item.title === title);
    if(x && x.length > 0){
        alert('این دسته بندی ویژگی قبلا ایجاد شده')
        return
    }

    setAddonItem(prevState => [...addonItem, {
        title:title,
        specs:[]
    }]);

  }

  const deleteAddonCategory = (title) => {
    let data = addonItem.filter(item => item.title !== title)
    setAddonItem(data)
    setReff(!reff)
  }

  const addAddonItem = (title) => {
    let data = addonItem;
    data.map(item => {
        if(item.title === title){
            let x = item.specs.filter(item => item.key === name);
            if(x.length > 0) {
                alert('این ویژگی برای این دسته وجود دارد')
                return
            }
            item.specs.push({key:name,value:val,price:priceAdd,quantity:quantity})
        }else{return}
    })
    setAddonItem(data)
    setName('')
    
  }

  const deleteItemAddon = (title,key) => {
    let data = addonItem;
    data.map((item,index) => {
        if(item.title === title){
            let sp = item.specs.filter(item2 => item2.key !== key);
            item.specs = sp;
            // item.specs.map((item1,index1) => {
            //     console.log(item1[index])
            //     if(item1.key === key) {
            //         delete item.specs[index1];
            //     }
            // })
        }else{return}
    })
    setAddonItem(data)
    setReff(!reff)
  }

  const setImageProduct = () => {
    console.log(selected)
    setOpen(false)
  }



  return (
    <>
    {
      (load) ?
      <Loading />
      :
    <div>

      <div className='item'>
        <label>نام فارسی</label>
        <input className='iptstyle' value={data.p_name} onChange={(e) => setData({...data,p_name:e.target.value})}/>
      </div>

      <div className='item'>
        <label>نام انگلیسی</label>
        <input className='iptstyle' value={data.e_name } onChange={(e) => setData({...data,e_name:e.target.value})}/>
      </div>

      <div className='item'>
        <label>دسته بندی</label>
        {
          category && <Cascader 
          fieldNames={{ label: 'title', value: '_id', children: 'children' }}
          options={category} value={category1} onChange={onChange} placeholder="انتخاب دسته بندی" />
        }
      </div>

      <div className='hor'></div>
      <div className='item'>
        <label className='qqq'>ویژگی ها</label>
        {
          (technicalSpecifications && technicalSpecifications.length > 0)? 
          technicalSpecifications.map((item,index) => 
            <div key={index}>
              <h2>{item.title}</h2>
              {
                  item.specs.map((key, keyIndex) => {
                      return <div  key={keyIndex} className="item x212">
                        <label>{key.key}</label>
                          <input value={key.value} name="key" onChange={event => 
                          editItem(event, index, keyIndex)} /> 
                          {key.asli && <span className="aslispan">اصلی</span>}
                          {/* <button onClick={() => {deleteItem(item.title,key.key)}} className="mr20">delete</button> */}
                          </div>
                  })
              }
            </div>
          )
          :
          <div>لطفا دسته بندی را انتخاب کنید</div>
        }

      </div>

      <div className='hor'></div>

      <div className='item'>
        <label>قیمت</label>
        <input className='iptstyle' value={data.priceAsli} onChange={(e) => setData({...data,priceAsli:e.target.value})}/>
      </div>

      <div className='hor'></div>
      <div className='item'>
        <label>آیتم های اضافی (بیمه و ...)</label>
        <div className="sdfg">
            <input onChange={(e) => {setTitle(e.target.value)}}  placeholder="title"/>
            <button onClick={() => {AddAddon()}}>افزودن دسته آیتم</button>
        </div>
        {
            addonItem && addonItem.map((item , index) => {
                
                return <div className="vbb" key={index}>
                    <h3>{item.title} <button onClick={() => {deleteAddonCategory(item.title)}}>حذف</button></h3>
                    <div className="dflex">
                        <label>نام ویژگی</label>
                        <input placeholder='نام ویژگی' value={name} onChange={(e) => setName(e.target.value)} />

                        <div className='ml10 mr10'> 
                          <span> قیمت افزوده شده</span>
                          <input type="Number" value={priceAdd} onChange={(e) => setPriceAdd(e.target.value)}  placeholder='این مبلغ به قیمت اصلی اضافه میشه'/>
                        </div>

                        <div className='ml10 mr10'> 
                          <span>تعداد</span>
                          <input type="Number" value={quantity} onChange={(e) => setQuantity(e.target.value)}  placeholder=''/>
                        </div>

                        {
                          (item.title === 'رنگ بندی') && 
                          <div className='ml10 mr10'> 
                            <span>رنگ</span>
                            <input type='color' value={val? val : ''} onChange={(e) => setVal(e.target.value)} />
                          </div>
                        }

                        <button onClick={() => {addAddonItem(item.title)}}>افزودن</button>
                    </div>
                    {
                        item.specs.map((key, keyIndex) => {
                            return <div  key={keyIndex} className="item x212">
                                <span>{key.price}</span>
                                <span>{key.key}</span>
                                {
                                (item.title === 'رنگ بندی') && 
                                <>
                                  <span style={{background:key.value}} className='circle'></span>
                                  <span> تعداد  - {key.quantity}</span>
                                </>
                                }
                                
                                <button onClick={() => {deleteItemAddon(item.title,key.key)}} className="mr20">delete</button>
                                </div>
                        })
                    }

                </div>
            })
        }
      </div>  

      <div className='hor'></div>
      <div className='item'>
        <label>توضیحات</label>
        <textarea value={data.description} onChange={(e) => setData({...data,description:e.target.value})}>

        </textarea>
      </div>

      <div className='hor'></div>
      <div className='item'>
        <h3>تخفیف</h3>
        <div className='item'>
            <div className='ddf'>
                <span>مقدار</span>
                <input value={data.discount.value} onChange={(e) => setData({...data,discount:{...data.discount,value:e.target.value}})} />
            </div>
            <div className='ddf'>
                <span>نوع</span>
                <select value={data.discount.type} onChange={(e) => setData({...data,discount:{...data.discount,type:e.target.value}})}>
                    <option value={'naghdi'}>مبلغی</option>
                    <option value={'darsadi'}>درصدی</option>\
                </select>
            </div>
            <div className='ddf'>
                <span>تاریخ شروع</span>
                <input type={"date"} value={data.discount.datec} onChange={(e) => setData({...data,discount:{...data.discount,datec:e.target.value}})} />
            </div>
            <div className='ddf'>
                <span>تاریخ پایان</span>
                <input type={"date"} value={data.discount.datee} onChange={(e) => setData({...data,discount:{...data.discount,datee:e.target.value}})} />
            </div>
        </div>
      </div>

      <div className='hor'></div>
      <div className='item'>
        <label>پیشنهاد لحظه ای</label>
        <input checked={data.momentary} onChange={() => setData({...data,momentary:!data.momentary})} type="checkbox"/>
      </div>

      

      <>
        <div className='hor'></div>
        <div className='item'>
          <label>تعداد</label>
          <input value={data.quantity} onChange={(e) => {setData({...data,quantity:e.target.value})}} type="number" placeholder='تعداد' />
        </div>
      </>

      {/* upload */}
      <div className='hor'></div>
      <div className='item'>
        <Button type="primary" onClick={() => setOpen(true)}>
          انتخاب عکس های محصول
        </Button>
        <Modal
          title="انتخاب عکس های محصول"
          centered
          open={open}
          onOk={() => setImageProduct()}
          onCancel={() => setOpen(false)}
          width={1000}
          style={{direction:'rtl'}}
        >
          <UploadCenter multi={true} />
        </Modal>
        <div className='c23'>
          {
            selected.map((item,index) => 
            <img key={index} className='img456' src={BASE_URL+item} />
            )
          }
        </div>

      </div>

      <div className='hor'></div>

      <Button className='mr20' onClick={() =>  SaveData()} type='primary'>
        {
          (isEdit) ?
          'بروزرسانی'
          :
          'افزودن محصول'
        }
      </Button>
    </div>

    }
      
    </>
  )
}

export default AddProduct