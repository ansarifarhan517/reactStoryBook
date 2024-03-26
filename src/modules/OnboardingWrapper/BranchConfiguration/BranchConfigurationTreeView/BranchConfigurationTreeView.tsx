import React, { useEffect, Dispatch, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Accordion, AccordionHeaderTitle, AccordionContent, FontIcon, AccordionHeaderSubTitle, PaginationBar, Box, Tooltip } from "ui-library";
import { BranchViewHeaderWrapper, BranchTreeViewWrapper, BranchViewContentWrapper, SetContentPadding } from '../BranchConfigurationStyledComponents';
import { BranchConfigurationActions } from '../BranchConfiguration.actions';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import axios from '../../../../utils/axios';
import apiMappings from '../../../../utils/apiMapping';
import BranchConfigurationTreeViewAccordion from '../SubComponents/BranchConfigurationTreeViewAccordion';
import { deepCopy } from '../../../../utils/helper';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import { IBranchConfigurationListViewRowData } from '../BranchConfiguration.models';

const BranchConfigurationTreeView = ({ onAddEdit = () => { } }) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.branchConfiguration);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();
  const branchTreeList = useTypedSelector(state => state.branchConfiguration.treedata.results)
  const selectedBranchId = useTypedSelector(state => state.branchConfiguration.selectedBranchId);
  const hasChildBranches = useTypedSelector(state => state.branchConfiguration.hasChildBranches);
  const [expandedValues, setExpandedValues] = useState<Array<boolean | undefined>>([])
  const [totalCount, setTotalCount] = useState<number>(0)

  const handleBranchToggle = async (selectedBranch?: IBranchConfigurationListViewRowData | undefined, branchId?: number, type?: string, callFrom?: string, hasChildBranches?: boolean) => {
    var id = branchId ? branchId : (selectedBranch && (selectedBranch.clientBranchId).toString())
    let copyOfBranchTreeList = deepCopy(branchTreeList)
    try {
      const { data: data } = await axios.post(apiMappings.branchConfiguration.listView.data + `?fetchType=TREEVIEW&clientBranchId=${id}${`&pageNumber=${(callFrom === 'CallthroughPagination' || type === 'MainBranch') ? pageNumber : 1}&pageSize=${hasChildBranches && type !== 'MainBranch' ? 1000 : pageSize}`}`)
      if (type === 'MainBranch')
        setTotalCount(data.totalCount)

      copyOfBranchTreeList.map((branch: IBranchConfigurationListViewRowData) => {
        if (data.results && data.results.length) {
          var superID = data.results[0].superClientParentBranchId
        }
        searchObject(branch, superID, data.results)
      });
      dispatch({
        type: '@@branchConfiguration/SET_TREE_DATA',
        payload: copyOfBranchTreeList
      })
    } catch {
    }
  };

  const setSelectedBranchId = (branchId?: number | undefined) => {
    dispatch({
        type: '@@branchConfiguration/SET_SELECTED_BRANCH_ID',
        payload: branchId
    })
  }

  const handleAccordianToggle = (id: number, hasChildBranches?: boolean) => {

    if (!hasChildBranches) {
      return;
    }
    var values: (boolean | undefined)[] = expandedValues;
    if (values[id] === undefined) {
      values[id] = true;
    }
    else {
      values[id] = values[id] ? !values[id] : true;
    }

    // Setting selected Branch id in Redux Store.
    setSelectedBranchId(id);

    // If branchList is a Parent Branch then close all the subBranches.
    const branch = branchTreeList.find((branch) => branch.clientBranchId === id);
    if(branch?.subBranches?.length){
      branch?.subBranches.forEach((subBranch) => {
        const subBranchId = subBranch?.clientBranchId;
        values[subBranchId] = false;
      })
    }

    setExpandedValues([...values]);
  }
  const searchObject = (branch: IBranchConfigurationListViewRowData, superID?: number, results?: IBranchConfigurationListViewRowData[]) => {
    if (branch.hasOwnProperty('clientBranchId') && branch["clientBranchId"] === superID) {
      return branch.subBranches = results;
    }

    for (var i = 0; i < Object.keys(branch).length; i++) {
      if (typeof branch[Object.keys(branch)[i]] == "object") {
        const o: any = searchObject(branch[Object.keys(branch)[i]], superID, results);
        if (o != null)
          return o;
      }
    }
    return null;
  }
  const handleAddEditBranch = (editBranchId?: number) => {
    dispatch({
      type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA', payload: {
        key: 'isEditClientBranch',
        value: { 'clientBranchId': editBranchId }
      }
    })
    dispatch({ type: '@@branchConfiguration/SET_PREVIOUS_VIEW_TYPE', payload: 'tree-view' });
    onAddEdit()
  }

  useEffect(() => {
    dispatch({
      type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST'
    });
  }, []);

  useEffect(() => {
    if (branchTreeList && branchTreeList.length) {
      handleBranchToggle(undefined, branchTreeList[0].clientBranchId, 'MainBranch', 'CallthroughPagination')
    }
  }, [pageNumber])

  useEffect(() => {
    if (selectedBranchId) {
      handleBranchToggle(undefined, selectedBranchId, undefined, undefined, hasChildBranches)
    }
  }, [selectedBranchId, hasChildBranches])

  return (
    <BranchTreeViewWrapper>
      {branchTreeList.length ? branchTreeList.map((branchObj: IBranchConfigurationListViewRowData, branchIndex: number) => {
        return (
          <Accordion key={branchIndex} id={(branchObj.clientBranchId).toString()} expanded={expandedValues[branchObj.clientBranchId] ? expandedValues[branchObj.clientBranchId] : false} onToggle={() => { handleBranchToggle(undefined, branchObj.clientBranchId, 'MainBranch'); handleAccordianToggle(branchObj.clientBranchId, true) }} >
            {{
              header: (
                <>
                  <BranchViewHeaderWrapper style={{ display: 'flex', justifyContent: 'space-between' }} className="branch-view-header-wrapper">
                    <div>
                      <AccordionHeaderTitle style={{whiteSpace: 'pre'}}>
                        {branchObj.name}
                      </AccordionHeaderTitle>
                      <AccordionHeaderSubTitle>
                        {branchObj.description}
                      </AccordionHeaderSubTitle>
                    </div>
                    <div style={{ paddingTop: '10px' }} >
                      <div >
                        <span onClick={() => handleAddEditBranch()} style={{ paddingRight: '10px' }}>
                          <Tooltip message={dynamicLabels.addChildBranchFor + ' ' + branchObj.name} hover arrowPlacement="center" messagePlacement="end">
                            <FontIcon
                              variant={'icomoon-add'}
                              size={'sm'}
                            />
                          </Tooltip>
                        </span>
                        <span onClick={() => handleAddEditBranch(branchObj.clientBranchId)}>
                          <Tooltip message={dynamicLabels.editDetailsOf + ' ' + branchObj.name} hover arrowPlacement="center" messagePlacement="end">
                            <FontIcon
                              variant={'icomoon-edit-empty'}
                              size={'sm'}
                            />
                          </Tooltip>
                        </span>
                      </div>
                    </div>
                  </BranchViewHeaderWrapper>
                </>
              ),
              content: (
                <SetContentPadding>
                  <AccordionContent>
                    <BranchViewContentWrapper>
                      <Box display="flex" className="tree-view-pagination" justifyContent="flex-end">
                        <PaginationBar
                          pageSize={pageSize}
                          totalRows={totalCount}
                          pageNumber={pageNumber}
                          onPageChange={(e: number) => setPageNumber(e + 1)}
                          hidePageSizeOption={true}
                          onPageSizeChange={() => { }}
                          isTotalCountLoading={false}
                          moreResultsExists={false}
                        />
                      </Box>
                      {branchObj.subBranches && branchObj.subBranches.length > 0 && branchObj.subBranches.map((branch: IBranchConfigurationListViewRowData) => {
                        return (
                          <BranchConfigurationTreeViewAccordion handleAddEditBranch={handleAddEditBranch} key={branch.clientBranchId} subBranch={branch} handleBranchToggle={() => handleBranchToggle(branch)} handleAccordianToggle={handleAccordianToggle} expandedAccordian={expandedValues}></BranchConfigurationTreeViewAccordion>
                        )
                      })}
                    </BranchViewContentWrapper>
                  </AccordionContent>
                </SetContentPadding>
              )
            }}
          </Accordion>
        )

      }):''}
    </BranchTreeViewWrapper>
  )
}
export default BranchConfigurationTreeView;