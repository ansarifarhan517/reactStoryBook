const columnsStructure = {
  deliveryMediumMasterName: {
    label: 'Name',
    fieldName: 'input',
    fieldType: 'text',
    permission: true,
    id: 'deliveryMediumMasterName',
    required: true,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {
      minlength: {
        args: '1',
        message: 'Minimum 1 characters required.'
      },
      required: {
        message: 'Full Name is required'
      },
      maxlength: {
        args: '50',
        message: 'Full Name must be maximum 50 characters long.'
      }
    },
    labelKey: 'deliveryMediumMasterName',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: true,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  phoneNumber: {
    label: 'Phone Number',
    fieldName: 'input',
    fieldType: 'text',
    permission: true,
    id: 'phoneNumber',
    required: true,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {
      required: {
        message: 'Mobile Number is Required'
      },
      phonenumber: {
        args: '',
        message: 'INVALID Mobile Number'
      },
      maxlength: {
        args: '18',
        message: 'Mobile Number must be maximum 18 characters long.'
      }
    },
    labelKey: 'phoneNumber',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: true,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  branchName: {
    label: 'Branch',
    fieldName: 'input',
    fieldType: 'select',
    permission: true,
    id: 'branchName',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'branchName',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: true,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  capacity: {
    label: 'Capacity',
    permission: true,
    id: 'capacity',
    required: false,
    childLength: 3,
    rowSpan: 1,
    colSpan: 0,
    childNodes: {
      capacityInWeight: {
        label: 'CapacityInWeight',
        fieldName: 'input',
        fieldType: 'text',
        permission: true,
        id: 'capacityInWeight',
        required: false,
        childLength: 0,
        rowSpan: 0,
        colSpan: 0,
        childNodes: {},
        validation: {
          numeric: {
            args: '',
            message: 'Please enter a valid Capacity.'
          },
          minlength: {
            args: '0',
            message: 'Please enter a valid Capacity.'
          },
          max: {
            args: '999999999',
            message:
              'Capacity (in Kg) value must be less than equal to 999999999.'
          }
        },
        labelKey: 'capacityInWeight',
        excelDropDownHidden: false,
        customField: false,
        searchable: true,
        editable: true,
        sortable: true,
        infoFlag: false,
        allowed: false
      },
      capacityInUnits: {
        label: 'In Units',
        fieldName: 'input',
        fieldType: 'text',
        permission: true,
        id: 'capacityInUnits',
        required: true,
        childLength: 0,
        rowSpan: 0,
        colSpan: 0,
        childNodes: {},
        validation: {
          numeric: {
            args: '',
            message: 'Please enter a valid Capacity.'
          },
          required: {
            message: 'Capacity (in Units) is mandatory.'
          },
          minlength: {
            args: '0',
            message: 'Please enter a valid Capacity.'
          },
          min: {
            args: '0',
            message: 'Please enter a valid Capacity.'
          },
          max: {
            args: '999999999',
            message:
              'Capacity (Units) value must be less than equal to 999999999.'
          }
        },
        labelKey: 'capacityInUnits',
        excelDropDownHidden: false,
        customField: false,
        searchable: true,
        editable: true,
        sortable: true,
        infoFlag: false,
        allowed: false
      },
      capacityInVolume: {
        label: 'CapacityInVolume',
        fieldName: 'input',
        fieldType: 'text',
        permission: true,
        id: 'capacityInVolume',
        required: false,
        childLength: 0,
        rowSpan: 0,
        colSpan: 0,
        childNodes: {},
        validation: {
          numeric: {
            args: '',
            message: 'Please enter a valid Capacity.'
          },
          minlength: {
            args: '0',
            message: 'Please enter a valid Capacity.'
          },
          max: {
            args: '999999999',
            message:
              'Capacity (in Cc) value must be less than equal to 999999999.'
          }
        },
        labelKey: 'capacityInVolume',
        excelDropDownHidden: false,
        customField: false,
        searchable: true,
        editable: true,
        sortable: true,
        infoFlag: false,
        allowed: false
      }
    },
    validation: {
      min: {
        args: '0',
        message: 'Capacity must be greater than 0.'
      },
      max: {
        args: '0',
        message: 'Capacity must be less than 0.'
      }
    },
    labelKey: 'capacity',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: true,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  minCapacityUtil: {
    label: 'Minimum Capacity Utilization(%)',
    permission: true,
    id: 'minCapacityUtil',
    required: false,
    childLength: 3,
    rowSpan: 1,
    colSpan: 0,
    childNodes: {
      minCapacityUtilizationInUnits: {
        label: '(in units)',
        fieldName: 'input',
        fieldType: 'text',
        permission: true,
        id: 'minCapacityUtilizationInUnits',
        required: false,
        childLength: 0,
        rowSpan: 0,
        colSpan: 0,
        childNodes: {},
        validation: {
          numeric: {
            args: '',
            message: 'Please enter a valid Capacity.'
          },
          max: {
            args: '100',
            message: 'Minimum capacity Utilization should be maximum 100'
          }
        },
        labelKey: '(in Units)',
        excelDropDownHidden: false,
        customField: false,
        searchable: true,
        editable: true,
        sortable: true,
        infoFlag: false,
        allowed: false
      },
      minCapacityUtilizationInWeight: {
        label: '(in Kg)',
        fieldName: 'input',
        fieldType: 'text',
        permission: true,
        id: 'minCapacityUtilizationInWeight',
        required: false,
        childLength: 0,
        rowSpan: 0,
        colSpan: 0,
        childNodes: {},
        validation: {
          numeric: {
            args: '',
            message: 'Please enter a valid Capacity.'
          },
          max: {
            args: '100',
            message: 'Minimum capacity Utilization should be maximum 100'
          }
        },
        labelKey: '(in #@#weight#@#)',
        excelDropDownHidden: false,
        customField: false,
        searchable: true,
        editable: true,
        sortable: true,
        infoFlag: false,
        allowed: false
      },
      minCapacityUtilizationInVolume: {
        label: '(in Cc)',
        fieldName: 'input',
        fieldType: 'text',
        permission: true,
        id: 'minCapacityUtilizationInVolume',
        required: false,
        childLength: 0,
        rowSpan: 0,
        colSpan: 0,
        childNodes: {},
        validation: {
          numeric: {
            args: '',
            message: 'Please enter a valid Capacity.'
          },
          max: {
            args: '100',
            message: 'Minimum capacity Utilization should be maximum 100'
          }
        },
        labelKey: '(in #@#volume#@#)',
        excelDropDownHidden: false,
        customField: false,
        searchable: true,
        editable: true,
        sortable: true,
        infoFlag: false,
        allowed: false
      }
    },
    validation: {
      min: {
        args: '0',
        message: 'minCapacityUtil must be greater than 0.'
      },
      max: {
        args: '100',
        message: 'minCapacityUtil must be less than 100.'
      }
    },
    labelKey: 'minCapacityUtil',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: true,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  deliveryMediumMasterTypeCd: {
    label: 'Skill Set',
    fieldName: 'input',
    fieldType: 'multiSelect',
    permission: false,
    id: 'deliveryMediumMasterTypeCd',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'deliveryMediumMasterTypeCd',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: true,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  userName: {
    label: 'User Name',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'userName',
    required: true,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {
      minlength: {
        args: '1',
        message: 'Minimum 1 characters required.'
      },
      required: {
        message: 'Username is required.'
      },
      maxlength: {
        args: '25',
        message: 'Username must be maximum 25 characters long.'
      }
    },
    labelKey: 'User Name',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  statusCd: {
    label: 'Status',
    fieldName: 'input',
    fieldType: 'dropdown',
    permission: false,
    id: 'statusCd',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'statusCd',
    infoTool: [
      {
        key: 'deliverymedium_statusCd_infotip',
        message: 'Possible DA statuses - Available, Inprogress, Inactive.'
      }
    ],
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: true,
    allowed: false
  },
  deviceStatus: {
    label: 'Device Status',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'deviceStatus',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'deviceStatus',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  tripName: {
    label: 'Running Trip',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'tripName',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'Running Trip',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  trackingDate: {
    label: 'Last Tracking',
    fieldName: 'input',
    fieldType: 'calendar',
    permission: false,
    id: 'trackingDate',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'trackingDate',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  isAttandanceFl: {
    label: 'Attendance',
    fieldName: 'input',
    fieldType: 'dropdown',
    permission: false,
    id: 'isAttandanceFl',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'isAttandanceFl',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  isActiveFl: {
    label: 'Active / Inactive',
    fieldName: 'input',
    fieldType: 'dropdown',
    permission: false,
    id: 'isActiveFl',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'isActiveFl',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  isOnBreakFl: {
    label: 'On-Break',
    fieldName: 'input',
    fieldType: 'dropdown',
    permission: false,
    id: 'isOnBreakFl',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'On-Break',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: true,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  fixedCost: {
    label: 'Fixed Cost',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'fixedCost',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {
      min: {
        args: '0',
        message: 'Fixed Cost must be greater than 0.'
      },
      max: {
        args: '999999999',
        message: 'Fixed Cost must be less than 999999999.'
      }
    },
    labelKey: 'Fixed Cost',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  variableCost: {
    label: 'Variable Cost',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'variableCost',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {
      min: {
        args: '0',
        message: 'Variable cost must be greater than 0.'
      },
      max: {
        args: '999999999',
        message: 'Variable cost must be less than 999999999.'
      }
    },
    labelKey: 'Variable Cost',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  weeklyOff: {
    label: 'Weekly Off',
    fieldName: 'input',
    fieldType: 'dropdown',
    permission: false,
    id: 'weeklyOff',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'weeklyOff',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: true,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  versionCode: {
    label: 'App Version',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'versionCode',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'versionCode',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  cashPaid: {
    label: 'Cash Paid',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'cashPaid',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'Cash Paid',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  geofenceName: {
    label: 'Territory Name',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'geofenceName',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'Geofence Name',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  cashCollected: {
    label: 'Cash Collected',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'cashCollected',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'Cash Collected',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  cashBalance: {
    label: 'Cash Balance',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'cashBalance',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'Cash Balance',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  networkStatus: {
    label: 'Network Status',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'networkStatus',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'Network Status',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  waitingTimeCost: {
    label: 'Waiting Time Cost',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'waitingTimeCost',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {
      min: {
        args: '0',
        message: 'Waiting Time Cost must be greater than 0.'
      },
      max: {
        args: '999999999',
        message: 'Waiting Time Cost must be less than 999999999.'
      }
    },
    labelKey: 'Waiting Time Cost',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  type: {
    label: 'Logged In Status',
    fieldName: 'input',
    fieldType: 'dropdown',
    permission: false,
    id: 'type',
    required: true,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {
      required: {
        message: 'Fleet Type is required'
      },
      maxlength: {
        args: '255',
        message: 'Fleet Type must be maximum 255 characters long.'
      }
    },
    labelKey: 'dmLoggedinStatus',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  deviceType: {
    label: 'Device Type',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'deviceType',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'deviceType',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  phoneModel: {
    label: 'Phone Model',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'phoneModel',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'phoneModel',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  },
  osVersion: {
    label: 'OS Version',
    fieldName: 'input',
    fieldType: 'text',
    permission: false,
    id: 'osVersion',
    required: false,
    childLength: 0,
    rowSpan: 2,
    colSpan: 0,
    childNodes: {},
    validation: {},
    labelKey: 'osVersion',
    excelDropDownHidden: false,
    customField: false,
    searchable: true,
    editable: false,
    sortable: true,
    infoFlag: false,
    allowed: false
  }
}

export default columnsStructure
