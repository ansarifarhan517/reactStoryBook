import { tModelType, tSuperType } from './common.interface'

export const REGEXPS = {
  wholeNumber: /^[0-9]\d*$/,
  wholeNumberWithMax:/^[0-9]{0,3}$/,
  decimal: /^-?[0-9]\d*(\.\d+)?$/,
  phone: /^[+]{0,1}[\(\)\-/0-9 ]{0,20}$/,
  noDriveZone: /^[1-9]\d{0,3}$/, //range from 1 to 9999
  stuckDuration: /^(?:[5-9]|[1-9]\d{1,4}|99999)$/,
  commaSeparatedPhone: /^[+]{0,1}[\(\)\-/0-9 ]{0,20}(,[+]{0,1}[\(\)\-/0-9 ]{0,20})*$/,
  commaSeparatedEmail: /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,63}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,63})[\W]*$/,
  htmltags: /^((?!<.*>).)*$/
}

export const userAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || '{}')

const modelType: tModelType = userAccessInfo.modelType
const superType: tSuperType = userAccessInfo.superType
export let PRODUCT_TYPE: 'mile' | 'allmile' | 'haul' = 'mile'
if (superType === 'MIDDLEMILE') {
  PRODUCT_TYPE = 'allmile'
}

if (modelType === 'LH') {
  PRODUCT_TYPE = 'haul'
}

export const timeWindowConfirmedByArray = [{ label: "Not Confirmed", value: "NOTCONFIRMED" },
  { label: "Confirmed By Dispatcher", value: "DISPATCHER" },
  { label: "Confirmed By Customer", value: "CUSTOMER" }]

export const timeWindowConfirmedByMap = (() => {
  let twcMap = {}
  timeWindowConfirmedByArray.forEach((ech)=>{
    twcMap[ech.value] = ech
  })
  return twcMap
})()

export const colorPalette = [
  'rgba(0, 0, 200,0.8)', 'rgba(200, 0, 0,0.8)', 'rgba(150, 0, 150,0.8)', 'rgba(0, 100, 0,0.8)', 'rgba(150, 150, 0,0.8)', 'rgba(0, 150, 150,0.8)', 'rgba(70, 70, 95,0.8)', 'rgba(128, 134, 149,0.8)', 'rgba(179, 190, 208,0.8)', 'rgba(242, 197, 0,0.8)', 'rgba(0, 198, 101,0.8)', 'rgba(65, 0, 0,0.8)', 'rgba(78, 0, 34,0.8)', 'rgba(91, 54, 0,0.8)', 'rgba(104, 22, 69,0.8)', 'rgba(117, 109, 19,0.8)', 'rgba(130, 55, 0,0.8)', 'rgba(143, 78, 32,0.8)', 'rgba(99, 54, 32,0.8)', 'rgba(169, 44, 19,0.6)', 'rgba(34, 78, 93,0.9)', 'rgba(0, 39, 0,0.8)', 'rgba(39, 52, 78,0.8)', 'rgba(95, 65, 50,0.8)', 'rgba(22, 34, 55,0.8)', 'rgba(0, 91, 60,0.8)', 'rgba(0, 10, 79,0.8)', 'rgba(22, 117, 0,0.5)', 'rgba(100, 13, 45,0.8)', 'rgba(39, 143, 99,0.8)', 'rgba(98, 72, 195,0.8)', 'rgba(23, 92, 56,0.8)', 'rgba(22, 45, 0,0.8)', 'rgba(0, 0, 52,0.8)', 'rgba(0, 100, 65,0.8)', 'rgba(108, 0, 78,0.8)', 'rgba(22, 54, 91,0.8)', 'rgba(56, 198, 225,0.8)', 'rgba(88, 95, 11,0.8)', 'rgba(88, 109, 130,0.8)', 'rgba(156, 0, 98,0.8)', 'rgba(54, 220, 156,0.8)', 'rgba(71, 71, 169,0.8)', 'rgba(22, 67, 56,0.8)', 'rgba(29, 109, 195,0.8)', 'rgba(78, 200, 208,0.8)', 'rgba(99, 178, 221,0.8)', 'rgba(100, 55, 234,0.8)', 'rgba(220, 50, 247,0.8)', 'rgba(243, 62, 116,0.6)', 'rgba(226, 141, 149,0.8)', 'rgba(161, 200, 96,0.5)', 'rgba(126, 28, 17,0.4)', 'rgba(251, 22, 63,0.7)', 'rgba(235, 20, 24,0.8)', 'rgba(129, 43, 9,1.0)', 'rgba(173, 164, 29,0.7)', 'rgba(116, 216, 166,0.4)', 'rgba(69, 162, 10,0.7)', 'rgba(118, 207, 180,0.5)', 'rgba(209, 195, 217,0.9)', 'rgba(151, 244, 213,0.8)', 'rgba(138, 244, 51,0.4)', 'rgba(247, 244, 174,0.9)', 'rgba(125, 8, 114,0.4)', 'rgba(119, 6, 84,0.5)', 'rgba(35, 81, 138,0.5)', 'rgba(78, 63, 68,0.5)', 'rgba(131, 216, 209,1.0)', 'rgba(255, 217, 50,0.8)', 'rgba(19, 131, 186,0.4)', 'rgba(254, 220, 177,0.7)', 'rgba(198, 244, 80,0.7)', 'rgba(135, 115, 154,0.6)', 'rgba(220, 195, 193,0.7)', 'rgba(62, 234, 209,0.6)', 'rgba(98, 146, 179,0.7)', 'rgba(56, 228, 46,0.8)', 'rgba(48, 236, 79,0.9)', 'rgba(62, 41, 119,0.7)', 'rgba(162, 188, 19,0.9)', 'rgba(60, 113, 217,0.9)', 'rgba(177, 73, 236,0.5)', 'rgba(82, 162, 125,0.4)', 'rgba(152, 185, 249,0.7)', 'rgba(144, 5, 5,0.6)', 'rgba(38, 76, 78,0.7)', 'rgba(176, 16, 244,0.7)', 'rgba(245, 98, 187,0.6)', 'rgba(160, 208, 13,0.7)', 'rgba(219, 9, 201,0.6)', 'rgba(153, 231, 51,0.6)', 'rgba(4, 214, 227,0.7)', 'rgba(20, 65, 99,0.6)', 'rgba(149, 224, 131,1.0)', 'rgba(68, 16, 94,0.7)', 'rgba(208, 4, 4,0.0)', 'rgba(230, 226, 95,0.6)', 'rgba(202, 50, 163,0.5)', 'rgba(191, 221, 94,0.0)', 'rgba(243, 210, 108,0.5)', 'rgba(120, 48, 99,0.9)', 'rgba(44, 57, 117,0.0)', 'rgba(207, 210, 143,0.6)', 'rgba(94, 239, 112,0.6)', 'rgba(74, 19, 137,0.4)', 'rgba(70, 60, 2,0.7)', 'rgba(70, 88, 185,0.6)', 'rgba(154, 11, 164,0.8)', 'rgba(146, 94, 79,0.9)', 'rgba(78, 111, 174,0.4)', 'rgba(181, 195, 190,1.0)', 'rgba(91, 203, 2,0.6)', 'rgba(158, 99, 145,0.6)', 'rgba(171, 241, 45,0.4)', 'rgba(113, 243, 143,0.6)', 'rgba(34, 151, 249,0.4)', 'rgba(86, 143, 254,0.5)', 'rgba(25, 72, 187,0.6)', 'rgba(142, 7, 108,0.6)', 'rgba(122, 180, 171,0.5)', 'rgba(131, 239, 85,0.5)', 'rgba(47, 187, 228,0.8)', 'rgba(56, 119, 9,0.7)', 'rgba(164, 134, 86,0.0)', 'rgba(183, 62, 105,0.6)', 'rgba(224, 66, 198,0.7)', 'rgba(137, 156, 50,0.4)', 'rgba(128, 199, 226,0.8)', 'rgba(247, 235, 110,0.4)', 'rgba(59, 78, 79,0.7)', 'rgba(205, 118, 212,0.4)', 'rgba(205, 39, 160,0.9)', 'rgba(39, 109, 22,0.6)', 'rgba(192, 176, 151,0.4)', 'rgba(221, 12, 208,0.7)', 'rgba(83, 247, 21,0.9)', 'rgba(225, 21, 54,0.5)', 'rgba(164, 177, 184,0.0)', 'rgba(205, 86, 160,0.7)', 'rgba(73, 212, 222,0.6)', 'rgba(217, 61, 110,0.5)', 'rgba(248, 93, 153,0.5)', 'rgba(29, 10, 36,0.7)', 'rgba(192, 166, 26,0.7)', 'rgba(158, 91, 126,0.9)', 'rgba(152, 234, 245,0.9)', 'rgba(55, 19, 50,0.5)', 'rgba(181, 102, 193,0.6)', 'rgba(118, 185, 115,0.6)', 'rgba(103, 32, 92,0.7)', 'rgba(220, 182, 87,0.8)', 'rgba(51, 128, 36,0.9)', 'rgba(190, 2, 78,0.7)', 'rgba(161, 154, 112,0.6)', 'rgba(157, 242, 197,0.5)', 'rgba(47, 68, 189,0.5)', 'rgba(114, 108, 182,0.7)', 'rgba(99, 41, 133,0.0)', 'rgba(107, 167, 104,0.6)', 'rgba(79, 151, 78,0.6)', 'rgba(117, 209, 154,0.7)', 'rgba(180, 192, 246,0.6)', 'rgba(173, 246, 50,0.6)', 'rgba(197, 122, 222,1.0)', 'rgba(167, 126, 217,0.9)', 'rgba(142, 145, 31,0.5)', 'rgba(98, 69, 71,0.5)', 'rgba(172, 27, 253,0.7)', 'rgba(84, 124, 119,0.7)', 'rgba(70, 205, 107,0.9)', 'rgba(97, 146, 205,0.6)', 'rgba(56, 235, 127,0.6)', 'rgba(195, 251, 162,0.6)', 'rgba(9, 47, 238,0.6)', 'rgba(11, 49, 80,0.5)', 'rgba(232, 15, 223,0.8)', 'rgba(39, 228, 156,0.4)', 'rgba(29, 194, 115,0.9)', 'rgba(152, 186, 242,0.5)', 'rgba(187, 74, 170,0.4)', 'rgba(237, 244, 102,0.7)', 'rgba(219, 4, 142,0.4)', 'rgba(10, 76, 233,0.9)', 'rgba(95, 57, 237,0.6)', 'rgba(171, 100, 111,0.7)', 'rgba(19, 126, 166,0.9)', 'rgba(94, 122, 15,0.6)', 'rgba(244, 230, 88,0.5)', 'rgba(51, 120, 142,0.7)', 'rgba(154, 153, 181,0.7)', 'rgba(154, 253, 12,0.7)', 'rgba(182, 97, 244,0.7)', 'rgba(100, 58, 223,0.5)', 'rgba(210, 182, 59,0.5)', 'rgba(148, 186, 27,0.9)', 'rgba(156, 111, 23,0.9)', 'rgba(47, 32, 155,0.6)', 'rgba(234, 104, 61,0.6)', 'rgba(34, 12, 138,0.7)'
];

export const charOptionList = [
  { value: 'beginning', label: 'Beginning' },
  { value: 'end', label: 'End' },
  { value: 'all', label: 'All' },
  { value: 'inBetween', label: 'In-Between' }
];

export const dateOptionList = [
  { value: 'DDMMYYYY', label: 'DDMMYYYY' },
  { value: 'MMDDYYYY', label: 'MMDDYYYY' },
  { value: 'MMDDYY', label: 'MMDDYY' },
  { value: 'YYYY', label: 'YYYY' },
  { value: 'DD', label: 'DD' },
  { value: 'MM', label: 'MM' },
  { value: 'YY', label: 'YY' },
  { value: 'Y', label: 'Y' },
  { value: 'M', label: 'M' },
];

export const intOptionList = [
  { value: 'exact', label: 'Exact' },
  { value: 'all', label: 'All' }
];

export const deciOptionList = [
  { value: 'all', label: 'All' },
  { value: 'int', label: 'Integer' },
  { value: 'deci', label: 'Fraction' }
];
