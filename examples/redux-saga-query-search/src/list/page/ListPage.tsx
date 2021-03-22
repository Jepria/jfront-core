import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../app/store/reducer";
import { actions as crudActions } from "../state/listCrudSlice";
import { actions as searchActions } from "../state/listSearchSlice";
import { actions as optionActions } from "../state/listOptionsSlice";
import { actions as filterOptionActions } from "../state/listFilterOptionsSlice";
import { ComboBox, ComboBoxItem } from "@jfront/ui-combobox";

export const ListPage = () => {
  const { records, isLoading, searchRequest } = useSelector(
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
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (records.length === 0) {
      dispatchSearch();
    }
  }, []);

  useEffect(() => {
    dispatch(optionActions.getOptionsStart({}));
  }, []);

  useEffect(() => {
    dispatch(filterOptionActions.getOptionsStart({ params: "" }));
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
        <ComboBox
          onInputChange={(text) =>
            dispatch(filterOptionActions.getOptionsStart({ params: [text.target.value] }))
          }
        >
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
                    dispatch(crudActions.selectRecords({ selectedRecords: [record] }));
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
