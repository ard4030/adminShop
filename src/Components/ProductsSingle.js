import axios from 'axios';
import React,{useState,useEffect, useContext} from 'react'
import OtherContext from '../Context/GlobalContext';
import { BASE_URL } from '../utils/constans';

const ProductsSingle = () => {
    const {singleProduct,setSingleProduct} = useContext(OtherContext)
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeoutId, setTimeoutId] = useState(null);
    const [pagination, setPagination] = useState({
        page:1,
        size:10,
        name:""
    });




    const getProduct = async () => {
        setLoading(true)
        await axios.post(`${BASE_URL}/user/product/getAllProducts`,pagination).then(response => {
            if(response.data.success){
                setProducts(response.data.data)
                setPagination({...pagination,page:response.data.page,size:response.data.size,count:response.data.count})
            }else{
                alert(response.data.message)
            }
        }).catch(err => {
            alert(err.message)
        })
        setLoading(false)
    }

    useEffect(() => {
        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => {
            getProduct();
        }, 1000));
    }, [pagination.name])

    const handleChange = (e) => {
        const value = e.target.value;
        setPagination({...pagination, name: value});
    }
    

  return (
    <>
    {
        loading ? 
        <h3>Loading ...</h3>
        :

        <>
            <div className='serchCont'>
                <input value={pagination.name} onChange={handleChange} placeholder='نام محصول ...' />
            </div>
            <div className='contPrrr'>
                {
                    products.map((item,index) => 
                    <div onClick={() => setSingleProduct(JSON.stringify(item))} key={index} 
                    className={`contIttt ${(singleProduct === JSON.stringify(item) && "actContIt")}`}>
                        <img src={`${BASE_URL}${item.images[0]}`}  />
                        <h5>{item.p_name}</h5>
                    </div>
                    )
                }
                
            </div>
        </>
    }
    </>
  )
}

export default ProductsSingle