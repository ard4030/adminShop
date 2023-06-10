import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constans";
import { Button , Space, Spin } from "antd";

function Features() {
  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState(null);
  const [name, setName] = useState(null);
  const [asli,setAsli] = useState(false);
  const [reff,setReff] = useState(false);
  const [title,setTitle] = useState(false);
  const [technicalSpecifications,setTechnicalSpecifications] = useState([]);
  const [loading,setLoading] = useState(false)


  const getCats = async () => {
    setLoading(true)
    await axios.get(`${BASE_URL}/user/category/getAllCategory1`,{
      headers:{
        accessToken:`bearer ${localStorage.getItem('@token')}`
      }
    }).then(response => {
        setCategories(response.data.data)
    }).catch(err => {
      alert(err.message)
    })
    setLoading(false)

  }

  const getFeat = async (id) => {
    setLoading(true)
    await axios.post(`${BASE_URL}/admin/category/getFeatById`,{id}).then(response => {
        setTechnicalSpecifications(response.data.data?response.data.data.technicalSpecifications:[])
        // setReff(!reff)
        console.log(response.data)
    }).catch(err => {
        alert(err.message)
    })
    setLoading(false)
  }

  useEffect(() => {
    getCats();
  }, []);

  const saveFeature = async () => {
    setLoading(true)
    const data = {
        catId : catId.id,
        technicalSpecifications
    }
    await axios.post(`${BASE_URL}/admin/category/addFeature`,data).then(response =>{
        alert(response.data.message)
        // getFeat(catId)
    }).catch(err => {
        alert(err.message)
    })
    setLoading(false)
  }

 const SubCat = ({category}) => {

    return(
        <ul className="ulxx">
            {
               category.map((item,index) => {
                  return  <li  key={index}>
                        <span onClick={() => {
                            setCatId({name:item.title,id:item._id})
                            getFeat(item._id) 
                            }} className="itt"> - {item.title}</span>
                        <SubCat category={item.children} />
                    </li>
                })
            }

        </ul>
    )
  }

  const AddTechnical = () => {
    if(!title){
        alert('نام دسته بندی ویژگی نمیتواند خالی باشد')
        return
    }
    let x = technicalSpecifications.filter(item => item.title === title);
    if(x && x.length > 0){
        alert('این دسته بندی ویژگی قبلا ایجاد شده')
        return
    }

    setTechnicalSpecifications(prevState => [...technicalSpecifications, {
        title:title,
        specs:[]
    }]);

  }

  const addVizh = (title) => {
    let data = technicalSpecifications;
    data.map(item => {
        if(item.title === title){
            let x = item.specs.filter(item => item.key === name);
            if(x.length > 0) {
                alert('این ویژگی برای این دسته وجود دارد')
                return
            }
            item.specs.push({key:name,asli:asli})
        }else{return}
    })
    setTechnicalSpecifications(data)
    setAsli(false)
    setName('')
    
  }

  const deleteItem = (title,key) => {
    let data = technicalSpecifications;
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
    setTechnicalSpecifications(data)
    setReff(!reff)
  }

  const deleteVizh = (title) => {
    let data = technicalSpecifications.filter(item => item.title !== title)
    setTechnicalSpecifications(data)
    setReff(!reff)
  }

  const editItem = (event, specIndex, valueIndex) => {
    const { name, value } = event.target;
    setTechnicalSpecifications(prevState => {
      const newState = [...prevState];
      newState[specIndex].specs[valueIndex][name] = value;
      return newState;
    });

  }



  return (
    <>
    {
        loading ? 

    <Space
    direction="vertical"
    style={{
    width: '100%',
    }}
        >
            <Space>
                <Spin tip="Loading" size="large">
                    <div className="content" />
                </Spin>
            </Space>

    </Space>
  :

    <>
        <ul className="ulno">
            {

            categories && categories.map((item,index) => {
                return (
                    !item.parent && 
                        <li key={index}>
                            <span> - {item.title}</span>
                            <SubCat category={item.children} />
                        </li>
                )
            })

            }
        </ul>

        <div className="sdfg">
            <input onChange={(e) => {setTitle(e.target.value)}}  placeholder="title"/>
            <button onClick={() => {AddTechnical()}}>افزودن دسته ویژگی</button>
        </div>
        <p>
            ویژگی ها برای دسته -  <span style={{fontWeight:'bold',fontSize:'15px'}}>{catId && catId.name}</span>  - ایجاد میشود
        </p>
        {
            technicalSpecifications && technicalSpecifications.map((item , index) => {
                
                return <div className="vbb" key={index}>
                    <h3>{item.title} <button onClick={() => {deleteVizh(item.title)}}>حذف</button></h3>
                    <div className="dflex">
                        <label>نام ویژگی</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                        <div>
                            <span>اصلی؟</span>
                            <input type="checkbox" checked={asli ? true : false} value={asli} onChange={() => setAsli(!asli)} />
                        </div>
                        <button onClick={() => {addVizh(item.title)}}>افزودن</button>
                    </div>
                    {
                        item.specs.map((key, keyIndex) => {
                            return <div  key={keyIndex} className="item x212">
                                <input value={key.key} name="key" onChange={event => 
                                editItem(event, index, keyIndex)} /> 
                                {key.asli && <span className="aslispan">اصلی</span>}
                                <button onClick={() => {deleteItem(item.title,key.key)}} className="mr20">delete</button>
                                </div>
                        })
                    }

                </div>
            })
        }
        {/* {
           feat && feat.map((item,index) => 
           <div className="itemmm" key={index}>
                <label>{item.name}</label>
                {item.asli && <span className="aslll">اصلی</span>}
                <button onClick={() => deleteFeat(item._id)}>حذف</button>
           </div>
           ) 
        } */}

        <Button onClick={()=> {saveFeature()}} type="primary">ذخیره</Button>
        
    </>

    }
    </>

    
  );
}

export default Features;