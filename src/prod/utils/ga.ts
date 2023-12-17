/** Reference: https://github.com/react-ga/react-ga */

import ReactGA from 'react-ga'

// const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '{}')['subClients'][0]['clientId'];
const username = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').userName;
const userId = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').userId;
const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').clientId;

let gaId = ''
const { modelType } = JSON.parse(localStorage.getItem('userAccessInfo') || '{}')

switch (modelType) {
  case 'OD':
    gaId = 'UA-80442017-1'
    break

  case 'LH':
    gaId = 'UA-80430329-1'
    break

  case 'FM':
  case 'LM':
  case 'FMLM':
  case 'SM':
    gaId = 'UA-80450507-1'
    break

  default:
    gaId = 'UA-80450507-1'

}

ReactGA.initialize(gaId, {
  debug: window.location.origin === 'http://localhost:9001',
  titleCase: false,
  gaOptions: {
    userId,
    // clientId,
    name: username
  }
})
const ga = ReactGA

export const sendGA = ( category: string, action: string) => {
  ga.send({
    hitType: 'event',
    eventCategory: category,
    eventAction: action,
    eventLabel: `${clientId} - ${username}`
  });
}

export default ga
