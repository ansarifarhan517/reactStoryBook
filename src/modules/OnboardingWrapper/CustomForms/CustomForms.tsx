import React, { Dispatch, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Card, Box, Grid, BreadCrumb, IconButton } from 'ui-library'
import { MemoryRouter, Switch, Route, useHistory } from 'react-router-dom'
import CustomFormsListView from './SubComponents/CustomFormsListView';
import AddCustomForm from "./SubComponents/AddCustomForm";
import CustomFormsContainer from './CustomFormsCss';
import { BreadCrumbContainer, Header, ActionButtonWrapper } from './CustomFormsStyledComponents';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { CustomFormsActions } from './CustomForms.actions';
import { rowData } from './CustomForms.models';
import { withReactOptimized } from '../../../utils/components/withReact';

export const basename = '';


const CustomForms = () => {
  /* General Hooks */
  const history = useHistory();
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
  
 /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<CustomFormsActions>>()
  const viewType = useTypedSelector((state) => state.customForms.listView.viewType);
  const pageLabels = useTypedSelector((state) => state.pageLabels.dynamicForms);
  const isFormEditable = useTypedSelector((state) => state.customForms.listView.form.isFormEditable);

  useEffect(() => {
    if (history?.location?.pathname === '/') {
      dispatch({ type: '@@customForms/FETCH_ACCOUNT_NAMES' });
      dispatch({ type: "@@customForms/SET_VIEW_TYPE", payload: "list-view" })
      dispatch({ type: '@@customForms/SET_FORM_EDITABLE', payload: false });
      dispatch({ type: '@@customForms/FETCH_TRIGGER_EVENTS_BY_ID_SUCCESS', payload: rowData });
      dispatch({ type: '@@customForms/SET_TRIGGER_EVENTS_LIST', payload: []})
    }
  }, [history]);

  const breadCrumbOptions = React.useMemo(() => {
    if(viewType === 'add-form-view') {
      
      return !isFormEditable ? [
        {
          id: 'list-view',
          label: dynamicLabels.customForms,
          disabled: false,
        },    
        {
          id: 'addCustomForms',
          label: dynamicLabels.addCustomForm,
          disabled: true,
        }
      ] : 
      [
        {
          id: 'list-view',
          label: dynamicLabels.customForms,
          disabled: false,
        },   
        {
          id: 'addCustomForms',
          label: dynamicLabels.duplicateCustomForm,
          disabled: true,
        }
      ]

  } else {
    return [
      {
        id: 'list-view',
        label: dynamicLabels.customForms,
        disabled: true,
      }
    ];
  }
  }, [viewType, isFormEditable, dynamicLabels]);

  const handleBreadCrumbChange = (id: string) => {
    dispatch({ type: "@@customForms/SET_VIEW_TYPE", payload: id });
    dispatch({ type: '@@customForms/SET_FORM_EDITABLE', payload: false });
    dispatch({ type: '@@customForms/FETCH_TRIGGER_EVENTS_BY_ID_SUCCESS', payload: rowData });
    dispatch({ type: '@@customForms/SET_TRIGGER_EVENTS_LIST', payload: []})
    history.push('/');
  }

  return (
    <>
      <Header>
        <BreadCrumbContainer><BreadCrumb options={breadCrumbOptions} onClick={(id) => handleBreadCrumbChange(id)} /></BreadCrumbContainer>

        {viewType === 'list-view' &&
          <ActionButtonWrapper title={dynamicLabels.ClickHereToAddCustomForm}>
            {pageLabels?.buttons.add && (
              <IconButton
                id="custom_form--actionbar--add"
                intent='page'
                iconVariant='icomoon-add'
                onClick={() => {
                  dispatch({ type: "@@customForms/SET_VIEW_TYPE", payload: "add-form-view" })
                  dispatch({ type: '@@customForms/FETCH_FORM_STRUCTURE' });
                  history.push('/addCustomForm')
                }}
              >
                {dynamicLabels.add}
              </IconButton>
            )}
          </ActionButtonWrapper>
        }
      </Header>
      <CustomFormsContainer>
        <div id='toast-inject-here' style={{ textAlign: 'center' }}></div>
        <>
          <Box display='flex' flexDirection='column' style={{ width: '100%', height: '90vh', marginRight: '2px' }}>

            {/* LIST VIEW CONTAINER */}
            <Grid container spacing={5} style={{ flexGrow: 1,  width: '100%', boxShadow: '0 2px 20px -10px #000' }}> {/* overflow: 'hidden'*/}
              <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                  <Switch>
                    <Route path={`${basename}/addCustomForm/:customFormGroupId`}><AddCustomForm /></Route>
                    <Route path={`${basename}/addCustomForm`}><AddCustomForm /></Route>
                    <Route path={`${basename}/`}><CustomFormsListView /></Route>
                  </Switch>
                </Card>
              </Grid>
            </Grid>
          </Box>

        </>
      </CustomFormsContainer>
    </>
  )
}

const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }

export default withReactOptimized(withMemoryRouter(CustomForms));