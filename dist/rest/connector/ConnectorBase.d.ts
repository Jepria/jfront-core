import { AxiosInstance } from 'axios';
/**
 * Базовый сетевой коннектор.
 *
 * Basic network connector.
 * @example
 * class GetConnection extends ConnectorBase {
 *  get = () => this.getAxios().get(this.baseUrl + "/test");
 * }
 * const connection: GetConnection = new GetConnection("http://localhost:8080/api");
 * connection.get().then(response => console.log(response.data)).catch(error => {throw new Error(error.message)});
 */
export declare class ConnectorBase {
    /**
     * @type {string} Basic URL.
     *
     */
    protected baseUrl: string;
    /**
     * @type {AxiosInstance} axios instance.
     */
    private axiosInstance;
    /**
     * @param baseUrl basic URL
     * @param withCredentials allows to pass credentials to CORS requests
     * @param axiosInstance customized axios instance (передавайте собственный instance (axios.create({...})),
     * если собираетесь задавать ему дополнительные настройки, в противном случае они применятся на глобальный статический instance, что может привести к фатальным ошибкам)
     */
    constructor(baseUrl: string, withCredentials?: boolean, axiosInstance?: AxiosInstance);
    /**
     * get current axios instance
     */
    protected getAxios: () => AxiosInstance;
}
