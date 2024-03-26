type tDropdownComponentProps = {
  id: string;
  name?: string;
  label?: string;
  value: string;
  displayName?: string;
};

type tSearchFieldAddressInfo = {
  apartment?: string
  streetName?: string
  landmark?: string
  locality?: string
  stateId?: string
  state?:string
  stateName?:string
  city?: string
  pincode?: string
  country?: string
  registeredCountryIsoCode?: string
  position?: any
  isPropSearch?: any
}

export type { tDropdownComponentProps, tSearchFieldAddressInfo };
