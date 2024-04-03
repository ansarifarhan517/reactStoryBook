import LottieAnimation from 'lottie-animation'

type lottieAnimationBannerProps = {
  animationPath: string
  className?: string
}

const LottieAnimationBanner = ({
  animationPath,
  className
}: lottieAnimationBannerProps) => (
  <div className={className}>
    <LottieAnimation
      loop
      autoplay
      animationPath={animationPath}
    />
  </div>
)

export default LottieAnimationBanner
