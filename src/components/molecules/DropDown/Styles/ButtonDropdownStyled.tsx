import { ThemeContext } from 'styled-components'
import { useContext } from 'react'

const ButtonView = () => {
  const theme = useContext(ThemeContext)
  const borderBottom = `1px solid ${theme?.colors?.grey['A800']}`
  return {
    control: (provided: any) => ({
      ...provided,
      borderStyle: 'none',
      borderBottom,
      borderRadius: '0px',
      boxShadow: 'none',
      borderColor: theme?.colors?.grey?.A800,
      '&:focus': {
        borderStyle: 'none',
        borderBottom,
        boxShadow: 'none',
        borderColor: theme?.colors?.grey?.A800
      },
      '&:hover': {
        borderStyle: 'none',
        borderBottom,
        boxShadow: 'none',
        borderColor: theme?.colors?.grey?.A800
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : theme?.colors?.white,
      '&:hover': {
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.grey['50']
      }
    }),

    menu: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected
        ? theme?.colors.primary.main
        : theme?.colors?.white,
      borderRadius: '2px',
      '&:hover': {
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.white
      },
      marginTop: '5px',
      marginLeft: '16px',
      width: '90%'
    }),
    menuList: (provided: any) => ({
      ...provided,
      marginTop: '0px'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0px'
    })
  }
}

export default ButtonView
