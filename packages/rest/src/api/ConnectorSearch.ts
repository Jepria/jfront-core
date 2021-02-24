import { ConnectorBase } from "./ConnectorBase";
import { ResultSet, SearchRequest } from "./types";
import { buildError, handleAxiosError } from "./Errors";
import { AxiosResponse, AxiosError } from "axios";

/**
 * Standard jepria-rest Search RESTful API connector.
 * @example
 * let connector: ConnectorSearch<Dto, SearchTemplate> = new ConnectorSearch("http://localhost:8080/feature/api/feature");
 */
export class ConnectorSearch<Dto, SearchTemplate> extends ConnectorBase {
  private axios = this.getAxios();

  /**
   * Search request template creation.
   * @param {SearchRequest<SearchTemplate>} searchRequest search template
   * @param {string} cacheControl Cache-control header value
   */
  postSearchRequest = (searchRequest: SearchRequest<SearchTemplate>, cacheControl = "no-cache") => {
    return new Promise<string>((resolve, reject) => {
      this.axios
        .post(this.baseUrl + "/search", searchRequest, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Cache-Control": cacheControl,
          },
        })
        .then((response: AxiosResponse<any>) => {
          if (response?.status === 201) {
            const location: string = response.headers["location"];
            resolve(location.split("/").pop() as string);
          } else {
            reject(buildError(response));
          }
        })
        .catch((error: AxiosError) => reject(handleAxiosError(error)));
    });
  };

  /**
   * Search values by query
   * @param {string} query search query string e.g. "field1=text1&field2=text2"
   * @param {string} cacheControl Cache-control header value
   */
  search = (query: string, cacheControl = "no-cache"): Promise<ResultSet<Dto>> => {
    return new Promise<ResultSet<Dto>>((resolve, reject) => {
      this.axios
        .get(this.baseUrl + `/search?${query}`, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Cache-Control": cacheControl,
          },
        })
        .then((response: AxiosResponse<any>) => {
          if (response?.status === 200) {
            resolve(response.data);
          } else {
            reject(buildError(response));
          }
        })
        .catch((error: AxiosError) => reject(handleAxiosError(error)));
    });
  };

  /**
   * Get resultset by searchId.
   * @param {string} searchId search template id
   * @param {number} pageSize page size
   * @param {number} page page number
   * @param {string} cacheControl Cache-control header value
   */
  getResultSet = (
    searchId: string,
    pageSize: number,
    page: number,
    cacheControl = "no-cache",
  ): Promise<Array<Dto>> => {
    return new Promise<Array<Dto>>((resolve, reject) => {
      this.axios
        .get(this.baseUrl + `/search/${searchId}/resultset?pageSize=${pageSize}&page=${page}`, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Cache-Control": cacheControl,
          },
        })
        .then((response: AxiosResponse<any>) => {
          if (response?.status === 200) {
            resolve(response.data);
          } else if (response?.status === 204) {
            resolve([]);
          } else {
            reject(buildError(response));
          }
        })
        .catch((error: AxiosError) => reject(handleAxiosError(error)));
    });
  };

  /**
   * Search resultset size request.
   * @param {string} searchId  search template id
   * @param {string} cacheControl Cache-control header value
   */
  getResultSetSize = (searchId: string, cacheControl = "no-cache"): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      this.axios
        .get(this.baseUrl + `/search/${searchId}/resultset-size`, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Cache-Control": cacheControl,
          },
        })
        .then((response: AxiosResponse<any>) => {
          if (response?.status === 200) {
            resolve(response.data);
          } else {
            reject(buildError(response));
          }
        })
        .catch((error: AxiosError) => reject(handleAxiosError(error)));
    });
  };
}
