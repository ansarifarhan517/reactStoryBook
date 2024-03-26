import React from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";

const RecurringAddonsSkeleton = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-recurring-addons">
        <SkeletonElement type="componentTitle" />
        {[1, 2, 3].map((e) => {
          return (
            <div
              key={e}
              className="skeleton-details-price"
              style={{ borderBottom: "solid 0.5px #c9c9c9" }}
            >
              <div>
                <SkeletonElement type="title" />
                <SkeletonElement type="text" />
              </div>
              <div>
                <SkeletonElement type="title" />
                <SkeletonElement type="text" />
              </div>
              <div>
                <SkeletonElement type="add-button" />
              </div>
            </div>
          );
        })}
      </div>
      <Shimmer />
    </div>
  );
};

export default RecurringAddonsSkeleton;
