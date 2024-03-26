import React from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";

const SupportTicketSkeleton = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="support-ticket-skeleton">
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <SkeletonElement type="avatar" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "88%",
            }}
          >
            {[1, 2].map((row) => {
              return <SkeletonElement key={row} type="support-ticket-text" />;
            })}
          </div>
        </div>
      </div>
      <Shimmer />
    </div>
  );
};

export default SupportTicketSkeleton;
