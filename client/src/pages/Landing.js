import React, { useEffect, useState } from 'react'
import img from '../images/train.gif'
import logo from '../images/logo.png'
import axios from 'axios'
import google from '../images/signin.jpg'
import { FaEye } from 'react-icons/fa'

import { useCookies } from 'react-cookie'
import { Navigate, useNavigate } from 'react-router-dom'
const Landing = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    isMember: true,
  })

  const [alert, setAlert] = useState({ show: false, type: '', text: '' })

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()


  const toggleMember = () => {
    setUser({ ...user, isMember: !user.isMember })
  }

  const handleSocialLogin = async () => {
    window.open(`${process.env.REACT_APP_URL}auth/google`, '_self')
  }

  const handleChange = (e) => {

    setUser({ ...user, [e.target.name]: e.target.value })
  }
  const handleLogin = async (e) => {
    e.preventDefault()

    if (!user.email || !user.password || (!user.isMember && !user.name)) {
      setAlert({
        show: 'true',
        type: 'danger',
        text: 'Please Provide Credentials',
      })
      return
      
    } 
     
    setAlert({show:true,type:'success',text:"Redirecting...."})

    try {
      if (user.isMember) {
        const data = await axios.post(
          `${process.env.REACT_APP_URL}localauth/login`,
          user
        )
        
      } else {
        const data = await axios.post(
          `${process.env.REACT_APP_URL}localauth/register`,
          user
        )
      }
    
       navigate('/home')
    } catch (error) {
      setAlert({ show: 'true', type: 'danger', text: error.response.data.msg })
      console.log(error)
      
    }


  }

  return (
    <>
      <div className='bg'>
        <main className='container landing'>
          <h2 className='text-center my-3 text-light'>
            NextGen Train Ticket Booking System
          </h2>
          <div className='row'>
            <div className='col-md-7 landingImg'>
              <img src={img} alt='' />
              <p className='text-light text-center fs-4'>
                Indian Railways is World's Largest Rail Network.{' '}
              </p>
            </div>

            <div className='col-md-5 align-self-center text-center landingForm card mt-2'>
              <div className='card-body '>
                <div className='card-title'>
                  <h3 className=''>{user.isMember ? 'Login' : 'Register'}</h3>
                </div>
                <div className='form py-3'>
                  {!user.isMember && (
                    <div className='input-group mb-4'>
                      <input
                        className='form-control'
                        name='name'
                        value={user.name}
                        onChange={(e) => handleChange(e)}
                        placeholder='name'
                        type='name'
                        required={true}
                      />
                    </div>
                  )}

                  <div className='input-group mb-4'>
                    <input
                      className='form-control'
                      name='email'
                      value={user.email}
                      onChange={(e) => handleChange(e)}
                      type='email'
                      placeholder='Email'
                      required={true}
                    />
                  </div>
                  <div className='input-group mb-4'>
                    <input
                      className='form-control'
                      name='password'
                      value={user.password}
                      onChange={(e) => handleChange(e)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder='password'
                      required={true}
                    />
                    <span
                      className='input-group-text pointer'
                      onMouseUp={() => setShowPassword(false)}
                      onMouseDown={() => setShowPassword(true)}
                    >
                      <FaEye></FaEye>
                    </span>
                  </div>
                  <button
                    type='submit'
                    className='btn btn-dark'
                    onClick={(e) => handleLogin(e)}
                  >
                    Submit
                  </button>
                  {user.isMember ? (
                    <p className='text-custom'>
                      Don't have a account?
                      <span onClick={toggleMember}> Register</span>
                    </p>
                  ) : (
                    <p className='text-custom'>
                      Already a customer?
                      <span onClick={toggleMember}> Login</span>
                    </p>
                  )}

                  <p className='fs-4'>Or</p>
                  <button
                    onClick={handleSocialLogin}
                    style={{ display: 'contents' }}
                  >
                    <img src={google} alt='' />
                  </button>
                  {alert.show && <p className={`calert text-${alert.type}`}>{alert.text}</p>}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Landing
