import { ConnectorBase } from './ConnectorBase';
import { SearchRequest, NetworkError } from '../types';
import { AxiosResponse, AxiosError } from 'axios';
/**
 * Обработка ошибки Axios.
 *
 * Axios error handling.
 * @param {AxiosError} error
 * @returns {NetworkError}
 */
export declare const handleAxiosError: (error: AxiosError) => NetworkError;
/**
 * Получение ошибки из ответа.
 *
 * Building error object from response.
 * @param AxiosResponse response
 */
export declare const buildError: (response: AxiosResponse) => NetworkError;
/**
 * Коннектор для подключения к стандартной реализации CRUD RESTful API jepria-rest.
 *
 * Standard jepria-rest CRUD RESTful API connector.
 * @example
 * let connector: ConnectorCrud<Dto, CreateDto, UpdateDto, Template> = new ConnectorCrud("http://localhost:8080/feature/api/feature");
 */
export declare class ConnectorCrud<Dto, CreateDto, UpdateDto, SearchTemplate> extends ConnectorBase {
    private axios;
    /**
     * Создание новой записи.
     *
     * Creating a new record.
     * @param {CreateDto} createDto record create DTO
     * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true).
     * @returns {Promise<Dto | string>} Promise with DTO or string ID of created record, if getRecordById===false
     */
    create: (createDto: CreateDto, getRecordById?: boolean) => Promise<Dto | string>;
    /**
     * Обновление записи.
     *
     * Record updating.
     * @param {string} id record primary id
     * @param {UpdateDto} updateDto record update DTO
     * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true).
     * @returns {Promise<Dto | void>} Promise with DTO or nothing if getRecordById===false
     */
    update: (id: string, updateDto: UpdateDto, getRecordById?: boolean) => Promise<Dto | void>;
    /**
     * Удаление записи.
     *
     * Record deletion.
     * @param {string} id record id
     */
    delete: (id: string) => Promise<void>;
    /**
     * Создание поискового запроса.
     *
     * Search request template creation.
     * @param {SearchRequest<SearchTemplate>} searchRequest search template
     * @param {string} cacheControl Cache-control header value
     */
    postSearchRequest: (searchRequest: SearchRequest<SearchTemplate>, cacheControl?: string) => Promise<string>;
    /**
     * Поисковый запрос.
     *
     * Search request.
     * @param {string} searchId search template id
     * @param {number} pageSize page size
     * @param {number} page page number
     * @param {string} cacheControl Cache-control header value
     */
    search: (searchId: string, pageSize: number, page: number, cacheControl?: string) => Promise<Array<Dto>>;
    /**
     * Получение количества найденых записей по поисковому запросу.
     *
     * Search resultset size request.
     * @param {string} searchId  search template id
     * @param {string} cacheControl Cache-control header value
     */
    getResultSetSize: (searchId: string, cacheControl?: string) => Promise<number>;
    /**
     * Получение записи по ключу.
     *
     * Get record by id.
     * @param {string} id record id
     */
    getRecordById: (id: string) => Promise<Dto>;
}
