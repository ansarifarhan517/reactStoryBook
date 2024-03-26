import React from "react";
import "./Skeleton.css";

const SkeletonElement = (props : {type: string}) => {
  const classes = `skeleton ${props.type}`;
  return <div className={classes}></div>;
};

export default SkeletonElement;
