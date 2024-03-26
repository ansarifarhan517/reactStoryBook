/* WARNING: arrays must not contain {objects} or behavior may be undefined */
export const isArrayEqual = (a: Array<any>, b: Array<any>) => JSON.stringify(a) === JSON.stringify(b);

export const getSubscriptionName = (pageKey: string, optionsArray: any, selectedValue: any) => {
  return pageKey === "SUBSCRIPTION"
    ? optionsArray.find((options: any) => options.clientIds === selectedValue) // We can use above function to compare 2 arrays
        ?.subscriptionName
    : optionsArray.find((options: any) => options.clientId === selectedValue)
        ?.subscriptionName;
};
