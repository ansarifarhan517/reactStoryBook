const PaginationDropdownStyled = (theme: any) => {
  const borderBottom = `1px solid ${theme?.colors?.grey['510']}`
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
        minHeight: '30px',
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
      backgroundColor:
        state?.isSelected || state?.isFocused
          ? theme?.colors?.grey['50']
          : null,
      color:
        state?.isSelected || state?.isFocused
          ? theme?.colors?.primary?.main
          : null,
      '&:active': {
        ...provided[':active'],
        backgroundColor: theme?.colors?.grey['50'],
        color: theme?.colors?.primary?.main
      },
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '13px',
      padding: '10px 15px'
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
          : null,
        borderColor: state?.menuIsOpen ? null : theme?.colors?.grey?.A1000
      },
      marginTop: '0px',
      width: '160px',
      zIndex: 100,
      boxShadow: theme?.shadows?.buttonPopupMenu
    }),
    menuList: (provided: any) => ({
      ...provided,
      marginTop: '0px',
      fontSize: '14px'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: theme?.colors?.grey?.A1000,
      fontSize: '13px'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: theme?.colors?.grey?.A1000,
      fontSize: '10px',
      cursor: 'pointer',
      padding: '0px',
      marginTop: '5px'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0px',
      marginBottom: '-3px',
      backgroundColor: 'transparent',
      color: 'transparent'
    })
  }
}

export default PaginationDropdownStyled
