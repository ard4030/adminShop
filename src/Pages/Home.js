import React,{useContext, useState , useEffect} from 'react'
import './home.css'
import { Layout , Button } from 'antd';
import Dashboard from '../Components/Dashboard';
import AddProduct from '../Components/AddProduct';
import ProductsList from '../Components/ProductsList';
import ViewContext from '../Context/View';
import { useNavigate , Navigate } from 'react-router-dom';
import AuthContext from '../Context/Auth';
import AddCategory from '../Components/AddCategory';
import Features from '../Components/Features';
import PostMethod from '../Components/PostMethod';
import Discount from '../Components/Discount';
import PaymentMethod from '../Components/PaymentMethod';
import Orders from '../Components/Orders';
import FileManager from '../Components/FileManager';
import Apis from '../Components/Apis';
import { BASE_URL } from '../utils/constans';
import axios from 'axios';
import SliderTop from '../Components/SliderTop';
import SliderMomentary from '../Components/SliderMomentary';
import ProSlider from '../Components/ProSlider';
import Shegeft from '../Components/Shegeft';
import SlidersBottom from '../Components/SlidersBottom';
import Articles from '../Components/Articles';

const { Header, Sider, Content  } = Layout;

const Home = () => {
  const {show,SettingShow} = useContext(ViewContext);
  const navigate = useNavigate();
  const {user  , setUser} = useContext(AuthContext)

  const logOut = async () => {
    await axios.get(`${BASE_URL}/auth/logOut`).then(response => {
        if(response.data.success){
            setUser(null)
            navigate('/login')
        }else{
            alert(response.data.message)
        }
        
    }).catch(err => {
        alert(err.message)
    })
}

  const isLog = async() => {
    await axios.get(`${BASE_URL}/auth/isLogin`,{withCredentials:true}).then(response => {
        if(response.data.success){
          setUser(response.data.user)
        }else{
          navigate('/login')
        }
    }).catch(err => {
      console.log('ccccccc')
    })
}

  useEffect(() => {
    isLog()
  }, [])
  

  return (
    <div className='container'>

      <Layout style={{minHeight:'100vh'}}>
        <Sider style={{background:'#fff'}}>
          <div className='homing'>
            <div className='pool'>
              <span>کاربر</span>
              <span>{user && user.mobile}</span>
              <button onClick={() => logOut()} >خروج</button>
            </div>
            <ul>
                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"داشبورد",comp:<Dashboard />})}
                  type={(show.name === 'داشبورد')? `primary` : 'secondary' } size={'large'}>
                    داشبورد
                  </Button>
                </li>
                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"مدیریت فایل",comp:<FileManager />})}
                  type={(show.name === 'مدیریت فایل')? `primary` : 'secondary' } size={'large'}>
                    مدیریت فایل ها
                  </Button>
                </li>
                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"افزودن محصول",comp:<AddProduct />})}
                  type={(show.name === 'افزودن محصول')? `primary` : 'text' } size={'large'}>
                    افزودن محصول
                  </Button>
                </li>
                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"لیست محصولات",comp:<ProductsList />})}
                  type={(show.name === 'لیست محصولات')? `primary` : 'text' } size={'large'}>
                    لیست محصولات
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"دسته بندی ها",comp:<AddCategory />})}
                  type={(show.name === 'دسته بندی ها')? `primary` : 'text' } size={'large'}>
                    دسته بندی ها
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"ویژگی ها",comp:<Features />})}
                  type={(show.name === 'ویژگی ها')? `primary` : 'text' } size={'large'}>
                    ویژگی ها
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"ارسال",comp:<PostMethod />})}
                  type={(show.name === 'ارسال')? `primary` : 'text' } size={'large'}>
                     ارسال
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"تخفیف",comp:<Discount />})}
                  type={(show.name === 'تخفیف')? `primary` : 'text' } size={'large'}>
                     تخفیف
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"تنظیمات پرداخت",comp:<PaymentMethod />})}
                  type={(show.name === 'تنظیمات پرداخت')? `primary` : 'text' } size={'large'}>
                     تنظیمات پرداخت
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"سفارشات",comp:<Orders />})}
                  type={(show.name === 'سفارشات')? `primary` : 'text' } size={'large'}>
                      سفارشات
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"داکیومنت",comp:<Apis />})}
                  type={(show.name === 'داکیومنت')? `primary` : 'text' } size={'large'}>
                      داکیومنت
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"اسلایدر بالا",comp:<SliderTop />})}
                  type={(show.name === 'اسلایدر بالا')? `primary` : 'text' } size={'large'}>
                      اسلایدر بالا
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"پیشنهاد لحظه ای",comp:<SliderMomentary />})}
                  type={(show.name === 'پیشنهاد لحظه ای')? `primary` : 'text' } size={'large'}>
                    پیشنهاد لحظه ای
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"اسلایدر پرو",comp:<ProSlider />})}
                  type={(show.name === 'اسلایدر پرو')? `primary` : 'text' } size={'large'}>
                    اسلایدر پرو
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"شگفت انگیز",comp:<Shegeft />})}
                  type={(show.name === 'شگفت انگیز')? `primary` : 'text' } size={'large'}>
                    شگفت انگیز
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"اسلایدر های اضافی",comp:<SlidersBottom />})}
                  type={(show.name === 'اسلایدر های اضافی')? `primary` : 'text' } size={'large'}>
                    اسلایدر های اضافی
                  </Button>
                </li>

                <li>
                  <Button 
                  onClick={()=>SettingShow({name:"مقالات",comp:<Articles />})}
                  type={(show.name === 'مقالات')? `primary` : 'text' } size={'large'}>
                    مقالات
                  </Button>
                </li>

            </ul>
          </div>
        </Sider>
        <Layout>
          <Header style={{background:'#3A4F7A',color:'#fff'}}>{show.name}</Header>
          <Content>
            <div style={{padding:'20px'}}>
              {show.comp}
              {/* <ProductsList /> */}
            </div>
          </Content>
          {/* <Footer style={{background:'#3A4F7A'}}>Footer</Footer> */}
        </Layout>
      </Layout>
    </div>

  )
}

export default Home