import { ThemeContext } from 'styled-components'
import { useContext } from 'react'

const InlineEditStyled = () => {
  const theme = useContext(ThemeContext)
  const borderBottom = `1px solid ${theme?.colors?.primary?.main}`
  return {
    control: (provided: any, state: any) => ({
      ...provided,
      borderStyle: 'none',
      borderBottom,
      borderRadius: '0px',
      boxShadow: 'none',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      marginBottom: '-5px',
      borderColor: theme?.colors?.primary?.main,
      '&:focus': {
        borderStyle: 'none',
        borderBottom,
        boxShadow: 'none',
        borderColor: theme?.colors?.primary?.main
      },
      '&:hover': {
        borderStyle: 'none',
        borderBottom,
        boxShadow: 'none',
        borderColor: theme?.colors?.primary?.main
      },
      backgroundColor: theme?.colors?.white,
      minHeight: '21px',
      opacity: state.isDisabled ? '0.5' : '1'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected ? theme?.colors?.primary?.main : null,
      '&:hover': {
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.grey['50'],
        color: state?.isSelected
          ? theme?.colors?.primary?.contrastText
          : theme?.colors?.primary?.main
      },
      cursor: 'pointer',
      color: state?.isSelected
        ? theme?.colors?.primary?.contrastText
        : theme?.colors?.grey['800']
    }),

    menu: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : theme?.colors?.white,
      borderRadius: '2px',
      '&:hover': {
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.white
      },
      marginTop: '5px',
      boxShadow: theme?.shadows?.buttonPopupMenu,
      width: '100%',
      minWidth: '160px',
      maxHeight: '200px'
    }),
    menuList: (provided: any) => ({
      ...provided,
      paddingTop: '0px',
      fontSize: '13px',
      cursor: 'pointer',
      maxHeight: '200px'
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: state?.selectProps?.menuIsOpen
        ? 'transparent'
        : theme?.colors?.black,
      fontSize: '12px',
      marginLeft: '2px',
      marginRight: '7px',
      cursor: 'pointer',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      // top: '70%'
      bottom: '-5px'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: theme?.colors?.grey['800'],
      fontSize: '10px',
      cursor: 'pointer',
      opacity: '0.7',
      lineHeight: '21px',
      paddingTop: '3px',
      paddingBottom: '0px'
    }),
    input: (provided: any) => ({
      ...provided
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0px',
      fontSize: '12px'
    })
  }
}

export default InlineEditStyled
