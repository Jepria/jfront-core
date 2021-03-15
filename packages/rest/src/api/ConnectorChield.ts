import { AxiosInstance } from "axios";
import { ConnectorBase } from "./ConnectorBase";
import { buildError, handleAxiosError } from "./Errors";

/**
 * Standard jepria-rest CRUD RESTful API connector.
 * @example
 * let connector: ConnectorChield<Dto, CreateDto, UpdateDto> = new ConnectorChield("http://localhost:8080/feature/api/feature");
 */
export class ConnectorChield<
  Dto,
  PrimaryKey = string,
  CreateDto = Dto,
  UpdateDto = Dto
> extends ConnectorBase {
  private axios = this.getAxios();
  constructor(baseUrl: string, withCredentials = true, axiosInstance?: AxiosInstance) {
    super(baseUrl, withCredentials, axiosInstance);
  }

  /**
   * Creating a new record.
   * @param {CreateDto} createDto record create DTO
   * @param {string} path path e.g. feature/1/feature-process/
   * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true).
   * @returns {Promise<Dto | string>} Promise with DTO or string ID of created record, if getRecordById===false
   */
  create = (createDto: CreateDto, path: string, getRecordById = true): Promise<Dto | string> => {
    return new Promise<Dto | string>((resolve, reject) => {
      this.axios
        .post(`${this.baseUrl}/${path}`, createDto, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
          },
        })
        .then((response) => {
          if (response?.status === 201) {
            const location: string = response.headers["location"];
            if (getRecordById) {
              this.axios
                .get(location, {
                  headers: {
                    Accept: "application/json;charset=utf-8",
                    "Content-Type": "application/json;charset=utf-8",
                  },
                })
                .then((response) => {
                  if (response?.status === 200) {
                    resolve(response.data);
                  } else {
                    reject(buildError(response));
                  }
                })
                .catch((error) => reject(handleAxiosError(error)));
            } else {
              resolve(location.substring(location.lastIndexOf("/") + 1));
            }
          } else {
            reject(buildError(response));
          }
        })
        .catch((error) => reject(handleAxiosError(error)));
    });
  };

  /**
   * Record updating.
   * @param {PrimaryKey} id record primary id
   * @param {UpdateDto} updateDto record update DTO
   * @param {string} path path e.g. feature/1/feature-process/
   * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true).
   * @returns {Promise<Dto | void>} Promise with DTO or nothing if getRecordById===false
   */
  update = (
    id: PrimaryKey,
    updateDto: UpdateDto,
    path: string,
    getRecordById = true,
  ): Promise<Dto | void> => {
    return new Promise<Dto | void>((resolve, reject) => {
      this.axios
        .put(`${this.baseUrl}/${path}/${id}`, updateDto, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
          },
        })
        .then((response) => {
          if (response?.status === 200) {
            if (getRecordById) {
              this.axios
                .get(this.baseUrl + `/${id}`, {
                  headers: {
                    Accept: "application/json;charset=utf-8",
                    "Content-Type": "application/json;charset=utf-8",
                  },
                })
                .then((response) => {
                  if (response?.status === 200) {
                    resolve(response.data);
                  } else {
                    reject(buildError(response));
                  }
                })
                .catch((error) => reject(handleAxiosError(error)));
            } else {
              resolve();
            }
          } else {
            reject(buildError(response));
          }
        })
        .catch((error) => reject(handleAxiosError(error)));
    });
  };

  /**
   * Record deletion.
   * @param {string} id record id
   * @param {string} path path e.g. feature/1/feature-process/
   */
  delete = (id: PrimaryKey, path: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.axios
        .delete(`${this.baseUrl}/${path}/${id}`, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
          },
        })
        .then((response) => {
          response?.status === 200 ? resolve() : reject(buildError(response));
        })
        .catch((error) => reject(handleAxiosError(error)));
    });
  };

  /**
   * Get record by id.
   * @param {string} id record id
   * @param {string} path path e.g. feature/1/feature-process/
   */
  getRecordById = (id: PrimaryKey, path: string): Promise<Dto> => {
    return new Promise<Dto>((resolve, reject) => {
      this.axios
        .get(`${this.baseUrl}/${path}/${id}`, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
          },
        })
        .then((response) => {
          if (response?.status === 200) {
            resolve(response.data);
          } else {
            reject(buildError(response));
          }
        })
        .catch((error) => reject(handleAxiosError(error)));
    });
  };

  /**
   * Get all records by parent ID.
   * @param {string} id record id
   * @param {string} path path e.g. feature/1/feature-process/
   */
  getAll = (path: string): Promise<Dto[]> => {
    return new Promise<Dto[]>((resolve, reject) => {
      this.axios
        .get(`${this.baseUrl}/${path}`, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
          },
        })
        .then((response) => {
          if (response?.status === 200) {
            resolve(response.data);
          } else {
            reject(buildError(response));
          }
        })
        .catch((error) => reject(handleAxiosError(error)));
    });
  };
}
