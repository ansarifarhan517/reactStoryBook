import React  from "react";
import { FontIcon } from "ui-library";
import { FieldTile, FieldTileWrapper, FieldTileIconWrapper, TextOverflowEllipsis } from "../../MobileTemplateStyledComponents";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping"

interface IFieldNameTileProps {
    isActive: Record<string, boolean>;
    fieldName: string;
    width: string;
    title: string;
    onTileClick: (tile: Record<string, boolean>, fieldName: string) => void;
    onClick?: (fieldName: string) => void;
}

const FieldNameTile = ({isActive, onTileClick, title, onClick, width, fieldName}: IFieldNameTileProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);

   return (
        <FieldTileWrapper style={{width: width}}>
           <FieldTile onClick={() => title && onTileClick({ [fieldName]: true }, fieldName)} className={width === "70%" ? isActive[fieldName] ? 'left active' : 'left' : isActive[fieldName] ? 'right active' : 'right'} >
            <TextOverflowEllipsis className={`${title === 'Empty' ? title : ''}`}>{title}</TextOverflowEllipsis>
                <FieldTileIconWrapper className="field-tile-icon-wrapper" onClick={() => onClick && onClick(fieldName)} title={dynamicLabels.updateField}>
                    <FontIcon size="sm" variant="icomoon-edit-empty" />
                </FieldTileIconWrapper>
            </FieldTile>
        </FieldTileWrapper>
    )
}

export default FieldNameTile;