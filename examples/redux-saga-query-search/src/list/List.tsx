import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../app/store/reducer";
import { ListPage } from "./page/ListPage";
import { actions as crudActions } from "./state/listCrudSlice";
import { actions as searchActions } from "./state/listSearchSlice";
import { useFormik } from "formik";
import namor from "namor";

export const List = () => {
  const { searchRequest } = useSelector((state: AppState) => state.list.listSearchSlice);
  const { selectedRecords, currentRecord } = useSelector(
    (state: AppState) => state.list.listCrudSlice,
  );
  const dispatch = useDispatch();
  const formik = useFormik<{ name: string }>({
    enableReinitialize: true,
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      dispatch(
        searchActions.search({
          searchTemplate: {
            template: {
              name: values.name,
            },
          },
          pageSize: 0,
          pageNumber: 0,
        }),
      );
    },
  });

  const dispatchSearch = () => {
    dispatch(
      searchActions.search({
        searchTemplate: {
          template: {
            name: "",
            ...searchRequest?.template,
          },
        },
        pageSize: 0,
        pageNumber: 0,
      }),
    );
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
                crudActions.create({
                  values: {
                    name: namor.generate({ words: 1, numbers: 0 }),
                    value: namor.generate({ words: 1, numbers: 0 }),
                  },
                  onSuccess: () => {
                    dispatchSearch();
                  },
                }),
              );
            }}
          >
            Add
          </button>
          <button
            type="button"
            style={{ margin: "5px" }}
            disabled={!currentRecord && selectedRecords.length === 0}
            onClick={() => {
              const primaryKeys = selectedRecords.map((record) => record.value);
              dispatch(
                crudActions.delete({
                  primaryKeys,
                  onSuccess: () => {
                    dispatchSearch();
                  },
                }),
              );
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
