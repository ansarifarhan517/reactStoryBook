import React from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";

const CurrentPlanSkeleton = () => {
  return (
    <div className="skeleton-wrapper" style={{height: "285px"}}>
      <div className="skeleton-currentPlan">
        <SkeletonElement type="componentTitle" />
        <div className="skeleton-details-price">
          <div>
            <SkeletonElement type="title" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
          </div>
          <div>
            <SkeletonElement type="title" />
            <SkeletonElement type="text" />
          </div>
        </div>
        <SkeletonElement type="button"/>
      </div>
      <Shimmer/>
    </div>
  );
};

export default CurrentPlanSkeleton;