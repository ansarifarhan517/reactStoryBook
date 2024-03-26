import React from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";

const ExpandableListSkeleton = () => {
  return (
    <div className="skeleton-wrapper">
      <SkeletonElement type="componentTitle" />
      <div className="list-column">
        {[1, 2, 3].map((row) => {
          return (
            <div key={row} className="list-row">
              {[1, 2, 3, 4].map((elem) => {
                return <SkeletonElement key={elem} type="list-element" />;
              })}
            </div>
          );
        })}
      </div>
      <SkeletonElement type="view-all-button" />
      <Shimmer />
    </div>
  );
};

export default ExpandableListSkeleton;
