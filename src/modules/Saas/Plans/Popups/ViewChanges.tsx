import React, { Dispatch, useMemo } from 'react'
import { FontIcon, Accordion, Modal, ModalHeader } from 'ui-library'
import { useDispatch } from 'react-redux'
import { IPlansFormActions } from '../PlansForm.model'
import { AccordionHeaderTitle } from '../Accordion/StyledAccodion'
import AccordionTable from '../Accordion/AccordionTable'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import moment from 'moment'
import { AccordionStyled } from '../StyledPlans'


export const NewChanges = ({ }: { [key: string]: any }) => {
    const dispatch = useDispatch<Dispatch<IPlansFormActions>>()
    const nextBillingDate = useTypedSelector(state => state.saas.plans.plansData?.scheduledChanges?.nextBillingDate)
    const viewChanges = useTypedSelector(state => state.saas.plans.viewChanges)
    const date = nextBillingDate ? moment(nextBillingDate).format('DD-MM-YYYY') : ''
    return <span style={{ marginTop: '12px', display: 'flex', marginBottom: '13px' }}><FontIcon color='error.warning' variant='icomoon-warning-circled' size='sm' />
        <div style={{ marginTop: '2px', marginLeft: '5px' }}>There are some changes scheduled on {date}.
         <a onClick={() => { dispatch({ type: '@@plansForm/SET_VIEW_CHANGES_POPUP', payload: !viewChanges }) }}>View Changes</a>
        </div></span>
}


const ViewChanges = () => {
    const dispatch = useDispatch<Dispatch<IPlansFormActions>>()
    const planViewChange = useTypedSelector(state => state.saas.plans.viewChangesData?.plan)
    const oneTime = useTypedSelector(state => state.saas.plans.viewChangesData?.oneTime)
    const recurring = useTypedSelector(state => state.saas.plans.viewChangesData?.recurring)
    const viewChanges = useTypedSelector(state => state.saas.plans.viewChanges)
    const nextBillingDate = useTypedSelector(state => state.saas.plans.plansData?.scheduledChanges?.nextBillingDate)
    const planColumnNames = useMemo(() => planViewChange?.map(plan => plan.label), [planViewChange])
    const oneTimeListValues = useMemo(() => oneTime && Object.values(oneTime)?.map(plan => plan), [oneTime])
    const recurringListValues = useMemo(() => recurring && Object.values(recurring)?.map(plan => plan), [recurring])
    const oneTimeColumnNames = useMemo(() => oneTimeListValues && oneTimeListValues?.[0]?.map(plan => plan.label), [oneTimeListValues])
    const recurringColumnNames = useMemo(() => recurringListValues && recurringListValues?.[0]?.map(plan => plan.label), [recurringListValues])
    const expandedSections = useMemo(() => {
        const expandedObj = {}
        const keys = ['planDetails', 'onetimeAddon', 'recurringAddon']
        keys.forEach(key => {
            expandedObj[key] = false
        })
        return expandedObj
    }, [])
    const [expanded, setExpanded] = React.useState(expandedSections)
    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        const newExpandedSection = { ...expandedSections }
        newExpandedSection[accordianId] = isExpanded
        setExpanded(newExpandedSection)
    }

    return <Modal
        open={viewChanges}
        onToggle={(value) => {
            dispatch({ type: '@@plansForm/SET_VIEW_CHANGES_POPUP', payload: value })
        }}
        width='800px'
        children={{
            header: <ModalHeader
                headerTitle={`Changes will be effective from ${moment(nextBillingDate).format('Do MMMM[,] YYYY')}`}
                handleClose={() => dispatch({ type: '@@plansForm/SET_VIEW_CHANGES_POPUP', payload: false })}
                imageVariant='icomoon-close'
                headerStyle={{ fontSize: '15px' }}
                width='100%'
            />,
            content: <AccordionStyled>< Accordion key='planDetials' id='planDetials' expanded={!!expanded?.['planDetials']
            } onToggle={handleToggle} >
                {{
                    header: (<AccordionHeaderTitle>Plan Details</AccordionHeaderTitle>),
                    content: (planColumnNames ? <AccordionTable
                        columnNames={planColumnNames || ['Plan Details', 'Number of Delivery Associates', 'Pricing Option', 'Rate', 'Price']}
                        listOfValues={planViewChange ? [planViewChange] : undefined}
                    /> : <div className='noData'><span>There is no data available.</span></div>),
                }}
            </Accordion >
                <Accordion key='recurringAddon' id='recurringAddon' expanded={!!expanded?.['recurringAddon']}
                    onToggle={handleToggle}>
                    {{
                        header: (<AccordionHeaderTitle>Recurring Addon Details</AccordionHeaderTitle>),
                        content: (recurringColumnNames ? <AccordionTable
                            columnNames={recurringColumnNames || []}
                            listOfValues={recurringListValues}
                        // listOfValues={oneTimeListValues && Object.keys(oneTimeListValues).length ? Object.values(oneTimeListValues) : []}
                        /> : <div className='noData'><span>There is no data available.</span></div>),
                    }}
                </Accordion>
                <Accordion key='onetimeAddon' id='onetimeAddon' expanded={!!expanded?.['onetimeAddon']} onToggle={handleToggle}>
                    {{
                        header: (<AccordionHeaderTitle>One-time Addon Details</AccordionHeaderTitle>),
                        content: (oneTimeColumnNames ? <AccordionTable
                            columnNames={oneTimeColumnNames || []}
                            listOfValues={oneTimeListValues}
                        // listOfValues={recurring && Object.keys(recurring).length ? Object.values(recurring): []}
                        /> : <div className='noData'><span>There is no data available.</span></div>),
                    }}
                </Accordion></AccordionStyled>
        }}
    />




}
export default ViewChanges