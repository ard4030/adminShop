import { Button, Modal } from 'antd';
import axios from 'axios';
import React, { useState, useRef , useContext , useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import OtherContext from '../Context/GlobalContext';
import { BASE_URL } from '../utils/constans';
import UploadCenterSingle from './UploadCenterSingle';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { DateObject } from 'react-multi-date-picker';


const Articles = () => {
  const {singleImage} = useContext(OtherContext);
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [option, setOption] = useState({
    name:"slider_article",
    slider_atricle_enable:true,
    slider_atricle_number:20
  });



  const quillRef = useRef(null);
  const handleChange = (content, delta, source, editor) => {
    setValue(content);
  };
  const handleRightAlign = () => {
    const range = quillRef.current.getEditor().getSelection();
    if (range) {
      quillRef.current.getEditor().formatText(range.index, range.length, { 'align': 'right' });
    }
  };
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, {'font': []}],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  };
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align'
  ];

  const Save = async () => {
    setLoading(true)
    if(title === ""){
      alert("no title")
      setLoading(false)
      return 
    }

    if(image === ""){
      alert("no image")
      setLoading(false)
      return 
    }

    const data = {
      title,
      value,
      image
    }
    await axios.post(`${BASE_URL}/admin/option/addArticle`,data).then(respopnse => {
      if(respopnse.data.success){
        alert(respopnse.data.message)
        setTitle("")
        setImage("")
        setValue("")
        getArticles()
      }else{
        alert(respopnse.data.message)
      }
    }).catch(err => {
      alert(err.message)
    })
    setLoading(false)

  }

  const getArticles = async () => {
    setLoading(true) 
    await axios.post(`${BASE_URL}/admin/option/getArticles`).then(response => {
      if(response.data.success){
        setArticles(response.data.data)
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
    await axios.post(`${BASE_URL}/admin/option/getOptionByname`,{name:"slider_article"}).then(response => {
      if(response.data.success){
        setOption({
          slider_atricle_enable:response.data.data.value.slider_atricle_enable,
          slider_atricle_number:response.data.data.value.slider_atricle_number,
          name:response.data.data.name
        })
      }else{
        alert(response.data.message)
      }
    }).catch(err => {
      console.log(err.message)
    })
    setLoading(false)
  }

  useEffect(() => {
    getArticles()
    getOptions()
  }, [])

  const SaveOption = async () => {
    setLoading(true)
    await axios.post(`${BASE_URL}/admin/option/initSettingsWebsite4`,option).then(response => {
     if(response.data.success){
       alert(response.data.message)
       getOptions();
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
      <h2>loading ...</h2>
      :
      <div>
        <div className='bb45'>
          <h3>تنظیمات</h3>    
              <div>
                <label>فعال</label>
                <input type="checkbox" checked={option.slider_atricle_enable} onChange={() => setOption({...option,slider_atricle_enable:!option.slider_atricle_enable})} />
              </div>

              <div>
                <label>تعداد آیتم ها</label>
                <input type="number" value={option.slider_atricle_number} onChange={(e) => setOption({...option,slider_atricle_number:e.target.value})} />
              </div>

              <Button onClick={() => SaveOption()}>ذخیره تنظیمات</Button>
        </div>
        <div className='heeed'>
            <h3>مقالات</h3>
            <div className='xcvnn'>
                <label>عنوان</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className='xcvnn'>
                <label>عکس</label>
                <Button onClick={() => setOpen(true)}>انتخاب عکس</Button>
                {
                    image !== "" && 
                    <img style={{width:'50px',height:'50px'}} src={`${BASE_URL}${image}`} />
                }
            </div>
            <Button onClick={() => Save()}>ذخیره</Button>
            
        </div>
      <ReactQuill
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Type here..."
        ref={quillRef}
      />
      {/* <button onClick={handleRightAlign}>Right Align</button> */}

      <Modal
          title="انتخاب عکس"
          centered
          open={open}
          onOk={() => {
            setOpen(false)
            setImage(singleImage)
          }}
          onCancel={() => setOpen(false)}
          width={1000}
          style={{direction:'rtl'}}
        >
          <UploadCenterSingle />
      </Modal>

      <div className='mt20'> 
      <table className='tbbk'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>عکس</th>
                    <th>عنوان</th>
                    <th>تاریخ انتشار</th>
                    <th>عملیات</th>
                </tr>
            </thead>

            <tbody>
                {
                    articles.map((item,index) => {
                      // const date = new DateObject({ calendar: persian, locale: persian_fa })
                      const date1 = new DateObject(item.createdAt).convert(persian, persian_fa)
                      // console.log(date1.month.name) //تیر
                      return <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                          <img src={`${BASE_URL}${item.image}`} style={{width:'50px',height:'50px'}} />
                      </td>
                      <td>{item.title}</td>
                      <td>{date1.format()}</td>
                      
                      <td>
                          <div>
                              {/* <button>حذف</button>
                              <button onClick={() => {handleEdit(item)}}>ویرایش</button> */}
                          </div>
                      </td>
                  </tr>
                    })
                }
                
            </tbody>
        </table>
      </div>
    </div>
    }
    </>
  );
};

export default Articles;