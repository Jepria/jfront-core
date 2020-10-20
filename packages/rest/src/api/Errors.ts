import { AxiosError, AxiosResponse } from "axios";

import {
  ACCESS_DENIED,
  AUTHORIZATION_FAILED,
  BAD_REQUEST,
  NetworkError,
  NOT_FOUND,
  SERVER_ERROR,
  UNKNOWN_ERROR,
} from "./types";


/**
 * Building error object from response.
 * @param AxiosResponse response
 */
export const buildError = (response: AxiosResponse): NetworkError => {
  let error: NetworkError;
  switch (response.status) {
    case 400: {
      error = {
        type: BAD_REQUEST,
        constraintViolations: response.data,
      };
      break;
    }
    case 401: {
      error = {
        type: AUTHORIZATION_FAILED,
      };
      break;
    }
    case 403: {
      error = {
        type: ACCESS_DENIED,
        message: response.data || response.statusText,
      };
      break;
    }
    case 404: {
      error = {
        type: NOT_FOUND,
        url: response.config.url,
      };
      break;
    }
    case 500: {
      error = {
        type: SERVER_ERROR,
        error: response.data,
      };
      break;
    }
    default: {
      error = {
        type: UNKNOWN_ERROR,
        errorCode: response.status,
        message: response.statusText,
        content: response.data,
      };
      break;
    }
  }
  return error;
};

/**
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
};
