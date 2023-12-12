export const RULAR_CONFIG = {
  position: 'topleft',
  unitSystem: 'imperial',
  color: '#FF0080',
  type: 'line',
  fillColor: '#fff',
  features: [
    'node',
    'line',
    'polygon',
    'ruler',
    'paint',
    'drag',
    'rotate',
    'nodedrag',
    'trash'
  ],
  pallette: ['#FF0080', '#4D90FE', 'red', 'blue', 'green', 'orange', 'black'],
  dashArrayOptions: [
    '5, 5',
    '5, 10',
    '10, 5',
    '5, 1',
    '1, 5',
    '0.9',
    '15, 10, 5',
    '15, 10, 5, 10',
    '15, 10, 5, 10, 15',
    '5, 5, 1, 5'
  ],
  fill: true,
  stroke: true,
  dashArray: [5, 5],
  weight: 2,
  opacity: 1,
  fillOpacity: 0.5,
  radius: 3,
  doubleClickSpeed: 300
}
