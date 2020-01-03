import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  fetchUtils
} from "react-admin";
import { stringify } from "query-string";
import { DELETE_MANY } from "ra-core";
import { API_URL } from "./config";
import getHeaders from "./authHeaders";

/**
 * @param {String} type One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertDataProviderRequestToHTTP = (type, resource, params) => {
  switch (type) {
    case GET_LIST: {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort: field,
        direction: order,
        page: page,
        limit: perPage,
        ...params.filter
      };
      return {
        url: `${API_URL}/${resource}?${stringify(query)}`,
        options: { headers: params.headers }
      };
    }
    case GET_ONE:
      return {
        url: `${API_URL}/${resource}/${params.id}`,
        options: { headers: params.headers }
      };
    case GET_MANY: {
      const query = {
        ids: params.ids.map(id => (id.id ? id.id : id)).join(",")
      };
      return {
        url: `${API_URL}/${resource}?${stringify(query)}`,
        options: { headers: params.headers }
      };
    }
    case GET_MANY_REFERENCE: {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort: field,
        direction: order,
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        [params.target]: params.id
      };
      return {
        url: `${API_URL}/${resource}?${stringify(query)}`,
        options: { headers: params.headers }
      };
    }
    case UPDATE:
      return {
        url: `${API_URL}/${resource}/${params.id}`,
        options: {
          method: "PUT",
          body: JSON.stringify(params.data),
          headers: params.headers
        }
      };
    case CREATE:
      return {
        url: `${API_URL}/${resource}`,
        options: {
          method: "POST",
          body: JSON.stringify(params.data),
          headers: params.headers
        }
      };
    case DELETE:
      return {
        url: `${API_URL}/${resource}/${params.id}`,
        options: { method: "DELETE", headers: params.headers }
      };
    default:
      throw new Error(`Unsupported fetch action type ${type}`);
  }
};

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} Data Provider response
 */
const convertHTTPResponseToDataProvider = (response, type, params) => {
  const { json } = response;
  switch (type) {
    case GET_MANY:
    case GET_LIST:
      return {
        data: json.data.map(x => x),
        total: parseInt(json.pagination.count, 10)
      };
    case GET_ONE:
      return {
        data: json.data
      };
    case CREATE:
      return { data: { ...params.data, id: json.data.id } };
    case UPDATE:
      return { data: { ...params.data } };
    default:
      return { data: json };
  }
};

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for response
 */
export default (type, resource, params) => {
  const { fetchJson } = fetchUtils;
  // simple-rest doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
  if (type === UPDATE_MANY) {
    return Promise.all(
      params.ids.map(id =>
        fetchUtils(`${API_URL}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data)
        })
      )
    ).then(responses => ({
      data: responses.map(response => response.json)
    }));
  }
  // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
  if (type === DELETE_MANY) {
    return Promise.all(
      params.ids.map(id =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: "DELETE",
          headers: getHeaders()
        }).then(response => response.json())
      )
    ).then(responses => {
      let errors = responses.filter(
        r =>
          r.data && r.data.code && (r.data.code === 409 || r.data.code === 403)
      );
      if (errors.length > 0) {
        throw new Error(errors.map(e => e.data.message).join("\n"));
      }

      return {
        data: responses.map(response =>
          convertHTTPResponseToDataProvider(response, type, resource, params)
        )
      };
    });
  }
  const { url, options } = convertDataProviderRequestToHTTP(
    type,
    resource,
    params
  );
  return fetchJson(url, options).then(response =>
    convertHTTPResponseToDataProvider(response, type, params)
  );
};
