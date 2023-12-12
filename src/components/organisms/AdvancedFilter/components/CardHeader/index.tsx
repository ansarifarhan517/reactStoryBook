import React from 'react'
import { FilterCardHeaderStyled, IconWrappers, TextInputStyled } from './styled'
import IconButton from '../../../../atoms/IconButton'
import FontIcon from '../../../../atoms/FontIcon'
import TextInput from '../../../../molecules/TextInput'
import { IAdvancedFilterCardHeader } from '../../interfaces'

const CardHeader = ({
  id,
  label,
  name,
  setName,
  save,
  saveTooltip,
  duplicateTooltip,
  cancelTooltip,
  favouriteTooltip,
  duplicate,
  favourite,
  isFavourite,
  allowFavourites,
  close
}: IAdvancedFilterCardHeader) => {
  return (
    <FilterCardHeaderStyled>
      <span>
        {label}
        <FontIcon
          variant='angle-right-thin'
          color='white'
          size={10}
          style={{ padding: '0px 5px' }}
        />

        <TextInputStyled>
          <TextInput
            id='filterName'
            name='filterName'
            className='filterNameClassName'
            placeholder='Enter Name ...'
            onChange={(e) => setName && setName(e.target.value)}
            variant='inline-edit'
            value={name}
          />
        </TextInputStyled>
      </span>
      <IconWrappers>
        <IconButton
          title={saveTooltip}
          onClick={save}
          onlyIcon
          iconVariant='icomoon-save'
          iconSize={15}
          color='white'
        />
        {allowFavourites && id && isFavourite ? (
          <IconButton
            title={favouriteTooltip}
            onClick={favourite}
            onlyIcon
            iconVariant='star-filled'
            iconSize={15}
            color='white'
          />
        ) : (
          allowFavourites &&
          id && (
            <IconButton
              title={favouriteTooltip}
              onClick={favourite}
              onlyIcon
              iconVariant='star-empty'
              iconSize={15}
              color='white'
            />
          )
        )}
        {id && (
          <IconButton
            title={duplicateTooltip}
            onClick={duplicate}
            onlyIcon
            iconVariant='copy-empty'
            iconSize={15}
            color='white'
          />
        )}

        <IconButton
          title={cancelTooltip}
          onClick={close}
          onlyIcon
          iconVariant='close'
          iconSize={12}
          color='white'
        />
      </IconWrappers>
    </FilterCardHeaderStyled>
  )
}
export default CardHeader
