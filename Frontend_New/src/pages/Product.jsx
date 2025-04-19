import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProduct from '../components/RelatedProduct';


const Product = () => {

  const {productId} = useParams();
  const {products, currency, addToCart} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  },[productId, products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>

      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>

          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[18.7%]'>
            {
              productData.image.map((item, index) => (
                  <div key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'>
                    <img  onClick={() => setImage(item)}  src={item} width={100} height={100} alt="" />
                  </div>
                ))
            }
          </div>

          <div className='w-full sm:w-[80%]'>
            <img className='w-full' src={image} alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className='pl-2'>{122}</p>
          </div>
          <p className='mt-2 text-xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-sm text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-5'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index)=> (
                <button onClick={() => setSize(item)} key={index} className={`border text-[12px] w-[25px] h-[25px] bg-gray-100 ${item === size ? 'bg-gray-900 text-white' : ''}`}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white text-sm px-8 py-3 active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on dellivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 px-2 py-6 text-sm text-gray-500'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam veritatis accusamus et vero sequi a eos minus aliquid consequatur repudiandae! Tempora soluta qui ut illo esse, quae doloribus distinctio officiis!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum culpa molestiae nesciunt! Assumenda, odio illo! Earum sed vel, iure cumque ab ipsum voluptas eum nihil nulla debitis. Magnam, optio deserunt.</p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='opacity-0'></div>
  
}

export default Product