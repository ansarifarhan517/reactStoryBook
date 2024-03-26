import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { Box, BreadCrumb, IconButton, Grid, Card, DateRangePicker, Tooltip, TextInput } from "ui-library";
import { MemoryRouter, Switch, Route, useHistory } from 'react-router-dom'
import { withReactOptimized } from "../../../utils/components/withReact";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { BreadCrumbContainer, Header, ActionButtonWrapper, ExceptionHandlingContainer,  ContainerCSS } from './ExceptionHandlingStyledComponents';
import { ExceptionHandlingActions } from "./ExceptionHandling.actions";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import AddExceptionForm from "./Components/AddExceptionForm";
import AllExceptionListView from "./Components/AllExceptionListView";
import { tBreadcrumbState, ViewTypes } from "./ExceptionHandling.models";
import RaisedExceptions from "./Components/RaisedExceptions";
import moment from "moment";
import useClientProperties from "../../common/ClientProperties/useClientProperties";
import { sendGA } from "../../../utils/ga";

export const basename = '';

export interface IBranchConfigurationProp {
    currentStep?: string
}

const ExceptionHandling = ({ currentStep }: IBranchConfigurationProp) => {
    /* General Hooks */
    const history = useHistory();
    const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.exceptionHandling);
    const pageLabels = useTypedSelector((state) => state.pageLabels.allExceptions);
    const raisedExceptionPageLabels = useTypedSelector((state) => state.pageLabels.raisedExceptions);
    const isFormEditable = useTypedSelector((state) => state.exceptionHandling.form.isEditable);
    const breadcrumbState = useTypedSelector(state => state.exceptionHandling.listview.raisedExceptions.breadcrumbState)
    const format = clientProperties?.DATEFORMAT?.propertyValue ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() : 'DD-MM-YYYY'

    const [selectedDate, setSelectedDates] = useState<any>({
        startDate: moment.utc(moment(Date()).subtract(7, 'days').startOf('day')).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment.utc(moment(Date()).endOf('day')).format('YYYY-MM-DD HH:mm:ss'),
    });
    const [minDate, setMinDate] = useState<any>(moment(Date()).subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'));
    const [maxDate, setMaxDate] = useState<any>(moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss'));

    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<ExceptionHandlingActions>>();
    const viewType = useTypedSelector((state) => state.exceptionHandling.viewType);


    useEffect(() => {
        if (history?.location?.pathname === '/') {
            sendGA('Settings', `Click - Exception Management - All Exceptions`);
            dispatch({ type: "@@exceptionHandling/SET_VIEW_TYPE", payload: "allExceptions" });
            dispatch({ type: "@@exceptionHandling/RESET_EXCEPTION_DATA" });
            dispatch({ type: "@@exceptionHandling/SET_FORM_EDITABLE", payload: false });
        }
    }, [history]);

    useEffect(() => {
        if (currentStep === 'RAISED_EXCEPTIONS') {
            sendGA('Settings', `Click - Exception Management - Raised Exceptions`);
            history.push("/raisedExceptions");
        }
    }, [currentStep])

    useEffect(() => {
        dispatch({ type: '@@exceptionHandling/FETCH_EXCEPTION_STAGE_LIST' });
        dispatch({ type: '@@exceptionHandling/FETCH_EXCEPTION_TYPE_LIST' });
        dispatch({ type: '@@exceptionHandling/FETCH_EXCEPTION_APPLIES_TO' });
        dispatch({ type: '@@exceptionHandling/FETCH_EXCEPTION_EVENTS' });
    }, [])

    const breadCrumbOptions = React.useMemo(() => {
        if (currentStep === 'EXCEPTION_CONFIGURATION') {
            if (viewType === 'addExceptionForm') {
                if (isFormEditable) {
                    return [
                        {
                            id: 'exceptionManagement',
                            label: dynamicLabels.exceptionManagement,
                            disabled: true,
                        },
                        {
                            id: 'allExceptions',
                            label: dynamicLabels.allExceptions,
                            disabled: false,
                        },
                        {
                            id: 'addExceptionForm',
                            label: dynamicLabels.updateException,
                            disabled: true,
                        }
                    ]
                } else {
                    return [
                        {
                            id: 'exceptionManagement',
                            label: dynamicLabels.exceptionManagement,
                            disabled: true,
                        },
                        {
                            id: 'allExceptions',
                            label: dynamicLabels.allExceptions,
                            disabled: false,
                        },
                        {
                            id: 'addExceptionForm',
                            label: dynamicLabels.addException,
                            disabled: true,
                        }
                    ]
                }
            } else {
                return [
                    {
                        id: 'exceptionManagement',
                        label: dynamicLabels.exceptionManagement,
                        disabled: true,
                    },
                    {
                        id: 'allExceptions',
                        label: dynamicLabels.allExceptions,
                        disabled: true,
                    }
                ]
            }
        } else {
            return [
                {
                    id: 'allExceptions',
                    label: dynamicLabels.allExceptions,
                    disabled: true,
                },
                { id: breadcrumbState, label: raisedExceptionPageLabels?.dropdownValues?.[breadcrumbState], disabled: false },
            ]
        }
    }, [viewType, dynamicLabels, isFormEditable, currentStep, raisedExceptionPageLabels, breadcrumbState]);

    const menuOptionList = React.useMemo(() =>
    raisedExceptionPageLabels?.dropdownValues ?
      Object.keys(raisedExceptionPageLabels.dropdownValues).map((key: string) => ({
        value: key,
        label: raisedExceptionPageLabels?.dropdownValues?.[key],
        id: key
      })) : [],
    [])

    const handleBreadCrumbChange = (id: ViewTypes) => {
        dispatch({ type: "@@exceptionHandling/SET_VIEW_TYPE", payload: id })
        dispatch({ type: "@@exceptionHandling/RESET_EXCEPTION_DATA" });
        dispatch({ type: "@@exceptionHandling/SET_FORM_EDITABLE", payload: false });
        if (id === 'allExceptions') {
            history.push('/');
            dispatch({ type: '@@exceptionHandling/RESET_FORM_STRUCTURE' });
        } else {
            history.push(`/${id}`)
        }
    }

    const changeExceptionListView = (selectedOption: string) => {
        const _breadCrumbState = selectedOption as tBreadcrumbState
        dispatch({ type: '@@exceptionHandling/SET_BREADCRUMB_STATE', payload: _breadCrumbState})
    }

    const handleChange = (date: Date | null | [Date, Date]) => {
        if (date && Object.keys(date).length !== 0) {
          let startDate = moment.utc(moment(date[0])).format('YYYY-MM-DD HH:mm:ss')
          let endDate = moment.utc(moment(date[1])).format('YYYY-MM-DD HH:mm:ss')
          
          sendGA('Raised Exceptions', `Click - Apply Date Range Selector - ${startDate} - ${endDate}`);
          
          setSelectedDates({ startDate: startDate, endDate: endDate });
          setMinDate(moment(date[0]).format('YYYY-MM-DD HH:mm:ss'))
          setMaxDate(moment(date[1]).format('YYYY-MM-DD HH:mm:ss'))
        }
    };

    const getFormattedDate = (date: Date) => {
        return moment(date).format(`${format} hh:mm A`);
    }
    return (<ContainerCSS listViewType={currentStep}>
        <Header>
            <BreadCrumbContainer>
            {currentStep === 'EXCEPTION_CONFIGURATION' ? 
                <BreadCrumb options={breadCrumbOptions} onClick={(id) => handleBreadCrumbChange(id)} />
                :
                <BreadCrumb options={breadCrumbOptions} optionList={menuOptionList} onClick={(id) => changeExceptionListView(id)} />
            }
            
        </BreadCrumbContainer>

            {currentStep === 'EXCEPTION_CONFIGURATION' && viewType === 'allExceptions' ?
                <ActionButtonWrapper title={dynamicLabels.ClickHereToAddCustomForm}>
                    {pageLabels?.buttons.add && (
                        <IconButton
                            id="exceptions--actionbar--add"
                            intent='page'
                            iconVariant='icomoon-add'
                            onClick={() => {
                                sendGA('Settings', `Click - Add Exception`);
                                dispatch({ type: "@@exceptionHandling/SET_VIEW_TYPE", payload: "addExceptionForm" })
                                history.push('/addExceptionForm')
                            }}
                        >
                            {dynamicLabels.add}
                        </IconButton>
                    )}
                </ActionButtonWrapper>
                : currentStep === "RAISED_EXCEPTIONS" &&
                <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px' style={{ margin: '18px 0' }}>
                    <div style={{ minWidth: '238px' }}>
                        <DateRangePicker
                            onFromChange={handleChange}
                            onToChange={handleChange}
                            onApply={handleChange}
                            label={'Date Range'}
                            variant='daterange'
                            style={{
                                position: 'absolute',
                                right: '10px'
                            }}
                            startDate={new Date(minDate)}
                            endDate={new Date(maxDate)}
                            fromDateFormatter={getFormattedDate}
                            toDateFormatter={getFormattedDate}
                            className="raisedExceptionDateSelector"
                        >
                            {({ value, open, setOpen }: any) => (
                            <div>
                                <div onClick={() => { sendGA('Raised Exceptions',`Click - Date Range Selector`); setOpen(!open)}}>
                                <Tooltip message={`${dynamicLabels?.chooseADateRangeToDisplay} ${dynamicLabels?.Exceptions} ${dynamicLabels?.raised || "raised"} ${dynamicLabels?.duringThatTime}.`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end" isWordWrap={true}>
                                    <TextInput
                                    id='exceptionDates'
                                    style={{
                                        margin: '0',
                                        fontSize: '12px',
                                        minHeight: '30px',
                                        boxShadow: '0 2px 11px -5px #000',
                                        width: '200px'
                                    }}
                                    className='someClassname'
                                    variant='withIcon'
                                    iconVariant='calendar'
                                    iconSize='xs'
                                    iconStyle={{ padding: '7px 7px 7px 7px' }}
                                    labelColor='grey.250'
                                    color="primary.main"
                                    border={false}
                                    placeholder='Please Click Here'
                                    fullWidth
                                    value={`${moment(value[0]).format(`${format} hh:mm A`)} - ${moment(value[1]).format(`${format} hh:mm A`)}`}
                                    onChange={() => 'On change clicked'}
                                    />
                                </Tooltip>
                                </div>
                            </div>
                            )}
                        </DateRangePicker>
                    </div>
                </Box>
            }
        </Header>
        <ExceptionHandlingContainer>
            <div id='toast-inject-here' style={{ textAlign: 'center' }}></div>
            <>
                {currentStep === "RAISED_EXCEPTIONS" ?
                    <Switch>
                        <Route path={`${basename}/raisedExceptions`}><RaisedExceptions selectedDate={selectedDate} /></Route>
                    </Switch>
                    :
                    <Box display='flex' flexDirection='column' style={{ width: '100%', height: '90vh', marginRight: '2px' }}>

                        {/* LIST VIEW CONTAINER */}
                        <Grid container spacing={5} style={{ flexGrow: 1, width: '100%', boxShadow: '0 2px 20px -10px #000' }}> {/* overflow: 'hidden'*/}
                            <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                                <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                                    <Switch>
                                        <Route path={`${basename}/addExceptionForm/:exceptionGroupId`}><AddExceptionForm /></Route>
                                        <Route path={`${basename}/addExceptionForm`}><AddExceptionForm /></Route>
                                        <Route path={`${basename}/`}><AllExceptionListView /></Route>
                                    </Switch>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                }

            </>
        </ExceptionHandlingContainer>

    </ContainerCSS>
    )
}

const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
    (props: P) => {
        return <MemoryRouter><Component {...props as P} /></MemoryRouter>
    }


export default withReactOptimized(withMemoryRouter(ExceptionHandling));