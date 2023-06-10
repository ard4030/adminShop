import { Button, Modal } from 'antd'
import axios from 'axios'
import React,{useContext, useState, useEffect} from 'react'
import OtherContext from '../Context/GlobalContext'
import { BASE_URL } from '../utils/constans'
import ProductsSingle from './ProductsSingle'

const Shegeft = () => {
    const [options, setOptions] = useState({
        name:"slider_shegeft",
        products:[],
        enable:true
    })
    const [open, setOpen] = useState(false)
    const {singleProduct} = useContext(OtherContext)
    const [type, setType] = useState('naghdi');
    const [datec, setDatec] = useState('');
    const [datee, setDatee] = useState('');
    const [value, setValue] = useState('');
    const [shegeft, setShegeft] = useState(false);
    const [loading, setloading] = useState(false);
    const [productDis, setProductDis] = useState([]);

    const handleOk = () => {
        setOpen(false)
        // if (!options.products.includes(singleProduct)) {
        //   setOptions({...options,products:[...options.products, singleProduct]})
        // }
        //  else {
        //   setOptions({...options,products:options.products.filter(item => item !== singleProduct)})
        // }
    }

    const saveDiscount = async () => {
        setloading(true)
        if(singleProduct === ""){
            alert("لطفا یک محصول را انتخاب کنید")
            setloading(false)
            return
        }
        if(datec === "" || datee === "" || value === "" ){
            alert("یکی از مقادیر وارد نشده")
            setloading(false)
            return
        }
        const product = JSON.parse(singleProduct);
        const data = {
            type:type,
            datec,
            datee,
            value,
            productId:product._id,
            shegeft
        }
        await axios.post(`${BASE_URL}/admin/discount/addProductDiscount`,data).then(response =>{
            if(response.data.success){
                alert(response.data.message)
                getProductsDiscount()
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setloading(false)
    }

    const getProductsDiscount = async () => {
        setloading(true)
        await axios.get(`${BASE_URL}/admin/discount/getDiscountProducts`).then(response => {
            if(response.data.success){
                setProductDis(response.data.data)
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setloading(false)
    }

    const deleteDis = async (id) => {
        setloading(true)
        await axios.post(`${BASE_URL}/admin/discount/deleteDiscountProduct`,{id}).then(response =>{
            if(response.data.success){
                alert(response.data.message)
                getProductsDiscount()
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setloading(false)
    }

    useEffect(() => {
        getProductsDiscount()
        getOption()
    }, [])

    const getOption = async () => {
        setloading(true)
        await axios.post(`${BASE_URL}/admin/option/getOptionByname`,{name:"slider_shegeft"}).then(response => {
          if(response.data.success){
            setOptions({...options,enable:response.data.data.value.slider_shegeft_enable})
          }else{
            alert(response.data.message)
          }
        }).catch(err => {
          console.log(err.message)
        })
        setloading(false)
    }

    const chengeStatus = async () => {
        setloading(true)
            setOptions({...options,enable:!options.enable})
            await axios.post(`${BASE_URL}/admin/option/initSettingsWebsite2`,{name:"slider_shegeft",slider_shegeft_enable:!options.enable}).then(response => {
                if(response.data.success){
                    getOption()
                }else{
                    alert(response.data.message)
                }
            }).catch(err =>{
                alert(err.message)
            })
        setloading(false)
    }
    

  return ( 
    <>
    {
        loading?
        <h2>Loading ...</h2>
        :
        <div>
            <div className='xcvnn'>
                <label>فعال</label>
                <input type="checkbox" checked={options.enable} onChange={() => chengeStatus()} />
            </div>
            <div className='xcvnn'>
                <label>محصولات</label>
                <Button onClick={() => setOpen(true)}>انتخاب</Button>
            </div>
            <div className='item itc2'>
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
                    <span>شگفت انگیز</span>
                    <input type="checkbox" checked={shegeft}  onChange={(e) => setShegeft(!shegeft)} />
                </div>

                {
                    singleProduct && singleProduct !== "" &&
                <div className='ddf'>
                    <span>محصول</span>
                    <div>
                        <img src={`${BASE_URL}${JSON.parse(singleProduct).images[0]}`} />
                        <h5>{JSON.parse(singleProduct).p_name}</h5>
                        <h3>{JSON.parse(singleProduct).priceAsli}</h3>
                    </div>
                </div>
                }
                <Button onClick={() => saveDiscount()}>تایید </Button>

            </div>

            <div>
                <table className='tblMe'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>عکس</th>
                            <th>نام</th>
                            <th>مقدار تخفیف</th>
                            <th>نوغ</th>
                            <th>شروع</th>
                            <th>پایان</th>
                            <th>شگفت</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            productDis.length > 0 &&  productDis.map((item,index) => 
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>
                                    <img src={`${BASE_URL}${item.images[0]}`} style={{width:'45px',height:"45px"}} />
                                </td>
                                <td>{item.p_name}</td>
                                <td>{item.discount.value}</td>
                                <td>{item.discount.type}</td>
                                <td>{item.discount.start_date}</td>
                                <td>{item.discount.end_date}</td>
                                <td>{item.discount.shegeft ? "بله" :"خیر"}</td>
                                <td>
                                    <button onClick={() => {deleteDis(item._id)}}>حذف</button>
                                    <button>ویرایش</button>
                                </td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            <Modal
                title="انتخاب عکس"
                
                open={open}
                onOk={() => handleOk()}
                onCancel={() => setOpen(false)}
                width={1000}
                style={{direction:'rtl',maxHeight:"60vh"}}
                >
                <ProductsSingle />
            </Modal>
        </div>
    }
    </>
  )
}

export default Shegeft