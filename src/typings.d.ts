/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string
  const svgComponent: SvgrComponent
  export default svgUrl
  export { svgComponent as ReactComponent }
}

declare module 'react-leaflet-heatmap-layer'
declare module 'react-leaflet-ant-path'
declare module 'react-leaflet-fullscreen'
declare module 'google-polyline'
declare module 'react-leaflet-draw'
declare module 'react-leaflet-measure'
