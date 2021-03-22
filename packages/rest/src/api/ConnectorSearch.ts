import { ConnectorBase } from "./ConnectorBase";
import { ResultSet } from "./types";
import { buildError, handleAxiosError } from "./Errors";
import { AxiosResponse, AxiosError } from "axios";

/**
 * Standard jepria-rest Search RESTful API connector.
 * @example
 * let connector: ConnectorSearch<Dto> = new ConnectorSessionSearch("http://localhost:8080/feature/api/feature");
 */
export class ConnectorSearch<Dto> extends ConnectorBase {
  private axios = this.getAxios();

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
}
