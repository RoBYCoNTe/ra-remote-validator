import getHeaders from "./authHeaders";

/**
 * Add required authorization headers necessary to work with  REST service.
 * @param {*} requestHandler
 */
const addAuthHeaderFeature = requestHandler => (type, resource, params) => {
  params.headers = getHeaders();
  return requestHandler(type, resource, params);
};

export default addAuthHeaderFeature;
