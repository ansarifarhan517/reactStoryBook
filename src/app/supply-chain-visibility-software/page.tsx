import { Metadata } from 'next'

import ModalTriggerButton from '@/components/modal-trigger-button'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import ConfigurationSection from '@/components/configuration-section'
import ImageContentLayout from '@/components/image-content-layout'
import LandingPageRelatedResources from '@/components/landing-page-related-resources'
import PageCoverSectionWithHubspotForm from '@/components/cover-section-with-hubsot-form'
import LoginextEmpowerBrands from '@/components/loginext-empower-brands'
import LandingPagesGtm from '@/components/landing-pages-gtm'

import supplyChainVisibilitySoftwareHeader from '/public/supply-chain-visibility/supply-chain-visibility-header.webp'
import supplyChainVisibilitySoftwareScreenPreview from '/public/supply-chain-visibility/supply-chain-visibility-software-screen-preview.webp'
import accurateETAPedictions from '/public/supply-chain-visibility/accurate-eta-predictions.webp'
import endToEndInventoryVisibility from '/public/supply-chain-visibility/end-to-end-inventory-visibility.webp'
import realTimeInsightAvailability from '/public/supply-chain-visibility/real-time-insight-availability.webp'

import supplyChainVisibilitySoftwareInformation from './_data'

const SupplyChainVisibilitySofwtare = () => (
  <>
    <PageCoverSectionWithHubspotForm
      title="Supply Chain Visibility Software"
      description="Reduce operational costs with optimized supply chain performance."
      image={supplyChainVisibilitySoftwareHeader}
      imageTitle="Supply Chain Visibility Header"
      imageAlt="Image of a Supply Chain Warehouse"
      imageDescription="Image of a Supply Chain Warehouse"
      dataAutoId="supply_chain_visibility_software_section_1"
    />
    <PageCoverSubSection
      title="Reduce the impact of disruptions with a reliable supply chain management software"
      description={`End-to-end visibility of the supply chain helps in minimizing errors and improving customer satisfaction.
                    Businesses dealing with various issues like delayed deliveries, unnecessary expenditure and lack of visibility
                    of the shipments need to identify a suitable supply chain visibility software and streamline their operations for a better future.`}
      buttonLabel="view infographic"
      buttonCategory="secondary"
      redirectUrl={'https://info.loginextsolutions.com/hubfs/Infographics/(Infographic)%205%20key%20supply%20chain%20trends.pdf'}
      imageAlt="A Preview of Supply Chain Visibility Software"
      imageTitle="Supply Chain Visibility Software Screen Preview"
      imageDescription="A Preview of Supply Chain Visibility Software"
      image={supplyChainVisibilitySoftwareScreenPreview}
      video="https://www.youtube.com/embed/39c5odOErtI?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Reduce the impact of disruptions with a reliable supply chain management software"
      dataAutoId="supply_chain_visibility_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'accurate-ETA-predictions',
          image: accurateETAPedictions,
          title: 'Accurate ETA Predictions',
          description:
            ` Assure your customers about timely delivery without following up multiple 
              times across various channels.`,
        },
        {
          id: 'end-to-end-inventory-visibility',
          image: endToEndInventoryVisibility,
          title: 'End-to-end Inventory Visibility',
          description:
            `Access real-time data related to the order process, inventory management, 
            delivery times and potential supply chain disruptions.`,
        },
        {
          id: 'real-time-insights-availability',
          image: realTimeInsightAvailability,
          title: 'Real-time Insights Availability',
          description:
            `Prioritize constant monitoring and customer service at every stage of the workflow 
            with shipment tracking devices for every business.`,
        },

      ]}
      dataAutoId="supply_chain_visibility_software_section_3"
    />
    <ImageContentLayout
      content={supplyChainVisibilitySoftwareInformation[0]}
      category="secondary"
      imageTitle="Supply Chain Visibility Screen"
      imageAlt= "A LogiNext Screen for Supply Chain & Order Visibility"
      imageDescription=" A LogiNext Screen for Supply Chain & Order Visibility"
      dataAutoId="supply_chain_visibility_software_section_4"
      withFeatureBullet={true}
    />
    <ImageContentLayout
      content={supplyChainVisibilitySoftwareInformation[1]}
      category="secondary"
      imageTitle="Supply Chain Visibility Dashboard for Management"
      imageAlt="A Dashboard of Supply Chain on a Delivery Software"
      imageDescription="A Dashboard of Supply Chain on a Delivery Software"
      dataAutoId="supply_chain_visibility_software_section_5"
      withFeatureBullet={true}
    >
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="supply_chain_visibility_software_section_5_schedule_demo"
      >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <LandingPageRelatedResources slug="supply-chain-visibility" dataAutoId="supply_chain_visibility_software_section_6" />
    <LoginextEmpowerBrands dataAutoId="supply_chain_visibility_software_section_7"/>
    <LandingPagesGtm />
  </>
)

const title = ' LogiNext Supply Chain Visibility Software - Total Awareness'
const description = `LogiNext helps you visualize your entire supply chain in one place. 
                    Order Scanning, Accurate ETA Predictions, Driver Management, and more!`
const url = 'https://www.loginextsolutions.com/supply-chain-visibility'

const metadata: Metadata = {
  title,
  description,
  openGraph: {
    locale: 'en_US',
    type: 'website',
    title,
    description,
    url,
    siteName: 'loginextsolutions',
  },
  twitter: {
    title,
    description,
    card: 'summary',
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  SupplyChainVisibilitySofwtare as default,
  metadata
}
