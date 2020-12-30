import { ConnectorCrud } from "@jfront/core-rest";
import { Item } from "../types";
import namor from "namor";
import { ConnectorSearch, SearchRequest } from "@jfront/core-rest";

const makeData = (length: number) => {
  const arr: Item[] = [];
  for (let i = 0; i < length; i++) {
    arr.push({
      name: namor.generate({ words: 1, numbers: 0 }),
      value: namor.generate({ words: 1, numbers: 0 }),
    });
  }
  return arr;
};

const items: Item[] = makeData(20);

const findByValue = (value: string) => {
  return items.find((record) => record.value === value);
};

export const findByName = (name: string) => {
  return items.filter((record) => record.name.startsWith(name));
};

const deleteItem = (value: string) => {
  const item = findByValue(value);
  if (item) {
    items.splice(items.indexOf(item), 1);
  }
};

const addItem = (value: Item) => {
  items.push(value);
};

export class ListSearchApi extends ConnectorSearch<Item, string> {
  private searchMap = new Map<string, string>();

  /**
   * Search request template creation.
   * @param {SearchRequest<SearchTemplate>} searchRequest search template
   * @param {string} cacheControl Cache-control header value
   */
  postSearchRequest = (
    searchRequest: SearchRequest<string>,
    cacheControl?: string,
  ): Promise<string> => {
    return new Promise((resolve) => {
      const searchId = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5);
      this.searchMap.set(searchId, searchRequest.template);
      resolve(searchId);
    });
  };
  /**
   * Search request.
   * @param {string} searchId search template id
   * @param {number} pageSize page size
   * @param {number} page page number
   * @param {string} cacheControl Cache-control header value
   */
  search = (
    searchId: string,
    pageSize: number,
    page: number,
    cacheControl?: string,
  ): Promise<Array<Item>> => {
    return new Promise((resolve, reject) => {
      const searchTemplate = this.searchMap.get(searchId);
      if (searchTemplate !== undefined) {
        resolve(findByName(searchTemplate));
      } else {
        throw new Error("no template");
      }
    });
  };
  /**
   * Search resultset size request.
   * @param {string} searchId  search template id
   * @param {string} cacheControl Cache-control header value
   */
  getResultSetSize = (searchId: string, cacheControl?: string): Promise<number> => {
    return new Promise((resolve) => {
      resolve(items.length);
    });
  };
}

export class ListCrudApi extends ConnectorCrud<Item, Item, Item> {
  /**
   * Creating a new record.
   * @param {CreateDto} createDto record create DTO
   * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true).
   * @returns {Promise<Dto | string>} Promise with DTO or string ID of created record, if getRecordById===false
   */
  create = (createDto: Item, getRecordById?: boolean): Promise<Item | string> => {
    return new Promise((resolve, reject) => {
      addItem(createDto);
      resolve(createDto);
    });
  };
  /**
   * Record updating.
   * @param {string} id record primary id
   * @param {UpdateDto} updateDto record update DTO
   * @param {boolean} getRecordById optional flag, if true getRecordById will be called after create (default true).
   * @returns {Promise<Dto | void>} Promise with DTO or nothing if getRecordById===false
   */
  update = (id: string, updateDto: Item, getRecordById?: boolean): Promise<Item | void> => {
    throw new Error("not supported");
  };
  /**
   * Record deletion.
   * @param {string} id record id
   */
  delete = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      deleteItem(id);
      resolve();
    });
  };
  /**
   * Get record by id.
   * @param {string} id record id
   */
  getRecordById = (id: string): Promise<Item> => {
    return new Promise((resolve, reject) => {
      resolve(findByValue(id) as Item);
    });
  };
}
