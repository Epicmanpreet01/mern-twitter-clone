import { useState } from 'react'
import XSvg from "../../../components/svgs/X";
import { Link } from 'react-router-dom'; 
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LogInPage = () => {
  const [formData,setFormData] = useState({
    email: '',
    password: ''
  });

  function handleChange(e) {
    const { name,value } = e.target;

    setFormData(prevFormData => ({
      ...prevFormData,
        [name]:value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  const isError = false

  return (
    <div className='flex max-w-screen-xl mx-auto px-10 h-screen w-full'>
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>

      <div className='flex-1 flex flex-col justify-center items-center w-full'>
        <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col w-full' onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className='text-4xl font-extrabold text-white '>{"Let's"} go.</h1>
          <label className='input input-bordered rounded flex items-center gap-2 w-full'>
            <MdOutlineMail />
            <input 
              type="email" 
              className='grow' 
              placeholder='Email'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label className='input input-bordered rounded flex items-center gap-2 w-full'>
            <MdPassword />
            <input 
              type="password" 
              className='grow' 
              placeholder='Password'
              name='password'
              value={formData.password}
              onChange={handleChange}
            />
          </label>     
          <button className='btn rounded-full btn-primary text-white'>Login</button>
          {isError && <p className='text-error'>Something went wrong</p>}
        </form>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-white text-md'>Already have an account?</p>
          <Link to="/SignUp">
            <button className='btn btn-outline btn-primary rounded-full text-white w-full mt-3'>Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LogInPage