/* eslint-disable */
import axios from "axios";
import store from "@src/store/Store";

// Config
const api_url      = import.meta.env.VITE_API_URL;
const api_version  = import.meta.env.VITE_API_VERSION;
const is_dev_mode  = import.meta.env.DEV;
const is_prod_mode = import.meta.env.PROD;

// From data methods
const form_data_methods = ['post', 'put'];

// Create a instance of axios
const $axios = axios.create({baseURL: `${api_url}/${api_version}/`});

/**
 * Pre config of axios request
 */
$axios.interceptors.request.use((config) => {
    const token = store.user.getToken();
    if (token) {
      // Add auth token to headers
      const headers = {
        "Authorization": `Bearer ${token}`,
      };
      config.headers = {...config.headers, ...headers};
    }

    // If post or put method - need to send FormData() instance
    if (form_data_methods.includes(config.method)) {
      const formData = new FormData();
      const data     = config.data;

      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key].forEach(function (item) {
            formData.append(key + "[]", item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      if (!!token) {
        formData.append('token', token);
      }
      config.data = formData;
    }
    return config;
  },
  error => Promise.reject(error),
);

/**
 * Pre config of axios response
 */
$axios.interceptors.response.use((response) =>
  response,
  async (error) => {
    if (is_dev_mode) {
      console.log(error);
    }
    return Promise.reject(error);
  },
);

const { get, post, put, delete: destroy } = $axios;
export { get, post, put, destroy };

// export default $axios;
