import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constans';
import Loading from './Loading';
import Loading1 from './Loading1';

const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const handleFileInputChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUploadButtonClick = async () => {
    setLoading(true)
    const formData = new FormData();
    if(selectedFiles.length < 1){
        alert('لطفا یک عکس را انتخاب کنید')
        return false
    }
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    await axios.post(`${BASE_URL}/admin/product/uploadImages`, formData).then(response => {
        if(response.data.success){
            setImages(response.data.data)
            setSelectedFiles(null)
        }else{
            alert(response.data.message)
        }
        
    }).catch(error => {
        console.log(error);
    });
      setLoading(false)
  };



  return (
    <div>
        {
            (loading && loading === true) ?
            <Loading1 />
            :

          <>
            <input type="file" multiple onChange={handleFileInputChange} />
            <button onClick={handleUploadButtonClick}>Upload</button>
            <div 
            style={{display:'flex',alignItems:'center'}}
            >
                {images.map((image, index) => (
                    <div className='ig'>
                        <img 
                        style={{width:'100px',height:'100px',marginLeft:'20px',borderRadius:'10px'}}
                        key={index} src={`${BASE_URL+image.path}`} alt={image.originalname} />
                    {/* <span onClick={() => {deleteImage(image._id)}} className='del'></span> */}
                    </div>
                    
                ))}
            </div>
          </>


        }

    </div>
    
  );
};

export default UploadFiles;