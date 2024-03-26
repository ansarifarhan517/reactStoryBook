import React, { useState } from "react";
import { TabButtonContainer } from "../ExceptionHandlingStyledComponents";
import { ButtonGroup } from "ui-library";
import ContentWrapper from "./SubComponents/ContentWrapper";
import OrderExceptionsListview from "./SubComponents/OrderExceptionsListview";
import ManifestExceptionsListview from "./SubComponents/ManifestExceptionsListview";
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { sendGA } from "../../../../utils/ga";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { capitalize } from "../utils";

interface IRaisedExceptionsProps {
    selectedDate: {
        startDate: string
        endDate: string
    }
}

const RaisedExceptions = (props: IRaisedExceptionsProps) => {
    const { selectedDate } = props;
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.exceptionHandling)

    const [activeTab, setTabActive] = useState<string>('orders');

    const buttonData = React.useMemo(() => {
        return [{
            id: "orders",
            label: dynamicLabels.orders,
            selected: activeTab === "orders"
        }, {
            id: "manifests",
            label: dynamicLabels.manifests || 'Manifests',
            selected: activeTab === "manifests"
        }]
    }, [activeTab])
    return (
        <>
            <TabButtonContainer>
                <ButtonGroup
                    data={buttonData}
                    onChange={(id) => { sendGA('Raised Exceptions', `Click - ${capitalize(id)}`); setTabActive(id) }}
                />
            </TabButtonContainer>
            <ContentWrapper>
                {activeTab === 'orders' ?
                    <OrderExceptionsListview selectedDate={selectedDate} /> :
                    <ManifestExceptionsListview selectedDate={selectedDate} />
                }
            </ContentWrapper>
        </>
    )
}

export default RaisedExceptions;