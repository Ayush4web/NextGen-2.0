import React, { useEffect, useRef, useState } from 'react'
import randomUser from '../images/randomUser.jpg'
import camImg from '../images/webcam.png'
import logout from '../images/logout.png'
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js'
import { useGlobalContext } from '../context'
import { Link, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useJwt } from 'react-jwt'
import axios from 'axios'

const Home = () => {
  const webcamRef = useRef(null)
  const imageRef = useRef(null)

  const [image, setImage] = useState(null)
  const [showImg, setShowImg] = useState(false)
  const [isWebcam, setIsWebcam] = useState(false)

  const [alert, setAlert] = useState({ show: false, type: '', text: '' })
  const [loading, setLoading] = useState()
  const [passenger, setPassenger] = useState({
    name: '',
    age: '',
    num: '',
    date: '',
    gender: '',
  })

  const [cookies, setCookie, removeCookie] = useCookies()
  const navigate = useNavigate()
  const { decodedToken, isExpired } = useJwt(cookies.token)
 

  const analizeImage = async () => {
    setAlert({ show: true, type: 'secondary', text: 'Recognizing your face' })

    const detections = await faceapi.detectAllFaces(
      imageRef.current,
      new faceapi.TinyFaceDetectorOptions()
    )

    if (detections.length !== 1) {
      setAlert({ show: true, type: 'danger', text: 'Face not found.' })
    } else {
      setAlert({
        show: true,
        type: 'success',
        text: 'Face recognition successful!',
      })
    }
  }

  const handleBook = (e) => {
    if (e.target.innerHTML === 'Open Webcam') {
      navigator.getUserMedia(
        { video: true },
        function () {
          // webcam is loaded.
          setAlert({})
          setIsWebcam(true)
        },
        function () {
          // webcam is not loaded.
          setAlert({
            show: true,
            type: 'danger',
            text: 'Webcam not available.',
          })
          return
        }
      )
    }

    if (e.target.innerHTML === 'Capture') {
      const imgsrc = webcamRef.current.getScreenshot()
      setImage(imgsrc)
      setIsWebcam(false)
      setShowImg(true)
      analizeImage()
    }

    if (e.target.innerHTML === 'Retake') {
      setShowImg(false)
      setIsWebcam(true)
      setAlert({})
    }
  }

  const handleChange = (e) => {
    // Age Validation
    if (
      e.target.name === 'age' &&
      (e.target.value < 0 || e.target.value > 100)
    ) {
      return
    }

    //Number Validation
    if (e.target.name === 'num' && e.target.value.length > 10) {
      return
    }

    // Controlled Form Input
   
    setPassenger({ ...passenger, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // checking for image if not generate alert

    if (!image) {
      setAlert({ show: 'true', type: 'danger', text: 'Please upload image' })
      return
    }

    const { name, age, num, date } = passenger
    if (!name || !age || !num || !date) {
      setAlert({
        show: true,
        text: 'Please Fill All The Details.',
        type: 'danger',
      })
      return
    }

    const reqBody = { ...passenger, imgSrc: image }

    setAlert({show:true,type:'secondary',text:'Uploading Images...'})
    try {
     
      const { data } = await axios.post(`${process.env.REACT_APP_URL}/upload`, reqBody)

      setPassenger({
        name: '',
        age: '',
        num: '',
        date: '',
      })
      setImage('')
      
      setAlert({ show: true, type: 'success', text: 'Ticket Booked !!' })
      
    } catch (error) {
      setAlert({ show: true, type: 'danger', text: 'Something went wrong, Please try again later.' })
    }

    
  }

  const handleLogout = () => {
    setIsWebcam(false)
    navigate('/')
    removeCookie('token')
  }
  useEffect(() => {
    if (!cookies.token || isExpired) {
      navigate('/')
    }
  }, [])
  return (
    <>
      <main className='home'>
        <nav className='homeNav text-center d-flex justify-content-center align-items-center'>
          {decodedToken.profileImg ? (
            <img src={decodedToken.profileImg} alt='' />
          ) : (
            <img src={randomUser} alt='' />
          )}

          {decodedToken && (
            <p className='fs-3'>
              Welcome , <span className='fw-bold'>{decodedToken.name}</span>
            </p>
          )}

          <div className='logout' onClick={handleLogout}>
            <img src={logout} alt='' />
          </div>
        </nav>

        <section className='container-fluid bgp'>
          <div className='row py-3'>
            <div className='col-md-6 p-3'>
              <h5>Passenger's Image</h5>
              <div
                className={`card ${alert.type == 'danger' ? 'redAlert' : null}`}
              >
                <img className='card-img-top' src={camImg} alt='' />
                <p className={`text-center mb-0 text-${alert.type}`}>
                  {alert.text}
                </p>

                <img ref={imageRef} src={image} className='webcamWidth' />

                {isWebcam && <Webcam ref={webcamRef} className='webcamWidth' />}

                <div className='card-body text-center'>
                  <button
                    className='btn btn-dark '
                    onClick={(e) => handleBook(e)}
                  >
                    {isWebcam ? 'Capture' : showImg ? 'Retake' : 'Open Webcam'}
                  </button>
                </div>
              </div>
            </div>
            <div className='col-md-6 p-3 right'>
              <h5 className=''>Passenger's Details</h5>
              <div
                className={`card ${alert.type == 'danger' ? 'redAlert' : null}`}
              >
                <form action='' className='form '>
                  <input
                    type='text'
                    name='name'
                    value={passenger.name}
                    onChange={(e) => handleChange(e)}
                    className='form-control mb-4'
                    placeholder='Passenger Name'
                  />
                  <div className='row'>
                    <div className='col-6'>
                      <input
                        type='number'
                        name='age'
                        value={passenger.age}
                        onChange={(e) => handleChange(e)}
                        className='form-control mb-4'
                        placeholder='Age'
                      />
                    </div>
                    <div className='col-6'>
                      <select
                        className='form-select'
                        aria-label='Default select example'
                        onChange={(e) => handleChange(e)}
                        name='gender'
                      >
                        <option defaultValue={true}>Gender</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        <option value='Prefer not to say'>
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>

                  <input
                    type='number'
                    name='num'
                    value={passenger.num}
                    onChange={(e) => handleChange(e)}
                    className='form-control mb-4'
                    placeholder='Contact No.'
                  />
                  <input
                    type='text'
                    name='date'
                    value={passenger.date}
                    onChange={(e) => handleChange(e)}
                    placeholder='Date of Journey'
                    onFocus={(e) => (e.currentTarget.type = 'date')}
                    onBlur={(e) => (e.currentTarget.type = 'text')}
                    className='form-control mb-4'
                  />
                  <button
                    className='btn btn-dark'
                    type='submit'
                    onClick={(e) => handleSubmit(e)}
                  >
                    Book Tickets
                  </button>
                </form>
              </div>
            </div>
            <Link to='/dash' className='text-center mt-5'>
              <button className='btn btn-dark w-50'>Dashboard</button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
