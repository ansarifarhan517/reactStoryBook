import { ThemeContext } from 'styled-components'
import { useContext } from 'react'

const BreadCrumbSelect = (width: string) => {
  const theme = useContext(ThemeContext)
  return {
    control: (provided: any) => ({
      ...provided,
      borderStyle: 'none',
      borderRadius: '0px',
      boxShadow: 'none',
      width: '160px',
      backgroundColor: theme?.colors?.grey['50'],
      fontSize: '17px',
      '&:focus': {
        borderStyle: 'none',
        boxShadow: 'none'
      },
      '&:hover': {
        borderStyle: 'none',
        boxShadow: 'none',
        borderColor: theme?.colors?.grey['A800']
      },
      '&:before': {
        boxShadow: 'none',
        border: 'none',
        borderStyle: 'none'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected ? theme?.colors?.primary?.main : null,
      '&:hover': {
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.grey['50']
      }
    }),

    menu: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected ? theme?.colors?.primary?.main : null,
      borderRadius: '2px',
      '&:hover': {
        backgroundColor: state?.isSelected ? theme?.colors?.primary?.main : null
      },
      marginTop: '1px',
      minWidth: '250px',
      width
    }),
    menuList: (provided: any) => ({
      ...provided,
      marginTop: '6px'
    }),

    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: theme?.colors?.primary?.main,
      fontSize: '10px',
      cursor: 'pointer'
    })
  }
}

export default BreadCrumbSelect
