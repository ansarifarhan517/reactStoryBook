export const fullHeightStyle = { height: 'calc(100vh - 64px)' }

export const settingsActivationKeyMap = {
  IVR: 'IVR',
  SMS: 'MOBILE',
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP'
}

export const settingsOtherDataKeyMap = {
  IVR: 'OTHERIVRMOBILENO',
  SMS: 'OTHERMOBILENO',
  EMAIL: 'OTHEREMAILID',
  WHATSAPP: 'OTHERWHATSAPPMOBILENO'
}

export const stripParagraphTags = (str: string) =>{

  return str.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('&nbsp;', '').replaceAll('<br>', '\n')
} 

export const removeHTMLTags = (htmlString : string)=> {
  htmlString = htmlString.toString();
  // Regular expression to identify HTML tags in 
  // the input string. Replacing the identified 
  // HTML tag with a null string.
  return htmlString.replace( /(<([^>]+)>)/ig, '');
}

export const stripTags = (str: string) =>{
  return str.replace(/<\/?span[^>]*>/g,"");
}

export const stripNextLine = (str: string) => {
  return str.replace(/\n/g, '');
};


const userAccessInfo = localStorage.getItem('userAccessInfo')
export const isShipper = JSON.parse(userAccessInfo || '{}').isSuperClient == false