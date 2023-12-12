const DatePickerDropdownStyled = (theme: any, isMultiRegionStyled: boolean) => {
  const borderBottom = 'none'
  return {
    control: (provided: any, state: any) => {
      return {
        ...provided,
        borderStyle: 'none',
        borderRadius: '0px',
        boxShadow: 'none',
        borderBottom: state?.menuIsOpen ? null : borderBottom,
        width: 'auto',
        backgroundColor: theme?.colors?.white,
        cursor: 'pointer',
        fontSize: '13px',
        '&:focus': {
          borderStyle: 'none',
          boxShadow: 'none',
          borderBottom: state?.menuIsOpen ? null : borderBottom
        },
        '&:hover': {
          borderStyle: 'none',
          boxShadow: 'none',
          borderBottom: state?.menuIsOpen ? null : borderBottom
        },
        '&:before': {
          boxShadow: 'none',
          border: 'none',
          borderStyle: 'none',
          borderColor: state?.menuIsOpen ? null : theme?.colors?.grey?.A1000
        }
      }
    },
    option: (provided: any, state: any) => ({
      ...provided,
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
          : theme?.colors?.primary?.main
      }
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      textAlign: 'left',
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : theme?.colors?.white,
      borderRadius: isMultiRegionStyled ? "none" : "2px",
      border: isMultiRegionStyled ? "none" : `1px solid ${theme?.colors?.grey[500]}`,
      boxShadow: isMultiRegionStyled ? "0 2px 20px -10px #000" : "none",
      '&:hover': {
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : null,
        borderColor: state?.menuIsOpen ? null : theme?.colors?.grey?.A1000
      },
      marginTop: '-5px',
      width: 'fit-content',
      zIndex: 100
    }),
    menuList: (provided: any) => ({
      ...provided,
      paddingTop: '6px'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isMultiRegionStyled ? theme?.colors?.primary?.main : theme?.colors?.black,
      fontSize: '13px'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: isMultiRegionStyled ? theme?.colors?.black : theme?.colors?.grey?.A1000,
      fontSize: '10px',
      cursor: 'pointer',
      padding: '0px',
      marginTop: '1px'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0px',
      marginBottom: '3px',
      backgroundColor: 'transparent',
      color: 'transparent'
    })
  }
}

export default DatePickerDropdownStyled
