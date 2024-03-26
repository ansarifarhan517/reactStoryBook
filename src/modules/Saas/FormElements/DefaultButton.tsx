import React from "react";
import { StyledDefaultButton } from "../ClientSetPassword/StyledSetPasswordForm";
import arrow from "../../../../images/onboardingClient/ic-arrow.svg";
import left_arrow from "../../../../images/onboardingClient/left_arrow.svg";
import start from "../../../../images/onboardingClient/ic-get-started.svg";
import launch from "../../../../images/onboardingClient/ic-launch.svg"

interface IDefaultButtonProps {
  id?:string;
  style?: object;
  disabled?: boolean;
  children: any;
  onHandleClick: any;
  isLoading?: boolean;
  className?: string;
  type?:string
}

const DefaultButton = ({
  id,
  style,
  disabled = false,
  children,
  onHandleClick,
  isLoading = false,
  className,
}: IDefaultButtonProps) => {
  return (
    <StyledDefaultButton
      style={{
        ...style,
        fontSize: "16px",
        textTransform: "inherit",
        padding: "1.5rem 1rem",
      }}
      disabled={disabled || isLoading}
      onClick={onHandleClick}
      className={className}
      id={id}
      // iconVariant={"icomoon-back"}
    >
      
      {children === "Previous" && (
        <img src={left_arrow} className={`${children}`}></img>
      )}
      {children}
      {children === "Next"  && !isLoading && <img src={arrow} className={`${children}`}></img>}
      {children === "Get Started" && !isLoading && <img src={start} className={`${children}`}></img>}
      {children === "Launch" && !isLoading && <img src={launch} className={`${children}`}></img>}
      {isLoading && (
        <i
          className="fa fa-spinner fa-spin"
          style={{ color: "#fff", top: "-1px", left: "8px" }}
        ></i>
      )}
    </StyledDefaultButton>
  );
};

export default DefaultButton;
