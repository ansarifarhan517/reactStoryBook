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

const EnterpriseContactUs = () => (
  <PricingSignUpLayout title="The Enterprise Plan">
    <PricingPlanSelectionComplete
      status="success"
      title="Thank You for Your Interest in LogiNext Mile!"
      description="We have received your request and will get in touch with you soon."
    />
    <LearnSaseStudy id="enterprise-success" data={learningData} />
  </PricingSignUpLayout>
)

export default EnterpriseContactUs
