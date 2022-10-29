const fs = require('fs')
const path = require('path')
const Passenger = require('../modals/passenger')
const cloudinary = require('cloudinary').v2



const createPassenger = async (req, res) => {

  const { name, imgSrc } = req.body
  let image = ''

  const base64Data = imgSrc.split(',')[1]

  fs.writeFileSync(`./uploads/${name}.jpg`, base64Data, 'base64')
  const imagePath = path.join(__dirname, '../uploads' + `/${name}.jpg`)
  
  // Uploading Images to Cloud
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      use_filename: true,
    })
    image = result.secure_url
  } catch (error) {
    console.log(error)
  }
  
  // Creating Passenger 
  const passenger = await Passenger.create({ ...req.body, image })


  res.status(201).send(passenger)
}

const getAllPassengers = async (req, res) => {
  const passenger = await Passenger.find({})
  res.status(200).json(passenger)
}

module.exports = { createPassenger, getAllPassengers }
