import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_GET_PERMISSIONS,
  AUTH_ERROR,
  AUTH_CHECK
} from "react-admin";
import { API_URL } from "./config";
import getHeaders from "./authHeaders";

const permissionsCache = {};

export default (type, params) => {
  // called when the user attempts to log in
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    const requestURL = `${API_URL}/users/login`;
    const request = new Request(requestURL, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json"
      })
    });
    return fetch(request)
      .then(response => response.json())
      .then(({ data }) => {
        if (data.code === 401) {
          throw new Error(data.message);
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("roles", JSON.stringify(data.roles));
      });
  }

  if (
    type === AUTH_GET_PERMISSIONS &&
    params &&
    params.location &&
    params.location.indexOf("/explorer") !== -1
  ) {
    const currentLocation = document.location.toString();
    const routeParams = currentLocation.split("#");
    const routeUrl = routeParams[1];
    const action = routeUrl.split("?");
    const qs = new URLSearchParams(action[1]);
    const filter = JSON.parse(qs.get("filter") || "{}");

    const id =
      filter.id ||
      (routeUrl.endsWith("/containers") || routeUrl.endsWith("/assets")
        ? routeUrl.split("/")[routeUrl.split("/").length - 2] || 0
        : 0);
    const type = routeUrl.endsWith("/assets") ? "assets" : "containers";
    const uid = [type, id].join("/");
    if (permissionsCache[uid]) {
      return Promise.resolve(permissionsCache[uid]);
    }
    const url = `${API_URL}/explorer/permissions/${id}/${type}`;

    const request = new Request(url, {
      method: "GET",
      headers: getHeaders()
    });
    return fetch(request)
      .then(response => response.json())
      .then(response => {
        permissionsCache[uid] = response.perms;
        return response.perms && response.perms
          ? Promise.resolve(response.perms)
          : Promise.reject();
      });
  } else if (type === AUTH_GET_PERMISSIONS) {
    let roles = JSON.parse(localStorage.getItem("roles"));
    return Promise.resolve(v => roles && roles.some(r => r.code === v));
  }
  // called when the user clicks on the logout button
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem("token");
    return Promise.resolve();
  }
  // called when the API returns an error
  if (type === AUTH_ERROR) {
    const { status } = params;
    if (status === 401) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  }
  // called when the user navigates to a new location
  if (type === AUTH_CHECK) {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  }
  return Promise.reject("Unknown method");
};
