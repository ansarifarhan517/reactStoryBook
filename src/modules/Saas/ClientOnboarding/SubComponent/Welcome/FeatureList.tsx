import React from "react";
import automationIcon from "../../../../../../images/onboardingClient/ic-auto.svg";
import analyticsIcon from "../../../../../../images/onboardingClient/ic-business.svg";
import CustomerExperience from "../../../../../../images/onboardingClient/ic-cust-exp.svg";
import Digitalization from "../../../../../../images/onboardingClient/ic-digitalization.svg";
import curveLine from "../../../../../../images/onboardingClient/dotted-line.svg";
import IconTextContent from "../../Component/IconTextContent";
const featureListData = [
  {
    title: "Automation & Optimization",
    description:
      "Auto-assign orders with considerations such as delivery associate skill sets and delivery time windows. Optimize routes and resource capacity to boost efficiency.",
    iconPosition: "left",
    icon: automationIcon,
  },
  {
    title: "Business Intelligence & Analytics",
    description:
      "Gain actionable insights with automated reports and dashboards. Monitor compliance using comprehensive KPI tracking capabilities.",
    iconPosition: "right",
    icon: analyticsIcon,
  },
  {
    title: "Customer Experience",
    description:
      "Provide real-time visibility of order statuses to your customers via personalized tracking links. Send custom alerts via SMS/email/IVR.",
    iconPosition: "left",
    icon: CustomerExperience,
  },
  {
    title: "Digitalization",
    description:
      "Digitalize all operations and experience a significant reduction in manual workload. Onboard fleet, set up hubs, and capture e-proofs of pickup/delivery.",
    iconPosition: "right",
    icon: Digitalization,
  },
];

export default function FeatureList() {
  return (
    <div className="feature__list__wrapper">
      {featureListData.map((list, index) => (
        <>
          <div className="feature__list__item" key={index}>
            <IconTextContent
              title={list.title}
              icon={list.icon}
              description={list.description}
              iconPosition={list.iconPosition}
            />
            <i className={index % 2 ? index === featureListData.length - 1 ? 'none' : 'flip' : index === featureListData.length - 1 ? 'none' : ''}>
              <img src={curveLine} style={{width: '115%'}}/>
            </i>
          </div>
        </>
      ))}
      <p className="description_color">
        We need a few more details to tailor the product for you. It'll take
        just a few minutes.
      </p>
    </div>
  );
}
