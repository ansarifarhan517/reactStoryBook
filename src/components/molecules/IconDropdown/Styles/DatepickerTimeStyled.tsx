const DatePickerTimeStyled = (theme: any) => {
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
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : theme?.colors?.white,
      textAlign: 'left',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.grey['50'],
        color: !state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.white
      }
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
      marginTop: '-5px',
      width: '100px',
      zIndex: 100
    }),
    menuList: (provided: any) => ({
      ...provided,
      marginTop: '0px',
      fontSize: '14px'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: theme?.colors?.black,
      fontSize: '13px'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: theme?.colors?.grey?.A1000,
      fontSize: '10px',
      cursor: 'pointer',
      padding: '0px',
      marginTop: '1px'
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      'input[type=text]': {
        display: 'none'
      },
      '&:hover': {
        borderColor: state?.menuIsOpen ? null : theme?.colors?.grey?.A1000
      }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0px',
      marginBottom: '3px'
    })
  }
}

export default DatePickerTimeStyled
