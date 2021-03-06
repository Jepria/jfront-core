import { ConnectorCrud, ResultSet } from "@jfront/core-rest";
import { Item } from "../types";
import namor from "namor";
import { ConnectorSearch, SearchRequest } from "@jfront/core-rest";
import { SearchTemplate } from "./ListTypes";

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

export class ListSearchApi extends ConnectorSearch<Item> {
  /**
   * Search request.
   * @param {string} query query string
   * @param {string} cacheControl Cache-control header value
   */
  search = (query: string, cacheControl?: string): Promise<ResultSet<Item>> => {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams(query);
      const name = params.get("name") || "";
      const result = findByName(name);
      resolve({
        resultsetSize: result.length,
        data: result,
      });
    });
  };
}

export class ListCrudApi extends ConnectorCrud<Item, string, Item, Item> {
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
      const result = findByValue(id);
      if (result) {
        resolve(result);
      } else {
        reject();
      }
    });
  };
}
