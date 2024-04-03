import NewsletterPRForm from '../newsletter-pr-form'

type joinPrListPopupFormProps = {
  successCallback: () => void
  dataAutoId?: string
}

const JoinPrListPopupForm = ({ successCallback, dataAutoId }: joinPrListPopupFormProps) => (
  <NewsletterPRForm joinPRListPopup successCallback={successCallback} dataAutoId={dataAutoId} />
)

export default JoinPrListPopupForm
