import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/store/configureStore";
import { AppState } from "../../app/store/reducer";
import { actions as crudActions } from "../state/listCrudSlice";
import { search, postSearch } from "../state/listSearchSlice";

export const ListPage = () => {
  const { records, searchId, searchTemplate, isLoading } = useSelector(
    (state: AppState) => state.list.listSearchSlice,
  );
  const { selectedRecords, currentRecord } = useSelector(
    (state: AppState) => state.list.listCrudSlice,
  );
  const dispatch = useAppDispatch();

  const dispatchSearch = () => {
    if (searchId) {
      dispatch(
        search({
          searchId: searchId,
          pageSize: 0,
          page: 0,
        }),
      );
    } else if (searchTemplate) {
      dispatch(
        postSearch({
          searchTemplate,
          pageSize: 0,
          page: 0,
        }),
      );
    } else {
      dispatch(
        postSearch({
          searchTemplate: {
            template: "",
          },
          pageSize: 0,
          page: 0,
        }),
      );
    }
  };

  useEffect(() => {
    if (records.length === 0) {
      dispatchSearch();
    }
  }, []);

  return (
    <>
      {isLoading && <span>Loading</span>}
      {!isLoading && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.value}
                style={
                  selectedRecords.includes(record) || currentRecord === record
                    ? { backgroundColor: "lightgray" }
                    : { backgroundColor: "transparent" }
                }
                onClick={(e) => {
                  if (e.ctrlKey) {
                    if (selectedRecords.includes(record)) {
                      const newRecords = [...selectedRecords].splice(
                        selectedRecords.indexOf(record),
                        1,
                      );
                      dispatch(crudActions.selectRecords({ selectedRecords: [...newRecords] }));
                    } else {
                      dispatch(
                        crudActions.selectRecords({
                          selectedRecords: [...selectedRecords, record],
                        }),
                      );
                    }
                  } else {
                    dispatch(crudActions.setCurrentRecord({ currentRecord: record }));
                  }
                }}
              >
                <td>{record.name}</td>
                <td>{record.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
