import React from "react";
import styled from "styled-components";
import { GroupedDropdown, InlinePopup, Position, IconButton } from "ui-library";
import CustomFieldsGrouppedDropDown from "../../AlertProfilesMaster/utils/CustomFieldsGrouppedDropDown";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";

interface IAttachDynamicTagsProps {
  children: JSX.Element;
  show?: boolean;
  onSelect?: (label: string, value: string) => void;
  tags: any
}
const DynamicTagsButton = styled(IconButton)`
  i {
    font-size: 20px;
    height: 20px;
    line-height: 20px;
  }
`;

const AttachDynamicTags = ({
  children,
  onSelect = () => {},
  show,
  tags,
}: IAttachDynamicTagsProps) => {
  const [showButton, setShowButton] = React.useState<boolean>(
    show === undefined ? false : show
  );
  const [isInlinePopupOpen, setIsInlinePopupOpen] =
    React.useState<boolean>(false);
  const isTagCategoryEmpty = tags;
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.notifications);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsInlinePopupOpen(true);
  };

  const handleFocus = () => {
    if (show === undefined) {
      setShowButton(true);
    }
  };

  const handleBlur = (_e: React.FocusEvent<HTMLDivElement>) => {
    if (!isInlinePopupOpen && show === undefined) {
      setShowButton(false);
    }
  };

  return (
    <div ref={containerRef}>
      <Position type="relative" onFocus={handleFocus} onBlur={handleBlur}>
        <Position
          type="absolute"
          top="10px"
          right="10px"
          zIndex="1"
          style={{ opacity: showButton ? 1 : 0 }}
        >
          {isTagCategoryEmpty?.tagGroupMappingList?.length != 0 ? (
            <InlinePopup
              id="dynamic-tags-popup"
              title={"Dynamic Tags"}
              isOpen={isInlinePopupOpen}
              onClose={() => setIsInlinePopupOpen(false)}
              width={500}
              height={350}
              content={
                <InlinePopupContent
                  onSelect={(label: string, value: string) => {
                    setIsInlinePopupOpen(false);
                    onSelect(label, value);
                  }}
                  Tags={tags}
                />
              }
              style={{ margin: "5px 0px" }}
            >
              <DynamicTagsButton
                id="dynamic-tags-btn"
                iconVariant="dynamic-tags"
                intent="table"
                onClick={handleClick}
              >
                {dynamicLabels?.dynamicTags || "Dynamic Tags"}
              </DynamicTagsButton>
            </InlinePopup>
          ) : (
            <DynamicTagsButton
              id="dynamic-tags-btn"
              iconVariant="dynamic-tags"
              disabled={true}
              intent="table"
              onClick={handleClick}
            >
              {dynamicLabels?.dynamicTags || "Dynamic Tags"}
            </DynamicTagsButton>
          )}
        </Position>
        {children}
      </Position>
    </div>
  );
};

interface IInlinePopupContentProps {
  onSelect: (label: string, value: string) => void;
  Tags: any;
}

function InlinePopupContent({ onSelect, Tags }: IInlinePopupContentProps) {
  const tags = Tags;
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.notifications);

  const categories = React.useMemo(() => {
    return tags?.tagGroupMappingList?.map((group) => ({
      id: String(group.value),
      label: group.label,
      value: String(group.value),
    }));
  }, [tags]);

  const data = React.useMemo(() => {
    return tags?.notificationKeys?.map(
      ({ key, tagGroupId, labelValue, isCustomField }) => ({
        id: key,
        label: isCustomField ? (
          <CustomFieldsGrouppedDropDown
            customLabel={labelValue}
            customText={dynamicLabels?.md_custom_label || "CUSTOM"}
          />
        ) : (
          labelValue
        ),
        value: key,
        categoryId: String(tagGroupId),
        hideInAll: isCustomField ? true : false,
        labelText: labelValue,
      })
    );
  }, [tags]);

  return (
    <GroupedDropdown
      category={categories}
      data={data}
      width={"500px"}
      height="350px"
      handleOnChange={(data) => {
        if (data?.label?.props) {
          data.label = data.label.props["customLabel"];
        }
        onSelect(data.label, data.value);
      }}
    />
  );
}

export default AttachDynamicTags;
