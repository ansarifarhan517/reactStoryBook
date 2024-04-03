import PricingSignUpLayout from '../_components/pricing-sign-up-layout'
import PricingPlanSelectionComplete from '../_components/pricing-plan-selection-complete'

import LearnSaseStudy from '../_components/learn-case-study'

const learningData = [{
  image: 'https://info.loginextsolutions.com/hubfs/Resource%20LP/Tire%20Industry%20Case%20Study.jpg',
  link: 'https://info.loginextsolutions.com/hubfs/Case_Studies_2022/Transportation%20and%20Logistics%20Business.pdf',
  label: '30% Return On Investment For A Leading International Tire Manufacturer'
},
{
  image: 'https://info.loginextsolutions.com/hubfs/Resource%20LP/Logistics%20and%20Transportation%20Case%20Study.jpg',
  link: 'https://info.loginextsolutions.com/hubfs/Case_Studies_2022/Transportation%20and%20Logistics%20Business.pdf',
  label: 'Enabling 40% Business Growth By Streamlining Logistics And Transportation Needs'
},
{
  image: 'https://info.loginextsolutions.com/hubfs/Resource%20LP/D2C%20Case%20Study.jpg',
  link: 'https://info.loginextsolutions.com/hubfs/Case_Studies_2022/D2C%20Casestudy.pdf',
  label: 'Leading D2C Brand Automates and Optimizes Operations With LogiNext'
}]

const PricingSuccess = () => (
  <PricingSignUpLayout title="The Growth Plan">
    <PricingPlanSelectionComplete
      status="success"
      title="Payment Successful!"
      description={`Thank you for your purchase! You will shortly receive an email with the
      activation link. Meanwhile, check out some of our case studies to learn how various
      industry stalwarts have turned their logistics operations into well-oiled machinery.`}
    />
    <LearnSaseStudy id="pricing-success" data={learningData} />
  </PricingSignUpLayout>
)

export default PricingSuccess
