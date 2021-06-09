import { ConnectorSearch, ResultSet } from "@jfront/core-rest";
import { configureStore } from "@reduxjs/toolkit";
import { SearchState } from "../src/types";
import { createSearchSlice } from "../src/slice/createSearchSlice";

interface Item {
  name: string;
  value: string;
}

interface SearchTemplateTest {
  name: string;
}

const items: Item[] = [
  { name: "a", value: "1" },
  { name: "b", value: "2" },
  { name: "c", value: "3" },
];

class SearchApi extends ConnectorSearch<Item> {
  search = (query: string): Promise<ResultSet<Item>> => {
    return new Promise((resolve, reject) => {
      resolve({
        resultsetSize: items.length,
        data: items,
      });
    });
  };
}
const api = new SearchApi("");

describe("searchSlice", () => {
  beforeEach(() => {});
  const initialSearchState: SearchState<SearchTemplateTest, Item> = {
    isLoading: false,
    pageSize: 25,
    pageNumber: 1,
    records: [],
  };

  const slice = createSearchSlice<SearchTemplateTest, Item>({
    name: "listSlice",
    initialState: initialSearchState,
  });

  const thunkCreators = slice.thunk;
  const reducer = slice.reducer;
  const search = thunkCreators.searchThunk(api);

  it("search without sort", () => {
    const store = configureStore({
      reducer: reducer,
      preloadedState: initialSearchState,
    });

    const dispatch = store.dispatch;

    const pageSize = 25;
    const pageNumber = 1;
    const searchRequest = { template: { name: "asd" } };
    dispatch(search(searchRequest, pageSize, pageNumber)).then(() => {
      expect(store.getState().records).toEqual(items);
      expect(store.getState().resultSetSize).toEqual(items.length);
      expect(store.getState().pageNumber).toEqual(pageNumber);
      expect(store.getState().pageSize).toEqual(pageSize);
      expect(store.getState().searchRequest).toEqual(searchRequest);
    });
  });

  it("search with sort", () => {
    const store = configureStore({
      reducer: reducer,
      preloadedState: initialSearchState,
    });

    const dispatch = store.dispatch;
    const pageSize = 25;
    const pageNumber = 1;
    const searchRequest = {
      template: { name: "asd" },
      listSortConfiguration: [
        { columnName: "name", sortOrder: "asc" },
        { columnName: "value", sortOrder: "desc" },
      ],
    };
    dispatch(search(searchRequest, pageSize, pageNumber)).then(() => {
      expect(store.getState().records).toEqual(items);
      expect(store.getState().resultSetSize).toEqual(items.length);
      expect(store.getState().pageNumber).toEqual(pageNumber);
      expect(store.getState().pageSize).toEqual(pageSize);
      expect(store.getState().searchRequest).toEqual(searchRequest);
    });
  });
});
