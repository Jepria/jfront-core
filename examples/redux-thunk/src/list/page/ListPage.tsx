import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/store/configureStore";
import { AppState } from "../../app/store/reducer";
import { actions as crudActions } from "../state/listCrudSlice";
import { getListOptions } from "../state/listOptionsSlice";
import { getListFilterOptions } from "../state/listFilterOptionsSlice";
import { search, postSearch } from "../state/listSearchSlice";
import { ComboBox, ComboBoxItem } from "@jfront/ui-combobox";

export const ListPage = () => {
  const dispatch = useAppDispatch();

  const { records, searchId, searchTemplate, isLoading } = useSelector(
    (state: AppState) => state.list.listSearchSlice,
  );
  const { selectedRecords, currentRecord } = useSelector(
    (state: AppState) => state.list.listCrudSlice,
  );
  const { options, isLoading: optionsIsLoading } = useSelector(
    (state: AppState) => state.list.listOptionsSlice,
  );
  const { options: filterOptions, isLoading: filterOptionsIsLoading } = useSelector(
    (state: AppState) => state.list.listFilterOptionsSlice,
  );

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

  useEffect(() => {
    dispatch(getListOptions());
  }, []);

  useEffect(() => {
    dispatch(getListFilterOptions(""));
  }, []);

  return (
    <>
      <div>
        {optionsIsLoading && <span>Loading</span>}
        <select>
          {options.map((option) => {
            return <option>{option}</option>;
          })}
        </select>
        <ComboBox onInputChange={(text) => dispatch(getListFilterOptions(text.target.value))}>
          {filterOptions.map((option) => (
            <ComboBoxItem label={option} value={option} />
          ))}
        </ComboBox>
      </div>
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
