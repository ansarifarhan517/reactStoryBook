import axiosRef from "axios";
import { IUserAccessInfo } from "./common.interface";

export const baseURL =
  window.location.origin == "http://localhost:9001"
    ? "https://qa-automation.loginextsolutions.com"
    : window.location.origin; 

axiosRef.defaults.headers.post["Content-Type"] = "application/json";
axiosRef.defaults.headers.put["Content-Type"] = "application/json";
axiosRef.defaults.headers.get["Content-Type"] = "application/json";
axiosRef.defaults.headers.delete["Content-Type"] = "application/json";
export const userAccessInfo: IUserAccessInfo = JSON.parse(
  localStorage.getItem("userAccessInfo") || "{}"
);
const axios = axiosRef.create({

  baseURL,
  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
  // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
  // FormData or Stream
  // You may modify the headers object.
  transformRequest: [
    transformReqFunction
  ],

  transformResponse: [

    function (data) {

      // Do whatever you want to transform the data
      if (userAccessInfo && data) {
        switch (data?.status) {
          case 401:
            if (
              !userAccessInfo.isClientExpire &&
              data.message.toLowerCase().includes("invalid token")
            ) {
              localStorage.clear();
              sessionStorage.clear();
              if (window.location.origin === "http://localhost:9001") {
                location.replace(window.location.origin + "/#/login");
              } else {
                location.replace(location.origin + "/product/#/login");
              }
            }
            break;
          case 403:
            debugger
            if (userAccessInfo.userName !== "saas_dummy_user") {
              if (window.location.origin === "http://localhost:9001") {
                location.replace(
                  window.location.origin + "/#/permissionDenied"
                );
              } else {
                location.replace(
                  location.origin + "/product/#/permissionDenied"
                );
              }
            }
            break;
          case 500:
            break;
        }
      }
      return data;
    },
  ],

  // `headers` are custom headers to be sent
  headers: {},

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  // timeout: 5000, // default is `0` (no timeout)
  responseType: "json",
});

export const axiosWP = axiosRef.create({
  baseURL: "https://support.loginextsolutions.com/index.php",
  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
  // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
  // FormData or Stream
  // You may modify the headers object.
  transformRequest: [
    (data, headers) => {
      // Do whatever you want to transform the data

      const userAccessInfo = JSON.parse(
        localStorage.getItem("userAccessInfo") || "{}"
      );
      if (userAccessInfo && userAccessInfo.wordpressToken) {
        headers.Authorization = `Bearer ${userAccessInfo.wordpressToken}`;
      }

      // console.log(data)
      // headers.get['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      // delete headers['Content-Type']
      // delete headers.post['Content-Type']
      // if (location.origin == "http://localhost:9001" && localStorage.getItem('userAccessInfo')) {
      //   config.params['access_token'] = JSON.parse(localStorage.getItem('userAccessInfo'))['accessToken'].split('BASIC ')[1].trim();
      //   config.params['CLIENT_SECRET_KEY'] = JSON.parse(localStorage.getItem('userAccessInfo'))['CLIENT_SECRET_KEY']
      //   // config.params['Access-Control-Allow-Origin']='http://localhost:9001';
      // }

      // headers['Access-Control-Allow-Origin'] = '*'
      // headers['Access-Control-Allow-Headers'] = '*'
      if (headers["Content-Type"] === "multipart/form-data") {
        return data;
      } else {
        return JSON.stringify(data);
      }
    },
  ],

  transformResponse: [
    function (data) {
      // Do whatever you want to transform the data

      return data;
    },
  ],

  // `headers` are custom headers to be sent
  headers: {},

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  // timeout: 5000, // default is `0` (no timeout)
  responseType: "json",
});

export const axiosNoTransformResp = axiosRef.create({
  baseURL,
  // `headers` same as normal axios
  headers: {},
  // light weight service calls Eg. Dropdown elements
  transformRequest: [transformReqFunction],
  transformResponse: [
    function (data) {
      // Do whatever you want to transform the data

      return data;
    },
  ],
  responseType: "json",
});

function transformReqFunction(data, headers) {
  // Do whatever you want to transform the data

  if (
    userAccessInfo &&
    userAccessInfo.accessToken &&
    userAccessInfo.CLIENT_SECRET_KEY
  ) {
    headers["WWW-Authenticate"] = userAccessInfo.accessToken;
    headers["CLIENT_SECRET_KEY"] = userAccessInfo.CLIENT_SECRET_KEY;
  } else {
    const userLoginInfo: IUserAccessInfo = JSON.parse(
      localStorage.getItem("userAccessInfo") || "{}"
    );
    headers["WWW-Authenticate"] = userLoginInfo.accessToken;
    headers["CLIENT_SECRET_KEY"] = userLoginInfo.CLIENT_SECRET_KEY;
  }

  // if (location.origin == "http://localhost:9001" && localStorage.getItem('userAccessInfo')) {
  //   config.params['access_token'] = JSON.parse(localStorage.getItem('userAccessInfo'))['accessToken'].split('BASIC ')[1].trim();
  //   config.params['CLIENT_SECRET_KEY'] = JSON.parse(localStorage.getItem('userAccessInfo'))['CLIENT_SECRET_KEY']
  //   // config.params['Access-Control-Allow-Origin']='http://localhost:9001';
  // }
  if (headers["Content-Type"] === "multipart/form-data") {
    return data;
  } else {
    return JSON.stringify(data);
  }
}

export default axios;
