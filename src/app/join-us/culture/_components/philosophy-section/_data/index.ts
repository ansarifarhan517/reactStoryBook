import SpeedImage from '/public/join-us/company-culture/speed.webp'
import BashImage from '/public/join-us/company-culture/bash.webp'
import Impact from '/public/join-us/company-culture/impact.webp'
import Target from '/public/join-us/company-culture/target.webp'
import Accomplishments from '/public/join-us/company-culture/accomplishments.webp'
import Approachable from '/public/join-us/company-culture/approachable.webp'
import Transparency from '/public/join-us/company-culture/transparency.webp'


const philosophy = {
  speedBashOwnership: [
    {
      id: 'speed',
      title: 'Speed',
      description:
        'Growing 3x is our trademark. We are agile and quick when it comes to performance.',
    },
    {
      id: 'speed-image',
      image: SpeedImage,
    },
    {
      id: 'ownership',
      title: 'Ownership',
      description:
        'What else can be more awesome than choosing a task of your choice and learning steeply?',
    },
    {
      id: 'bash-image',
      image: BashImage,
    },

    {
      id: 'bash',
      title: 'Bash',
      description:
        'We abide by only one rule, "work hard and party harder". We rock n roll pretty amazingly.',
    },
    {
      id: 'bash-video',
      videoSrc: '/join-us/company-culture/career.mp4',
      videoPoster: '/public/join-us/company-culture/ph-dummy.webp',
    },
  ],
  impact: [
    {
      id: 'impact-image',
      image: Impact
    },
    {
      id: 'impact',
      title: 'Impact',
      description:
        'Our actions are organizing the most chaotic sector in the world.',
    },
    {
      id: 'target',
      image: Target
    },
  ],
  accomplishments_transparency_approachable_consistency : [
    {
      id: 'accomplishments-image',
      image: Accomplishments,
    },
    {
      id: 'accomplishments',
      title: 'Accomplishments',
      description:
        'We challenge ourselves daily and outperform ourselves in every new task.',
    },
    {
      id: 'transparency-image',
      image: Transparency,
    },
    {
      id: 'transparency',
      title: 'Transparency',
      description:
        'Our policies and processes are in place to offer you the best.',
    },
    {
      id: 'approachable',
      title: 'Approachable',
      description:
        'You can approach anyone at anytime and even can share your food with the founders.',
    },
    {
      id: 'approachable-image',
      image: Approachable,
    },
    {
      id: 'consistency',
      title: 'Consistency',
      description:
        'We have set high deliverables for our clients and we are consistence with the high performance.',
    },
  ]
}

export { philosophy }
