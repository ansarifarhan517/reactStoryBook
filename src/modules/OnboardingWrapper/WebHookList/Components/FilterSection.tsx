import React, { useEffect } from 'react'
import { FilterSectionWrapper,TextInputStyled , DateRangeWrapper, SearchWrapper} from './styled'
import { DropDown, DateRangePicker, TextInput, IconButton, Tooltip} from 'ui-library'
import { IModuleTypes , IEventTypes} from '../WebHookListView.models'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import useClientProperties from '../../../common/ClientProperties/useClientProperties'
import moment from 'moment-timezone'
import {getEventObj} from '../Utils'
import useDebounce from '../../../../utils/useDebounce'

type tDateRangeChildren = {
    value: [Date, Date]
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface IFilterSection  {
    moduleOptions: IModuleTypes[]
    eventOptions: IEventTypes[]
    moduleValue?: IModuleTypes | string | undefined
    eventValue?: IEventTypes | string 
    eventDate: Date[]
    onSearch: (moduleType: IModuleTypes | undefined, eventType: IEventTypes | undefined, eventDate: [Date,Date] ) => void
    onModuleChange: (value: string | undefined) => void
    loading?: boolean
}

const todaysDate = new Date()

const FilterSection = ({ moduleOptions, eventOptions, moduleValue, eventValue, eventDate, onSearch, onModuleChange,loading }:IFilterSection) => {

    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const clientProperties = useClientProperties(['DATEFORMAT','TIMEZONE'])
    const [module, setModule] = React.useState(moduleValue)
    const [eventType, setEventType] = React.useState(eventValue)
    const [dateRange, setDateRange] = React.useState([...eventDate])
    const [finalObj, setFinalObj]= React.useState<any>({
        module:undefined,
        event: undefined,
        date: [eventDate[0], eventDate[1]]
    })
    const debouncedFinalState = useDebounce(finalObj, 1000)

    useEffect(()=> {
        const eventTypeValue = eventOptions && eventValue ? getEventObj(eventOptions,eventValue) : undefined
        setEventType(eventTypeValue)

        eventDate[0] && eventDate[1] ? setDateRange([eventDate[0], eventDate[1]]) : setDateRange([todaysDate, todaysDate] )
    },[eventValue, eventDate, eventOptions])

    useEffect(() => {
        const moduleName = moduleValue && typeof moduleValue === 'string' ?  moduleValue.toLowerCase() : undefined;
        setModule(moduleName)

    },[moduleValue])
    
   useEffect(() => {
       
    onSearch(debouncedFinalState?.module, debouncedFinalState?.event, debouncedFinalState?.date)
   },[debouncedFinalState])

    const handleSearch = () => {
        let moduleObj = moduleOptions?.find((m) =>  m.clientRefMasterCd.toLowerCase() === module)
        
        const eventObj = eventOptions?.find((m) => m.clientRefMasterCd+'_'+m.clientRefMasterType === eventType)
        moduleObj = module ? moduleObj : moduleOptions?.find((m) => {
            let value = eventObj?.clientRefMasterType.replace('EVENT_TYPE_','')
            return value && m.clientRefMasterCd.toLowerCase() === value.toLowerCase()
        }) 

        let moduleOBJ;
        if(typeof module === 'string') {
            moduleOBJ = module ? moduleOptions?.find((m) => m.clientRefMasterCd.toLowerCase() === module) : undefined
        }
        
        setFinalObj({
            module : moduleOBJ , 
            event: eventObj, 
            date: [dateRange[0], dateRange[1]]
        })

    }

    const dateFormatter = React.useCallback((date: Date) => {
        return moment(date).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())
    },[clientProperties])

    const onEventChange = (value:string) => {
       value ? setEventType(value) :  setEventType(undefined)
    }

    const onDateChange = (date: Date | [Date,Date] | null) => {
        if(date !== null) {
            Array.isArray(date) ? setDateRange([...date]) : setDateRange([date, date])
        }  
    }

    const handleModuleChange = (value: string) => {
        setModule(value)
        onModuleChange(value)
        setEventType(undefined)
    }

    const stringToDate = React.useCallback((str: string) => {
        return moment(str, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`).toDate()
    }, [clientProperties])


    return (
        <FilterSectionWrapper>

            {/* Module Type */}
            <DropDown
                variant='form-select'
                optionList={moduleOptions}
                label={dynamicLabels.Module}
                onChange={handleModuleChange}
                value={module}
                width='100%'
               
            />

            {/* event */}
            <DropDown
                variant='form-select'
                optionList={eventOptions}
                label={dynamicLabels.eventType}
                onChange={onEventChange}
                value={eventType}
                width='100%'
               
            />

            {/* date range picker */}
            <DateRangePicker
                onApply={onDateChange}
                label={dynamicLabels.eventDate}
                variant='daterange'
                timeFormat={24}
                showTime={false}
                style={{
                    position: 'absolute',
                    right: '0px',
                    marginTop: '-10px'
                
                }}
                startDate={dateRange[0] || todaysDate}
                endDate={dateRange[1] || todaysDate}
                fromDateFormatter={dateFormatter}
                toDateFormatter={dateFormatter}
                stringToDate={stringToDate}
            >
            {({ value, open, setOpen }: tDateRangeChildren) => (
                <DateRangeWrapper>
                    <TextInputStyled onClick={() => setOpen(!open)}>
                    <TextInput
                        id='eventDate_webhookHistory' 
                        name='eventDate_webhookHistory' 
                        className='eventDate_webhookHistory'
                        label={dynamicLabels.eventDate}
                        variant='withIcon'
                        iconVariant='calendar'
                        iconSize='sm'
                        labelColor='text.inputLabel.default'
                        placeholder='Please Click Here'
                        style={{
                            width:'100%'
                        }}
                        value={moment(value[0]).format(clientProperties?.DATEFORMAT?.propertyValue?.replace('dd','DD'))+'-'+moment(value[1]).format(clientProperties?.DATEFORMAT?.propertyValue.replace('dd','DD'))}
                        iconStyle={{ padding: '11px', margin: '18px 0px'}}
                    />
            
                    </TextInputStyled>
                </DateRangeWrapper>
            )}
        </DateRangePicker>
        <SearchWrapper>
                <Tooltip message={dynamicLabels.webhook_search}
                hover
                messagePlacement={'end'}
                arrowPlacement={'center'}
                >   
                <IconButton
                    id="webhooks--actionbar--search"
                    onClick={handleSearch}
                    primary={true}
                    disabled={loading}
                    intent='default'
                    iconVariant='search'
                    children='Search'
                    className="SearchButton"
                    
                />
                </Tooltip>
        </SearchWrapper>
        
        </FilterSectionWrapper>
    )
}

export default FilterSection