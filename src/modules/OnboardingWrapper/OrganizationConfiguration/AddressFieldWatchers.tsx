import React, {useEffect} from 'react';
import useDebounce from "../../../utils/useDebounce";
import { deepCopy } from "../../../utils/helper";

const AddressFieldWatchers = (props : any) => {

    const { formInstance, structure, isMapSearched , isAddressFieldsTouched, setSearchText }  = props;
    const { watch } = formInstance;

    /* watchers for address fields */
    const country = useDebounce(watch('countryId', ''), 1000);
    const state = useDebounce(watch('stateId', ''), 1000);
    const apartment = useDebounce(watch('apartment', ''), 1000);
    const streetName = useDebounce(watch('streetName', ''), 1000);
    const landmark = useDebounce(watch('landmark', ''), 1000);
    const locality = useDebounce(watch('locality', ''), 1000);
    const city = useDebounce(watch('city', ''), 1000);
    const zipCode = useDebounce(watch('zipCode', ''), 1000);
    
    //React Map address field touched
    useEffect(() => {
        const newStructure = deepCopy(structure);
        const isTextType = newStructure?.['address']?.['addressFields']?.['childNodes']?.zipCode?.fieldType === "text" ? true : false;
        let address = `${apartment} ${streetName} ${landmark} ${locality} ${city} ${state?.name} ${country?.name} ${isTextType ? zipCode : zipCode?.name}`.replaceAll('undefined', '');
        if(!isMapSearched && isAddressFieldsTouched) {
            setSearchText(address);
        }
      }, [country, state, apartment, streetName, landmark, locality, city, zipCode, isAddressFieldsTouched]);

      return(<></>);
}

export default AddressFieldWatchers;