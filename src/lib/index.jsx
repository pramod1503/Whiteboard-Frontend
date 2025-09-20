import React from 'react'


export const Link = ({ to, children, className = '', ...props }) => {
  const handleClick = (e) => {
    e.preventDefault()
    if (to) {
      window.location.href = to
    }
  }

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`text-blue-600 hover:text-blue-800 underline ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
