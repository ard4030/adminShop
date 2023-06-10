import axios from 'axios';
import React,{useState , useEffect, useContext} from 'react'
import OtherContext from '../Context/GlobalContext';
import { BASE_URL } from '../utils/constans';
import './addp.css'
import Loading1 from './Loading1';

const UploadCenter = ({res_image}) => {
  const {selected,handleChange,handleSelectAllChange,selectAllChecked,
    getData,loading,handleFileInputChange,handleUploadButtonClick,deleteItems,images
  } = useContext(OtherContext)

  useEffect(() => {
    getData()
  }, [])
  

  return (
    <>
    {
      loading ?
      <Loading1 />  
      :
      <div className='uploadcenter'>
        <header>
            <h2>آپلود سنتر</h2>
            <div className='c23'>
                <input type="file" multiple onChange={handleFileInputChange} />
                <button onClick={handleUploadButtonClick}>آپلود عکس</button>
                <button onClick={handleSelectAllChange}>
                  {selectAllChecked ? "عدم انتخاب همه" : "انتخاب همه"}
                </button>
                <button>تایید</button>
                <button onClick={() => deleteItems()}>حذف</button>
            </div>
        </header>
        <div className='contentUploD'>
          {
            images && images.length > 0 && images.map((item,index) => 
            <div key={index} className='contImgs'>
              <img className='imgsUp' src={`${BASE_URL}${item.path}`} alt='ss'/>
              <input
                type="checkbox"
                value={item.path}
                className="iptImg"
                onChange={handleChange}
                checked={selected.includes(item.path)}
              />
            </div>
            )
          }
            
            

        </div>
    </div>
    }
    </>
  )
}

export default UploadCenter