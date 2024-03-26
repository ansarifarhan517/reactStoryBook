import { useDispatch } from "react-redux";
import React, { Dispatch } from "react";
import {
  TextInput,
  FontIcon,
  MultiSelect,
  tMultiSelectChildren,
  IMultiSelectOptions,
  NumberInput,
} from "ui-library";
import { Cell } from "react-table";
import styled from "styled-components";
import { useTypedSelector } from "../../../../../../../utils/redux/rootReducer";
import { IAllAddressListActions } from "../../redux/action";
import useDebounce from "../../../../../../../utils/useDebounce";

interface IMultiSelect {
  isMenuOpen?: boolean;
}

export const StyledMultiSelect = styled.div<IMultiSelect>`
  position: relative;
  width: 100%;
  display: flex;
  .multiselct-input {
    padding-right: 21px;
    background-color: #fff;
  }
`;

const ALL_ADDRESSES_INLINE_EDITABLE_CELL_MAPPING = {
  default: ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<IAllAddressListActions>>();
    const editDetails = useTypedSelector(
      (state) => state.all_addresses.listView.inlineEdits
    );
    const columnStructure = useTypedSelector(
      (state) => state.all_addresses.listView.columnStructure
    );
    const lastUpdatedCell = useTypedSelector(
      (state) => state.all_addresses.listView.lastUpdatedCell
    );
    const error = useTypedSelector(
      (state) =>
        state.all_addresses.listView.inlineEdits?.[row.original.clientNodeId]?.[
          column.id
        ]?.hasError
    );

    const [inputVal, setInputVal] = React.useState(value);
    const debouncedValue = useDebounce(inputVal, 500);
    React.useEffect(() => {
      if (value !== debouncedValue) {
        dispatch({
          type: "@@ALL_ADDRESSES/SET_INLINE_EDITS",
          payload: {
            rowId: row?.original?.clientNodeId,
            columnId: column.id,
            value: debouncedValue,
            hasError: false,
          },
        });
      }
    }, [debouncedValue]);

    return (
      <TextInput
        id={`editableCell-${row.id}-${column.id}`}
        fullWidth
        autoFocus={
          `${row.original.clientNodeId}-${column.id}` === lastUpdatedCell
        }
        defaultValue={
          editDetails?.[row.original.clientNodeId]?.[column.id]
            ? editDetails?.[row.original.clientNodeId]?.[column.id]?.value || ""
            : value
        }
        error={error}
        variant="inline-edit"
        maxLength={Number(
          columnStructure[column.id]?.validation?.maxlength?.args || 100
        )}
        onChange={React.useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setInputVal(value);
          },
          [setInputVal]
        )}
      />
    );
  },
  serviceTimeInMins: ({ row, column, value }: Cell<any>) => {
    const dispatch = useDispatch<Dispatch<IAllAddressListActions>>();
    const editDetails = useTypedSelector(
      (state) => state.all_addresses.listView.inlineEdits
    );
    const [inputVal, setInputVal] = React.useState<number>(value);
    const lastUpdatedCell = useTypedSelector(
      (state) => state.all_addresses.listView.lastUpdatedCell
    );
    const debouncedValue = useDebounce(inputVal, 500);
    React.useEffect(() => {
      if (value !== debouncedValue) {
        dispatch({
          type: "@@ALL_ADDRESSES/SET_INLINE_EDITS",
          payload: {
            rowId: row?.original?.clientNodeId,
            columnId: column.id,
            value: parseInt(debouncedValue),
            hasError: false,
          },
        });
      }
    }, [debouncedValue]);

    return (
      <NumberInput
        id={`editableCell-${row.id}-${column.id}`}
        autoFocus={
          `${row.original.clientNodeId}-${column.id}` ===
          lastUpdatedCell
        }
        fullWidth
        defaultValue={
          editDetails?.[row.original.clientNodeId]?.[column.id]
            ? editDetails?.[row.original.clientNodeId]?.[column.id]
                ?.value || ""
            : inputVal
        }
        type="number"
        error={
          editDetails?.[row.original.clientNodeId]?.[column.id]
            ?.hasError
        }
        variant="inline-edit"
        onChange={React.useCallback(
          (_value: any) => {
            setInputVal(_value);
          },
          [setInputVal]
        )}
      />
    );
  },
  weeklyOffString: ({ row, column, value }: Cell<any>) => {
    const weekDays = useTypedSelector(
      (state) => state.all_addresses.listView.weekDays
    );
    const inlineEditsData = useTypedSelector(
      (state) =>
        state.all_addresses?.listView.inlineEdits[row.original.clientNodeId]?.[
          column.id
        ]?.value
    );
    const lastUpdatedCell = useTypedSelector(
      (state) => state.all_addresses.listView.lastUpdatedCell
    );

    const dispatch = useDispatch<Dispatch<IAllAddressListActions>>();
    const optionList = React.useMemo(() => {
      return weekDays as any;
    }, [weekDays]);

    const listofWeeklyOff = React.useMemo(() => {
      const selectionString = inlineEditsData || value;
      return selectionString
        ?.split(",")
        .map((day) => optionList.find((eachDay) => eachDay.label === day));
    }, [value, inlineEditsData, optionList]);

    const [selectedOption, setSelectedOption] = React.useState<
      IMultiSelectOptions[] | undefined
    >(listofWeeklyOff);
    const displayOptions = React.useRef<string | undefined>();

    return (
      <MultiSelect
        options={optionList}
        onMenuClose={() => {
          dispatch({
            type: "@@ALL_ADDRESSES/SET_INLINE_EDITS",
            payload: {
              rowId: row?.original?.clientNodeId,
              columnId: column.id,
              value: displayOptions.current,
              hasError: false,
            },
          });
        }}
        onChange={(_event, _value, _isSelected, selectedOptionParam: any) => {
          setSelectedOption(selectedOptionParam);
          displayOptions.current = selectedOptionParam
            ?.map((o: any) => o.label)
            .join(",");
        }}
        style={{
          position: "absolute",
          top: "auto",
          left: "auto",
          marginTop: "0px",
          width: "87%",
        }}
        width="100%"
        maximumSelected={10}
        menuOpen={false}
        selected={selectedOption}
        allowSelectAll={false}
        searchableKeys={["label"]}
        isLoading={false}
      >
        {({ isMenuOpen, openMenu }: tMultiSelectChildren) => {
          return (
            <StyledMultiSelect>
              <TextInput
                id={`editableCell-${row.id}-${column.id}`}
                autoFocus={
                  `${row.original.clientNodeId}-${column.id}` ===
                  lastUpdatedCell
                }
                value={displayOptions.current || inlineEditsData || value}
                className="multiselct"
                label="Weekly Off"
                labelColor="black"
                placeholder=""
                variant="inline-edit"
                onClick={() => {
                  openMenu(!isMenuOpen);
                }}
                readOnly
                fullWidth
                onChange={() => {}}
              />
              <span
                style={{
                  position: "absolute",
                  left: "85%",
                  top: "8px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  openMenu(!isMenuOpen);
                }}
              >
                <FontIcon
                  variant="breadcrumb-down-thin"
                  color="primary.main"
                  size={12}
                />
              </span>
            </StyledMultiSelect>
          );
        }}
      </MultiSelect>
    );
  },
};

export default ALL_ADDRESSES_INLINE_EDITABLE_CELL_MAPPING;
