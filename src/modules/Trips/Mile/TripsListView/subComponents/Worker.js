export default () => {
    // eslint-disable-next-line no-restricted-globals
    self.addEventListener("message", (e) => {

        const { tripDTO, additionalTripData, shipmentIdsArray, shipmentIds, tripIndex } = JSON.parse(e.data);

        tripDTO.deliveryRunSheet.forEach((shipmentDTO, shipmentIndex) => {
            shipmentIds[tripIndex].push(shipmentDTO.shipmentId);
            if (!shipmentIdsArray.includes(shipmentDTO.shipmentId)) {
                if (additionalTripData[tripDTO['tripId']]) {
                    additionalTripData[tripDTO['tripId']].totalPackageWeight += shipmentDTO.packageWeight == undefined ? 0 : shipmentDTO.packageWeight;
                    additionalTripData[tripDTO['tripId']].totalPackageVolume += shipmentDTO.packageVolume == undefined ? 0 : shipmentDTO.packageVolume;
                    shipmentIdsArray.push(shipmentDTO.shipmentId);
                }
            }
        });

        const response = {
            additionalTripData,
            shipmentIdsArray,
            shipmentIds
        }

        postMessage(response);
    });
};
