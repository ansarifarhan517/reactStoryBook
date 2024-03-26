import "../css/skeleton.css";
import React from "react";

const BoxSkeleton = () => {
    return (
        <a className="card" id="card-link" target="_blank">
            <div className="card__header">
                <div className="card__body body__text" id="card-details">
                    <div className="skeleton skeleton-text skeleton-text__body"></div>
                </div>
                <div className="card__header header__title" id="card-title">
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text"></div>
                </div>
            </div>
        </a>
    )
}

export default BoxSkeleton;