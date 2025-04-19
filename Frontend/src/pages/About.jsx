import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'


const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.</p>
          <p>Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home esssentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission at Forever is to empower customers with choice, convenience, and quality. We believe that shopping should be an enjoyable experience, and we strive to make it easy for people to find the products they love.</p>
        </div>
      </div>

      <div className='text-3xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We take pride in our commitment to quality. Our products are carefully sourced and tested to ensure they meet the highest standards of durability, functionality, and aesthetics.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier. You can browse, add to cart, and checkout with just a few clicks.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>We believe in providing exceptional customer service. Our dedicated support team is always ready to assist you with any questions or concerns you may have.</p>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  )
}

export default About