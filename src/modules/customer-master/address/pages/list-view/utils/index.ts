const dummyColumns: any = {
  address: { label: "Address", permission: true },
  addressContactCount: {
    label: "Additional Billing Contacts",
    permission: true,
  },
  addressNotes: { label: "Address Notes", permission: true },
  clientNodeAddressCd: { label: "Address ID", permission: true },
  clientNodeCd: { label: "Consumer ID", permission: true },
  clientNodeType: { label: "Address Type", permission: true },
  geocodeStatus: { label: "Geocoding Status", permission: true },
  isActiveFl: { label: "Active / Inactive", permission: true },
};

const dummyResult: any = Array(15)
  .fill(0)
  .map((_, i) => ({ xyz: i + 1 }));

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = {
    notify: false,
    reload: false,
    inherit: false,
    location: true,
  };

export { dummyColumns, dummyResult, ngStateRouterOptions };
