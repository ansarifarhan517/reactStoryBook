import React from 'react'
import "./../css/waveLoading.css";

const WaveLoader = () => {
  return (
    <div className="dot-wrapper">
        {[1, 2, 3].map((e) => {
            return <div className="wave-dot" key={e} />;
        })}
    </div>
  )
}

export default WaveLoader