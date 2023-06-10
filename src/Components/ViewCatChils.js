import { Button, Modal } from 'antd';
import axios from 'axios';
import React,{useState , useContext} from 'react'
import OtherContext from '../Context/GlobalContext';
import { BASE_URL } from '../utils/constans'
import UploadCenterSingle from './UploadCenterSingle';

const ViewCatChils = ({cats}) => {
    const [editItem, setEditItem] = useState({
        title:"",
        parent:"",
        id:"",
        description:"",
        image:""
    })
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const {singleImage} = useContext(OtherContext);


    const handleEdit = (data) => {
        setEditItem({
            title:data.title,
            parent:data.parent,
            id:data._id,
            description:data.description,
            image:data.image
        })

        setOpen(true)
    }

    const ViewEdit = () => {

        return(
            <div>
                <div className='xcvnn'>
                    <label>نام</label>
                    <input value={editItem.title} />
                </div>

                <div className='xcvnn'>
                    <label>والد</label>
                    <select>
                        {
                            cats.map((item,index) => 
                            <option selected={(item.parent === editItem.parent) ? true : false} key={index}>{item.title}</option>
                            )
                        }
                    </select>
                </div>

                <div className='xcvnn'>
                    <label>عکس</label>
                    <img  src={`${BASE_URL}${editItem.image}`}  style={{width:"50px",height:"50px"}}/>
                    <Button style={{marginRight:"10px"}} onClick={() => setOpen1(true)}>انتخاب عکس</Button>
                </div>

               
            </div>
        )
    }

    const editing = async () => {
        await axios.post(`${BASE_URL}/admin/category/editCategory`,editItem,{
            headers:{
              accessToken:`bearer ${localStorage.getItem('@token')}`
            }
          }).then(response => {
            if(response.data.success){
              alert(response.data.message)
              
            }else{
              alert(response.data.message)
            }
          }).catch(err => {
            alert(err.message)
          })
    }
    
  return (
    <div className='mt20'>
        <table className='tbbk'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>نام</th>
                    <th>والد</th>
                    <th>عکس</th>
                    <th>عملیات</th>
                </tr>
            </thead>

            <tbody>
                {
                    cats.map((item,index) => 

                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.parent}</td>
                        <td>
                            <img src={`${BASE_URL}${item.image}`} style={{width:'50px',height:'50px'}} />
                        </td>
                        <td>
                            <div>
                                <button>حذف</button>
                                <button onClick={() => {handleEdit(item)}}>ویرایش</button>
                            </div>
                        </td>
                    </tr>
                    
                    )
                }
                
            </tbody>
        </table>

        <Modal
          title="ویرایش دسته بندی"
          centered
          open={open}
          onOk={() => {
            editing()
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
          width={1000}
          style={{direction:'rtl'}}
        >
          <ViewEdit />
        </Modal>

        <Modal
                title="انتخاب عکس"
                centered
                open={open1}
                onOk={() => {
                    setOpen1(false)
                    setEditItem({...editItem,image:singleImage})
                }}
                onCancel={() => setOpen1(false)}
                width={1000}
                style={{direction:'rtl'}}
                >
                <UploadCenterSingle />
        </Modal>
    </div>
  )
}

export default ViewCatChils