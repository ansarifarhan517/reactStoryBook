import PlatformPresentation from './components/platform-presentation'
import IndutriesPresentation from './components/industries-presentation'
import UseCasePresentation from './components/use-casae-presentation'
import ResourcePresentation from './components/resource-presentation'
import CompanyPresentation from './components/company-presentation'

type menuRepresentationProps = {
  mainMenuId?: string;
  id?: string;
}

const MenuRepresentation = ({ mainMenuId, id }: menuRepresentationProps) => {
  switch (mainMenuId) {
  case 'products': {
    return (<PlatformPresentation id={id} />)
  }
  case 'industries': {
    return (<IndutriesPresentation id={id} />)
  }
  case 'usecase': {
    return (<UseCasePresentation id={id} />)
  }
  case 'resource': {
    return (<ResourcePresentation id={id} />)
  }
  case 'company': {
    return (<CompanyPresentation id={id} />)
  }
  default: {
    return null
  }
  }
}

export default MenuRepresentation
