import React from 'react';

const Logo = ({src, styles, ...props}) => {
    return (
        <div className="img-wrapper" style={...styles}>
            <img src={src}></img>
        </div>
    )
}

export default Logo;