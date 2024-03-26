import { tReducerState, tReducerAction, ReducerType } from "./CommunicationWorkflow.types";

const reducerFn = (state: tReducerState, action: tReducerAction): tReducerState  => {
   switch (action.type) {
      case ReducerType.SET_INITIAL_STATE: {
         const { levels, channelLabelMap } = action.payload;
         return { ...state, levels, prevLevels: levels, channelLabelMap };
      }
      case ReducerType.ADD_LEVEL: {
         return { ...state, levels: [...state.levels, action.payload] };
      }
      case ReducerType.REMOVE_LEVEL: {
         const [remainingLevels, removedLevel] = [state.levels.slice(0, -1), state.levels.slice(-1)[0]];
         return {
            ...state,
            levels: remainingLevels,
            availableChannelsToAdd: removedLevel.channels.length > 0
               ? [...state.availableChannelsToAdd, ...removedLevel.channels]
               : state.availableChannelsToAdd
         };
      }
      case ReducerType.SAVE_CHANNEL: {
         const { position, updatedChannels, deletedChannels } = action.payload;
         const newLevels = state.levels.map((level, index) => {
            if (index === position) {
               return { ...level, channels: updatedChannels };
            } else if ((index === position + 1) && level?.conditions?.some(condition => deletedChannels.includes(condition.channel))) {
               const conditions = level.conditions
                  .filter((condition) => !deletedChannels.includes(condition.channel))
                  .map((condition, index, array) => ((index + 1) === array.length ? { channel: condition.channel } : condition));
               return {...level, conditions};
            } else {
               return level;
            }
         });
         const availableChannelsToAdd = [...deletedChannels];
         return { 
            ...state, 
            levels: newLevels, 
            availableChannelsToAdd, 
         };
      }
      case ReducerType.SAVE_CONDITIONS: {
         const { position, updatedConditions } = action.payload;
         const newLevels = state.levels.map((level, index) => 
            index === position ? { ...level, conditions: updatedConditions } : level
         );
         return {
            ...state,
            levels: newLevels
         }
      }
      case ReducerType.RESET_LEVELS: {
         return {
            ...state,
            levels: state.prevLevels,
            availableChannelsToAdd: []
         }
      }
      default:
         return state;
   }
}

export default reducerFn;