import React from 'react'
import styled from 'styled-components'
import { GroupedDropdown, InlinePopup, Position, IconButton } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import CustomFieldsGrouppedDropDown from '../utils/CustomFieldsGrouppedDropDown';


interface IAttachDynamicTagsProps {
  children: JSX.Element
  show?: boolean
  onSelect?: (label: string, value: string) => void
}
const DynamicTagsButton = styled(IconButton)`
  i {
    font-size: 20px;
    height: 20px;
    line-height: 20px;
  }
`

const AttachDynamicTags = ({ children, onSelect = () => { }, show }: IAttachDynamicTagsProps) => {
  const [showButton, setShowButton] = React.useState<boolean>(show === undefined ? false : show)
  const [isInlinePopupOpen, setIsInlinePopupOpen] = React.useState<boolean>(false)
  const isTagCategoryEmpty = useTypedSelector(state => state.settings.alertProfilesMaster.settings.tags)
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
    // console.log(e.target, containerRef.current?.contains(e.target))
    // if (!containerRef.current?.contains(e.target)) {
    // console.log({ isInlinePopupOpen })
    if (!isInlinePopupOpen && show === undefined) {
      setShowButton(false)
    }
    // }
  }

  return (
    <div ref={containerRef}>
      <Position type='relative' onFocus={handleFocus} onBlur={handleBlur}>
        <Position type='absolute' top='10px' right='10px' zIndex='1'
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
              style={{ margin: '5px 0px' }}
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
  const tags = useTypedSelector(state => state.settings.alertProfilesMaster.settings.tags)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const categories = React.useMemo(() => {
    return tags.tagGroupMappingList.map((group) => ({
      id: String(group.value),
      label: group.label,
      value: String(group.value)
    }))
  }, [tags])

  const data = React.useMemo(() => {
    return tags.alertKeys.map(({ alertTagKey, tagGroupId, alertTagLabelValue, isCustomField }) => ({
      id: alertTagKey,
      label: isCustomField ? <CustomFieldsGrouppedDropDown customLabel={alertTagLabelValue} customText={dynamicLabels.md_custom_label} /> : alertTagLabelValue,
      value: alertTagKey,
      categoryId: String(tagGroupId),
      hideInAll: isCustomField ? true : false,
      labelText: alertTagLabelValue
    }))

  }, [tags])

  return <GroupedDropdown
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
}

export default AttachDynamicTags