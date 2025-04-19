import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/cartTotal';
import { toast } from 'react-toastify';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [clicked, setClicked] = useState(false);

  const handleCheckout = () => {
    if (cartData.length === 0) {
      toast.error('Your cart is empty');
    } else {
      if (clicked) {
        toast.error('Please wait...');
      } else {
        setClicked(true);
        navigate('/place-order');
    }
    }
  }

  useEffect(() => {
    
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            tempData.push({ 
              _id: items, 
              size: item, 
              quantity: cartItems[items][item] 
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    setCartData(tempData);
  },[cartItems])

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        { cartData.length === 0 ? (
          <p className='text-gray-500 text-center py-10'>Your cart is empty</p>
        ) : (
          cartData.map((item,index)=> {
            const productData = products.find((product)=> product._id === item._id);

            if (!productData) {
              return null;
            }

            return (
              <div key={index} className='py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='border text-[12px] w-[25px] h-[25px] bg-slate-50 flex items-center justify-center'>{item.size}</p>
                    </div>
                  </div>
                </div>
                <input 
                onChange={(e) => {
                  let value = Number(e.target.value);
                  
                  if (value < 1 || isNaN(value)) {
                    setCartData((prevCartData) =>
                      prevCartData.map((cartItem) =>
                        cartItem._id === item._id && cartItem.size === item.size
                          ? { ...cartItem, quantity: item.quantity } // Reset to original quantity
                          : cartItem
                      )
                    );
                  } else {
                    updateQuantity(item._id, item.size, value);
                  }
                }}
                className='border max-w-10 sm:max-w-20 px-2 sm:px-2 py-1' 
                type="number" 
                min={1} 
                value={item.quantity}
                />
                <img onClick={()=> updateQuantity(item._id, item.size,0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
              </div>
            )
          })
        )}
      </div>

      
      
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button 
            // onClick={handleCheckout}
            onClick={() => navigate('/place-order')}
            className='bg-black text-white text-sm my-4 px-8 py-3'>
              PROCEED TO CHECKOUT
            </button>
  
          </div>
        </div>

      </div>

    </div>
  )
}

export default Cart