import { useState } from 'react'
import XSvg from "../../../components/svgs/X";
import { Link } from 'react-router-dom'; 
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/common/LoadingSpinner';


const SignUpPage = () => {

  const queryClient = useQueryClient();
  const { mutate:signUpMutation, isPending} = useMutation({
    mutationFn: async({email,userName,name,password}) => {
      try {
        const res = await axios.post('/api/oauth/signup',{email,userName,name,password});
        if(res.status !== 201) {
          throw new Error('Failed to sign up');
        }
        const data = res.data
        if(!data) {
          throw new Error('No data received from server');
        }
        return data
      } catch (error) {
        console.error(`Error occured in mutation function: ${error.message}`)
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['authUser']});
    },
    onError: (error) => {
      console.error(`Error occured in mutation: ${error.message}`);
      toast.error(error.response?.data?.message || 'Failed to sign up');
    }
  })

  const [formData,setFormData] = useState({
    email: '',
    name: '',
    userName: '',
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
    signUpMutation(formData);
  }


  return (
    <div className='flex max-w-screen-xl mx-auto px-10 h-screen w-full'>
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>

      <div className='flex-1 flex flex-col justify-center items-center lg:w-full'>
        <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className='text-4xl font-extrabold text-white '>Join today.</h1>
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
            <FaUser />
            <input 
              type="text" 
              className='grow' 
              placeholder='Username'
              name='userName'
              value={formData.userName}
              onChange={handleChange}
            />
          </label>
          <label className='input input-bordered rounded flex items-center gap-2 w-full'>
            <MdDriveFileRenameOutline />
            <input 
              type="text" 
              className='grow' 
              placeholder='Full Name'
              name='name'
              value={formData.name}
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
          <button className='btn rounded-full btn-primary text-white'>
            {isPending? <LoadingSpinner /> : 'Sign Up' }
          </button>
        </form>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-white text-md'>Already have an account?</p>
          <Link to="/LogIn">
            <button className='btn btn-outline btn-primary rounded-full text-white w-full mt-3'>Sign In</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage