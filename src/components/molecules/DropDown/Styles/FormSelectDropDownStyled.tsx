import { ThemeContext } from 'styled-components'
import { useContext } from 'react'

const FormSelectStyled = (error: boolean) => {
  const theme = useContext(ThemeContext)
  const borderColor = error
    ? theme?.colors?.error?.main
    : theme?.colors?.grey?.A800
  return {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '0px',
      borderColor,
      boxShadow: '#000',
      margin: '18px 0px',
      minHeight:'40px',
      '&:focus': {
        borderColor,
        boxShadow: borderColor
      },
      '&:hover': {
        borderColor,
        boxShadow: borderColor
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      // backgroundColor: state?.isSelected ? theme?.colors?.primary?.main : null,
      fontSize: '13px',
      padding: '11px 15px',
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : state?.isFocused
        ? theme?.colors?.grey['50']
        : 'inherit',
      color: state?.isSelected
        ? theme?.colors?.primary?.contrastText
        : state.isFocused
        ? theme?.colors?.primary?.main
        : 'inherit',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.grey['50'],
        color: state?.isSelected
          ? theme?.colors?.primary?.contrastText
          : theme?.colors?.primary?.main,

        '.option_description': {
          backgroundColor: state?.isSelected
            ? theme?.colors?.primary?.main
            : theme?.colors?.grey['50'],
          color: state?.isSelected
            ? theme?.colors?.primary?.contrastText
            : theme?.colors?.primary?.main
        }
      },
      '& div': {
        color: state?.isSelected
          ? theme?.colors?.primary?.contrastText
          : state.isFocused
          ? theme?.colors?.primary?.main
          : theme?.colros?.grey['700']
      }
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : 'white',
      boxShadow: '0 10px 36px -10px rgba(0, 0, 0, 0.47)',
      borderRadius: '2px',
      '&:hover': {
        backgroundColor: state?.isSelected ? theme?.colors?.primary?.main : null
      },
      marginTop: '1px',
      opacity: state.isLoading ? 0 : 1,
      zIndex: theme?.zIndex?.popover
    }),
    menuList: (provided: any) => ({
      ...provided,
      paddingTop: '6px'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: theme?.colors?.black,
      fontSize: '8px',
      padding: '0px',
      marginLeft: '0px',
      marginRight: '10px'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: theme?.colors?.darkBlack,
      width: '100%'
    })
  }
}

export default FormSelectStyled
