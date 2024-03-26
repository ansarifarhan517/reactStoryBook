import React, {Dispatch} from 'react';
import { useDispatch } from 'react-redux';
import { BranchConfigurationActions } from '../BranchConfiguration.actions';
import {Accordion, AccordionHeaderTitle, AccordionContent, FontIcon, Tooltip, AccordionHeaderSubTitle } from 'ui-library';
import { BranchViewHeaderWrapper, SubBranchAccordionHeader} from '../BranchConfigurationStyledComponents';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import {IBranchConfigurationListViewRowData} from '../../BranchConfiguration/BranchConfiguration.models';
export interface IAccordianViewProps {
    subBranch: IBranchConfigurationListViewRowData;
    handleAddEditBranch: Function;
    expandedAccordian: (boolean | undefined)[];
    handleAccordianToggle: Function;
    handleBranchToggle?: Function;
}
const BranchConfigurationTreeViewAccordion = (props: IAccordianViewProps) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.branchConfiguration);

    const { subBranch , handleAddEditBranch, expandedAccordian, handleAccordianToggle} = props;
    const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();

    const handleChildBranches = (hasChildBranches: boolean | undefined) => {
        dispatch({
            type: '@@branchConfiguration/SET_CHILD_BRANCHES_TOGGLE',
            payload: hasChildBranches
        })
    }
    return (
        <Accordion hideChevron={!subBranch.hasChildBranches} id={(subBranch.clientBranchId).toString()} expanded={(expandedAccordian && expandedAccordian[subBranch.clientBranchId]) ? expandedAccordian[subBranch.clientBranchId]: false } onToggle={() => {handleChildBranches(subBranch.hasChildBranches); handleAccordianToggle(subBranch.clientBranchId, subBranch.hasChildBranches)}} >
            {{
                header: (
                <>
                    <BranchViewHeaderWrapper style={{display: 'flex',justifyContent: 'space-between'}} className="branch-view-header-wrapper">
                        <SubBranchAccordionHeader>
                            <div>
                                <AccordionHeaderTitle style={{fontWeight: 'bold', whiteSpace: 'pre'}}>
                                    {subBranch.name}
                                </AccordionHeaderTitle>
                                {subBranch?.description && subBranch?.description?.length > 0 &&
                                    <AccordionHeaderSubTitle>
                                        {subBranch.description}
                                    </AccordionHeaderSubTitle>
                                }
                            </div>
                        </SubBranchAccordionHeader>
                        <div style={{paddingTop: '10px'}} >
                        <div>
                        {/* <Box display='flex' justifyContent='center'> */}
                            <span onClick={() => handleAddEditBranch()} style={{paddingRight: '10px'}}>
                                <Tooltip message={dynamicLabels.addChildBranchFor + ' '+ subBranch.name} hover arrowPlacement="center" messagePlacement="end">
                                    <FontIcon
                                        variant={'icomoon-add'}
                                        size={'sm'}
                                    />
                                </Tooltip>
                            </span>
                        {/* </Box> */}
                            <span onClick={() => {handleAddEditBranch(subBranch.clientBranchId)}}>
                                <Tooltip message={dynamicLabels.editDetailsOf + ' '+ subBranch.name} hover arrowPlacement="center" messagePlacement="end">
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
                    <AccordionContent>
                        {subBranch.subBranches && subBranch.subBranches.length > 0 && subBranch.subBranches.map((branch: IBranchConfigurationListViewRowData) => {
                            return (
                                <BranchConfigurationTreeViewAccordion key={branch.clientBranchId} subBranch={branch} handleAddEditBranch={handleAddEditBranch} expandedAccordian={expandedAccordian} handleAccordianToggle={handleAccordianToggle}></BranchConfigurationTreeViewAccordion>
                            )
                        })}
                    </AccordionContent>
                )
            }}
        </Accordion>
    )
}
export default BranchConfigurationTreeViewAccordion

