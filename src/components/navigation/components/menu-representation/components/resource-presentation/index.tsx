import caseStudySample from '/public/case-study-sample.webp'
import caseStudyLogisticsAndTransportation from '/public/case-study-logistics-and-transportation.webp'

import whitePaperSample from '/public/white-paper-sample.webp'
import whitePaperFieldServiceManagementFutureTrends from '/public/white-paper-field-service-management-future-trends.webp'

import infographicSample from '/public/infographic-sample.webp'
import fiveKeySupplyChainTrends from '/public/five-key-supply-chain-trends.webp'

import carbonEmissionSample from '/public/carbon-emission-sample.webp'

import NavigationCard from '../navigation-card'

import './style.scss'

type resourcePresentationProps = {
  id?: string;
}

const blk = 'resource-representation'

const ResourcePresentation = ({ id }: resourcePresentationProps) => {
  switch (id) {
  case 'resource_case_study': {
    return (
      <div className={blk}>
        <NavigationCard
          image={caseStudySample}
          description="Large QSR company quickens food deliveries with LogiNext"
          link="https://info.loginextsolutions.com/quick-service-restaurant-case-study-for-on-demand-delivery-management"
          target="_blank"
          dataAutoId="resource_case_study_card_1"
        />
        <NavigationCard
          image={caseStudyLogisticsAndTransportation}
          description="Large CPG player improves carrier movement and end-to-end visibility"
          link="https://info.loginextsolutions.com/logistics-distribution-optimization-consumer-packaged-goods"
          target="_blank"
          dataAutoId="resource_case_study_card_2"
        />
      </div>
    )
  }
  case 'resource_white_paper': {
    return (
      <div className={blk}>
        <NavigationCard
          image={whitePaperFieldServiceManagementFutureTrends}
          description="Industry Trends in Field Service Optimization."
          link="http://info.loginextsolutions.com/white-paper-field-service-management-future-trends"
          target="_blank"
          dataAutoId="resource_white_paper_card_1"
        />
        <NavigationCard
          image={whitePaperSample}
          description="Disrupting Distribution Management."
          link="http://info.loginextsolutions.com/white-paper-fmcg-distribution-management-system-and-future-of-distribution"
          target="_blank"
          dataAutoId="resource_white_paper_card_2"
        />
      </div>
    )
  }
  case 'resource_infographics': {
    return (
      <div className={blk}>
        <NavigationCard
          image={infographicSample}
          description="The Last Mile Infographic"
          link="https://2704626.fs1.hubspotusercontent-na1.net/hubfs/2704626/Infographics/LastMile_Infographic_March2022.pdf"
          target="_blank"
          dataAutoId="resource_infographics_card_1"
        />
        <NavigationCard
          image={fiveKeySupplyChainTrends}
          description="5 key supply chain trends"
          link="https://2704626.fs1.hubspotusercontent-na1.net/hubfs/2704626/Infographics/(Infographic)%205%20key%20supply%20chain%20trends.pdf"
          target="_blank"
          dataAutoId="resource_infographics_card_2"
        />
      </div>
    )
  }
  case 'resource_carbon_emission_calculator': {
    return (
      <NavigationCard
        image={carbonEmissionSample}
        description="Carbon Emission Calculator"
        link="/resource/carbonemission"
        dataAutoId="resource_carbon_emission_calculator_card_1"
      />
    )
  }
  default: {
    return null
  }
  }
}

export default ResourcePresentation
