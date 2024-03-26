import React, { useMemo, useState, Dispatch, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import {
  IconButton,
  BreadCrumb,
  ButtonGroup,
  FontIcon,
  IFetchDataOptions
} from 'ui-library';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import BranchConfigurationListView from './BranchConfigurationListView/BranchConfigurationListView';
import BranchConfigurationForm from "./BranchConfigurationForm";
import {ActionButtonWrapper, AddFormCard, BranchConfigurationTreeViewContainer, BreadCrumbContainer, GridContainer, GridItem, Header, ListViewCard, MainContentContainer, StyledGridContainer, ViewTypeButtonWrapper, HeaderWrapper} from "./BranchConfigurationStyledComponents";
import { sendGA } from '../../../utils/ga';
import { ReactTooltipCustom as ReactTooltip } from '../../../utils/layouts/ReactTooltipCustom';

import BranchConfigurationMap from './BranchMapView/BranchConfigurationMap';
import BranchConfigurationTreeView from './BranchConfigurationTreeView/BranchConfigurationTreeView';
import { BranchConfigurationActions } from './BranchConfiguration.actions';
import { withReactOptimized } from '../../../utils/components/withReact'
import UploadExcel from '../../../utils/wrapper/uploadExcel';
import LabelMapping from '../../DeliveryAssociate/DeliveryAssociateListView/LabelMapping';

export interface IBranchConfigurationProp {
  navigateToList? : boolean
}

const BranchConfiguration = ({navigateToList}: IBranchConfigurationProp) => {
  const [viewType, setViewType] = useState<'add-form-view' | 'list-view' | 'map-view' | 'tree-view' | string>('tree-view');
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false);
  const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();
  const isEditClientBranch = useTypedSelector(state => state.branchConfiguration.isEditClientBranch);
  const previousViewType = useTypedSelector((state) => state.branchConfiguration.previousViewType);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const resetFormStructure = useTypedSelector((state) => state.branchConfiguration.resetForm?.structure);

  useEffect(() => {
    dispatch({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_SHIFT_TIMINGS_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_DELIVERY_TYPE'});
    dispatch({ type: '@@branchConfiguration/FETCH_LOCALE' });
    dispatch({ type: '@@branchConfiguration/GOOGLE_API_KEY' });
    dispatch({ type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA', payload: { key: 'isEditClientBranch', value: '' } })
    dispatch({ type: '@@branchConfiguration/FETCH_ZONE_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_ZONE_PROFILE_STRUCTURE' });
    dispatch({ type: '@@branchConfiguration/FETCH_RATE_PROFILE_DROPDOWNS' });
    dispatch({ type: '@@branchConfiguration/FETCH_ZONES_LISTVIEW_STRUCTURE' });
    return ()=> {
      dispatch({ type: '@@branchConfiguration/RESET_ZONE_DETAILS' });
      dispatch({ type: "@@branchConfiguration/RESET_BRANCH_DATA" });
      dispatch({ type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA', payload: { key: 'isEditClientBranch', value: '' } })
      dispatch({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE_SUCCESS', payload: resetFormStructure })
    }
  },[])

  const handleFetchList = React.useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
      setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });
      dispatch({ type: '@@branchConfiguration/SET_FETCH_OPTIONS', payload: { pageSize, pageNumber, sortOptions, filterOptions, apis } })
      dispatch({
        type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_LIST',
        payload: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
        },
      });
    },
    []
  );
  useEffect(() => {
    if (viewType !== 'add-form-view') {
      dispatch({ type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA', payload: { key: 'isEditClientBranch', value: '' } })
      dispatch({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE_SUCCESS', payload: resetFormStructure })
    }

  }, [viewType])

  useEffect(() => {
    setViewType('tree-view')
  },[navigateToList])

  const pageLabels = useTypedSelector((state) => state.pageLabels.clientbranch);
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.branchConfiguration
  );
  const breadCrumbOptions = React.useMemo(() => {
    if (isEditClientBranch?.clientBranchId) {
      return [
        {
          id: 'ClientBranch',
          label: dynamicLabels.branchConfiguration ? dynamicLabels.branchConfiguration: 'Branch Configuration',
          disabled: false,
        },
        {
          id: 'updateClientBranch',
          label: dynamicLabels.updateBranchConfiguration ? dynamicLabels.updateBranchConfiguration: 'Update Branch Configuration',
          disabled: true,
        },
      ];
    } else{
      return [
        {
          id: 'ClientBranch',
          label:dynamicLabels.branchConfiguration ? dynamicLabels.branchConfiguration : 'Branch Configuration',
          disabled: true,
        },
      ];
    }
  }, [isEditClientBranch, dynamicLabels.branchConfiguration, dynamicLabels.updateBranchConfiguration]);

  const buttonTooltip = {
    mapview: `${LabelMapping.clickhereToShowtheCurrentLocation} ${dynamicLabels.branch_p} ${dynamicLabels.onAMap}`,
    listview: `${LabelMapping.clickheretoViewListofThe} ${dynamicLabels.branch_p}`,
    timelineview: `${LabelMapping.clickheretoViewTreeofThe}  ${dynamicLabels.branch_p}`,
  };

  const viewButtonOptions = useMemo(
    () => [
      {
        id: 'tree-view',
        label: (
          <ViewTypeButtonWrapper>
            <FontIcon variant='tree-view' size={13} />
            <span>{dynamicLabels.Tree ? dynamicLabels.Tree : "Tree"}</span>
          </ViewTypeButtonWrapper>
        ),
        selected: viewType === 'tree-view',
        tooltipText: buttonTooltip['timelineview']
      },
      {
        id: 'list-view',
        label: (
          <ViewTypeButtonWrapper>
            <FontIcon variant='list-view' size={13} />
            <span>{dynamicLabels.List}</span>
          </ViewTypeButtonWrapper>
        ),
        selected: viewType === 'list-view',
        tooltipText: buttonTooltip['listview']
      },
      {
        id: 'map-view',
        label: (
          <ViewTypeButtonWrapper>
            <FontIcon variant='map-view' size={13} />
            <span>{dynamicLabels.Map}</span>
          </ViewTypeButtonWrapper>
        ),
        selected: viewType === 'map-view',
        tooltipText: buttonTooltip['mapview']
      },
    ],
    [viewType, dynamicLabels.List, dynamicLabels.Map, dynamicLabels.Tree]
  );

  return (
    <>
      {/* Header */}
      <HeaderWrapper>
      <Header className={window.location.hash === "#/onboarding" ? "onboarding-branch-header" : "header" }>
        <BreadCrumbContainer>        
            {window.location.hash !== "#/onboarding" &&  <BreadCrumb options={breadCrumbOptions} /> }
        </BreadCrumbContainer>
        {/* Page Action Buttons */}
         {viewType !== "add-form-view" &&
        <ActionButtonWrapper>
          {(pageLabels?.buttons.addClient || window.location.hash === "#/onboarding") && (
            <>
            <IconButton
              id="client_branch_management--actionbar--add"
              intent="page"
              data-for="tt_AddOrder"
              iconVariant='icomoon-add'
              onClick={() => { dispatch({type: '@@branchConfiguration/SET_PREVIOUS_VIEW_TYPE', payload: viewType}); setViewType('add-form-view')}}>
              {dynamicLabels.add}
            </IconButton>
             <ReactTooltip
             id="tt_AddOrder"
             type="info"
             effect="solid"
             place="bottom">
             {`${dynamicLabels.addClientBranch}`}
           </ReactTooltip>
           </> 
          )}
          {(pageLabels?.buttons.upload || window.location.hash === "#/onboarding") && 
          <>
            <IconButton
             intent="page"
              data-for="tt_UploadBranch"
              iconVariant='icomoon-upload'
              onClick={() => {
                sendGA('Excel Upload' , 'Button Click Branch Configuration Upload')
                  setShowUploadPopup(true)
                }}
            >
            {dynamicLabels[pageLabels?.buttons.upload] || dynamicLabels.Upload}
            </IconButton>
            <ReactTooltip
             id="tt_UploadBranch"
             type="info"
             effect="solid"
             place="bottom"
           >
             {`${dynamicLabels.uploadClientBranch}`}
           </ReactTooltip>
            </>
          }
          {(pageLabels?.buttons.format || window.location.hash === "#/onboarding") && (
            <ButtonGroup
              data={viewButtonOptions}
              onChange={(id) => setViewType(id)}
            />
          )}
        </ActionButtonWrapper>
        }
      </Header>
    </HeaderWrapper>
      <MainContentContainer>
        <GridContainer
          container
          spacing={5}
        >
          <GridItem item md={12}>
            <StyledGridContainer
              container
              spacing={15}
            >
            {viewType === 'list-view' && (                
                  <ListViewCard>
                  <BranchConfigurationListView onEditRow={() => setViewType('add-form-view')} />
                  </ListViewCard>
              )}
              {viewType === 'add-form-view' && (
                <AddFormCard>
                  <BranchConfigurationForm onCancel={() => {setViewType(previousViewType);}}/>
                </AddFormCard>
              )}
              {viewType === "map-view" && <BranchConfigurationMap/> }
              {viewType === "tree-view" && <BranchConfigurationTreeViewContainer><BranchConfigurationTreeView onAddEdit={() => {setViewType('add-form-view')}}/></BranchConfigurationTreeViewContainer>}
              
            </StyledGridContainer>
        </GridItem>
      </GridContainer>
    </MainContentContainer>

      {/* BRANCH UPLOAD MODAL */}
      <UploadExcel
        isOpen={showUploadPopup}
        featureName='branch'
        onSuccess={() => {
          setShowUploadPopup(false);
          setViewType('list-view')
          handleFetchList(fetchOptions);
        }}
        onClose={() => setShowUploadPopup(false)}
      />
    </>
  );
};

export default withReactOptimized(BranchConfiguration);
