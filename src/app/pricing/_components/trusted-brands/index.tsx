import EmpoweringBrands from '@/components/empowering-brands'
import Text from '@/components/text'

import { bemClass } from '@/utils'

import brandImages from '@/config/empowering-brands'

import './style.scss'

const blk = 'trusted-brands'

type trustedBrandsProps = {
  dataAutoId?: string
}

const TrustedBrands = ({ dataAutoId }: trustedBrandsProps) => (
  <>
    <Text
      tag="h3"
      typography="xxl"
      color="black"
      className={bemClass([blk, 'title'])}
      dataAutoId={`${dataAutoId}_title`}
    >
      <>
        {'Trusted by Businesses in '}
        <Text tag="span" typography="xxl" color="primary">70+ Countries</Text>
      </>
    </Text>
    <EmpoweringBrands
      brandsImages={brandImages['pricing-sign-up']}
      industry="food-beverages"
      hideTitle
      className={bemClass([blk, 'powering-brands'])}
      dataAutoId={`${dataAutoId}_brands`}
    />
  </>
)

export default TrustedBrands
