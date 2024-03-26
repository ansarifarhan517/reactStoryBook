import React, { useEffect, useState } from 'react';
import { Box, DropDown, FontIcon, IconButton, Modal, ModalHeader, Typography } from 'ui-library';
import { ReducerType, tChannel, tDropdownOptions, tUpdateChannelComponentProps } from '../CommunicationWorkflow.types';

const UpdateChannels = (props: tUpdateChannelComponentProps) => {

   const { position, open, setOpen, dynamicLabels, dispatch, channelLabelMap, availableChannelsToAdd } = props;
   
   const [channels, setChannels] = useState<tChannel[]>([]);
   const [dropdownOptions, setDropdownOptions] = useState<tDropdownOptions[]>(
      availableChannelsToAdd?.map((channel) => ({ label: channelLabelMap[channel], value: channel, isSelected: false }))
   );

   const handleDeleteChannel = (index: number, channelName: string) => {
      if (channelName.length > 0) {
         const dropdownIndex = dropdownOptions?.findIndex(option => option.value === channelName);
         if (dropdownIndex !== -1) {
            const updatedDropdownOptions = [...dropdownOptions];
            updatedDropdownOptions[dropdownIndex].isSelected = false;
            setDropdownOptions(updatedDropdownOptions);
         } else {
            setDropdownOptions(prev => [...prev, { value: channelName, label: channelLabelMap[channelName], isSelected: false }]);
         }
      }
      const updatedChannels = channels.filter((_, idx) => idx !== index).map((channel, idx) => ({...channel, key: idx + 1}));
      setChannels(updatedChannels);
   }

   const handleAddChannel = () => {
      setChannels(prev => [...prev, { name: '', mode: 'ADD', key: channels.length + 1 }]);
   }

   const handleSaveChannel = () => {
      const updatedChannels = channels.map(channel => channel.name).filter(channel => channel !== '');
      const deletedChannels: string[] = dropdownOptions.filter(channel => !channel.isSelected).map(channel => channel.value);
      dispatch({ type: ReducerType.SAVE_CHANNEL, payload: { position: position - 1, updatedChannels, deletedChannels } });
      handleClose();
   }

   const handleGetDropdownOptions = (options: tDropdownOptions[], selectedChannelName: string) => {
      return options.filter(option => !option.isSelected || option.value === selectedChannelName);
   }

   const handleDropdownChange = (selectedChannel: string, index: number) => {
      const channelIndex = channels.findIndex((channel) => channel.key === index + 1);
      if (channelIndex !== -1) {
         const newChannels = [...channels];
         newChannels[channelIndex] = { ...newChannels[channelIndex], mode: 'ADD', name: selectedChannel };

         const newOptionIndex = dropdownOptions.findIndex(option => option.value === selectedChannel);

         if (newOptionIndex !== -1) {
            const updatedOptions = [...dropdownOptions];
            updatedOptions[newOptionIndex].isSelected = true ;

            if (channels[index]?.name?.length > 0) {
               const oldOptionIndex = dropdownOptions.findIndex(option => option.value === channels[index]?.name);
               updatedOptions[oldOptionIndex].isSelected = false;
            }
            
            setDropdownOptions(updatedOptions);
         }
         setChannels(newChannels);
      }
   }

   const handleClose = () => { setOpen(false) }

   useEffect(() => {
      if(props.channels.length > 0) {
         setChannels(props.channels.map((channel, idx) => ({ name: channel, mode: 'VIEW', key: idx + 1 })));
      } else {
         setChannels([{ name: '', mode: 'ADD', key: 1 }]);
      }
   },[props.channels]);

   const shouldDisableSave = channels.length === (availableChannelsToAdd.length + props.channels.length);
   
   return (
      <Modal open={!!open} onToggle={handleClose} width='400px'>
         {{
            header: (
               <ModalHeader
                  headerTitle={`Level ${position}: Update Communication Channel`}
                  imageVariant='icomoon-close'
                  handleClose={handleClose}
                  headerStyle={{ width: 'inherit' }}
               />
            ),
            content: (
               <>
                  <Box px='16px'>
                     {channels && channels.map((channel, index) => (
                        <Box 
                           key={channel.key}
                           py='12px' 
                           display='flex' 
                           alignItems='center' 
                           justifyContent='space-between'
                           {...(index !== channels.length - 1) && {
                              borderBottom: 1,
                              borderColor: 'grey.200'
                           }}
                        >
                           {channel.mode === 'VIEW' ? (
                              <Typography fontSize='12px' color='black'>
                                 {channelLabelMap[channel.name]}
                              </Typography>
                           ) : (
                              <Box fullWidth mr='24px'> 
                                 <DropDown
                                    variant='dashed-dropdown'
                                    placeholder='Select Channel'
                                    value={channel.name}
                                    optionList={handleGetDropdownOptions(dropdownOptions, channel.name)}
                                    onChange={(selectedChannel: string) => handleDropdownChange(selectedChannel, index)}
                                 />
                              </Box>
                           )}
                           <IconButton id='btn_comm-wrkflow_delete-channel' iconVariant='icomoon-delete' iconSize={16} onlyIcon
                              onClick={() => handleDeleteChannel(index, channel.name)}>{dynamicLabels.cancel}</IconButton>
                        </Box>
                     ))}
                  </Box>
                  <Box mt='8px' mb='24px'>
                     <IconButton 
                        fullWidth 
                        iconVariant='icomoon-add' 
                        iconSize={'xs'} 
                        onClick={handleAddChannel}
                        disabled={shouldDisableSave}
                        id='btn_comm-wrkflow_new-channel'
                        className='comm-wrkflow__btn--dashed' 
                     >
                        {dynamicLabels?.newChannel}
                     </IconButton>
                  </Box>
                  <Box px='12px' py='8px' display='flex' className='comm-wrkflow__note' horizontalSpacing='12px'>
                     <FontIcon variant='icomoon-warning-circled' size={24} color='#444444' />
                     <Box>
                        <b>Note:</b>&nbsp;{dynamicLabels?.communicationWorkflowChannelNote}
                     </Box>
                  </Box>
               </>
            ),
            footer: (
               <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                  <IconButton className='comm-wrkflow__btn' iconVariant='icomoon-save' onClick={handleSaveChannel} primary
                     id='btn_comm-wrkflow_save-channel' disabled={!channels.some(channel => channel.name.length > 0)}>{dynamicLabels.save}</IconButton>
                  <IconButton className='comm-wrkflow__btn' iconVariant='icomoon-close' onClick={handleClose}
                     id='btn_comm-wrkflow_cancel-channel' disabled={false}>{dynamicLabels.cancel}</IconButton>
               </Box>
            )
         }}
      </Modal>
   )
}

export default UpdateChannels