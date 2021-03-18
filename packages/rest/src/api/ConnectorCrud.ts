import { ConnectorBase } from "./ConnectorBase";
import { buildError, handleAxiosError } from "./Errors";

/**
 * Standard jepria-rest CRUD RESTful API connector.
 * @example
 * let connector: ConnectorCrud<Dto, CreateDto, UpdateDto> = new ConnectorCrud("http://localhost:8080/feature/api/feature");
 */
export class ConnectorCrud<
  Dto,
  PrimaryKey = string,
  CreateDto = Dto,
  UpdateDto = Dto
> extends ConnectorBase {
  private axios = this.getAxios();

  /**
   * Creating a new record.
   * @param {CreateDto} createDto record create DTO
   * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true).
   * @returns {Promise<Dto | string>} Promise with DTO or string ID of created record, if getRecordById===false
   */
  create = (createDto: CreateDto, getRecordById = true): Promise<Dto | string> => {
    return new Promise<Dto | string>((resolve, reject) => {
      this.axios
        .post(this.baseUrl, createDto, {
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
   * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true).
   * @returns {Promise<Dto | void>} Promise with DTO or nothing if getRecordById===false
   */
  update = (id: PrimaryKey, updateDto: UpdateDto, getRecordById = true): Promise<Dto | void> => {
    return new Promise<Dto | void>((resolve, reject) => {
      this.axios
        .put(this.baseUrl + `/${id}`, updateDto, {
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
   */
  delete = (id: PrimaryKey): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.axios
        .delete(this.baseUrl + `/${id}`, {
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
   */
  getRecordById = (id: PrimaryKey): Promise<Dto> => {
    return new Promise<Dto>((resolve, reject) => {
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
    });
  };
}
