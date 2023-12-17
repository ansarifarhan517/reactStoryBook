import React  from "react";
import { useTypedSelector } from '../redux/rootReducer'
interface IDynamicLabelProps {
   value: string
}

const DynamicLabel = ({value}: IDynamicLabelProps) => {
   const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
   return <>{dynamicLabels?.[value]}</>   
}

export default DynamicLabel;
