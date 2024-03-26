import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { BreadCrumb, FontIcon, Tooltip } from "ui-library";
import { hybridRouteTo } from "../../../../../utils/hybridRouting";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import iconsMapping from "../../../../../utils/mongo/ListView/actionBarIcons.mapping";
import "./style.css";

const AddressHeader = ({ dynamicLabels, isUpdateForm }) => {
  const pageLabels = useTypedSelector((state) => state.pageLabels.address);

  const viewTooltip = {
    listview: `${
      dynamicLabels.clickheretoViewListofThe ||
      "Click here to view the list of the"
    } ${dynamicLabels.customer || "Consumer"}`,
    mapview: `${
      dynamicLabels.clickhereToShowtheCurrentLocation ||
      "Click here to view the current location of the"
    } ${dynamicLabels.customer || "Consumer"} ${
      dynamicLabels.onAMap || "on a map"
    }`,
  };

  const views = useMemo(() => {
    return (
      pageLabels?.viewOptions
        ? Object.keys(pageLabels.viewOptions)?.map((key) => ({
            label: pageLabels.viewOptions[key].toUpperCase(),
            path: key === "listview" ? "/address" : "/address/map",
            icon: iconsMapping[key],
            tooltipText: viewTooltip[key],
          }))
        : []
    );
  }, [pageLabels, dynamicLabels]);


  const getBreadcrumbs = () => [
    {
      id: "customer",
      label: dynamicLabels.customer || "Consumer",
      disabled: false,
    },
    {
      id: "address",
      label: dynamicLabels.allAddresses || "All Addresses",
      disabled: !isUpdateForm,
    },
    ...(isUpdateForm
      ? [
          {
            id: "update-address",
            label: dynamicLabels.updateAddress || "Update Address",
            disabled: true,
          },
        ]
      : []),
  ];



  return (
    <div className="all-addresses__header">
      <div className="all-addresses__breadcrumb">
        <BreadCrumb
          options={getBreadcrumbs()}
          onClick={(id) => hybridRouteTo(id)}
        />
      </div>
      {!isUpdateForm && (
        <div className="all-addresses__nav-container">
          {views?.map(({ label, path, icon, tooltipText }, index) => (
            <NavLink
              exact
              to={path}
              activeClassName="active"
              className="all-addresses__nav-button"
              key={tooltipText + index}
            >
              <Tooltip
                message={tooltipText}
                hover
                arrowPlacement="center"
                messagePlacement="end"
              >
                {icon && <FontIcon variant={icon} size="sm" />}
                <span>{label}</span>
              </Tooltip>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressHeader;
