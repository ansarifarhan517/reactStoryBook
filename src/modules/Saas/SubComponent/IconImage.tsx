import React from 'react';

interface IPropsIconImage {
    src: string;
    styles: object;
}

const IconImage = ({src, styles}: IPropsIconImage) => {
    return (
        <div className="img-icon-wrapper">
            <img src={src} ></img>
        </div>
    )
}

export default IconImage;