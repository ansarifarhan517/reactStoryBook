import { dropdownPosition } from '../../DropDown/interface'

const TextDropdownStyled = (
  width: string,
  theme: any,
  disabled: boolean,
  dropdownPosition?: dropdownPosition
) => {
  console.log(disabled)
  return {
    option: (provided: any) => ({
      ...provided,
      backgroundColor: theme?.colors?.white,
      color: theme?.colors?.grey?.A100,
      '&:hover': {
        backgroundColor: theme?.colors?.grey['50'],
        color: theme?.colors?.primary?.main
      },
      cursor: 'pointer'
    }),

    menu: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : theme?.colors?.white,
      borderRadius: '2px',
      '&:hover': {
        backgroundColor: state?.isSelected ? theme?.colors?.primary?.main : null
      },
      marginTop: '0px',
      minWidth: '180px',
      width,
      boxShadow: theme?.shadows?.buttonPopupMenu,
      top: '5px'
    }),
    menuList: (provided: any) => ({
      ...provided,
      marginTop: '2px'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0px',
      marginBottom: '-3px',
      backgroundColor: 'transparent',
      overflow: 'initial',
      color: 'transparent',
      cursor: 'pointer'
    }),
    container: (provided: any) => ({
      ...provided,
      position: 'absolute',
      zIndex: theme?.zIndex?.dropDown,
      backgroundColor: 'transparent',
      width: '100px',
      top: dropdownPosition ? dropdownPosition?.top : '0px',
      left: dropdownPosition ? dropdownPosition?.left : '0px'
    })
  }
}

export default TextDropdownStyled
