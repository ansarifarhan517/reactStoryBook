import React from 'react';
import {FontIcon} from "ui-library";

export interface ICompliantProps {
    compliance: number | boolean;
}

const CompliantField = ({compliance}: ICompliantProps) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        color: compliance === 1 ? "#79d07b" : "#f69189",
      }}
    >
      <FontIcon
        variant={compliance === 1 ? 'check-tick' : 'close'}
        size='sm'
      />
    </div>
  );
};

export default CompliantField;
