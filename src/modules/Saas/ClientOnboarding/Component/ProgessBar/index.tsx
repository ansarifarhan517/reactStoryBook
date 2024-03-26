import React from 'react'

export interface IProgressProps{
    percentage? : number,
    isCompleted?: boolean,
  }

const ProgessLoader = ({percentage, isCompleted}) => {
  return (
    <div className="progress">
      <div
        className="progress-bar progress-bar-striped active"
        style={{width: `${percentage}%`}}
      >
        
      </div>
      <div className="progress-value">{percentage}</div>
    </div>
  )
}

export default ProgessLoader