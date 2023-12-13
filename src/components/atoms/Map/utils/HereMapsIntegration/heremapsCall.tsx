import { getFormattedLatLongString } from './heremapsLatLongConversion';

export const getHereMapsDataForPath = async (props: any, waypoints: any) => {
  return new Promise<any[]>((resolve, reject) => {
    const subPolylineLatngs: any[] = [];

    const onSuccess = (response: { routes: any[] }) => {
      const route = response.routes[0];
      if (route) {
        addRouteOnPath(route);
      } else {
        reject(subPolylineLatngs);
      }
    };

    const onError = (error: any) => {
      console.error('Error while fetching Here maps data', error);
      reject(subPolylineLatngs);
    };

    const addRouteOnPath = (route: any) => {
      route?.sections?.forEach((section: any) => {
        const linestring = props.heremapsObject.geo.LineString.fromFlexiblePolyline(section.polyline);
        const arrayWithout0 = linestring?.$?.filter((num: number) => num !== 0);
        const finalArray: any[] = [];

      
        arrayWithout0.forEach((_: any, index: number, array: string | any[]) => {
          if (index % 2 === 0) {
              finalArray.push(array.slice(index, index + 2));
          }
        });
        
        finalArray.forEach((point: any) => {
          subPolylineLatngs.push(point);
        });
      });

      resolve(subPolylineLatngs);
    };

    const origin = getFormattedLatLongString(waypoints[0]);
    const destination = getFormattedLatLongString(waypoints[waypoints.length - 1]);
    const formattedWaypoints = waypoints.map((obj: any) => getFormattedLatLongString(obj));

    const routingParams = {
      origin,
      via: new props.heremapsObject.service.Url.MultiValueQueryParameter(formattedWaypoints),
      destination,
      routingMode: 'fast',
      transportMode: 'truck',
      return: 'polyline',
    };

    const platform = new props.heremapsObject.service.Platform({
      apikey: props.heremapsApiKey,
    });

    const router = platform.getRoutingService(null, 8);

    setTimeout(async () => {
      await router.calculateRoute(routingParams, onSuccess, onError);
    }, 1000);
  });
};
