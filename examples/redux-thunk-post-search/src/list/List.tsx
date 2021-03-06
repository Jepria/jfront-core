import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../app/store/reducer";
import { ListPage } from "./page/ListPage";
import { getResultSet, postSearch } from "./state/listSearchSlice";
import { useFormik } from "formik";
import namor from "namor";
import { createRecord, deleteRecord } from "./state/listCrudSlice";
import { useAppDispatch } from "../app/store/configureStore";

export const List = () => {
  const { searchId, searchRequest } = useSelector((state: AppState) => state.list.listSearchSlice);
  const { selectedRecords, currentRecord } = useSelector(
    (state: AppState) => state.list.listCrudSlice,
  );
  const dispatch = useAppDispatch();
  const formik = useFormik<{ name: string }>({
    enableReinitialize: true,
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      dispatch(postSearch({ template: { name: values.name } }, 0, 0));
    },
  });

  const dispatchSearch = () => {
    if (searchId) {
      dispatch(getResultSet(searchId, 0, 0));
    } else if (searchRequest) {
      dispatch(postSearch(searchRequest, 0, 0));
    } else {
      dispatch(postSearch({ template: { name: "" } }, 0, 0));
    }
  };

  return (
    <section>
      <nav>
        <form
          onSubmit={formik.handleSubmit}
          style={{ padding: 0, margin: 0, display: "inline-flex", flexDirection: "row" }}
        >
          <label>
            name: <input name="name" value={formik.values.name} onChange={formik.handleChange} />
          </label>
          <button type="submit" style={{ margin: "5px" }}>
            Filter
          </button>
          <button
            type="button"
            style={{ margin: "5px" }}
            onClick={() => {
              dispatch(
                createRecord({
                  name: namor.generate({ words: 1, numbers: 0 }),
                  value: namor.generate({ words: 1, numbers: 0 }),
                }),
              ).then(() => {
                dispatchSearch();
              });
            }}
          >
            Add
          </button>
          <button
            type="button"
            style={{ margin: "5px" }}
            disabled={!currentRecord && selectedRecords.length === 0}
            onClick={() => {
              dispatch(deleteRecord(selectedRecords.map((record) => record.value))).then(() => {
                dispatchSearch();
              });
            }}
          >
            Remove
          </button>
        </form>
      </nav>
      <ListPage />
    </section>
  );
};
