const operationType = {
  text: [
    {
      operation: 'in',
      operationSymbol: 'in',
      labelKey: 'filterOpIn',
      labelValue: 'is any of'
    },
    {
      operation: 'equals',
      operationSymbol: '=',
      labelKey: 'filterOpEquals',
      labelValue: 'is'
    },
    {
      operation: 'contains',
      operationSymbol: 'rlike',
      labelKey: 'contains',
      labelValue: 'Contains'
    },
    {
      operation: 'isempty',
      operationSymbol: 'isempty',
      labelKey: 'isempty',
      labelValue: 'is empty'
    },
    {
      operation: 'isnotempty',
      operationSymbol: 'isnotempty',
      labelKey: 'isnotempty',
      labelValue: 'is not empty'
    },
    {
      operation: 'between',
      operationSymbol: 'between',
      labelKey: 'between',
      labelValue: 'Between'
    }
  ],
  number: [
    {
      operation: 'in',
      operationSymbol: 'in',
      labelKey: 'filterOpIn',
      labelValue: 'is any of'
    },
    {
      operation: 'equals',
      operationSymbol: '=',
      labelKey: 'filterOpEquals',
      labelValue: 'is'
    },
    {
      operation: 'isempty',
      operationSymbol: 'isempty',
      labelKey: 'isempty',
      labelValue: 'is empty'
    },
    {
      operation: 'lessThan',
      operationSymbol: '<',
      labelKey: 'lessThan',
      labelValue: '<'
    },
    {
      operation: 'greaterThan',
      operationSymbol: '>',
      labelKey: 'greaterThan',
      labelValue: '>'
    },
    {
      operation: 'lessThanEqualTo',
      operationSymbol: '<=',
      labelKey: 'lessThanEqualTo',
      labelValue: '<='
    },
    {
      operation: 'greaterThanEqualTo',
      operationSymbol: '>=',
      labelKey: 'greaterThanEqualTo',
      labelValue: '>='
    },
    {
      operation: 'isNotEquals',
      operationSymbol: '!=',
      labelKey: 'filterNotOpEquals',
      labelValue: 'is not'
    }
  ],
  button: [
    {
      operation: 'in',
      operationSymbol: 'in',
      labelKey: 'filterOpIn',
      labelValue: 'is any of'
    },
    {
      operation: 'equals',
      operationSymbol: '=',
      labelKey: 'filterOpEquals',
      labelValue: 'is'
    },
    {
      operation: 'contains',
      operationSymbol: 'rlike',
      labelKey: 'contains',
      labelValue: 'Contains'
    },
    {
      operation: 'isempty',
      operationSymbol: 'isempty',
      labelKey: 'isempty',
      labelValue: 'is empty'
    },
    {
      operation: 'isnotempty',
      operationSymbol: 'isnotempty',
      labelKey: 'isnotempty',
      labelValue: 'is not empty'
    }
  ],
  dropdown: [
    {
      operation: 'in',
      operationSymbol: 'in',
      labelKey: 'filterOpIn',
      labelValue: 'is any of'
    },
    {
      operation: 'equals',
      operationSymbol: '=',
      labelKey: 'filterOpEquals',
      labelValue: 'is'
    }
  ],
  multiselect: [
    {
      operation: 'in',
      operationSymbol: 'in',
      labelKey: 'filterOpIn',
      labelValue: 'is any of'
    },
    {
      operation: 'equals',
      operationSymbol: '=',
      labelKey: 'filterOpEquals',
      labelValue: 'is'
    }
  ],
  checkbox: [
    {
      operation: 'equals',
      operationSymbol: '=',
      labelKey: 'filterOpEquals',
      labelValue: 'is'
    }
  ],
  calendar: [
    {
      operation: 'between',
      operationSymbol: 'between',
      labelKey: 'between',
      labelValue: 'Between'
    }
  ],
  date: [
    {
      operation: 'between',
      operationSymbol: 'between',
      labelKey: 'between',
      labelValue: 'Between'
    }
  ],
  datetime: [
    {
      operation: 'between',
      operationSymbol: 'between',
      labelKey: 'between',
      labelValue: 'Between'
    }
  ],
  select: [
    {
      operation: 'in',
      operationSymbol: 'in',
      labelKey: 'filterOpIn',
      labelValue: 'is any of'
    },
    {
      operation: 'equals',
      operationSymbol: '=',
      labelKey: 'filterOpEquals',
      labelValue: 'is'
    }
  ],
  link: [
    {
      operation: 'in',
      operationSymbol: 'in',
      labelKey: 'filterOpIn',
      labelValue: 'is any of'
    },
    {
      operation: 'equals',
      operationSymbol: '=',
      labelKey: 'filterOpEquals',
      labelValue: 'is'
    },
    {
      operation: 'contains',
      operationSymbol: 'rlike',
      labelKey: 'contains',
      labelValue: 'Contains'
    },
    {
      operation: 'isempty',
      operationSymbol: 'isempty',
      labelKey: 'isempty',
      labelValue: 'is empty'
    },
    {
      operation: 'isnotempty',
      operationSymbol: 'isnotempty',
      labelKey: 'isnotempty',
      labelValue: 'is not empty'
    }
  ]
}
export default operationType
