import React from 'react'
import { GroupedDropdown, InlinePopup, Position } from 'ui-library'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import CustomFieldsGrouppedDropDown from '../../../AWBLabelConfiguration/utils/CustomFieldsGroupedDropdown';
import { IAttachDynamicTagsProps } from '../DRSTemplateConfiguration.models';
import {DynamicTagsButton,GroupDropdownWrapper} from '../StyledDrsLabelConfiguration'


const AttachDynamicTags = ({ children, onSelect = () => { }, show }: IAttachDynamicTagsProps) => {
  const [showButton, setShowButton] = React.useState<boolean>(show === undefined ? false : show)
  const [isInlinePopupOpen, setIsInlinePopupOpen] = React.useState<boolean>(false)
  const isTagCategoryEmpty = useTypedSelector(state => state.drsTemplateConfiguration.tags)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setIsInlinePopupOpen(true)
  }

  const handleFocus = () => {
    if (show === undefined) {
      setShowButton(true)
    }
  }

  const handleBlur = (_e: React.FocusEvent<HTMLDivElement>) => {
    if (!isInlinePopupOpen && show === undefined) {
      setShowButton(false)
    }
  }

  return (
    <div ref={containerRef}>
      <Position type='relative' onFocus={handleFocus} onBlur={handleBlur}>
        <Position type='absolute' top='-20px' right='0px' zIndex='1'
          style={{ opacity: showButton ? 1 : 0 }}>
          {isTagCategoryEmpty.tagGroupMappingList?.length != 0 ?
            <InlinePopup id='dynamic-tags-popup' title={'Dynamic Tags'}
              isOpen={isInlinePopupOpen}
              onClose={() => setIsInlinePopupOpen(false)}
              width={500} height={350}
              content={<InlinePopupContent onSelect={(label: string, value: string) => {
                setIsInlinePopupOpen(false)
                onSelect(label, value)
              }} />}
              style={{ margin: '5px 0px', left: '0' }}
            >
              <DynamicTagsButton id='dynamic-tags-btn'
                iconVariant='dynamic-tags' intent='table' onClick={handleClick}>{dynamicLabels.dynamicTags}</DynamicTagsButton>
            </InlinePopup>
            :
            <DynamicTagsButton id='dynamic-tags-btn'
              iconVariant='dynamic-tags' disabled={true} intent='table' onClick={handleClick}>{dynamicLabels.dynamicTags}</DynamicTagsButton>
          }
        </Position>
        {children}
      </Position>
    </div>
  )
}

interface IInlinePopupContentProps {
  onSelect: (label: string, value: string) => void
}

function InlinePopupContent({ onSelect }: IInlinePopupContentProps) {
  const tags = useTypedSelector(state => state.drsTemplateConfiguration.tags)
  const crateType = useTypedSelector(state => state.awbLabelConfiguration.propertyType);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.awbLabelConfiguration)

  const categories = React.useMemo(() => {
    var categoriesList = tags.tagGroupMappingList.map((group) => ({
      id: String(group.value),
      label: group.label,
      value: String(group.value)
    }))
    categoriesList.push({
      id: String(tags.tagGroupMappingList.length + 1),
      label: 'Custom',
      value: String(tags.tagGroupMappingList.length + 1)
    })



    if (crateType.propertyValue !== 'CRATEITEM') {
      const index = categoriesList.findIndex(category => category.label === 'Item')
      if (index > -1) {
        categoriesList.splice(index, 1)
      }
    }
    return categoriesList;
  }, [tags])


  const data = React.useMemo(() => {
    return tags.dynamicTagKeys.map(({ dynamicTagKey, tagGroupId, dynamicTagLabelValue, isCustomField }) => ({
      id: (dynamicTagKey == '#@--statusCd--@#' || dynamicTagKey == '#@--orderNo--@#') ? dynamicTagKey + String(tagGroupId) : dynamicTagKey,
      label: isCustomField ? <CustomFieldsGrouppedDropDown customLabel={dynamicTagLabelValue} customText={dynamicLabels.md_custom_label} /> : dynamicTagLabelValue,
      value: (dynamicTagKey == '#@--statusCd--@#' || dynamicTagKey == '#@--orderNo--@#') ? dynamicTagKey + String(tagGroupId) : dynamicTagKey,
      categoryId: isCustomField ? String(tags.tagGroupMappingList.length + 1) : String(tagGroupId),
      hideInAll: isCustomField ? true : false,
      labelText: dynamicTagLabelValue
    }))

  }, [tags])

  return <GroupDropdownWrapper>
      <GroupedDropdown
      category={categories}
      data={data}
      width={'500px'}
      height='350px'
      handleOnChange={(data) => {
        if (data?.label?.props) {
          data.label = data.label.props['customLabel']
        }
        onSelect(data.label , data.value)
      }}
    />
  </GroupDropdownWrapper>
}

export default AttachDynamicTags