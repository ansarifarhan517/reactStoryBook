import React, { useState, useEffect } from 'react'
import 'google-maps-react'
import AntPath from 'react-leaflet-ant-path'
import { getHereMapsDataForPath } from './heremapsCall'
import prepareCallStack from '../GoogleIntegration/prepareRouteCallStack'



const HereMapsRouteContainer = (props: any) => {
  const [paths, setPaths] = useState([] as any)

  const createHereMapsPath = async (paths: any) => {
      const newRoute = await Promise.all(paths.map(async (p: any) => {
        const paths = await getHereMapsDataForPath(props, p.points);
        p.path = paths;
        return p;
      }));

      setPaths(newRoute);
  }

  useEffect(() => {
      const newPaths = prepareCallStack(props.positions)
      createHereMapsPath(newPaths);
  }, [props.positions])

  return (
    <React.Fragment>
      <HereMapsRoutePresentation {...props} paths={paths} />
    </React.Fragment>
  )
}

const HereMapsRoutePresentation = (props: any) => {

  return (
    <React.Fragment>
      {props?.paths && props?.paths?.map((route: any, index: number) => {
        if (!route.path.length) {
          return (
            <AntPath
              key={index}
              positions={route.points}
              options={{ color: props.color[index] }}
            />
          )
        } else {
          return (
            <AntPath
              key={index}
              positions={route.path}
              options={{ color: props.color[index] }}
            />
          )
        }
      })}
    </React.Fragment>
  )
}

export default HereMapsRouteContainer
