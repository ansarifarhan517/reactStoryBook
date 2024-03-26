
import React, {useEffect, Dispatch} from "react";
import { useDispatch } from 'react-redux';
import { IMarkerData,ISettingConfigData } from '../../../../utils/components/Map/interface';
import MapDefault from '../../../../utils/components/Map/MapDefault';
import { BranchConfigurationActions } from '../BranchConfiguration.actions';
import useDynamicLabels from '../../../../modules/common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../../modules/common/DynamicLabels/dynamicLabels.mapping';
import { StyledMapDiv  } from '../../../../utils/components/Map/StyledMap';
import makeMapData from './BranchMakeMapData';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import {BranchMapSetting} from './BranchMapSetting';
import { BranchConfigurationMapmapDivWrapper } from '../BranchConfigurationStyledComponents';
import { IBranchConfigurationListViewRowData } from '../BranchConfiguration.models';


const BranchConfigurationMap = (props: any) => {
    const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();
    const branchList =  useTypedSelector(state => state.branchConfiguration.data)
    const googleApiKey = useTypedSelector(
        (state) => state.branchConfiguration.googleApiKey
      );
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);
    useEffect(() => {
            dispatch({
                type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_LIST',
                payload: {
                  pageNumber: 1,
                  pageSize: 50
                },
              });
    },[])         
 // markers data according to legend ,will be dynamic and sent from outside 
    const isEditMode = props.isEditMode
    const setMapMarkerData = (branchList: IBranchConfigurationListViewRowData[], settingConfigData: ISettingConfigData) => {
        const newMapData: IMarkerData = makeMapData(branchList, settingConfigData, dynamicLabels)
        return newMapData
    }
    return (
    <>
    <StyledMapDiv className="map_pane live_pane live_pane_v2" style={{ flexGrow: 100, flexShrink: 100, height:'calc(100vh - 145px)' }}>
    {branchList.results.length > 0 &&
        <BranchConfigurationMapmapDivWrapper>
            <MapDefault
                type='branch'
                settingAPIParam='clientBranchMap'
                mapSetting={BranchMapSetting(dynamicLabels)}
                setMapData={(settingConfigData) => setMapMarkerData(branchList.results, settingConfigData)}
                googleApiKey={googleApiKey}
                showLegendWrapper={false}
                isEditMode={isEditMode}
            />
        </BranchConfigurationMapmapDivWrapper>
    }
    </StyledMapDiv>
    </>
    )
}

export default (BranchConfigurationMap)
