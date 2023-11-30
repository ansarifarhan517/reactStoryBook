import { tBreakpoints } from './types'

export const getDefaultTheme = () => ({
  shadows: {
    default: '0 2px 11px -5px #000',
    hover: '0 7px 27px -8px #000',
    searchInput: '0 2px 2px 0 rgba(0,0,0,.24), 0 2px 2px 0 rgba(0,0,0,.24)',
    toolTip: '4px 4px 8px rgba(0,0,0,.3)',
    buttonPopupMenu: '0 6px 12px rgba(0,0,0,.175)',
    iconButtonPopover: '0 1px 9px -5px #000',
    hoverButtonPopover: '0 5px 20px -8px #000',
    toggleSwitch: '0px 2px 1px 0px',
    toggleSwitchInner: 'inset 0 0 10px -5px',
  },
  button: {
    borderRadius: 5,
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    up: function (breakpoint: tBreakpoints) {
      return `@media (min-width: ${this[breakpoint]}px)`
    },
    down: function (breakpoint: tBreakpoints) {
      return `@media (max-width: ${this[breakpoint]}px)`
    },
  },
  fontIcons: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 36,
  },
  zIndex: {
    none: 0,
    basic: 1,
    loader: 2000,
    dropDown: 1000,
    max: 100000,
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    toast: 9050 - 50,
    modal: 9050,
    popover: 1300,
    snackbar: 1400,
    tooltip: 10010,
    textFilter: 100,
    listView: {
      pinnedColumn: 3,
      columnHeader: 10,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  scrollbar: {
    neutral: '#dadceo',
    hover: '#bdc1c6',
    active: '#80868b',
  },
  colors: {
    white: '#fff',
    black: '#000',
    darkBlack: '#0e0e0e',
    green: '#27bf00',
    red: '#f05548',
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.19)',
      hint: 'rgba(0, 0, 0, 0.38)',
      inputLabel: {
        grey: '#999',
        default: '#000',
      },
    },
    listRowSelection: '#cfe2fb',
    dateRangeSelection: '#ebf4f8',
    popUpOverlay: '0e0e0e',
    lightPopUpOverlay: '#ffbe88',
    shiftTimingsBg: '#fdfdfd',
    grey: {
      '50': '#fafafa',
      '100': '#f5f5f5',
      '150': '#555',
      '200': '#eeeeee',
      '250': '#dde2e6',
      '300': '#e0e0e0',
      '400': '#abacba',
      '450': '#dddddd',
      '500': '#d4d4d4',
      '510': '#d5d5db',
      '550': '#d8d8d8',
      '600': '#f3f3f3',
      '700': '#616161',
      '800': '#333',
      '900': '#485465',
      A100: '#545454',
      A200: '#aaaaaa',
      A400: '#303030',
      A500: '#42425c',
      A700: '#616161',
      A800: '#979797',
      A900: '#8f8f8f',
      A1000: '#828395',
      inputBorder: '#979797',
      searchInputBorder: 'rgba(0,0,0,.1)',
    },
    charts: {
      green: '#48979b',
      red: '#f05548',
      brown: '#9b4848',
      yellow: '#f0ad48',
      lightBlue: '#82b8e5',
      shadowBlue: '#006279',
    },
    onlineStatus: {
      idle: '#eccc0a',
      offline: '#de5364',
    },
    primary: {
      main: '#fc8019',
      contrastText: '#fff',
      light: '#fff3ea',
      contrastTextLight: '#fc8019',
      dark: '#df6703',
    },
    secondary: {
      main: '#9D1CB2',
      contrastText: '#fff',
      dark: '#851897',


    },
    error: {
      light: '#ffedee',
      lighterMain: '#ed6261',
      main: '#f44336',
      contrastText: '#fff',
      transparentLight: '#ff000026',
      warning: '#fba729',
      dark: '#d32f2f',

    },
    warning: {
      light: '#ffb74d',
      main: '#ffc107',
      dark: '#ffca2c',
      contrastText: 'rgba(0, 0, 0, 0.87)',

    },
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#fff',

    },
    success: {
      // light: '#81c784',
      light: 'rgba(0,200,0,.1)',
      main: '#4caf50',
      dark: '#388e3c',
      contrastText: '#fff',


    },
    light: {
      // light: '#81c784',
      light: 'rgba(0,200,0,.1)',
      main: '#eee',
      dark: '#d3d4d5',
      contrastText: '#7E808C',
      contrastTextLight:'white',

    },
    dark: {
      light: 'rgba(0,200,0,.1)',
      main: '#7E808C',
      dark: '#424649',
      contrastText: '#fff',
      contrastTextLight:'white',

    },
    lightPrimary: {
      main: '#fff3ea',
      contrastText: '#fc8019',
      dark: '#df6703',
      contrastTextLight:'white',


    },
    lightSecondary: {
      main: '#df8aed;',
      contrastText: '#9D1CB2',
      color: '#9D1CB2',
      dark: '#851897',
      contrastTextLight:'white',


    },
    lightError: {
      main: '#fce9e9;',
      contrastText: '#EB5757',
      color: '#EB5757',
      dark: '#EB5757',
      contrastTextLight:'white',


    },
    lightSuccess: {
      main: '#e3faef;',
      contrastText: '#1FBF75',
      color: '#1FBF75',
      dark: '#1FBF75',
      contrastTextLight:'white',


    },

    lightWarning: {
      light: '#fef7f1',
      main: '#fef7f1',
      dark: '#ffca2c',
      contrastText: '#ffb74d',
      contrastTextLight:'white',


    },
    outlinePrimary: {
      main: '#fc8019',
      contrastText:'#fc8019',
      dark:'#fc8019',
      contrastTextLight:'white',
    },
    outlineSecondary: {
      main: '#9D1CB2',
      contrastText:'#9D1CB2',
      dark:'#9D1CB2',
      contrastTextLight:'white',
    },
    outlineError: {
      main: '#f44336',
      contrastText:'#f44336',
      dark:'#f44336',
      contrastTextLight:'white',
    },
    outlineSuccess: {
      main: '#4caf50',
      contrastText:'#4caf50',
      dark:'#4caf50',
      contrastTextLight:'white',
    },
    outlineWarning: {
      main: '#ffc107',
      contrastText:'#ffc107',
      dark:'#ffc107',
      contrastTextLight:'white',
    },
    outlineInfo: {
      main: '#2196f3',
      contrastText:'#2196f3',
      dark:'#2196f3',
      contrastTextLight:'white',
    },
    outlineLight: {
      main: '#eee',
      contrastText:'#7E808C',
      dark:'#eee',
      contrastTextLight:'#7E808C',
    },
    outlineDark: {
      main: '#7E808C',
      contrastText:'#7E808C',
      dark:'#7E808C',
      contrastTextLight:'white',
    },


  },
  modal: {
    sm: '400px',
    md: '600px',
    lg: '800px',
  },
})
