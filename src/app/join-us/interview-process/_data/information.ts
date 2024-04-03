import introductionCallRound from '/public/join-us/interview-process/recruitment-process/introduction-call-round.webp'
import useCaseRound from '/public/join-us/interview-process/recruitment-process/usecase-round.webp'
import comfortAnalysisRound from '/public/join-us/interview-process/recruitment-process/comfort-analysis-round.webp'

import firstStep from '/public/join-us/interview-process/recruitment-flow/first-step.webp'
import secondStep from '/public/join-us/interview-process/recruitment-flow/second-step.webp'
import thirdStep from '/public/join-us/interview-process/recruitment-flow/third-step.webp'
import fourthStep from '/public/join-us/interview-process/recruitment-flow/fourth-step.webp'
import fifthStep from '/public/join-us/interview-process/recruitment-flow/fifth-step.webp'
import { recruitmentFlowCardProps } from '../_components/recruitment-flow-card'

const RecruitmentProcessData = [
  {
    id: 'introduction-call-round',
    image: introductionCallRound,
    title: 'Introduction Call',
    description:
      'We start with a preliminary HR call which moves around the introduction to your prior experience and the expectations from the defined role.',
  },
  {
    id: 'usecase-round',
    image: useCaseRound,
    title: 'Technical/Business Case',
    description:
      'Specific to the role we assign a technical case study to assess the domain experience followed by a discussion on the same.',
  },
  {
    id: 'comfort-analysis-round',
    image: comfortAnalysisRound,
    title: 'Comfort analysis',
    description:
      // eslint-disable-next-line max-len
      'The interview process ends with a behavioral or a cultural- fit assessment, to analyse your comfort level to work with our fast paced working culture and the super enthusiastic and hardworking team.',
  },
]

const RecruitmentFlowData : Array<recruitmentFlowCardProps> = [
  {
    id: 'first-step',
    image: firstStep,
    imagePosition: 'left',
    title: 'Preliminary HR Screening',
    description:
      'We screen the candidate based on the technical and non technical skill set required',
  },
  {
    id: 'second-step',
    image: secondStep,
    imagePosition: 'right',
    title: '1st Technical/Business round',
    description:
      'The panel from the respective department will dig down the skill set & suitability for the role',
  },
  {
    id: 'third-step',
    image: thirdStep,
    imagePosition: 'left',
    title: 'Task/Case study Discussion',
    description:
      'The next assessment round is based on the task relevant to the job profile, based on the submitted task we also check the approach towards the completion of the task',
  },
  {
    id: 'fourth-step',
    image: fourthStep,
    imagePosition: 'right',
    title: 'Cultural Fitment/Behavioural Screening',
    description:
      'Next level of assessment is checking the cultural fitment, wherein we check your behavioral parameters',
  },
  {
    id: 'fifth-step',
    image: fifthStep,
    imagePosition: 'left',
    title: 'Final Offer & on boarding process',
    description: 'We discuss the final offer and notice period',
  },
]

export { RecruitmentProcessData, RecruitmentFlowData }
