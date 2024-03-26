import React from "react";
import "./cardSelect.css";
import { IOption } from "../SelectBox";

const CardSelect = ({
  optionValue,
  optionLabel,
  optionLabelKey,
  isIcon,
  icon
}: IOption) => {
  return (
    <div className="card__btn draw meet" id={optionLabelKey}>
      <img src={icon.filter(item => item.id === optionLabelKey)[0]?.icon} />
      <p><span>{optionLabel}</span></p>
      {/* {optionDescLabel && optionDescLabel !== "" && <span>{optionDescLabel}</span>} */}
    </div>
  );
};

export default CardSelect;
