import History from './History'
export const toolbarOptions = {
  options: [
    'history',
    'fontFamily',
    'fontSize',
    'inline',
    'colorPicker',
    'textAlign'
  ],
  inline: {
    inDropdown: false,
    options: ['bold', 'italic', 'underline']
  },
  fontFamily: {
    inDropdown: true
    // options: [
    //   'Impact',
    //   'Open Sans',
    //   'Roboto',
    //   'Tahoma',
    //   'Times New Roman',
    //   'Verdana'
    // ]
  },
  textAlign: { inDropdown: true },
  history: {
    inDropdown: false,
    component: History
  }
}
