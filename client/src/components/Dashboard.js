import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import { useGlobalContext } from '../context'
import moment from 'moment'
import Modal from './Modal'
import { Link, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useJwt } from 'react-jwt'

const date = moment().format('YYYY-MM-DD')

const Dashboard = () => {
  const { loading, setLoading, loadLabeledImages, startVideo, stopVideo } =
    useGlobalContext()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const videoHeight = 480
  const videoWidth = 640
  
  const navigate = useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies()
   const { decodedToken, isExpired } = useJwt(cookies.token)
  const handleVideoOnPlay = async () => {
    const labledImg = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labledImg, 0.6)

    setLoading(false)

    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        )
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        }

        faceapi.matchDimensions(canvasRef.current, displaySize)

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withFaceExpressions()

        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        const results = resizedDetections.map((d) =>
          faceMatcher.findBestMatch(d.descriptor)
        )

        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box

          if (result.distance > 0.45) {
            result._label = 'unknown'
          }

          let drawBox = {}

          if (result.label.split(',')[0] === 'unknown') {
            drawBox = new faceapi.draw.DrawBox(box, {
              label: 'Unknown',
              boxColor: 'red',
            })
          } else if (result.label.split(',')[1] === date) {
            drawBox = new faceapi.draw.DrawBox(box, {
              label: result.label.split(',')[0] + ', ' + '(Valid Ticket)',
              boxColor: 'green',
            })
          } else {
            drawBox = new faceapi.draw.DrawBox(box, {
              label: result.label.split(',')[0] + ', ' + '(Invalid Ticket)',
              boxColor: 'orange',
            })
          }

          drawBox.draw(canvasRef.current)

          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
        })
      }
    }, 500)
  }

  useEffect(() => {
     if (!cookies.token || isExpired) {
       navigate('/')
     }
    setLoading(true)
    startVideo(videoRef)
  }, [])

  return (
    <main className='bgp'>
      <h3 className='text-center mt-2 mb-0 heading'>Dashboard</h3>

      <div className='d-flex justify-content-evenly  mt-2 mb-2 web'>
        {loading && <Modal></Modal>}

        <div className='card transp'>
          <div className='card-body'>
            <div className='box1'>
              <span className='text-center '>
                Green box is used to indicate a Verified Person with a valid
                ticket.
              </span>
            </div>

            <div className='box2'>
              <span className='text-center'>
                Orange box is used to indicate a Verified Person with a Invalid
                ticket.
              </span>
            </div>
            <div className='box3'>
              <span className='text-center'>
                Red box is used to indicate a UnVerified Person.
              </span>
            </div>
            <Link to='/home'>
              <button className='btn btn-dark'>Go Back Home</button>
            </Link>
          </div>
        </div>
        <div
          className='camera'
          style={{
            height: videoHeight,
            width: videoWidth,
            position: 'relative',
          }}
        >
          <video
            ref={videoRef}
            height={videoHeight}
            width={videoWidth}
            style={{ position: 'relative' }}
            onPlay={handleVideoOnPlay}
          />
          <canvas
            className='canvas'
            ref={canvasRef}
            style={{ position: 'absolute', left: '0' }}
          />
        </div>
      </div>
    </main>
  )
}
export default Dashboard
