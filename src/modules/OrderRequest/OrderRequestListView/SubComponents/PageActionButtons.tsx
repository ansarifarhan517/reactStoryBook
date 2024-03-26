import React, { Dispatch } from 'react'
import { Box, IconButton, Tooltip, DateRangePicker, TextInput } from 'ui-library'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { tOrderRequestListViewAcions } from '../OrderRequestListView.actions'
import { sendGA } from '../../../../utils/ga'
import { IStateService } from 'angular-ui-router'
import moment from 'moment'
import useClientProperties from '../../../common/ClientProperties/useClientProperties'
import { TextInputStyled } from '../../../DeliveryAssociate/DeliveryAssociateListView/SubComponent/StyledSubComponent'

interface IPageActionButton {
  ngStateRouter: IStateService
  minDate: Date
  maxDate: Date
}

const PageActionButtons = ({ minDate, maxDate}: IPageActionButton) => {
  /** Redux */
  const dispatch = useDispatch<Dispatch<tOrderRequestListViewAcions>>()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const pageLabels = useTypedSelector(state => state.pageLabels.booking)
  const dateRangeOpen = useTypedSelector(state => state.orderRequest.listView.dateRangeOpn);


  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
  const format = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() ? `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A` : 'YYYY-MM-DD hh:mm AA'

  const dateFormatter = (date: Date) => {
    return moment(date).format(format)
  }


  const handleChange = (date: Date | null | [Date, Date]) => {
    if (date && Object.keys(date).length !== 0) {
      let stDate = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
      let etDate = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
      dispatch({
        type: '@@orderRequestListView/SET_SELECTED_DATE', payload: {
          minDate: stDate,
          maxDate: etDate
        }
      })

    }
  };

  const convertStringToDate = (input: string) => {
    const isValidDateEntered = moment(input, `${format}`).isValid()
    if (isValidDateEntered) {
      return moment(input, `${format}`).toDate()
    }
    return undefined
  }
  const dateToString = (d: Date) => {
    return moment(d).format(format)
  }


  {/* Page Action Buttons */ }
  return <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
    {pageLabels?.buttons.add && (
      <Tooltip message={`${dynamicLabels?.clickHereToAdd} ${dynamicLabels?.bookings}.`} hover={true}>
        <IconButton
          intent='page'
          iconVariant='icomoon-add'
          onClick={() => {

          }}
        >
          {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
        </IconButton>
      </Tooltip>)}
    {pageLabels?.buttons.upload && (
      <Tooltip
        message={`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels.booking_s}.`}
        hover
        arrowPlacement='center'
        messagePlacement='end'
      >
        <IconButton intent='page' style={{ marginRight: 0 }} iconVariant='icomoon-upload' onClick={() => {
          sendGA('Event New','Order Request - Upload button clicked')
          dispatch({ type: '@@orderRequestListView/SET_UPLOAD_MODAL', payload: true })

        }}>
          {dynamicLabels?.[pageLabels?.buttons.upload] || dynamicLabels?.Upload}
        </IconButton>
      </Tooltip>
    )}
    <div>
      <DateRangePicker
        onApply={handleChange}
        label='Date Range'
        variant='daterange'
        style={{
          position: 'absolute',
          right: '10px'
        }}
        startDate={moment(minDate, 'YYYY-MM-DD HH:mm:ss').toDate()}
        endDate={moment(maxDate, 'YYYY-MM-DD HH:mm:ss').toDate()}
        fromDateFormatter={dateFormatter}
        stringToDate={convertStringToDate}
        toDateFormatter={dateFormatter}
        timeInterval={15}
        timeFormat={12}
        open={!!dateRangeOpen}
        dateToString={dateToString}
        onOutsideClick={()=> dispatch({ type: '@@orderRequestListView/SET_OPEN_DATERANGE', payload: false })}
      >
        {({ value, open, setOpen }: any) => {
          const isOpen = !!(dateRangeOpen || open)
          return (
            <div>
              <Tooltip message={`${dynamicLabels?.chooseADateRangeToDisplay} ${dynamicLabels?.bookings} ${dynamicLabels?.duringThatTime}.`}
                hover
                hide={isOpen}
                 >
                <TextInputStyled onClick={() => setOpen(!(isOpen))}>
                  <TextInput
                    id="date-range-download"
                    style={{
                      margin: '0',
                      fontSize: '14px',
                      minHeight: '30px',
                      boxShadow: '0 2px 11px -5px #000',
                      width: "230px",
                      cursor: 'pointer',
                      height: '30px',
                      marginTop: '5px'
                    }}
                    readOnly
                    onClick={() => {
                      setOpen(!(isOpen))
                      dispatch({ type: '@@orderRequestListView/SET_OPEN_DATERANGE', payload: !dateRangeOpen })
                    }}
                    label={dynamicLabels?.transactionDate}
                    className='someClassname'
                    variant='withIcon'
                    iconVariant='calendar'
                    iconSize='xs'
                    iconStyle={{
                      padding: "7px",
                      minHeight: "30px",
                      height: "30px",
                      margin: '0',
                      marginTop: '5px'
                    }}
                    labelColor='grey.250'
                    color="primary.main"
                    border={false}
                    placeholder={dynamicLabels?.pleaseClickHere || 'Please Click Here'}
                    fullWidth
                    errorMessage={dynamicLabels.transactionDateMandatory}
                    value={`${moment(value[0]).format(format)} - ${moment(value[1]).format(format)}`}
                    onChange={() => {
                    }}
                  />
                </TextInputStyled>
              </Tooltip>
            </div>

          )
        }}
      </DateRangePicker>
    </div>
  </Box>


}

export default PageActionButtons