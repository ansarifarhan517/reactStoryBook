import React, { useEffect, useReducer } from 'react';
import { Box, Card, IconButton, Typography, useToast } from 'ui-library';
import { ReducerType, tChannelLabelMap, tChannels, tLevel, tOperation } from './CommunicationWorkflow.types';
import { withReactOptimized } from '../../../utils/components/withReact';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import Level from './SubComponents/Level';
import './CommunicationWorkflow.styles.scss';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import reducerFn from './CommunicationWorkflow.reducer';

const CommunicationWorkflow = () => {

   const toast = useToast();
   const initialState = {
      levels: [] as tLevel[],
      prevLevels: [] as tLevel[],
      channelLabelMap: {} as tChannelLabelMap,
      availableChannelsToAdd: [] as string[],
   };
   const [state, dispatch] = useReducer(reducerFn, initialState);
   const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.communicationWorkflow);

   const handleAddLevel = () => {
      const newLevel = { channels: [], conditions: [] };
      dispatch({ type: ReducerType.ADD_LEVEL, payload: newLevel });
   }
   
   const handleGetChannels = async () => {
      try {
         const response = await Promise.all([
            axios.get(apiMappings.communicationWorkflow.getAllChannels),
            axios.get(apiMappings.communicationWorkflow.getConfiguredChannels),
         ]);
         const [channelTypes, channelsConfigurationData] = [
            response[0].data as tChannels[],
            Object.values(response[1].data.data.configuration) as tLevel[],
         ];
         const channelLabelMap = channelTypes.reduce(
            (a: tChannelLabelMap, c: tChannels) => ((a[c.clientRefMasterCd] = c.clientRefMasterDesc), a),
            {},
         );    
         const levels = Object.values(channelsConfigurationData);     
         dispatch({ type: ReducerType.SET_INITIAL_STATE, payload: { levels, channelLabelMap }});
      } catch(e) {
         toast.add(dynamicLabels.somethingWendWrong, 'error', false);
      }
   }

   const handleSaveWorkflow = async () => {
      try {
         const configuration = Object.fromEntries(state.levels.map((item, index) => [
            index.toString(),
            {
               channels: item.channels,
               ...(item.conditions && { conditions: item.conditions.map(op => ({ channel: op.channel, operator: op.operator })) })
            }
         ]));
         const { data: { status }} = await axios.post(apiMappings.communicationWorkflow.saveConfiguredChannels, { configuration });
         if (status == 200) {
            toast.add(dynamicLabels?.communicationWorkflowUpdateSuccessMsg, 'check-round', false);
            dispatch({ type: ReducerType.SET_INITIAL_STATE, payload: { levels, channelLabelMap: state.channelLabelMap }});
         } else {
            toast.add(dynamicLabels.somethingWendWrong, 'error', false);
         }
      } catch(e) {
         toast.add(dynamicLabels.somethingWendWrong, 'error', false);
      }
   }

   const handleReset = () => {
      dispatch({ type: ReducerType.RESET_LEVELS });
   }

   useEffect(() => {
      handleGetChannels();
   },[]);

   const { levels, prevLevels, channelLabelMap, availableChannelsToAdd } = state;

   const shouldDisableAddLevelBtn = availableChannelsToAdd.length === 0
      || !(levels?.slice(-1)?.[0]?.channels?.length > 0)
      || !levels.every((level, index) => index === 0 ? true : (level?.conditions as tOperation[])?.length > 0);

   const shouldDisableResetBtn = JSON.stringify(levels) === JSON.stringify(prevLevels);
      
   return (
      <Card className='comm-wrkflow'>
         <Box p='10px'>
            <Typography fontSize='14px' lineHeight='16px' useStyle={false} className='comm-wrkflow__desc'> 
               {dynamicLabels?.communicationWorkflowDesc}
            </Typography>
            <Box
               my='24px'
               py='40px'
               px='20px'
               display='flex'
               flexDirection='column'
               alignItems='center'
               justifyContent='center'
               bgColor='grey.50'
               borderRadius={2}
               className='comm-wrkflow__level-container'
            >
               <Box display='flex' flexDirection='column' alignItems='center' className='comm-wrkflow__level-box'>
                  {levels && levels?.length > 0 && levels?.map((level: tLevel, index) => (
                     <Level
                        key={`level-${index+1}`}
                        data={level}
                        position={index + 1}
                        prevLevelChannels={index !== 0 ? levels[index-1].channels : undefined}
                        dispatch={dispatch}
                        dynamicLabels={dynamicLabels}
                        availableChannelsToAdd={availableChannelsToAdd}
                        channelLabelMap={channelLabelMap}
                        isLastLevel={levels.length === (index + 1)}
                     />
                  ))}
                  <IconButton primary iconVariant='icomoon-add' disabled={shouldDisableAddLevelBtn} 
                     id='communicationWorkflow--actionbar--addNewLevel' onClick={handleAddLevel}>{dynamicLabels?.addNewLevel}</IconButton>
               </Box>
            </Box>
            <Box display='flex' horizontalSpacing='16px'>
               <IconButton className='comm-wrkflow__btn' iconVariant='icomoon-save' onClick={handleSaveWorkflow} primary
                  id='communicationWorkflow--actionbar--save' disabled={!(availableChannelsToAdd.length === 0)}>{dynamicLabels.save}</IconButton>
               <IconButton className='comm-wrkflow__btn' iconVariant='icomoon-back' onClick={handleReset}
                  id='communicationWorkflow--actionbar--reset' disabled={shouldDisableResetBtn}>{dynamicLabels.reset}</IconButton>
            </Box>
         </Box>
      </Card>
  )
}

export default withReactOptimized(CommunicationWorkflow);