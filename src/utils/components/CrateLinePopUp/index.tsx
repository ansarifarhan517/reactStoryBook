import React, { useEffect, useState } from 'react'
import Parent from './Components/Parent'
import { IconButton, useToast } from 'ui-library'
import { StyledCrate, CrateLineWrapper, ButtonWrapperStyled } from './styled'
import { PrepareCrateItemData, prepareEmptyCrateData, prepareShipmentLineItemsObject } from './Utils/index'
import { ICrateLineProps } from './interfaces'
import apiMappings from '../../../utils/apiMapping'
import axios from '../../../utils/axios'
import { PrepareAutomatedValidatingData } from './Utils'

const CrateLinePopUp = (
  {
    crateColumns,
    crateItemColumns,
    crateData,
    handleClose,
    shipmentId,
    TemperatureDropdown,
    readMode,
    handleSave
  }: ICrateLineProps) => {
  const toast = useToast()
  const [crate, setCrate] = useState<any[] | undefined>(crateData)
  const [crateItems, setCrateItems] = useState<any[] | {}>()

  useEffect(() => {
    const data = PrepareCrateItemData(crateData)
    setCrate(crateData)
    setCrateItems(data)
  }, [crateData])

  const addCrate = () => {
    const data = prepareEmptyCrateData(crateColumns)
    crate ? setCrate([
      ...crate,
      { ...data }
    ]) : setCrate([
      { ...data }
    ])
  }

  const handleDeleteCrate = (id: number) => {
    let temp = crate && [...crate]
    if (temp) {
      temp[id].isDeleteFl = "Y"
      setCrate(temp)
    }
  }

  const handleChange = (value: any, index: any, columnId: any) => {
    let temp = crate && [...crate]
    if (temp) {
      temp[index][columnId] = value
    }
    setCrate(temp)
    console.log('handle change called')
  }

  const onSave = async () => {

    const validate = PrepareAutomatedValidatingData(crate, crateColumns, crateItems, crateItemColumns)

    let finalObj = crate?.map((c: any, index: number) => {
      const shipmentItems = prepareShipmentLineItemsObject(crateItems?.[index] ? [...crateItems[index]] : [])
      return {
        ...c,
        ['shipmentlineitems']: shipmentItems && crateItems?.[index] ? [...shipmentItems] : []
      }
    })

    if (validate && finalObj) {
      const payload = {
        shipmentCrates: [...finalObj],
        shipmentId: shipmentId
      }

      try {
        const data = await axios.put(apiMappings.order.listView.getPutCrateLineData, payload)
        console.log('DATA', data)
        handleClose()
        handleSave(payload)

      } catch (e) {
        console.log(e)
        handleClose()
      }
    } else {
      toast.add('Incomplete Information', 'error', false)
    }
  }


  const onAddCrateItem = (id: any) => {
    let temp = crateItems ? { ...crateItems } : undefined
    const data = prepareEmptyCrateData(crateItemColumns)
    if (temp) {
      temp = temp[id] ? {
        ...temp,
        [id]: [
          ...temp[id],
          { ...data }
        ]
      } : {
          ...temp,
          [id]: [{ ...data }]
        }
    } else {
      temp = {
        [id]: [{ ...data }]
      }
    }
    setCrateItems({ ...temp })

  }

  const onDeleteCrateItem = (id: any, crateId: any) => {
    const temp = crateItems && [...crateItems[crateId]]

    if (temp && temp[id]) {
      temp[id].isDeleteFl = "Y"

      setCrateItems({
        ...crateItems,
        [crateId]: [...temp]
      })
    }
  }

  const handleCrateItemChange = (value: any, index: any, columnId: any, crateId: number) => {
    const temp = crateItems && [...crateItems[crateId]]
    if (temp && temp[index]) {
      temp[index][columnId] = value
      setCrateItems({
        ...crateItems,
        [crateId]: [...temp]
      })
    }
  }

  return (<><CrateLineWrapper>
    <Parent
      crate={crate || []}
      handleDeleteCrate={handleDeleteCrate}
      crateColumns={crateColumns}
      crateItemColumns={crateItemColumns}
      crateItems={crateItems}
      handleChange={handleChange}
      onAddCrateItem={onAddCrateItem}
      onDeleteCrateItem={onDeleteCrateItem}
      handleCrateItemChange={handleCrateItemChange}
      TemperatureDropdown={TemperatureDropdown}
      readMode={readMode}
    />
    {!readMode && <StyledCrate onClick={addCrate}>
      + Add Crate
        </StyledCrate>}
  </CrateLineWrapper>
    <ButtonWrapperStyled>
      {!readMode && <IconButton
        onClick={onSave}
        iconVariant='icomoon-save'
        children='Save'
      />}
      <IconButton
        onClick={handleClose}
        iconVariant='icomoon-close'
        children='Cancel'
      />
    </ButtonWrapperStyled>
  </>
  )
}

export default CrateLinePopUp