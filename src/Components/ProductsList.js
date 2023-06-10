import React,{useContext, useEffect,useState} from 'react';
import { Space, Table, Tag , Divider, Radio , Modal , Button } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../utils/constans';
import {
  EyeOutlined,
  EditOutlined ,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ViewContext from '../Context/View';
import AddProduct from './AddProduct';


const ProductsList = () => {
  const {SettingShow} = useContext(ViewContext)
  const navigate = useNavigate();
  const columns = [
    {
      title: 'نام فارسی',
      dataIndex: 'p_name',
      key: 'p_name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'نام انگلیسی',
      dataIndex: 'e_name',
      key: 'p_name',
    },
    {
      title: 'دسته بندی',
      dataIndex: 'finall',
      key: 'finall',
      render: (car) => {
        return <div>
          {car[0].title}
          </div>
      },
    },
    {
      title: 'مود ها',
      key: 'modes',
      dataIndex: 'modes',
      render: (modes) => {
        return(
          <>  

          </>
        )
      },
    },
    {
      title: 'قیمت',
      key: 'priceAsli',
      dataIndex: 'priceAsli'
    },
    {
      title: 'بازدید',
      key: 'visit',
      dataIndex: 'visit',
      render: (vis) => {
        return(
          vis.length
        )
      }
    },
    {
      title: 'وضعیت',
      key: 'status',
      dataIndex: 'status',
      render: (stat) => {
        return(
          <>
           <span className={`${stat}`}>{stat}</span>
          </>
        )
      }
    },
    {
      title: 'عملیات',
      key: '_id',
      dataIndex: '_id',
      render: (_, record) => (
        <Space size="middle">
          <span style={{cursor:'pointer'}} onClick={() => SettingShow({id:record._id,name:"addproduct",comp:<AddProduct />})}><EditOutlined title='ویرایش' /></span>
          <span style={{cursor:'pointer'}} onClick={() => deleteProduct(record._id)}><DeleteOutlined title='حذف' /></span>
          <a onClick={() => {alert(JSON.stringify(record))}}><EyeOutlined title='مشاهده'/></a>
        </Space>
      ),
    },
  ];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setdeleteId] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleOk = async () => {
    setIsModalOpen(false);
    await axios.post(`${BASE_URL}/admin/product/deleteProductOne`,{id:deleteId},{
      headers:{
        accessToken:`bearer ${localStorage.getItem('@token')}`
      }
    }).then(response => {
      setLoading(true)
      if(response.data.success){
        alert(response.data.message)
        getData()
      }else{
        alert(response.data.message)
      }
      setLoading(false)
      setdeleteId(null)
    }).catch(err => {
      alert(err.message)
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setdeleteId(null)
  };

  // const getRandomuserParams = (params) => ({
  //   results: params.pagination?.pageSize,
  //   page: params.pagination?.current,
  //   ...params,
  // });

  const getRandomuserParams = (params) => {
    let results = params.pagination ? params.pagination.pageSize : undefined;
    let page = params.pagination ? params.pagination.current : undefined;
    return {
      results,
      page,
      ...params,
    };
  };

  const getData = async () => {
    setLoading(true);
    await axios.post(`${BASE_URL}/admin/product/getAllProducts`,getRandomuserParams(tableParams),{
      headers:{
        accessToken:`bearer ${localStorage.getItem('@token')}`
      }
    }).then(response => {
      if(response.data.success){
        setData(response.data.data)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            // 200 is mock data, you should read it from server
            total: response.data.count,
          },
        });
      }else{
        alert(response.data.message)
      }
      setLoading(false);
    }).catch(err => {
      alert(err.message)
    })
  }

  const deleteProduct = (id) => {
    setIsModalOpen(true);
    setdeleteId(id)
  }

  useEffect(() => {
    getData()
  }, [JSON.stringify(tableParams)])

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== (tableParams.pagination && tableParams.pagination.pageSize)) {
      setData([]);
    }
  };

 
  

  return (
    <div>

    <>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>
          ایا از حذف محصول اطمینان دارید؟
        </p>
      </Modal>
    </>

    <Table 
    columns={columns} 
    dataSource={data} 
    pagination={tableParams.pagination}
    onChange={handleTableChange}
    loading={loading}
    />

    </div>
    
  )
};

export default ProductsList