import { ConnectorBase } from './ConnectorBase';
import { SearchRequest, NetworkError, UNKNOWN_ERROR, BAD_REQUEST, NOT_FOUND, SERVER_ERROR, AUTHORIZATION_FAILED, ACCESS_DENIED } from '../types';
import { AxiosResponse, AxiosError } from 'axios';

/**
 * Обработка ошибки Axios.
 * 
 * Axios error handling.
 * @param {AxiosError} error 
 * @returns {NetworkError}
 */
export const handleAxiosError = (error: AxiosError): NetworkError => {
  if (error.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    return buildError(error.response);
  } else if (error.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    return { type: UNKNOWN_ERROR, message: error.message, content: error.request };
  } else {
    // Something happened in setting up the request and triggered an Error
    return { type: UNKNOWN_ERROR, message: error.message };
  }
}

/**
 * Получение ошибки из ответа.
 * 
 * Building error object from response.
 * @param AxiosResponse response 
 */
export const buildError = (response: AxiosResponse): NetworkError => {
  let error: NetworkError;
  switch (response.status) {
    case 400: {
      error = {
        type: BAD_REQUEST,
        constaintViolations: response.data
      }
      break;
    }
    case 401: {
      error = {
        type: AUTHORIZATION_FAILED
      }
      break;
    }
    case 403: {
      error = {
        type: ACCESS_DENIED,
        message: response.data || response.statusText
      }
      break;
    }
    case 404: {
      error = {
        type: NOT_FOUND,
        url: response.config.url
      }
      break;
    }
    case 500: {
      error = {
        type: SERVER_ERROR,
        error: response.data
      }
      break;
    }
    default: {
      error = {
        type: UNKNOWN_ERROR,
        errorCode: response.status,
        message: response.statusText,
        content: response.data
      }
      break;
    }
  }
  return error;
}

/**
 * Коннектор для подключения к стандартной реализации CRUD RESTful API jepria-rest.
 * 
 * Standard jepria-rest CRUD RESTful API connector.
 * @example 
 * let connector: ConnectorCrud<Dto, CreateDto, UpdateDto, Template> = new ConnectorCrud("http://localhost:8080/feature/api/feature");
 */
export class ConnectorCrud<Dto, CreateDto, UpdateDto, SearchTemplate> extends ConnectorBase {

  private axios = this.getAxios();

  /**
   * Создание новой записи.
   * 
   * Creating a new record.
   * @param {CreateDto} createDto record create DTO
   * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true). 
   * @returns {Promise<Dto | string>} Promise with DTO or string ID of created record, if getRecordById===false
   */
  create = (createDto: CreateDto, getRecordById: boolean = true): Promise<Dto | string> => {
    return new Promise<Dto | string>((resolve, reject) => {
      this.axios.post(
        this.baseUrl,
        createDto,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      ).then(response => {
        if (response.status === 201) {
          let location: string = response.headers['location'];
          if (getRecordById) {
            this.axios.get(
              location,
              {
                headers: {
                  'Accept': 'application/json;charset=utf-8',
                  'Content-Type': 'application/json;charset=utf-8'
                }
              }
            ).then(response => {
              if (response.status === 200) {
                resolve(response.data);
              } else {
                reject(buildError(response))
              }
            }).catch(error => reject(handleAxiosError(error)));
          } else {
            resolve(location.substring(location.lastIndexOf('/') + 1));
          }
        } else {
          reject(buildError(response))
        }
      }).catch(error => reject(handleAxiosError(error)));
    });
  }

  /**
   * Обновление записи.
   * 
   * Record updating.
   * @param {string} id record primary id
   * @param {UpdateDto} updateDto record update DTO
   * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true). 
   * @returns {Promise<Dto | void>} Promise with DTO or nothing if getRecordById===false
   */
  update = (id: string, updateDto: UpdateDto, getRecordById: boolean = true): Promise<Dto | void> => {
    return new Promise<Dto | void>((resolve, reject) => {
      this.axios.put(
        this.baseUrl + `/${id}`,
        updateDto,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      ).then(response => {
        if (response.status === 200) {
          if (getRecordById) {
            this.axios.get(
              this.baseUrl + `/${id}`,
              {
                headers: {
                  'Accept': 'application/json;charset=utf-8',
                  'Content-Type': 'application/json;charset=utf-8'
                }
              }
            ).then(response => {
              if (response.status === 200) {
                resolve(response.data);
              } else {
                reject(buildError(response))
              }
            }).catch(error => reject(handleAxiosError(error)));
          } else {
            resolve();
          }
        } else {
          reject(buildError(response))
        }
      }).catch(error => reject(handleAxiosError(error)));
    });
  }

  /**
   * Удаление записи.
   * 
   * Record deletion.
   * @param {string} id record id
   */
  delete = (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.axios.delete(
        this.baseUrl + `/${id}`,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      ).then(response => {
        response.status === 200 ? resolve() : reject(buildError(response))
      }).catch(error => reject(handleAxiosError(error)));
    })
  }

  /**
   * Создание поискового запроса.
   * 
   * Search request template creation.
   * @param {SearchRequest<SearchTemplate>} searchRequest search template
   * @param {string} cacheControl Cache-control header value
   */
  postSearchRequest = (searchRequest: SearchRequest<SearchTemplate>, cacheControl: string = 'no-cache') => {
    return new Promise<string>((resolve, reject) => {
      this.axios.post(
        this.baseUrl + '/search',
        searchRequest,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8',
            'Cache-Control': cacheControl
          }
        }
      ).then(response => {
        if (response.status === 201) {
          let location: string = response.headers['location'];
          resolve(location.split('/').pop());
        } else {
          reject(buildError(response))
        }
      }).catch(error => reject(handleAxiosError(error)));
    });
  }

  /**
   * Поисковый запрос.
   * 
   * Search request.
   * @param {string} searchId search template id
   * @param {number} pageSize page size
   * @param {number} page page number
   * @param {string} cacheControl Cache-control header value
   */
  search = (searchId: string, pageSize: number, page: number, cacheControl: string = 'no-cache'): Promise<Array<Dto>> => {
    return new Promise<Array<Dto>>((resolve, reject) => {
      this.axios.get(
        this.baseUrl + `/search/${searchId}/resultset?pageSize=${pageSize}&page=${page}`,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8',
            'Cache-Control': cacheControl
          }
        }
      ).then(response => {
        if (response.status === 200) {
          resolve(response.data);
        } else if (response.status === 204) {
          resolve([]);
        } else {
          reject(buildError(response))
        }
      }).catch(error => reject(handleAxiosError(error)));
    });
  }

  /**
   * Получение количества найденых записей по поисковому запросу.
   * 
   * Search resultset size request.
   * @param {string} searchId  search template id
   * @param {string} cacheControl Cache-control header value
   */
  getResultSetSize = (searchId: string, cacheControl: string = 'no-cache'): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      this.axios.get(
        this.baseUrl + `/search/${searchId}/resultset-size`,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8',
            'Cache-Control': cacheControl
          }
        }
      ).then(response => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(buildError(response))
        }
      }).catch(error => reject(handleAxiosError(error)));
    });
  }

  /**
   * Получение записи по ключу.
   * 
   * Get record by id.
   * @param {string} id record id
   */
  getRecordById = (id: string): Promise<Dto> => {
    return new Promise<Dto>((resolve, reject) => {
      this.axios.get(
        this.baseUrl + `/${id}`,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      ).then(response => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(buildError(response))
        }
      }).catch(error => reject(handleAxiosError(error)));
    });
  }

}