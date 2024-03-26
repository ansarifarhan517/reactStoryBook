import React, { useState } from "react";
import { tActionCard, tActionDetailCard } from "../CXDashboard.model";
import {
  TextWrapper,
  DashboardCard,
  PercentageOnCard,
  CardText,
  CardDesc,
  StarGroup,
} from "./StaticLayout.style";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { Loader, IconButton } from "ui-library";

interface IInfoCard {
  handleCallback?: (id: tActionCard | tActionDetailCard) => void;
  id?: tActionCard | tActionDetailCard;
  percentage?: number;
  text?: string;
  desc?: string;
  isSelectable?: boolean;
  selected?: boolean;
  displayRating?: string | number;
}

const InfoCard = ({
  handleCallback,
  id,
  percentage,
  text,
  desc,
  isSelectable,
  selected,
  displayRating,
}: IInfoCard) => {
  const loading = useTypedSelector(
    (state) => state.cxDashboardReducer.loading.DATACARDS
  );
  const handleClick = () => {
    if (isSelectable) {
      handleCallback && handleCallback(id as tActionCard);
    }
  };
  return (
    <DashboardCard
      onClick={handleClick}
      isSelectable={!!isSelectable}
      selected={selected && !loading}
      id={id}
    >
      {loading && <Loader center={true} fadeBackground={true} speed={1} />}
      {!loading && displayRating && (
        <StarGroup>
          {displayRating !== undefined &&
            [...Array(5)].map((elem, index) => {
              if (index + 1 <= displayRating) {
                return (
                  <IconButton
                    key={index}
                    onlyIcon
                    iconVariant={"star-filled"}
                    color={"charts.yellow"}
                    hoverFeedback={false}
                  />
                );
              } else {
                return (
                  <IconButton
                    key={index}
                    onlyIcon
                    iconVariant={"star-filled"}
                    color={"grey.500"}
                    hoverFeedback={false}
                  />
                );
              }
            })}
        </StarGroup>
      )}
      {!loading && (
        <>
          <div>
            {!loading && percentage !== undefined && (
              <PercentageOnCard positive={percentage >= 0}>
                {percentage >= 0 ? `+${percentage}%` : `${percentage}%`}
              </PercentageOnCard>
            )}
            {text && (
              <CardText isSelectable={!!isSelectable} selected={selected}>
                {text}
              </CardText>
            )}
          </div>
          {desc && (
            <CardDesc isSelectable={!!isSelectable} selected={selected}>
              {desc}
            </CardDesc>
          )}
        </>
      )}
    </DashboardCard>
  );
};

export default InfoCard;
