import dynamic from 'next/dynamic'

import Container from '@/components/container'
import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

const Icon = dynamic(() => import('@/components/icon'), {
  ssr: false
})

const blk = 'review-rating'

const ReviewRating = () => (
  <Container dataAutoId="home_Section_4">
    <ul className={blk}>
      <li className={bemClass([blk, 'item'])}>
        <a
          href="https://www.gartner.com/reviews/market/vehicle-routing-and-scheduling-and-last-mile-technologies/vendor/loginext/product/loginext-mile/review/view/4009344"
          className={bemClass([blk, 'wrapper'])}
          target="_blank"
          data-auto-id="home_section_4_item_1"
        >
          <div className={bemClass([blk, 'star'])}>
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
          </div>
          <Text tag="p" color="black">
            Great Transportation Automation Platform
          </Text>
          <Text tag="span" typography="xs" color="gray-dark">
            Senior Domain Solutions Architect, 5B+ USD Transportation Services Firm
          </Text>
        </a>
      </li>
      <li className={bemClass([blk, 'item'])}>
        <a
          href="https://www.gartner.com/reviews/market/vehicle-routing-and-scheduling-and-last-mile-technologies/vendor/loginext/product/loginext-mile/review/view/3765630"
          className={bemClass([blk, 'wrapper'])}
          target="_blank"
          data-auto-id="home_section_4_item_2"
        >
          <div className={bemClass([blk, 'star'])}>
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
          </div>
          <Text tag="p" color="black">
            Most Extensive Logistics Automation Platform
          </Text>
          <Text tag="span" typography="xs" color="gray">
            Chief Supply Chain Officer, 2B+ USD Retail Firm
          </Text>
        </a>
      </li>
      <li className={bemClass([blk, 'item'])}>
        <a
          href="https://www.gartner.com/reviews/market/vehicle-routing-and-scheduling-and-last-mile-technologies/vendor/loginext/product/loginext-mile/review/view/3779188"
          className={bemClass([blk, 'wrapper'])}
          target="_blank"
          data-auto-id="home_section_4_item_3"
        >
          <div className={bemClass([blk, 'star'])}>
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
          </div>
          <Text tag="p" color="black">
            Best Last Mile Logistics Optimization
          </Text>
          <Text tag="span" typography="xs" color="gray">
            IT Manager, Global Fast Food Restaurant Chain
          </Text>
        </a>
      </li>
      <li className={bemClass([blk, 'item'])}>
        <a
          href="https://www.gartner.com/reviews/market/vehicle-routing-and-scheduling-and-last-mile-technologies/vendor/loginext/product/loginext-mile/review/view/3773106"
          className={bemClass([blk, 'wrapper'])}
          target="_blank"
          data-auto-id="home_section_4_item_4"
        >
          <div className={bemClass([blk, 'star'])}>
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
            <Icon name="star" size="xs" color="warning" />
          </div>
          <Text tag="p" color="black">
            Best At Delivery Management & Route Planning
          </Text>
          <Text tag="span" typography="xs" color="gray">
            Operations Head, North American Grocery Delivery Firm
          </Text>
        </a>
      </li>
    </ul>
  </Container>
)

export default ReviewRating
