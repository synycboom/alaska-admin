import { baseUrl } from '../configs/conf';
import axios from 'axios';

export default class BaseService {
  constructor() {
    this.client = axios.create({
      baseURL: baseUrl
    });
    this.client.interceptors.request.use(
      function(config) {
        // Use cooke instead of token
        // const token = localStorage.getItem('token');

        // if (token) {
        //   config.headers.Authorization = `Token ${token}`;
        // }
        config.withCredentials = true;
        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
    );
  }

  handleError = error => {
    if (error.response) {
      return Promise.reject({
        ...error.response.data,
        __meta__: {
          status: error.response.status
        }
      });
    } else {
      console.log(error);
      return Promise.reject({ detail: 'Something Error, please check logs.' });
    }
  };
}
