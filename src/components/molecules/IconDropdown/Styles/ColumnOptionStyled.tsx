const ColumnOptionStyled = (width: string, theme: any) => {
  return {
    control: (provided: any) => ({
      ...provided,
      borderStyle: 'none',
      borderRadius: '0px',
      boxShadow: 'none',
      backgroundColor: 'transparent',
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
    option: (provided: any) => ({
      ...provided,
      backgroundColor: theme?.colors?.white,
      '&:hover': {
        backgroundColor: theme?.colors?.grey['600']
      },
      fontSize: '11px',
      borderBottom: `1px solid ${theme?.colors?.grey['500']}`,
      '&:last-child': {
        borderBottom: 'none'
      },
      cursor: 'pointer'
    }),

    menu: (provided: any) => ({
      ...provided,
      borderRadius: '2px',
      backgroundColor: theme?.colors?.white,
      marginTop: '-10px',
      minWidth: '135px',
      width: width || '135px',
      marginLeft: '-115px',
      // boxShadow: theme?.shadows?.hover,
      boxShadow: theme?.shadows?.buttonPopupMenu,
      cursor: 'pointer'
    }),
    menuList: (provided: any) => ({
      ...provided,
      marginTop: '35px',
      paddingTop: '0px',
      position: 'absolute',
      boxShadow: '0 6px 12px rgb(0 0 0 / 30%)'
    }),

    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: theme?.colors?.primary?.main,
      fontSize: '10px',
      cursor: 'pointer',
      '&:hover': {
        color: theme?.colors?.primary?.main
      }
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

export default ColumnOptionStyled
