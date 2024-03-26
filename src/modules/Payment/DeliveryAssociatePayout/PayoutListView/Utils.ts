export const frequencyOptions = [
  {
    label: "Daily",
    value: "Daily",
  },
  {
    label: "Weekly",
    value: "Weekly",
  },
  {
    label: "Monthly",
    value: "Monthly",
  },
  {
    label: "Custom",
    value: "Custom",
  },
];

export const periodOptions = [
  {
    label: "Day(s)",
    value: "Daily",
  },
  {
    label: "Week(s)",
    value: "Weekly",
  },
  {
    label: "Month(s)",
    value: "Monthly",
  },
];

export const dayOptions = [
  {
    label: "Sunday",
    value: "Sunday",
  },
  {
    label: "Monday",
    value: "Monday",
  },
  {
    label: "Tuesday",
    value: "Tuesday",
  },
  {
    label: "Wednesday",
    value: "Wednesday",
  },
  {
    label: "Thursday",
    value: "Thursday",
  },
  {
    label: "Friday",
    value: "Friday",
  },
  {
    label: "Saturday",
    value: "Saturday",
  },
];

export const dateOptions = () => {
  let countTill = 29;
  return Array.from({ length: countTill }, (_, i) => i + 1)?.map((item) => {
    return {
      label: item.toString(),
      value: item.toString(),
    };
  });
};

export const formTimeStructure = {
    time: {
      allowed: false,
      ShiftStartEndTimeVisiblity: false,
      childLength: 0,
      colSpan: 0,
      customField: false,
      editable: true,
      excelDropDownHidden: false,
      fieldName: "time",
      fieldType: "time",
      id: "time",
      infoFlag: false,
      label: "Time",
      labelKey: "Time",
      options: [],
      permission: true,
      required: false,
      rowSpan: 0,
      searchable: false,
      sortable: false,
      url: "",
      validation: {},
    },
  };

  export const makeBranchToProfileMap = (profileArray) => {
    const branchToProfileSet = new Map();
    profileArray?.forEach((profileObj) => {
      return profileObj.linkedBranchIds?.forEach(branchId => {
        return branchToProfileSet.set(branchId, profileObj.payoutProfileName)
      })
    });
    return branchToProfileSet;
  };