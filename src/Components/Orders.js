import React,{useContext, useEffect,useState} from 'react';
import { Space, Table, Tag , Divider, Radio , Modal , Button , Select } from 'antd';
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

const Orders = () => {
  const {SettingShow} = useContext(ViewContext)
  const navigate = useNavigate();
  const columns = [
    {
      title: 'پیگیری',
      dataIndex: 'order_id',
      key: 'order_id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'مبلغ',
      key: 'amount',
      dataIndex: 'amount'
    },
    {
      title: 'موبایل',
      key: 'customer_phone',
      dataIndex: 'customer_phone',
      render: (vis) => {
        return(
          vis
        )
      }
    },
    {
      title: 'وضعیت',
      key: 'status',
      dataIndex: 'status',
      render: (vis) => {
        return(
          vis
        )
      }
    },
    {
      title: 'تخفیف',
      key: 'discount',
      dataIndex: 'discount',
      render: (vis) => {
        return(
          vis ?
          (vis.type === "naghdi") ?
          `${vis.price}  تومان`
        :
        `${vis.price}  درصد`
          :
          'بدون تخفیف'
          
        )
      }
    },
    {
      title: 'روش ارسال',
      key: 'pestDet',
      dataIndex: 'pestDet',
      render: (pestDet) => {
        return(
          pestDet[0].name
        )
      }
    },



    {
      title: 'عملیات',
      key: '_id',
      dataIndex: '_id',
      render: (_, record) => (
        <Space size="middle">
          <span style={{cursor:'pointer'}} onClick={() => {viewDetail2(record)}}><EditOutlined title='ویرایش' /></span>
          <span style={{cursor:'pointer'}} onClick={() => deleteProduct(record._id)}><DeleteOutlined title='حذف' /></span>
          <a onClick={() => {viewDetail(record)}}><EyeOutlined title='مشاهده'/></a>
        </Space>
      ),
    },
  ];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [deleteId, setdeleteId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [tracking_code, setTracking_code] = useState('');
  const [status, setStatus] = useState('');

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleOk = async () => {
    setIsModalOpen(false);
    await axios.post(`${BASE_URL}/admin/order/deleteOrderOne`,{id:deleteId}).then(response => {
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

  const handleOk1 = () => {
    console.log('asd')
  }

  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  const viewDetail = (data) => {
    setIsModalOpen1(true);
    setDetail(data)
  }

  const handleOk2 = async () => {
    setLoading(true)
    const data = {status,tracking_code,id:detail._id}
    await axios.post(`${BASE_URL}/admin/order/updateStatus`,data).then(response => {
      if(response.data.success){
        alert(response.data.message)
        getData()
      }else{
        alert(response.data.message)
      }
    }).catch(err => {
      alert(err.message)
    })
    setLoading(false)
    setIsModalOpen2(false)


  }

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const viewDetail2 = (data) => {
    setIsModalOpen2(true);
    setDetail(data)
    setStatus(data.status)
  }

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
    await axios.post(`${BASE_URL}/admin/order/getAllOrders`,getRandomuserParams(tableParams)).then(response => {
      console.log(response.data)
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
    // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //   setData([]);
    // }
    if (pagination.pageSize !== (tableParams.pagination && tableParams.pagination.pageSize)) {
      setData([]);
    }
  };

  const handleChange = (value) => {
    // console.log(`selected ${value}`);
    setStatus(value)
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

    <>
      <Modal title="جزيیات سفارش" open={isModalOpen1} onOk={handleOk1} onCancel={handleCancel1}>
        {console.log(detail)}
        {
          detail && <div className='myMod'>
          <div>
            <span>مبلغ</span>
            :
            <span>{detail.amount}</span>
          </div>

          <div>
            <span>کارت</span>
            :
            <span>{detail.card}</span>
          </div>

          <div>
            <span>محصولات</span>
            :
            <div>
              {
                detail.cartDetail.product.map((item,index) => 
                  <div key={index}>
                    {item.p_name} - 
                    {JSON.parse(item.addonItem).map((item1,index1) => 
                      <span key={index1}>
                        - {item1.title}  :  {item1.key} -
                      </span>  
                    )}
                  </div>
                )
              }
              
            </div>
          </div>

          <div>
            <span>تاریخ پرداخت</span>
            :
            <span>{detail.updatedAt}</span>
          </div>

          <div>
            <span>وضعیت</span>
            :
            <span>{detail.status}</span>
          </div>

          <div>
            <span>آدرس</span>
            :
            <span>{detail.addRessDet[0].ostanName} - {detail.addRessDet[0].cityName} - {detail.addRessDet[0].description} - 
            {detail.addRessDet[0].name}
            </span>
          </div>

          <div>
            <span>روش ارسال</span>
            :
            <span>{detail.pestDet[0].name}</span>
          </div>

          <div>
            <span>شماره پیگیری سایت</span>
            :
            <span>{detail.order_id}</span>
          </div>

          <div>
            <span>شماره پیگیری بانک</span>
            :
            <span>{detail.shaparakref}</span>
          </div>

          <div>
            <span>تخفیف</span>
            :
            <span>
              {
                detail.discount ?
                (detail.discount.type === "naghdi") ?
                `${detail.discount.price}  تومان`
              :
              `${detail.discount.price}  درصد`
                :
                'بدون تخفیف'
              }
            </span>
          </div>


      </div>
        }
      </Modal>
    </>

    <>
      <Modal title="ویرایش سفارش" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2}>
        {console.log(detail)}
        {
          detail && <div className='myMod'>

          <div>
            <span>کد رهگیری پستی</span>
            :
            <input onChange={(e) => setTracking_code(e.target.value)} />
          </div>

          <div>
            <span>تغییر وضعیت</span>
            :
          <Select
            defaultValue={status}
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={[
              {
                value: 'pending',
                label: 'در انتظار پرداخت',
              },
              {
                value: 'پرداخت شده',
                label: 'پرداخت شده',
              },
              {
                value: 'ارسال شده',
                label: 'ارسال شده',
              },
              {
                value: 'لغو شده',
                label: 'لغو شده',
              },
              {
                value: 'تحویل شده',
                label: 'تحویل شده',
              },
            ]}
          />
          </div>

      </div>
        }
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

export default Orders