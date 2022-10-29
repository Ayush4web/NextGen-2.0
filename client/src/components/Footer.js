import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-dark text-light text-center'>
      <p className='mb-0 py-2'>
        All Rights Reserved ©{' '}
        <a
          className='text-decoration-none text-info'
          href='https://ayushchoubey.netlify.app/'
          target='_blank'
        >
          Ayush Choubey.
        </a>
        <br />
        2022 - Present
      </p>
    </footer>
  )
}

export default Footer
