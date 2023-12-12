import LL from 'leaflet'
const colorPalette = ["#0000c8cc", "#c80000cc", "#960096cc", "#006400cc", "#969600cc", "#009696cc", "#46465fcc", "#808695cc", "#b3bed0cc", "#f2c500cc", "#00c665cc", "#78addcff", "#f58585ff", "#f8e27fff", "##ff00e5ff", "##7f00ffff", "##0019ffff", "##00b2ffff", "##00ffb2ff", "##00ff19ff", "##ffe500ff", "##ff4c00ff", "##ff9900ff", "##cbff00ff", "##00ffffff", "##0066ffff", "##cc00ffff", "##ff0098ff", "#ebeef4ff", "#410000cc", "#4e0000cc", "#5b0000cc", "#680000cc", "#750000cc", "#820000cc", "#8f0000cc", "#9c0000cc", "#a90000cc", "#b60000cc", "#002700cc", "#003400cc", "#004100cc", "#004e00cc", "#005b00cc", "#006800cc", "#007500cc", "#008200cc", "#008f00cc", "#009c00cc", "#00a900cc", "#00b600cc", "#000034cc", "#000041cc", "#00004ecc", "#00005bcc", "#000068cc", "#000075cc", "#000082cc", "#00008fcc", "#00009ccc", "#0000a9cc", "#0000b6cc", "#0000c3cc", "#0000d0cc", "#0000ddcc", "#0000eacc", "#0000f7cc"]
const markerIcons = {
  orderIntransit: {
    html:
      '<div style="height:25px;width:25px;background:#5698d3;color:white;text-align:center;line-height:25px;font-size:11px;border-radius:50%;transform: translate(-33%,-33%);">P</div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  },
  orderNotdispatched: {
    html:
      '<div style="height:25px;width:25px;background:#FF0000;color:white;text-align:center;line-height:25px;font-size:11px;border-radius:50%;transform: translate(-33%,-33%);">D</div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  },
  pickupLocation:{
    html:`<div id="id-pickupLocation" style="height:25px;width:25px;background:#5698d3;color:white;text-align:center;line-height:25px;font-size:11px;border-radius:50%;transform: translate(-33%,-33%);">P</div>`,
    html_sequence:(sequence:Number,id:any) => `<div id="id-pickupLocation-${id}" style="height:25px;width:25px;background:#5698d3;color:white;text-align:center;line-height:25px;font-size:11px;border-radius:50%;transform: translate(-33%,-33%);">P${sequence}</div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  },
  deliverLocation:{
    html:`<div id="id-deliverLocation" style="height:25px;width:25px;background:#FF0000;color:white;text-align:center;line-height:25px;font-size:11px;border-radius:50%;transform: translate(-33%,-33%);">D</div>`,
    html_sequence:(sequence:Number,id:any) => `<div id="id-deliverLocation-${id}" style="height:25px;width:25px;background:#FF0000;color:white;text-align:center;line-height:25px;font-size:11px;border-radius:50%;transform: translate(-33%,-33%);">D${sequence}</div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  },
  dbIntransit: {
    html:
      '<div style="height:25px;width:25px;background:#FF0000;color:white;text-align:center;line-height:25px;font-size:11px;border-radius:50%;transform: translate(-33%,-33%);">Db</div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  },
  hub: {
    iconAnchor: [13, 52],
    html:
      '<div class="leafletStandardHtmlMarker hub"><?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="27px" height="54px" viewBox="0 0 27 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Hub</title><defs></defs><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Hub" transform="translate(1.000000, 1.000000)"><path d="M11.1176471,47.8496498 L11.1176471,25.4117647 L14.2941176,25.4117647 L14.2941176,47.8496498 C15.5795978,48.1959411 16.4705882,48.9495808 16.4705882,49.8235294 C16.4705882,51.0255609 14.785072,52 12.7058824,52 C10.6266927,52 8.94117647,51.0255609 8.94117647,49.8235294 C8.94117647,48.9495808 9.83216688,48.1959411 11.1176471,47.8496498 Z" id="Combined-Shape" stroke="#2A2A2A" fill="#BEBEBE"></path><circle id="Oval-3" stroke="#2A2A2A" fill="' +
      'rgba(0, 0, 200,0.8)' +
      '" cx="12.7058824" cy="12.7058824" r="12.7058824"></circle><polygon id="Shape" fill="#FFFFFF" fill-rule="nonzero" opacity="0.820953825" points="11.6470588 17 11.6470588 12.7647059 14.4705882 12.7647059 14.4705882 17 18 17 18 11.3529412 20.1176471 11.3529412 13.0588235 5 6 11.3529412 8.11764706 11.3529412 8.11764706 17"></polygon></g></g></svg></div>',
    iconSize: [5, 5],
    html_sequence: (sequence:number) => `<div class="leafletStandardHtmlMarker hub"><?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="27px" height="54px" viewBox="0 0 27 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Hub</title><defs></defs><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Hub" transform="translate(1.000000, 1.000000)"><path d="M11.1176471,47.8496498 L11.1176471,25.4117647 L14.2941176,25.4117647 L14.2941176,47.8496498 C15.5795978,48.1959411 16.4705882,48.9495808 16.4705882,49.8235294 C16.4705882,51.0255609 14.785072,52 12.7058824,52 C10.6266927,52 8.94117647,51.0255609 8.94117647,49.8235294 C8.94117647,48.9495808 9.83216688,48.1959411 11.1176471,47.8496498 Z" id="Combined-Shape" stroke="#2A2A2A" fill="#BEBEBE"></path><circle id="Oval-3" stroke="#2A2A2A" fill=${colorPalette[sequence] ? colorPalette[sequence] : "rgba(0, 0, 200,0.8)"}
     cx="12.7058824" cy="12.7058824" r="12.7058824"></circle><polygon id="Shape" fill="#FFFFFF" fill-rule="nonzero" opacity="0.820953825" points="11.6470588 17 11.6470588 12.7647059 14.4705882 12.7647059 14.4705882 17 18 17 18 11.3529412 20.1176471 11.3529412 13.0588235 5 6 11.3529412 8.11764706 11.3529412 8.11764706 17"></polygon></g></g></svg></div>`
  },
  tracking: {
    iconAnchor: new LL.Point(10, 10),
    iconSize: new LL.Point(5, 5),
    html:
      '<div class="leafletStandardHtmlMarker tracking" style="height:10px;width:10px;background:#5698d3;border-radius:50%;box-shadow:0px 0px 0px 1px #0000009c;"></div>'
  },
  lastTracking: {
    iconAnchor: [5, 5],
    iconSize: [10, 10],
    html: '<div class="leafletStandardHtmlMarker lastTracking"></div>'
  },
  locationSearch: {
    html:
      '<div style="height:25px;width:25px;background:#ee5448;color:white;text-align:center;line-height:25px;font-size:11px;border-radius:50%;transform: translate(-33%,-33%);border:1px solid white;box-shadow: 0px 4px 8px 2px lightgrey;"></div>',
    iconSize: new LL.Point(10, 10),
    iconAnchor: new LL.Point(5, 5)
  },
  trip: {
    html:
      '<svg width="27px" height="54px" viewBox="0 0 27 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Hub</title><defs></defs><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Hub" transform="translate(1.000000, 1.000000)"><path d="M11.1176471,47.8496498 L11.1176471,25.4117647 L14.2941176,25.4117647 L14.2941176,47.8496498 C15.5795978,48.1959411 16.4705882,48.9495808 16.4705882,49.8235294 C16.4705882,51.0255609 14.785072,52 12.7058824,52 C10.6266927,52 8.94117647,51.0255609 8.94117647,49.8235294 C8.94117647,48.9495808 9.83216688,48.1959411 11.1176471,47.8496498 Z" id="Combined-Shape" stroke="#2A2A2A" fill="#BEBEBE"></path><circle id="Oval-3" stroke="#2A2A2A" fill="rgba(0, 0, 200,0.8)" cx="12.7058824" cy="12.7058824" r="12.7058824"></circle><polygon id="Shape" fill="#FFFFFF" fill-rule="nonzero" opacity="0.820953825" points="11.6470588 17 11.6470588 12.7647059 14.4705882 12.7647059 14.4705882 17 18 17 18 11.3529412 20.1176471 11.3529412 13.0588235 5 6 11.3529412 8.11764706 11.3529412 8.11764706 17"></polygon></g></g></svg>',
    iconSize: new LL.Point(10, 10),
    iconAnchor: new LL.Point(5, 5)
  }
}

export default markerIcons
