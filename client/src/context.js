import React, { useContext, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'
import axios from 'axios'

const MODEL_URL = process.env.PUBLIC_URL + '/models'
const AppContext = React.createContext()


const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, text: '', type: '' })
  const [modal, setModal] = useState({ show: false, type: '', text: '' })
  const [isModelsLoaded, setIsModelsLoaded] = useState(false)
  const [openModal, setOpenModel] = useState(false)
  const [expressions, setExpressions] = useState({ type: '', name: '', text: '' })
  const [name, setName] = useState('')
  const [isFeedbackDone, setIsFeedbackDone] = useState(false)
  const [isWebcamAvailable, setIsWebcamAvailable] = useState()
  const [labledImg, setLabledImg] = useState()

  const loadModels = async () => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    ])
      .then(setIsModelsLoaded(true))
      .catch((err) => console.log(err))
  }

  const loadLabeledImages = async () => {
    const { data } = await axios(`${process.env.RECT_APP_URL}dashboard`)
    return Promise.all(
      data.map(async (d) => {
        const descriptions = []
        const img = await faceapi.fetchImage(d.image)

        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor()
        
        descriptions.push(detections.descriptor)
         console.log('models loaded')
        return new faceapi.LabeledFaceDescriptors(d.name+','+d.date ,descriptions)
      })
    )
  }

  const startVideo = (videoRef) => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        let video = videoRef.current
        video.srcObject = stream
        video.play()
      })
      .catch((err) => {
        console.error('error:', err)
      })
  }
  
  const stopVideo = (videoRef) => {
       
  }
 
  
  return (
    <AppContext.Provider
      value={{
        modal,
        setModal,
        loading,
        setLoading,
        alert,
        setAlert,
        isModelsLoaded,
        setIsModelsLoaded,
        loadModels,
        loadLabeledImages,
        startVideo,
        openModal,
        setOpenModel,
        expressions,
        setExpressions,
        name,
        setName,
        isFeedbackDone,
        setIsFeedbackDone,
        isWebcamAvailable,
        setIsWebcamAvailable,
        stopVideo,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Custom Hook to use context globally
const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppProvider, useGlobalContext }
