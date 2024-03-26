import firebaseRef from "../../../../utils/firebase";

export const getSocketConnection = (timestamp: any, reportType,dynamicLabels,toast) => {
    const timeStampString = timestamp.toString();

    let accessToken = localStorage.getItem('userAccessInfo');
    accessToken = accessToken ? JSON.parse(accessToken).token : null;
    const driverCreateRef = firebaseRef.database().ref(`sockets/${reportType}/${accessToken}/${timeStampString}`)
    driverCreateRef.on('value', function (snapshot) {
        if (snapshot.val()) {
            var reportURL = snapshot.val().value;

            if (reportURL && reportURL == "usermasterreport_FAILED") {
                toast.add(dynamicLabels["internal.server.error"] != null ? dynamicLabels["internal.server.error"] : "Internal Server Error", 'warning', false);
            } else if (reportURL && reportURL?.length) {

                window.location.href = reportURL;
            }
            driverCreateRef.off('value');
        }
    });
}