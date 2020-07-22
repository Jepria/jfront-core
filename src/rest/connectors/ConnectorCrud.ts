import BaseConnector from './ConnectorBase';
import { SearchRequest } from '../types';

export default class ConnectorCrud<Dto, CreateDto, UpdateDto, SearchTemplate> extends BaseConnector {

  private axios = this.getAxios();

  create = (createDto: CreateDto, getRecordById = true): Promise<Dto | string> => {
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
                reject(response);
              }
            }).catch(error => reject(error));
          } else {
            resolve(location.substring(location.lastIndexOf('/') + 1));
          }
        } else {
          reject(response);
        }
      }).catch(error => reject(error));
    });
  }

  update = (id: string, updateDto: UpdateDto, getRecordById = true): Promise<Dto | void> => {
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
                reject(response);
              }
            }).catch(error => reject(error));
          } else {
            resolve();
          }
        } else {
          reject(response);
        }
      }).catch(error => reject(error));
    });
  }

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
        response.status === 200 ? resolve() : reject(response);
      }).catch(error => reject(error));
    })
  }


  postSearchRequest = (searchRequest: SearchRequest<SearchTemplate>) => {
    return new Promise<string>((resolve, reject) => {
      this.axios.post(
        this.baseUrl + '/search',
        searchRequest,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8',
            'X-Cache-Control': 'no-cache'
          }
        }
      ).then(response => {
        if (response.status === 201) {
          let location: string = response.headers['location'];
          resolve(location.split('/').pop());
        } else {
          reject(response);
        }
      }).catch(error => reject(error));
    });
  }

  search = (searchId: string, pageSize: number, page: number): Promise<Array<Dto>> => {
    return new Promise<Array<Dto>>((resolve, reject) => {
      this.axios.get(
        this.baseUrl + `/search/${searchId}/resultset?pageSize=${pageSize}&page=${page}`,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8',
            'Cache-Control': 'no-cache'
          }
        }
      ).then(response => {
        if (response.status === 200) {
          resolve(response.data);
        } else if (response.status === 204) {
          resolve([]);
        } else {
          reject(response);
        }
      }).catch(error => reject(error));
    });
  }

  getResultSetSize = (searchId: string): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      this.axios.get(
        this.baseUrl + `/search/${searchId}/resultset-size`,
        {
          headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8',
            'X-Cache-Control': 'no-cache'
          }
        }
      ).then(response => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(response);
        }
      }).catch(error => reject(error));
    });
  }

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
          reject(response);
        }
      }).catch(error => reject(error));
    });
  }

}