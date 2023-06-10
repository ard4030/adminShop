import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import React,{ useEffect, useState } from "react";
import { Button, Modal , Table , Space } from 'antd';
import axios from "axios";
import { BASE_URL } from "../utils/constans";
import {
    EyeOutlined,
    EditOutlined ,
    DeleteOutlined
  } from '@ant-design/icons';


const Apis = () => {
    const [code, setCode] = useState("")
    const [text, setText] = useState("")
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [data, setData] = useState({
        title:"",
        description:"",
        address:"",
        method:"",
        example:"",
        category:""
    })

    const [tableParams, setTableParams] = useState({
        pagination: {
          current: 1,
          pageSize: 10,
        },
    });

    const columns = [
        {
          title: 'عنوان',
          dataIndex: 'title',
          key: 'title',
          render: (text) => <a>{text}</a>,
        },
        {
            title: 'توضیحات',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <button onClick={() => alert(text)}>نمایش</button>,
        },
        {
            title: 'آدرس ',
            dataIndex: 'address',
            key: 'address',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'متد',
            dataIndex: 'method',
            key: 'method',
            render: (text) => <span className="spnmet">{text}</span>,
        },
        {
            title: 'دسته بندی',
            dataIndex: 'category',
            key: 'category',
            render: (text) => <span className="spnmet1">{text}</span>,
        },
        {
            title: 'مثال',
            dataIndex: 'example',
            key: 'example',
            render: (text) => {
                return(
                    <>
                        <button onClick={() => {
                            setText(text)
                            setOpen1(true)
                            }}>نمایش</button>
                        
                    </>
                )
            },
        },

        {
          title: 'عملیات',
          key: '_id',
          dataIndex: '_id',
          render: (_, record) => (
            <Space size="middle">
              <span style={{cursor:'pointer'}} onClick={() => {/*viewDetail2(record)*/}}><EditOutlined title='ویرایش' /></span>
              <span style={{cursor:'pointer'}} onClick={() => deleteItem(record._id)}><DeleteOutlined title='حذف' /></span>
              <a onClick={() => {/*viewDetail(record)*/}}><EyeOutlined title='مشاهده'/></a>
            </Space>
          ),
        },
    ];

    const getItems = async () => {
        setLoading(true)
        await axios.post(`${BASE_URL}/admin/apis/getAll`).then(response => {
            if(response.data.success){
                setItems(response.data.data)
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setLoading(false)
    }

    const getRandomuserParams = (params) => {
        let results = params.pagination ? params.pagination.pageSize : undefined;
        let page = params.pagination ? params.pagination.current : undefined;
        return {
          results,
          page,
          ...params,
        };
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
          pagination,
          filters,
          ...sorter,
        });
    
        // `dataSource` is useless since `pageSize` changed
        // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        //   setData([]);
        // }
        if (pagination.pageSize !== (tableParams.pagination && tableParams.pagination.pageSize)) {
          setData([]);
        }
    };

    const deleteItem = () => {

    }

    useEffect(() => {
        getItems()
    }, [])
    

    const changeHandler = (e) => {
        setData({...data,[e.target.name]:e.target.value})
    }

    const createApi = async () => {
        setLoading(true)
        await axios.post(`${BASE_URL}/admin/apis/add`,data).then(response => {
            if(response.data.success){
                alert(response.data.message)
                getItems()
                setOpen(false)
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setLoading(false)
    }

    return (
        <>
            <Button style={{marginBottom:'20px'}} type="primary" onClick={() => setOpen(true)}>
                افزودن
            </Button>
            <Modal
                title="افزودن جدید"
                centered
                open={open}
                onOk={() => createApi()}
                onCancel={() => setOpen(false)}
                width={1000}
                style={{direction:'rtl'}}
            >
                <div className="allIn">
                    <div>
                        <label>عنوان</label>
                        <input className="newIpStyle" name="title" value={data.title} onChange={(e) => {changeHandler(e)}} />
                    </div>

                    <div>
                        <label>توضیحات</label>
                        <input className="newIpStyle" name="description" value={data.description} onChange={(e) => {changeHandler(e)}} />
                    </div>

                    <div>
                        <label>آدرس ای پی آی</label>
                        <input className="newIpStyle" name="address" value={data.address} onChange={(e) => {changeHandler(e)}} />
                    </div>

                    <div>
                        <label>متد</label>
                        <input className="newIpStyle" name="method" value={data.method} onChange={(e) => {changeHandler(e)}} />
                    </div>

                    <div>
                        <label>دسته بندی</label>
                        <input className="newIpStyle" name="category" value={data.category} onChange={(e) => {changeHandler(e)}} />
                    </div>

                    <div>
                        <label>کد نمونه</label>
                        <textarea className="cvvb" name="example" value={data.example} onChange={(e) => {changeHandler(e)}}/>
                        <pre className="pree">
                            <code>
                                {data.example}
                            </code>
                        </pre>
                    </div>
                </div>
            </Modal>

            <Modal
                        title="نمایش مثال"
                        centered
                        open={open1}
                        onOk={() => setOpen1(false)}
                        onCancel={() => setOpen1(false)}
                        width={1000}
                        style={{direction:'rtl'}}
                    >
                        <div className="allIn">
                            <div>
                                <label>کد نمونه</label>
                                <pre className="pree">
                                    <code>
                                        {text}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </Modal>


            <Table 
            columns={columns} 
            dataSource={items} 
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            loading={loading}
            />
        </>
      
    );
}
export default Apis;
