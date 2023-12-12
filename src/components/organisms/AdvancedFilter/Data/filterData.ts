const filterData = [
  {
    id: '5e1d6e029de0370b62a7593e',
    filterName: 'Powai Vendor Branch Only',
    ownerUserId: 31690,
    pageName: 'DELIVERYMEDIUM',
    sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
    userGroupIds: [0],
    userIds: [0],
    operationLogic: 'AND',
    advanceFilterTagReferenceIds: [],
    filters: [
      {
        fieldId: 'branchName',
        filterData: 'Powai Vendor',
        operationSymbol: '=',
        operationLabelKey: 'filterOpEquals',
        fieldLabelKey: 'branchName',
        customField: false
      }
    ],
    isFavourite: false
  },
  {
    id: '5f7c3e0ed3f6ff074bd94f2a',
    filterName: 'iiiiii',
    ownerUserId: 31690,
    pageName: 'DELIVERYMEDIUM',
    sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
    userGroupIds: [561],
    userIds: [31690],
    operationLogic: 'ALL',
    filters: [
      {
        fieldId: 'deliveryMediumMasterName',
        filterData: 'Peter D,Peter C',
        fieldLabelKey: 'Name',
        customField: false
      },
      {
        fieldId: 'branchName',
        filterData: 'Powai Vendor,vendor',
        fieldLabelKey: 'Branch',
        customField: false
      }
    ],
    isFavourite: false
  },
  {
    id: '5f7c3faad3f6ff074bd94f2b',
    filterName: 'DA 2',
    ownerUserId: 31690,
    pageName: 'DELIVERYMEDIUM',
    sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
    userGroupIds: [561],
    userIds: [31690],
    operationLogic: 'AND',
    advanceFilterTagReferenceIds: [],
    filters: [
      {
        fieldId: 'statusCd',
        filterData: 'AVAILABLE,DISPATCHED,INACTIVE,ABSENT',
        operationSymbol: 'in',
        operationLabelKey: 'filterOpIn',
        fieldLabelKey: 'statusCd',
        customField: false
      }
    ],
    isFavourite: false
  },
  {
    id: '5f7dd86bd3f6ff074bd94f5a',
    filterName: 'My DAs',
    ownerUserId: 31690,
    pageName: 'DELIVERYMEDIUM',
    sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
    userGroupIds: [561],
    userIds: [31690],
    operationLogic: 'AND',
    advanceFilterTagReferenceIds: [],
    filters: [
      {
        fieldId: 'userName',
        filterData: 'param3,peterd',
        operationSymbol: 'in',
        operationLabelKey: 'filterOpIn',
        fieldLabelKey: 'User Name',
        customField: false
      }
    ],
    sortCriteria: [
      {
        customField: false,
        fieldId: 'deliveryMediumMasterName',
        fieldLabelKey: 'Name',
        operationLabelKey: 'DESC',
        operationSymbol: 'DESC'
      }
    ],
    isFavourite: false
  },
  {
    id: '5f86f983d3f6ff074bd94fe2',
    filterName: 'phoneNo',
    ownerUserId: 31690,
    pageName: 'DELIVERYMEDIUM',
    sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
    userGroupIds: [561],
    userIds: [31690],
    operationLogic: 'AND',
    advanceFilterTagReferenceIds: [],
    filters: [
      {
        fieldId: 'phoneNumber',
        filterData: '8888888888',
        operationSymbol: '>',
        operationLabelKey: 'greaterThan',
        fieldLabelKey: 'phoneNumber',
        customField: false
      }
    ],
    isFavourite: true,
    favouriteSections: ['list']
  },
  {
    id: '5f92b95637c24c28eb950447',
    filterName: '2.5 test',
    ownerUserId: 31690,
    pageName: 'DELIVERYMEDIUM',
    sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
    userGroupIds: [561],
    userIds: [31690],
    operationLogic: 'OR',
    advanceFilterTagReferenceIds: [],
    filters: [
      {
        fieldId: 'branchName',
        filterData: 'Powai Vendor',
        operationSymbol: '=',
        operationLabelKey: 'filterOpEquals',
        fieldLabelKey: 'branchName',
        customField: false
      },
      {
        fieldId: 'statusCd',
        filterData: 'AVAILABLE,DISPATCHED,ABSENT',
        operationSymbol: 'in',
        operationLabelKey: 'filterOpIn',
        fieldLabelKey: 'statusCd',
        customField: false
      },
      {
        fieldId: 'type',
        filterData: 'LOGIN,LOGOUT',
        operationSymbol: 'in',
        operationLabelKey: 'filterOpIn',
        fieldLabelKey: 'dmLoggedinStatus',
        customField: false
      }
    ],
    // filterApplied: true,
    isFavourite: true,
    favouriteSections: ['list', 'live']
  },
  {
    id: '5f99373a8a7fff49adb94c86',
    filterName: 'test 11',
    ownerUserId: 31690,
    pageName: 'DELIVERYMEDIUM',
    sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
    userGroupIds: [561],
    userIds: [31690],
    operationLogic: 'AND',
    filters: [
      {
        fieldId: 'deliveryMediumMasterName',
        filterData: 'test',
        operationSymbol: '=',
        operationLabelKey: 'filterOpEquals',
        fieldLabelKey: 'Name',
        customField: false
      }
    ],
    isFavourite: false
  },
  {
    id: '5f9942f58a7fff49adb94c89',
    filterName: 'Name Is not empty',
    ownerUserId: 31690,
    pageName: 'DELIVERYMEDIUM',
    sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
    userGroupIds: [561],
    userIds: [31690],
    operationLogic: 'AND',
    filters: [
      {
        fieldId: 'deliveryMediumMasterName',
        filterData: '',
        operationSymbol: 'isnotempty',
        operationLabelKey: 'isnotempty',
        fieldLabelKey: 'Name',
        customField: false
      }
    ],
    isFavourite: false
  },
  {
    id: '5f9943778a7fff49adb94c8a',
    filterName: 'Name Is empty',
    ownerUserId: 31690,
    pageName: 'DELIVERYMEDIUM',
    sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
    userGroupIds: [561],
    userIds: [31690],
    operationLogic: 'AND',
    filters: [
      {
        fieldId: 'deliveryMediumMasterName',
        filterData: '',
        operationSymbol: 'isempty',
        operationLabelKey: 'isempty',
        fieldLabelKey: 'Name',
        customField: false
      }
    ],
    isFavourite: true,
    favouriteSections: ['live']
  },
  {
    id: '609381d79a800318d73bf3d7',
    filterName: 'aayushi-test2',
    ownerUserId: 31690,
    pageName: 'VEHICLE',
    sectionName: 'VEHICLE_LIST_VIEW',
    userGroupIds: [561],
    userIds: [31690],
    operationLogic: 'AND',
    advanceFilterTagReferenceIds: [
      '5f7c3faad3f6ff074bd94f2b',
      '5f7c3e0ed3f6ff074bd94f2a'
    ],
    advanceFilterTags: [
      {
        id: '5f7c3faad3f6ff074bd94f2b',
        filterName: 'DA 2',
        ownerUserId: 31690,
        pageName: 'DELIVERYMEDIUM',
        sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
        userGroupIds: [561],
        userIds: [31690],
        operationLogic: 'AND',
        advanceFilterTagReferenceIds: [],
        filters: [
          {
            fieldId: 'statusCd',
            filterData: 'AVAILABLE,DISPATCHED,INACTIVE,ABSENT',
            operationSymbol: 'in',
            operationLabelKey: 'filterOpIn',
            fieldLabelKey: 'statusCd',
            customField: false
          }
        ],
        isFavourite: false
      },
      {
        id: '5f7c3e0ed3f6ff074bd94f2a',
        filterName: 'iiiiii',
        ownerUserId: 31690,
        pageName: 'DELIVERYMEDIUM',
        sectionName: 'DELIVERY_MEDIUM_LIST_VIEW',
        userGroupIds: [561],
        userIds: [31690],
        operationLogic: 'ALL',
        filters: [
          {
            fieldId: 'deliveryMediumMasterName',
            filterData: 'Peter D,Peter C',
            fieldLabelKey: 'Name',
            customField: false
          },
          {
            fieldId: 'branchName',
            filterData: 'Powai Vendor,vendor',
            fieldLabelKey: 'Branch',
            customField: false
          }
        ],
        isFavourite: false
      }
    ],
    filters: [],
    isFavourite: false
  }
]

export default filterData
