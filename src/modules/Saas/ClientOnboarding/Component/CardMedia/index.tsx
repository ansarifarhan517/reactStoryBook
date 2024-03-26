import React from 'react'

interface ICardMedia {
    component: string;
    height: string;
    image: string;
    alt: string;
    sx: object
}

const CardMedia = ({component, height, image, sx, alt} : ICardMedia) => {
  return (
      <div style={{textAlign:'center'}}>
        <img src={image} style={{...sx}} alt={alt}></img>
      </div>
    
  )
}

export default CardMedia