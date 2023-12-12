import { ThemeContext } from 'styled-components'
import { useContext } from 'react'

const ListViewStyled = () => {
  const theme = useContext(ThemeContext)
  const borderBottom = `1px solid ${theme?.colors?.grey['400']}`
  return {
    control: (provided: any) => ({
      ...provided,
      borderStyle: 'none',
      borderBottom,
      borderRadius: '0px',
      boxShadow: 'none',
      cursor: 'pointer',
      borderColor: theme?.colors?.grey['A800'],
      '&:focus': {
        borderStyle: 'none',
        borderBottom,
        boxShadow: 'none',
        borderColor: theme?.colors?.grey['A800']
      },
      '&:hover': {
        borderStyle: 'none',
        borderBottom,
        boxShadow: 'none',
        borderColor: theme?.colors?.grey?.A800
      },
      backgroundColor: 'transparent',
      minHeight: '21px'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected ? theme?.colors?.grey['50'] : null,
      color: state?.isSelected ? theme?.colors?.primary?.main : null,
      '&:hover': {
        color: theme?.colors?.primary?.main
      },
      '&:active': {
        ...provided[':active'],
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
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.white
      },
      marginTop: '5px',
      boxShadow: theme?.shadows?.buttonPopupMenu,
      width: '160px'
    }),
    menuList: (provided: any) => ({
      ...provided,
      paddingTop: '0px',
      fontSize: '13px',
      cursor: 'pointer'
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

export default ListViewStyled
