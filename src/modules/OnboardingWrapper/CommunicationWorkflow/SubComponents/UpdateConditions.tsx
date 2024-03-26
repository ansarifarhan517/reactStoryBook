import React, { useEffect, useState } from 'react';
import { Box, Button, DropDown, FontIcon, IconButton, Modal, ModalHeader, Typography } from 'ui-library';
import { ReducerType, tDropdownOptions, tOperation, tUpdateConditionsComponentProps } from '../CommunicationWorkflow.types';

const UpdateConditions = (props: tUpdateConditionsComponentProps) => {

   const { position, open, setOpen, dispatch, prevLevelChannels, channelLabelMap, dynamicLabels } = props;

   const [conditions, setConditions] = useState<tOperation[]>([]);
   const [dropdownOptions, setDropdownOptions] = useState<tDropdownOptions[]>([]);

   const handleClose = () => { setOpen(false) }

   const handleAddCondition = () => {
      setConditions(prevConditions => [...prevConditions, { channel: '' }]);
   }

   const handleDeleteCondition = (index, channelName) => {
      if(channelName.length > 0) {
         const dropdownIndex = dropdownOptions?.findIndex(option => option.value === channelName);
         if (dropdownIndex !== -1) {
            const updatedDropdownOptions = [...dropdownOptions];
            updatedDropdownOptions[dropdownIndex].isSelected = false;
            setDropdownOptions(updatedDropdownOptions);
         } else {
            setDropdownOptions(prev => [...prev, { value: channelLabelMap[channelName], label: channelName, isSelected: false }]);
         }
      }
      const updatedConditions = conditions
         .filter((_, idx) => idx !== index)
         .map((operation, index, array) => (index + 1 === array.length ? { channel: operation.channel } : operation));
      setConditions(updatedConditions);
   }

   const handleGetDropdownOptions = (options: tDropdownOptions[], selectedConditionName: string) => {
      return options.filter(option => !option.isSelected || option.value === selectedConditionName);
   }

   const handleConditionChange = (selectedCondition: string, selectedIndex: number) => {
      const channelIndex = conditions.findIndex((_, index) => index === selectedIndex);
      if (channelIndex !== -1) {
         const newConditions = [...conditions];
         newConditions[channelIndex] = { ...newConditions[channelIndex], channel: selectedCondition };

         const newOptionIndex = dropdownOptions.findIndex(option => option.value === selectedCondition);

         if (newOptionIndex !== -1) {
            const updatedOptions = [...dropdownOptions];
            updatedOptions[newOptionIndex].isSelected = true;

            if (conditions[selectedIndex]?.channel?.length > 0) {
               const oldOptionIndex = dropdownOptions.findIndex(option => option.value === conditions[selectedIndex]?.channel);
               updatedOptions[oldOptionIndex].isSelected = false;
            }

            setDropdownOptions(updatedOptions);
         }
         setConditions(newConditions);
      }
   }

   const handleAddOperator = (index) => {
      const updatedConditions = conditions.map((condition, idx) =>
         index === idx ? { ...condition, operator: '' } : condition,
      );
      setConditions(updatedConditions);
   }

   const handleOperatorChange = (selectedOperator: string, index: number) => {
      const updatedConditions = conditions.map((condition, idx) =>
         index === idx ? { ...condition, operator: selectedOperator } : condition,
      );
      setConditions(updatedConditions);
   }

   const handleSaveConditions = () => {
      const updatedConditions = conditions.filter(condition => condition.channel !== '');
      dispatch({ type: ReducerType.SAVE_CONDITIONS, payload: { position: position - 1, updatedConditions }});
      handleClose();
   }

   useEffect(() => {
      props.conditions.length > 0 ? setConditions(props.conditions) : setConditions([{ channel: '' }]);
   }, [props.conditions]);

   useEffect(() => {
      const existingConditions = new Set(props.conditions.map(condition => condition.channel));
      let conditionsSet: tDropdownOptions[] = [], conditionsNotSet: tDropdownOptions[] = [];
      prevLevelChannels?.forEach(channel => {
         existingConditions.has(channel) 
            ? conditionsSet.push({ label: channelLabelMap[channel], value: channel, isSelected: true }) 
            : conditionsNotSet.push({ label: channelLabelMap[channel], value: channel, isSelected: false }) 
      })
      setDropdownOptions([...conditionsSet, ...conditionsNotSet]);
   },[prevLevelChannels, props.conditions]);

   const areValuesNotEmpty = conditions.every((item, index) => (
      (index + 1) !== conditions.length ? item.channel !== '' && ('operator' in item && item?.operator !== '') : item.channel !== '')
   );
   
   const shouldDisableBtn = (conditions?.length === prevLevelChannels?.length as number) || (conditions.length > 0 ? !areValuesNotEmpty : false);

   return (
      <Modal open={!!open} onToggle={handleClose} width='748px'>
         {{
            header: (
               <ModalHeader
                  headerTitle={`Configure Condition for Level ${position}`}
                  imageVariant='icomoon-close'
                  handleClose={handleClose}
                  headerStyle={{ width: 'inherit' }}
               />
            ),
            content: (
               <>
                  <Box>
                     <Box px='12px' py='8px' display='flex' className='comm-wrkflow__note' horizontalSpacing='12px'>
                        <FontIcon variant='icomoon-warning-circled' size={24} color='#444444' />
                        <Box>{dynamicLabels?.communicationWorkflowCondNote}</Box>
                     </Box>
                     <Box fullWidth my='20px'>
                        {conditions && conditions.map((condition: tOperation, index) => {
                           return (
                              <>
                              <Box fullWidth display='flex' justifyContent='space-between' key={`index-${index+1}`}>
                                 <Box display='flex'>
                                    <Box mr='16px'><Typography fontSize='14px'>If</Typography></Box>
                                    <Box className='comm-wrkflow__dropdown'>
                                       <DropDown
                                          variant='form-select'
                                          showCrossIcon={false}
                                          showDropdownIndicator={true}
                                          placeholder='Communication Channel'
                                          value={condition.channel}
                                          optionList={handleGetDropdownOptions(dropdownOptions, condition.channel)}
                                          onChange={(selectedCondition: string) => handleConditionChange(selectedCondition, index)}
                                       />
                                    </Box>
                                    <Box mx='16px'><Typography fontSize='14px'>Fails</Typography></Box>
                                    {(index + 1 !== conditions.length) ? condition.channel.length > 0 && 'operator' in condition ? (
                                       <Box className='comm-wrkflow__dropdown'>
                                          <DropDown
                                             fullWidth
                                             variant='form-select'
                                             showCrossIcon={false}
                                             showDropdownIndicator={true}
                                             placeholder='Operator'
                                             value={condition.operator}
                                             optionList={[{ value: 'AND', label: 'AND' }]}
                                             onChange={(selectedOperator: string) => handleOperatorChange(selectedOperator, index)}
                                          />
                                       </Box>
                                       ) : (
                                          <Button
                                             variant='link'
                                             className='comm-wrkflow__btn--link'
                                             onClick={() => handleAddOperator(index)}
                                             disabled={!condition.channel}
                                          >
                                             <FontIcon variant='icomoon-add' size={16} color='#F1665A' />
                                             <Typography underline fontSize='12px'>
                                                {dynamicLabels?.addOperatorConditions}
                                             </Typography>
                                          </Button>
                                       ) : null
                                    } 
                                 </Box>
                                 <Box className='comm-wrkflow__btn--cond-delete'>
                                    <IconButton
                                       onlyIcon
                                       id='btn_comm-wrkflow_delete-cond'
                                       iconVariant='cancel-button'
                                       iconSize={'md'}
                                       disabled={prevLevelChannels?.length === 1}
                                       onClick={() => handleDeleteCondition(index, condition.channel)}
                                    />
                                 </Box>
                              </Box>
                              <Box {...(index !== conditions.length - 1) && {
                                 borderBottom: 1,
                                 borderColor: 'grey.200',
                                 my: '16px'
                              }} />
                              </>
                           )
                        })}
                     </Box>
                  </Box>
                  <IconButton
                     fullWidth
                     iconVariant='icomoon-add'
                     iconSize={'xs'}
                     onClick={handleAddCondition}
                     disabled={shouldDisableBtn}
                     className='comm-wrkflow__btn--dashed'
                     id='btn_comm-wrkflow_new-cond'
                  >
                     {dynamicLabels?.newCondition}
                  </IconButton>
               </>
            ),
            footer: (
               <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                  <IconButton className='comm-wrkflow__btn' iconVariant='icomoon-save' onClick={handleSaveConditions} primary
                     id='btn_comm-wrkflow_save-cond' disabled={!areValuesNotEmpty}>{dynamicLabels.save}</IconButton>
                  <IconButton className='comm-wrkflow__btn' iconVariant='icomoon-close' onClick={handleClose}
                     id='btn_comm-wrkflow_cancel-cond' disabled={false}>{dynamicLabels.cancel}</IconButton>
               </Box>
            )
         }}
      </Modal>
  )
}

export default UpdateConditions