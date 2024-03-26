import React  from "react";
import { useTypedSelector } from '../redux/rootReducer'

const BooleanValue = ({value}:any) => {
   const dynamicLabels = useTypedSelector(state => state.dynamicLabels);

    if(value) {
        return <>Yes</>
    } else if(value === false) {
        return <>No</>
    } else {
        return <>{dynamicLabels.notAvailable}</>;
    }
}

export default BooleanValue;