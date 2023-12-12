import styled, { ThemeContext } from 'styled-components'
import { useContext } from 'react'

export const StyledSelectWrapper = styled.div`
  background-color: white;
`
export const CustomStyles = () => {
  const theme = useContext(ThemeContext)
  const borderBottom = `1px solid ${theme?.colors?.grey['450']}`
  return {
    control: (provided: any, state: any) => {
      return {
        ...provided,
        borderStyle: 'none',
        borderRadius: '0px',
        boxShadow: 'none',
        border: state?.menuIsOpen ? null : borderBottom,
        width: 'auto',
        backgroundColor: theme?.colors?.white,
        cursor: 'pointer',
        fontSize: '13px',
        minHeight: '30px',
        '&:focus': {
          borderStyle: 'none',
          boxShadow: 'none',
          border: state?.menuIsOpen ? null : borderBottom
        },
        '&:hover': {
          borderStyle: 'none',
          boxShadow: 'none',
          border: state?.menuIsOpen ? null : borderBottom
        },
        '&:before': {
          boxShadow: 'none',
          border: 'none',
          borderStyle: 'none',
          borderColor: state?.menuIsOpen ? null : theme?.colors?.grey?.A1000
        }
      }
    },
    menu: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : theme?.colors?.white,
      borderRadius: '2px',
      '&:hover': {
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : null,
        borderColor: state?.menuIsOpen ? null : theme?.colors?.grey?.A1000
      },
      marginTop: '0px',
      width: '100%',
      zIndex: theme?.zIndex?.dropDown,
      boxShadow: theme?.shadows?.buttonPopupMenu
    }),
    menuList: (provided: any) => ({
      ...provided,
      marginTop: '0px',
      fontSize: '14px',
      maxHeight: '200px',
      scroll: 'auto'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: theme?.colors?.grey['800'],
      fontSize: '13px',
      marginLeft: '10px',
      marginRight: '10px'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: theme?.colors?.black,
      fontSize: '8px',
      cursor: 'pointer',
      padding: '0px',
      margin: '5px'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0px',
      marginBottom: '-3px',
      backgroundColor: 'transparent',
      color: 'transparent'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
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
          : theme?.colors?.primary?.main
      }
    })
  }
}
