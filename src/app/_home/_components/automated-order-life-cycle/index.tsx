
import Text from '@/components/text'
import VideoButton from '@/components/video-button'
import Container from '@/components/container'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'automated-order-life-cycle'

const AutomatedOrderLifeCycle = () => (
  <div className={blk} data-auto-id="home_Section_6">
    <video
      preload="auto"
      autoPlay
      loop
      muted
      id="video"
      poster="/automated-order-life-cycle-poster.webp"
      data-auto-id="home_section_6_video"
    >
      <source src="/automated-order-life-cycle-video.mp4" />
    </video>
    <div className={bemClass([blk, 'content'])}>
      <Container>
        <Text tag="h2" color="white" typography="xxl" dataAutoId="home_section_6_title">
          Automate Your Order Lifecycle
        </Text>
        <Text tag="p" color="white" className={bemClass([blk, 'description'])} dataAutoId="home_section_6_desc1">
          Your customers expect faster deliveries, your operations manager deserves real time
          visibility across the supply chain, and your delivery drivers need a way to deliver
          shipments efficiently.
        </Text>
        <Text tag="p" color="white" className={bemClass([blk, 'description'])} dataAutoId="home_section_6_desc2">
          LogiNext empowers you to meet your customer expectations, gain visibility across all
          stages of pick-up and delivery, to stay ahead of your competition, and deliver a great
          customer experience.
        </Text>
        <Text tag="p" typography="s" color="white" className={bemClass([blk, 'video-title'])}>
          Watch the video
        </Text>
        <VideoButton
          videoUrl="https://www.youtube.com/embed/39c5odOErtI?controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
          videoTrackingId="13463006"
          videoTitle="LogiNext Mile | The Best Last Mile Delivery Management Software"
          dataAutoId="home_section_6_video_button"
        />
      </Container>
    </div>
  </div>
)

export default AutomatedOrderLifeCycle
