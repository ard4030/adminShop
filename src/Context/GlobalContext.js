import axios from "axios";
import React,{ createContext , useState  } from "react";
import { BASE_URL } from "../utils/constans";

const OtherContext = createContext();

export const GlobalProvider = ({children}) => {
    const [selected, setSelected] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [images,setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [productImages,setProductImages] = useState([]);
    const [singleImage, setSingleImage] = useState("");
    const [singleProduct,setSingleProduct] = useState("");
  
    const changeSingle = (data) => {
      setSingleImage(data)
    }


    const getData = async () => {
        setLoading(true)
        const data = {
          page:1,
          size:20
        }
        await axios.post(`${BASE_URL}/admin/upload/getAllImages`,data).then(response => {
          if(response.data.success){
            setImages(response.data.data)
          }else{
            alert(response.data.message)
          }
        }).catch(err => {
          alert(err.message)
        })
        setLoading(false)
    }
    
    const deleteItems = async () => {
    setLoading(true)
    const data = {
        ids:selected
    }
    await axios.post(`${BASE_URL}/admin/upload/deleteManyImages`,data).then(response => {
        if(response.data.success){
        alert(response.data.message)
        getData()
        console.log(response.data)
        }else{
        alert(response.data.message)
        }
    }).catch(err => {
        alert(err.message)
    })
    setLoading(false)

    }
    
    // forUpload
    const handleFileInputChange = (event) => {
    setSelectedFiles(event.target.files);
    };
    
    const handleUploadButtonClick = async () => {
    setLoading(true)
    const formData = new FormData();
    if(!selectedFiles || selectedFiles.length < 1){
        alert('لطفا یک عکس را انتخاب کنید')
        setLoading(false)
        return false
    }
    for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);
    }

    await axios.post(`${BASE_URL}/admin/product/uploadImages`, formData).then(response => {
        if(response.data.success){
            getData()
            setSelectedFiles(null)
        }else{
            alert(response.data.message)
        }
        
    }).catch(error => {
        console.log(error);
    });
        setLoading(false)
    };

    const handleChange = (event) => {
        const id = event.target.value;
        if (id === "all") {
          if (selectAllChecked) {
            setSelected([]);
          } else {
            const allIds = images.map((item) => item.path);
            setSelected(allIds);
          }
          setSelectAllChecked(!selectAllChecked);
        } else {
          if (selected.includes(id)) {
            setSelected(selected.filter((item) => item !== id));
          } else {
            setSelected([...selected, id]);
          }
        }
    };

    const handleSelectAllChange = () => {
        if (selectAllChecked) {
          setSelected([]);
        } else {
          const allIds = images.map((item) => item.path);
          setSelected(allIds);
        }
        setSelectAllChecked(!selectAllChecked);
    };

    const selectImagesDetail = (myImages=[]) => {
      let x = [];
      images.map(item => {
        if(selected.includes(item._id) || myImages.includes(item.path)){
          x.push(item.path)
        }
      })
      setProductImages(x)
    }
    

    return (
        <OtherContext.Provider value={{
            selected,handleChange,handleSelectAllChange,selectAllChecked,
            getData,loading,handleFileInputChange,handleUploadButtonClick,deleteItems,images,selectImagesDetail,
            productImages,setSelected , singleImage , changeSingle , singleProduct , setSingleProduct
            
            }}>
            {children}
        </OtherContext.Provider>
    )
}

export default OtherContext;