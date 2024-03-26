import React, { Dispatch, useMemo, useEffect } from 'react'
import { Modal, ModalHeader, ModalFooter, IconButton, Loader, DropDown } from 'ui-library'
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { tTripsListMileActions } from '../TripsListView.actions';
import { ITripPrintDRSTemplateData, ITripsListMileRowData } from '../TripsListView.model';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import { IMongoDynamicHTMLTemplate } from '../../../../../utils/common.interface';
import usePrintingDRS from './usePrintingDRS';
import axios from '../../../../../utils/axios';
import apiMappings from '../../../../../utils/apiMapping';
import { sendGA } from '../../../../../utils/ga';
import { withReactOptimized } from '../../../../../utils/components/withReact';
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';
import useMetricsConversion from '../../../../common/ClientProperties/useMetricsConversion';

interface IPrintDRSProps {
    selectedRows: {
        [key: string]: ITripsListMileRowData;
    }
}
const PrintDRSModal = ({ selectedRows }: IPrintDRSProps) => {
    const { isModalOpen, templates } = useTypedSelector(state => state.trips.listView.mile.printDrs)

    const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.drsTemplateConfiguration)
    const headersLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.drsTemplateHeaders)
    const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
    const {convertMetricsForDisplay} = useMetricsConversion()
    const { handlePrinting } = usePrintingDRS()

    const [value, setValue] = React.useState<string | undefined>()
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)
  

    sendGA("Trip action button", `Trip - Print DRS`);

    useEffect(() => {
        dispatch({ type: '@@tripsListViewMile/FETCH_DRS_HTML_TEMPLATES' })
    }, [])

    useEffect(() => {
        if (!value) {
            setTimeout(() => {
                templates && setValue(templates.find(o => o.isFavouriteFl)?.id)
            }, 300)
        }
    }, [templates])


    const optionList = useMemo(() => {
        return templates && templates.map(o => ({ label: o.name, value: o.id }))
    }, [templates])


    const optionsMap: Record<string, IMongoDynamicHTMLTemplate<ITripPrintDRSTemplateData>> = useMemo(() => {
        return templates && templates?.reduce((accumulator, current) => ({ ...accumulator, [current.id]: current }), {})
    }, [templates])



    const handleDataModification = async () => {
        const { data } = await axios.get(
            apiMappings.trips.mile.listview.multipleTripRoute,
            {
                params: {
                    tripId: Object.keys(selectedRows)+ ""
                },
            }
        );
        let shipmentIds: any[] = [];
        let drsTableData = data.data.results;

        drsTableData.forEach((element, key) => {
            let crateIds = new Set();
            element.deliveryRunSheet.forEach(item => {
                crateIds.add(item.shipmentId);
            });
            shipmentIds[key] = Array.from(new Set(crateIds))
        });
        const crateInfo: any[] = [];

        for (let entry of shipmentIds) {
            if (entry.length !== 0) {
                let url = apiMappings.order.form.orderCrate + '?shipment_ids=' + entry + "&fetchEvent=DRS";
                const { data: response } = await axios.get(url);
                crateInfo.push(response.data)
            } else {
                crateInfo.push([])
            }
        }

        const countInfo: any = [];
        for (let value of Object.keys(selectedRows)) {
            const { data } = await axios.post("/ShipmentApp/shipment/fmlm/data/count", [value])
            countInfo.push(data)
        }


        //IMP :- Do Not change the ID of the templates

        if (optionsMap[value || ''] && optionsMap[value || ''].htmlData.orderHTML) {
            optionsMap[value || ''].htmlData.orderHTML = optionsMap[value || ''].htmlData.orderHTML.replaceAll('#$@$#ORDER', '')
        }

        handlePrinting(optionsMap[value || ''], drsTableData, crateInfo, countInfo,clientProperties,convertMetricsForDisplay,headersLabels)
    }

    const onClose = React.useCallback(() => {
        dispatch({ type: '@@tripsListViewMile/SET_DRS_MODAL_OPEN', payload: false })
    }, []
    )

    return (

        <Modal open={isModalOpen} width='600px' onToggle={() => { }} >
            {{
                header: <ModalHeader headerTitle={dynamicLabels.printDrsTemplate || 'Print DRS'} handleClose={onClose} />,
                content: <div onClick={() => setIsMenuOpen(o => !o)}>
                    {Object.keys(selectedRows).length === 0 ? <Loader center fadeBackground /> :
                        <DropDown
                            label={dynamicLabels.drsTemplate}
                            placeholder={dynamicLabels.drsTemplate}
                            variant='form-select'
                            optionList={optionList}
                            onChange={setValue}
                            value={value}
                            isMenuOpen={isMenuOpen}
                        />}
                </div>,
                footer: <ModalFooter>
                    <IconButton id="printDRS-Modal-OK" iconVariant='icomoon-tick-circled' primary
                        disabled={!(value) || Object.keys(selectedRows).length === 0}
                        onClick={() => {
                            handleDataModification()
                        }}
                    >{dynamicLabels.ok || 'Ok'}</IconButton>

                    <IconButton id="printDRS-Modal-cancel" iconVariant='icomoon-close' onClick={onClose} iconSize={11}>
                        {dynamicLabels.cancel}
                    </IconButton>
                </ModalFooter>
            }}

        </Modal>
    )
}

export default withReactOptimized((PrintDRSModal), false)
