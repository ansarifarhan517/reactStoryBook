import React, { useState, useEffect } from 'react';
import {
  IDeliveryAssociateListPayloadData,
  IReasonsForLessDepositPayloadData,
} from '../CashTransactionList.models';
/*, Dispatch, useEffect */
import moment from 'moment';
import {
  Modal,
  ModalHeader,
  Box,
  IconButton,
  DropDown,
  TextInput,
  DatePicker,
  FileUpload,
  useToast,
  AsyncFormSelect
} from 'ui-library';
import axios from '../../../../utils/axios';
import apiMappings from '../../../../utils/apiMapping';
import "./../CashTransactionList.css"
import { OptionsType } from 'react-select'
import useClientProperties from '../../../common/ClientProperties/useClientProperties';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
/* import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import { CashTransactionListActions } from '../CashTransactionList.actions';
import { useDispatch } from 'react-redux'; */

export interface IAddCashTransactionProps {
  isAddTransactionModalVisible: boolean;
  setAddTransactionVisible: Function;
  // deliveryAssociateList: Array<IDeliveryAssociateListPayloadData>;
  lessDepositReasons: Array<IReasonsForLessDepositPayloadData>;
  handleFetchData: Function;
  setSelectedDates: Function;
}

export interface IDeliveryAssociateData {
  value: number,
  label: string
}

export interface IFileData {
  id: string | number;
  filename: string;
  [key: string]: any;
}

const AddCashTransaction = (props: IAddCashTransactionProps) => {

  const toast = useToast();

  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.paymentTransaction)
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
  const [deliveryAssociate, setDeliveryAssociate] = useState<number>(0);
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [lessDepositReason, setLessDepositReason] = useState<number>(0);
  const [transactionId, setTransactionId] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  const [comments, setComments] = useState<string>('');
  const [associateList, setAssociateList] = useState<Array<IDeliveryAssociateListPayloadData>>([])
  const [lessDepositReasonOptions, setLessDepositReasonOptions] = useState<
    Array<object>
  >([]);
  const [outStandingAmount, setOutstandingAmount] = useState<number>(0);

  const [deliveryAssociateError, setDeliveryAssociateError] = useState<boolean>(
    false
  );
  const [transactionAmountError, setTransactionAmountError] = useState<boolean>(
    false
  );
  const [transactionIdError, setTransactionIdError] = useState<boolean>(false);
  const [transactionTypeError, setTransactionTypeError] = useState<boolean>(
    false
  );
  const [transactionDateError, setTransactionDateError] = useState<boolean>(
    false
  );
  const [lessDepositReasonErrror, setLessDepositReasonErrror] = useState<boolean>(false)
  const [fileUploadError, setFileUploadError] = useState<boolean>(false);

  const [payload] = useState<any>(new FormData());
  const [transactionProofsUpload, setTransactionProofsUpload] = useState<Array<IFileData>>([]);
  const [uploads, setUploads] = useState<Array<File>>([]);


  const {
    isAddTransactionModalVisible,
    setAddTransactionVisible,
    lessDepositReasons,
    setSelectedDates
  } = props;


  
  useEffect(() => {

    const reasons = lessDepositReasons.map(
      (reason: IReasonsForLessDepositPayloadData) => {
        return {
          value: reason.clientRefMasterId,
          label: reason.clientRefMasterDesc,
        };
      }
    );

    let selectedAssociate = associateList.find(
      (associate: IDeliveryAssociateListPayloadData) =>
        associate.deliveryMediumMasterId === deliveryAssociate
    );
    let outstanding =
      selectedAssociate?.outstandingAmount !== undefined
        ? selectedAssociate.outstandingAmount
        : 0;

    setLessDepositReasonOptions(reasons);
    setOutstandingAmount(!isNaN(outstanding) ? parseFloat(parseFloat(String(outstanding)).toFixed(2)): 0);
    setTransactionAmount(!isNaN(Number(outstanding)) ? Math.sign(Number(outstanding)) === -1 ? 0 : parseFloat(parseFloat(String(outstanding)).toFixed(2)): 0)
    selectedAssociate
  }, [associateList, lessDepositReasons, deliveryAssociate]);


  const ListViewOption = [
    {
      value: "Credit",
      label: dynamicLabels.credit,
      // type: dynamicLabels.credit,
      description: `${dynamicLabels.creditDesc}${dynamicLabels.deliveryAssociateName}`
    },
    {
      value: "Debit",
      label: dynamicLabels.debit,
      // type: dynamicLabels.debit,
      description: `${dynamicLabels.debitDesc}${dynamicLabels.deliveryAssociateName}.`
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = []; 
    let fileNames = [];

    fileNames = [...transactionProofsUpload]
    files = [...uploads];

    if (e.target.files && e.target.files.length) {
      for (var i = 0; i < e.target.files.length; i++) {
        files.push(e.target.files[i]);
        fileNames.push({id: fileNames.length+1, filename: e.target.files[i].name, file: e.target.files[i]})
      }   
      setUploads(files)
      setFileUploadError(files.length > 5 ? true : false)
      setTransactionProofsUpload(fileNames)
    }

  };

  const handleFileRemove = (file: IFileData) => {
    let transactionProofs =  transactionProofsUpload.filter((fileName: any) => fileName.id !== file.id);
    let files = uploads.filter((upload:File) => upload !== file.file);
    setTransactionProofsUpload(transactionProofs);
    setFileUploadError(files.length > 5 ? true : false)
    setUploads(files);
  }

  const onTransactionAmountChange = (e: any) => {
    const decimal_index = e.target.value.indexOf('.');
    if(decimal_index > -1){
        var decimals = e.target.value.substring(decimal_index, e.target.value.length+1);
        if(decimals.length > 2 && e.keyCode !== 8){
           e.preventDefault();
        }
    }
  } 

  const handleAddTransaction = async () => {
    setDeliveryAssociateError(deliveryAssociate === 0);
    setTransactionAmountError(transactionAmount == 0 || isNaN(transactionAmount));
    setTransactionIdError(transactionId === '');
    setTransactionTypeError(transactionType === '');
    // setTransactionDateError(transactionDate === '');
    setLessDepositReasonErrror(transactionAmount < outStandingAmount && !lessDepositReason)
    setFileUploadError(uploads.length > 5 || uploads.length === 0 ? true : false)

    if (
      !deliveryAssociateError &&
      !transactionAmountError &&
      !transactionIdError &&
      !transactionTypeError &&
      !transactionDateError &&
      !fileUploadError
      ) {
        
        let reasonOption = lessDepositReasons.find((reason: IReasonsForLessDepositPayloadData) => reason.clientRefMasterId === lessDepositReason && reason.clientRefMasterDesc);
        let shipment = associateList.find((associate: IDeliveryAssociateListPayloadData) => associate.deliveryMediumMasterId === deliveryAssociate && associate.shipmentLocationId)
        payload.append(
          "data", JSON.stringify({
                transactionId: transactionId,
                transactionType: transactionType,
                transactionAmount: transactionAmount,
                outstandingAmount: outStandingAmount,
                transactionDate: moment.tz(transactionDate, clientProperties?.TIMEZONE.propertyValue).utc().format('x'),
                reasonId: lessDepositReason,
                reason: reasonOption?.clientRefMasterDesc,
                deliveryMediumMasterId: deliveryAssociate,
                comment: comments,
                pendingAmount: shipment?.pendingAmount,
                transactionMode: "Web",
                // shipmentLocationId: shipment?.shipmentLocationId
            }),  
          )
            uploads.map((file:File) => {
              payload.append("transactionProofsUpload", file)
            })

      try {        
        const { data: { message, status } } = await axios.post(apiMappings.cashTransaction.addTransaction.addTransaction, payload,  {
          headers: {
          'Content-Type': 'multipart/form-data'
        }})

        if (status === 412) {          
          message && toast.add(message, 'warning', false)
          payload?.delete("data")
          uploads.map(() => {
            payload?.delete("transactionProofsUpload")
          })
        } else if(status === 200) {        
          message && toast.add(message, 'check-round', false)
          setAddTransactionVisible(false)
          let startDate = moment.utc(moment(Date()).startOf('day')).format('YYYY-MM-DD HH:mm:ss')
          let endDate = moment.utc(moment(Date())).format('YYYY-MM-DD HH:mm:ss')
          setSelectedDates({ startDate: startDate, endDate: endDate });
          // handleFetchData({id: 'transaction', flag: true});
      }
      } catch (error){      
        if (error?.response.status === 412) {          
          error.response.data.message && toast.add(error?.response?.data?.message, 'warning', false)
          payload?.delete("data")
          uploads.map(() => {
            payload?.delete("transactionProofsUpload")
          })
        } else {
          error && toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
          setAddTransactionVisible(true)
        }
      }
    } else {
      return;
    }
  };

  const [options] = React.useState<OptionsType<any>>([])
  const handleLoadOptions = async(inputValue: string, callback: (options: OptionsType<any>) => void)  => {
      if (inputValue.length > 2) {     
        const { data : {data: result} } = await axios.get(apiMappings.cashTransaction.addTransaction.getDeliveryAssociateList + `?searchParam=${inputValue}`)
        setAssociateList(result);
        const newOptions = result.map(
          (associate: IDeliveryAssociateListPayloadData) => {
            return {
              value: associate.deliveryMediumMasterId,
              label: `${associate.deliveryAssociateName} (${associate.employeeId})`,
            };
          }
        );
        callback(newOptions)
      } else {
        callback(options)
      }
  }

  return (
    <Modal
      onToggle={() => {}}
      open={isAddTransactionModalVisible}
      width='704px'
      children={{
        header: (
          <ModalHeader
            headerTitle={dynamicLabels.addTransaction}
            width='704px'
            handleClose={() => setAddTransactionVisible(false)}
            imageVariant='icomoon-close'
            headerStyle={{ fontSize: '15px' }}
          />
        ),
        content: (
          <Box p='0px'>
            <Box display='flex' justifyContent='space-between'>
              <div style={{ width: '322px' }}>

                <AsyncFormSelect
                  loadOptions={handleLoadOptions}
                  cacheOptions
                  label={dynamicLabels.deliveryAssociateName}
                  required
                  error={deliveryAssociateError}
                  errorMessage={dynamicLabels.deliveryAssociateNameMandatory}
                  placeholder={dynamicLabels.deliveryAssociateName}
                  onChange={(e: any) => {
                    setDeliveryAssociateError(!e ? true : false)
                    setDeliveryAssociate(e?.value);
                  }}
                />
              </div>

              <TextInput
                id='outstandingAmount'
                name='outstandingAmount'
                className='outstandingAmount'
                label={dynamicLabels.outstandingAmount}
                labelColor='text.inputLabel.default'
                placeholder={dynamicLabels.outstandingAmount}
                maxLength={10}
                disabled={true}
                style={{ width: '322px' }}
                value={outStandingAmount}
              />
            </Box>
        
            <Box display='flex' justifyContent='space-between'>
              <TextInput
                id='transactionAmount'
                name='transactionAmount'
                className='transactionAmount'
                type="number"
                label={dynamicLabels.transactionAmount}
                labelColor='text.inputLabel.default'
                placeholder={dynamicLabels.transactionAmount}
                value={transactionAmount > 0 ? transactionAmount : "" }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTransactionAmountError((Number(e.target.value) == 0 || isNaN(Number(e.target.value))) ? true : false)
                    // setTransactionAmount(!isNaN(Number(e.target.value)) ? Math.sign(Number(e.target.value)) === -1 ? 0 : parseFloat(parseFloat(String(e.target.value)).toFixed(2)): 0)
                    setTransactionAmount(Number(e.target.value))
                }}
                maxLength={10}
                max={outStandingAmount}
                min={0}
                onKeyDown={onTransactionAmountChange}
                error={transactionAmountError}
                errorMessage={transactionAmountError ? dynamicLabels.transactionAmountMandatory : transactionAmount > outStandingAmount ? dynamicLabels.greaterTransactionAmountError : "" }
                required
                style={{ width: '322px' }}
              />
              <DropDown
                variant='form-select'
                className = {transactionAmount < outStandingAmount ? '' : 'disableDropdownClass'}
                optionList={lessDepositReasonOptions}
                label={dynamicLabels.reasonForLessDeposit}
                loading={false}
                onChange={(e: number) => {
                  setLessDepositReasonErrror(!e && transactionAmount < outStandingAmount)  
                  setLessDepositReason(e)
                }}
                disabled={transactionAmount < outStandingAmount ? false : true}
                placeholder={dynamicLabels.reasonForLessDeposit}
                value={lessDepositReason}
                width='322px'
                error={lessDepositReasonErrror}
                errorMessage={dynamicLabels.reasonForLessDepositMandatory}
                required= {transactionAmount < outStandingAmount}
              />
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <TextInput
                id='transactionId'
                name='transactionId'
                className='transactionId'
                label={dynamicLabels.transactionId}
                labelColor='text.inputLabel.default'
                placeholder={dynamicLabels.transactionId}
                value={transactionId}
                onChange={(e: any) => {
                    setTransactionIdError(e.target.value === '')
                    setTransactionId(e.target.value)
                }}
                maxLength={11}
                required
                error={transactionIdError}
                errorMessage={dynamicLabels.transactionIdMandatory}
                style={{ width: '322px' }}
              />
              <DropDown
                variant='form-select'
                optionList={ListViewOption}
                label={dynamicLabels.transactionType}
                required={true}
                onChange={(e: string) => {
                  setTransactionTypeError(!e ? true : false)
                  setTransactionType(e)
                }}
                error={transactionTypeError}
                errorMessage={dynamicLabels.transactionTypeMandatory}
                placeholder={dynamicLabels.transactionType}
                value={transactionType}
                width={'322px'}
                showDescription={true}
              />
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <DatePicker
                onChange={(e: any) =>
                 { 
                    setTransactionDateError(e === '' ? true : false)
                    setTransactionDate(e)}
                }
                variant='datetime'
                label={dynamicLabels.transactionDate}
                placeholder={dynamicLabels.transactionDate}
                required
                timeInterval={15}
                timeFormat={24}
                tillMaxDate={ new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate(),
                  new Date().getHours(),
                  new Date().getMinutes()
                )}
                style={{
                  position: 'absolute',
                  top: -200,
                  right: 'auto',
                }}
              >
                {({ value, open, setOpen }) => (
                  <div onClick={() => setOpen(!open)}>
                    <TextInput
                      id='transactionDate'
                      name='transactionDate'
                      label={dynamicLabels.transactionDate}
                      labelColor='text.inputLabel.default'
                      className='transactionDate'
                      placeholder={dynamicLabels.transactionDate}
                      variant='withIcon'
                      iconVariant='calendar'
                      iconSize='md'
                      required
                      error={transactionDateError}
                      errorMessage={dynamicLabels.transactionDateMandatory}                      
                      value={moment(value).format('MM/DD/YYYY HH:mm A')}
                      onChange={() => {}}
                      iconStyle={{ padding: '8px 8px 8px 8px' }}
                      style={{ width: '281px' }}
                    />
                  </div>
                )}
              </DatePicker>

              <Box style={{ width: '322px', marginTop: '-16px' }}>
                <FileUpload
                  id='proofOfTransaction'
                  name='proofOfTransaction'
                  className='proofOfTransaction'
                  files={transactionProofsUpload}
                  onFileClick={() => {}}
                  onFileRemove={(e: IFileData) => handleFileRemove(e)}
                  label={dynamicLabels.proofOfTransaction}
                  labelColor='text.inputLabel.default'
                  placeholder={dynamicLabels.proofOfTransaction}
                  max = {5}
                  error={fileUploadError}
                  errorMessage={uploads.length === 0 ? dynamicLabels.proofOfTransactionMandatory :  dynamicLabels.maximumProofOfUploadsError}
                  required={true}
                  multiple
                  accept='.png, .jpg, .jpeg'
                  fullWidth={false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e)}
                />
              </Box>
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <TextInput
                id='comments'
                name='comments'
                className='comments'
                label={dynamicLabels.transactionComments}
                labelColor='text.inputLabel.default'
                placeholder={dynamicLabels.transactionComments}
                value={comments}
                onChange={(e: any) => setComments(e.target.value)}
                style={{ width: '322px' }}
              />
            </Box>
          </Box>
        ),
        footer: (
          <Box
            horizontalSpacing='10px'
            display='flex'
            justifyContent='flex-end'
            p='15px'
          >
            <IconButton
              iconVariant='icomoon-save'
              iconSize={11}
              primary
              disabled={  
                deliveryAssociate === 0 ||
                (transactionAmount == 0 || isNaN(transactionAmount)) ||
                transactionId === '' ||
                !transactionType ||
                (transactionAmount <outStandingAmount && !lessDepositReason) ||
                (!uploads.length || uploads.length > 5) ?  true : false
              }
              onClick={() => handleAddTransaction()}
            >
              {dynamicLabels.save}
            </IconButton>

            <IconButton
              iconVariant='icomoon-close'
              iconSize={11}
              onClick={() => setAddTransactionVisible(false)}
            >
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        ),
      }}
    />
  );
};

export default AddCashTransaction;
