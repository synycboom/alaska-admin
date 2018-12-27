import { baseUrl } from '../configs/conf';
import axios from 'axios';

export default class BaseService {
  constructor() {
    this.client = axios.create({
      baseURL: baseUrl,
    })
    this.client.interceptors.request.use(function (config) {
      const token = localStorage.getItem('token')

      if (token) {
        config.headers.Authorization = `Token ${token}`
      }
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
  }

  handleError = error => {
    if (error.response) {
      return Promise.reject(error.response.data)
    } else {
      console.log(error)
      return Promise.reject({detail: 'Something Error, please check logs.'})
    }
  }
}