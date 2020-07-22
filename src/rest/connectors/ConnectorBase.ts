import axios, { AxiosInstance } from 'axios';

export default class ConnectorBase {
  
  protected baseUrl: string;
  protected axiosInstance?: AxiosInstance;

  constructor(baseUrl: string, withCredentials = true, axiosInstance?: AxiosInstance) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axiosInstance;
    this.axiosInstance ? this.axiosInstance.defaults.withCredentials = withCredentials : axios.defaults.withCredentials = withCredentials;
  }

  protected getAxios = () => this.axiosInstance ? this.axiosInstance : axios;

}