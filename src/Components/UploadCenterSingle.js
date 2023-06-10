import React, { useContext , useEffect } from 'react'
import OtherContext from '../Context/GlobalContext';
import { BASE_URL } from '../utils/constans';

const UploadCenterSingle = () => {
  const {images,getData ,changeSingle , singleImage} = useContext(OtherContext)

  useEffect(() => {
    getData()
  }, [])
  
  return (
    <div className='singCont'>
        {
            images.map((item,index) => 
                <img className={`${(singleImage === item.path) ? "sell" : ""}`} onClick={() => changeSingle(item.path)} key={index} src={`${BASE_URL}${item.path}`} />
            )
        }
    </div>
  )
}

export default UploadCenterSingle