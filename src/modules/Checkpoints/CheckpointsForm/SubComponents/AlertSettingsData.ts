export const alertSettings = [
  {
    id: "1",
    fallbackLabel: "Checkpoint Entry",
    toggleLabelKey :'checkpointEntry',
    toggleFlag:'checkpointEntryAlertFl',
    fallbackAccordianLabel:"This alert is triggered when a DA enters the geofence of a checkpoint.",
    accordionLabelKey:"checkpointEntryDescription"
  },
  {
    id: "2",
    fallbackLabel: "Checkpoint Exit",
    toggleLabelKey :'checkpointExit',
    toggleFlag:'checkpointExitAlertFl',
    fallbackAccordianLabel:"This alert is triggered when a DA exits the geofence of a checkpoint.",
    accordionLabelKey:"checkpointExitDescription"
  },
  {
    id: "3",
    fallbackLabel: "Maximum Halt Time",
    toggleLabelKey :'maximumHaltTime',
    toggleFlag :'haltTimeAlertFl',
    fallbackAccordianLabel:"This alert is triggered when a DA exceeds the predefined maximum halt time at a checkpoint.",
    accordionLabelKey:"maximumHaltTimeDescription"
  },
  {
    id: "4",
    fallbackLabel: "Fleet Movement Stopped",
    toggleLabelKey :'fleetMovementStopped',
    toggleFlag :'fleetMovementStoppedAlertFl',
    fallbackAccordianLabel:'This alert is triggered when fleet movement stops due to road blockages or accidents. It notifies dispatchers of potential delays in order delivery.',
    accordionLabelKey:"fleetMovementStoppedDescription"
  },
  {
    id: "5",
    fallbackLabel: "Fleet Movement Resumed",
    toggleLabelKey :'fleetMovementResumed',
    toggleFlag :'fleetMovementResumedAlertFl',
    fallbackAccordianLabel:'This alert is triggered, when fleet movement resumes after stoppage due to road blockages or accidents. This alert is triggered after a Fleet Movement Stopped alert has previously been triggered.',
    accordionLabelKey:"fleetMovementResumedDescription"
  },
  {
    id: "6",
    fallbackLabel: "Restricted Time",
    toggleLabelKey :'restrictedTime',
    toggleFlag :'restrictedTimeAlertFl',
    fallbackAccordianLabel:"This alert is triggered when a DA enters a checkpoint during the predefined restricted time.",
    accordionLabelKey:"restrictedTimeDescription"
  },
];
