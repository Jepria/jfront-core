import { AxiosInstance } from 'axios';
export declare class ConnectorBase {
    protected baseUrl: string;
    protected axiosInstance?: AxiosInstance;
    constructor(baseUrl: string, withCredentials?: boolean, axiosInstance?: AxiosInstance);
    protected getAxios: () => AxiosInstance;
}
