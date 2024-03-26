import React from 'react'

interface IShape {
    isActive?: boolean;
}

export const Polygon = ({ isActive }: IShape) => {
  return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.471405 8L8 0.471405L15.5286 8L8 15.5286L0.471405 8Z" fill="white" stroke={isActive ? "#FFFFFF" : "#000000"} strokeWidth="0.666667" />
      </svg>
  )
}

export const Circle = ({ isActive }: IShape) => {
  return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{overflow: "visible"}}>
          <circle cx="8" cy="8" r="8" fill="white" stroke={isActive ? "#FFFFFF" : "#000000"} strokeWidth="0.666667" />
      </svg>
  )
}

