import React, { useState } from 'react';
import { Box, Button, FontIcon, Position, Typography } from 'ui-library';
import { ReducerType, tLevelComponentProps, tOperation } from '../CommunicationWorkflow.types';
import UpdateChannels from './UpdateChannels';
import UpdateConditions from './UpdateConditions';

const Level = ({ data, position, isLastLevel, dynamicLabels, dispatch, prevLevelChannels, channelLabelMap, availableChannelsToAdd }: tLevelComponentProps) => {

   const [openUpdateChannel, setOpenUpdateChannel] = useState(false);
   const [openConditions, setOpenConditions] = useState(false);
   
   return (
      <>
         {openUpdateChannel ? 
            <UpdateChannels 
               position={position}
               channels={data.channels}
               open={openUpdateChannel}
               setOpen={setOpenUpdateChannel}
               dispatch={dispatch}
               channelLabelMap={channelLabelMap}
               dynamicLabels={dynamicLabels}
               availableChannelsToAdd={availableChannelsToAdd}
            /> : null
         }
         {openConditions ?
            <UpdateConditions
               position={position}
               conditions={data.conditions as tOperation[]}
               open={openConditions}
               setOpen={setOpenConditions}
               dispatch={dispatch}
               channelLabelMap={channelLabelMap}
               prevLevelChannels={prevLevelChannels}
               dynamicLabels={dynamicLabels}
            /> : null
         }
         <Position
            fullWidth
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            type='relative'
            px='16px'
            py='20px'
            bgColor='white'
            border={1}
            borderRadius={2}
            borderColor='primary.main'
            className='comm-wrkflow__level'
         >
            <Position
               type='absolute'
               top='-13px'
               zIndex='1000'
               px='8px'
               py='4px'
               bgColor='primary.main'
               border={1}
               borderRadius={100}
               borderColor='primary.main'
            >
               <Typography color='white' fontSize='12px' fontWeight={500} useStyle={false}>{`Level ${position}`}</Typography>
            </Position>
            {position === 1 ? (
               <Typography align='center' color='grey.A800' fontSize='12px' lineHeight='15px' useStyle={false}>
                  {dynamicLabels?.communicationWorkflowLvlDesc}
               </Typography>
            ) : ( 
               <Box
                  display='flex'
                  flexDirection='column'
                  px='16px'
                  py='20px'
                  bgColor='white'
                  borderRadius={2}
                  className='comm-wrkflow__level__condition'
                  verticalSpacing='12px'
               >
                  <Typography align='center' color='grey.A800' fontSize='12px' lineHeight='15px' useStyle={false}>
                     {dynamicLabels?.communicationWorkflowCondDesc}
                  </Typography>
                  <Button variant='link' id='btn_comm-wrkflow_add-cond' className='comm-wrkflow__btn--link' onClick={() => setOpenConditions(true)}>
                     <FontIcon variant='icomoon-setting' size={16} color='#5698D3' />
                     <Typography underline fontSize='14px' fontWeight={500}>
                        {data?.conditions && data?.conditions?.length > 0 ? 'Conditions' : 'Add Conditions'}
                     </Typography>
                  </Button>
               </Box>
            )}
            {data?.channels?.length > 0 ? (
               <Box display='flex' mt='20px' mb='5px' horizontalSpacing='8px'>
                  {data.channels.map((channel) => (
                     <Box
                        key={channel}
                        display='flex'
                        alignItems='center'
                        px='12px'
                        py='2px'
                        borderRadius={2}
                        bgColor='white'
                        className='comm-wrkflow__level__chip'
                     >
                        <Typography align='center' fontSize='14px' useStyle={false}>
                           {channelLabelMap[channel]}
                        </Typography>
                     </Box>
                  ))}
               </Box>
            ) : null}
            <Box display='flex' mt='15px' horizontalSpacing='16px'>
               <Button
                  variant='link'
                  id='btn_comm-wrkflow_add-channel'
                  className='comm-wrkflow__btn--link'
                  onClick={() => setOpenUpdateChannel(true)}
                  disabled={data?.conditions?.length === 0}
               >
                  <FontIcon variant='icomoon-setting' size={16} color='#5698D3' />
                  <Typography underline fontSize='14px' fontWeight={500}>
                     {data.channels.length > 0 ? 'Update' : 'Add'} Communication Channel
                  </Typography>
               </Button>
               {position !== 1 && isLastLevel ? (
                  <Button variant='link' id='btn_comm-wrkflow_remove-level' className='comm-wrkflow__btn--link' onClick={() => dispatch({ type: ReducerType.REMOVE_LEVEL })}>
                     <FontIcon variant='icomoon-delete' size={16} color='#5698D3' />
                     <Typography underline fontSize='14px' fontWeight={500}>
                        {dynamicLabels?.removeLevel}
                     </Typography>
                  </Button>
               ) : null}
            </Box>
         </Position>
         <Box className={`comm-wrkflow__vr-line ${isLastLevel ? 'comm-wrkflow__vr-line--arrow-down' : ''}`} />
      </>
   );
};

export default Level;