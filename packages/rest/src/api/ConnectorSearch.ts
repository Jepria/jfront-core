import { ConnectorBase } from "./ConnectorBase";
import { SearchRequest } from "./types";
import { buildError, handleAxiosError } from "./Errors";
import { AxiosResponse, AxiosError } from "axios";

/**
 * Standard jepria-rest CRUD RESTful API connector.
 * @example
 * let connector: ConnectorCrud<Dto, CreateDto, UpdateDto, Template> = new ConnectorCrud("http://localhost:8080/feature/api/feature");
 */
export class ConnectorSearch<Dto, SearchTemplate> extends ConnectorBase {
  private axios = this.getAxios();

  /**
   * Search request template creation.
   * @param {SearchRequest<SearchTemplate>} searchRequest search template
   * @param {string} cacheControl Cache-control header value
   */
  postSearchRequest = (searchRequest: SearchRequest<SearchTemplate>, cacheControl: string = "no-cache") => {
    return new Promise<string>((resolve, reject) => {
      this.axios.post(
        this.baseUrl + "/search",
        searchRequest,
        {
          headers: {
            "Accept": "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Cache-Control": cacheControl,
          },
        },
      ).then((response: AxiosResponse<any>) => {
        if (response.status === 201) {
          let location: string = response.headers["location"];
          resolve(location.split("/").pop());
        } else {
          reject(buildError(response));
        }
      }).catch((error: AxiosError) => reject(handleAxiosError(error)));
    });
  };

  /**
   * Search request.
   * @param {string} searchId search template id
   * @param {number} pageSize page size
   * @param {number} page page number
   * @param {string} cacheControl Cache-control header value
   */
  search = (searchId: string, pageSize: number, page: number, cacheControl: string = "no-cache"): Promise<Array<Dto>> => {
    return new Promise<Array<Dto>>((resolve, reject) => {
      this.axios.get(
        this.baseUrl + `/search/${searchId}/resultset?pageSize=${pageSize}&page=${page}`,
        {
          headers: {
            "Accept": "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Cache-Control": cacheControl,
          },
        },
      ).then((response: AxiosResponse<any>) => {
        if (response.status === 200) {
          resolve(response.data);
        } else if (response.status === 204) {
          resolve([]);
        } else {
          reject(buildError(response));
        }
      }).catch((error: AxiosError) => reject(handleAxiosError(error)));
    });
  };

  /**
   * Search resultset size request.
   * @param {string} searchId  search template id
   * @param {string} cacheControl Cache-control header value
   */
  getResultSetSize = (searchId: string, cacheControl: string = "no-cache"): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      this.axios.get(
        this.baseUrl + `/search/${searchId}/resultset-size`,
        {
          headers: {
            "Accept": "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Cache-Control": cacheControl,
          },
        },
      ).then((response: AxiosResponse<any>) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(buildError(response));
        }
      }).catch((error: AxiosError) => reject(handleAxiosError(error)));
    });
  };
}
