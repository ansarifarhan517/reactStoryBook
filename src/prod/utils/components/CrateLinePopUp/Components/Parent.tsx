import React, { useEffect, useState } from 'react'
import { Accordion, AccordionHeaderTitle, AccordionContent, AccordionHeaderSubTitle, TextInput, IconButton, NumberInput, DropDown } from 'ui-library'
import {CrateLineHeaderWrapper, StyledAccordionHeaders, FormDataWrapper, ReadOnlyWrapper} from '../styled'
import Child from './Child'
import {IParentProps} from '../interfaces'



const Parent = (
  {crate,
  handleDeleteCrate, 
  crateColumns,  
  handleChange, 
  crateItems, 
  crateItemColumns, 
  onAddCrateItem,
  onDeleteCrateItem,
  handleCrateItemChange,
  TemperatureDropdown,
  readMode
 }:IParentProps) => {
    const [expanded, setExpanded] = useState('0')
    const handleToggle = (accordionId: string, isExpanded?: boolean) => {
      setExpanded(isExpanded ? accordionId : '')
    } 
  
    // const [crateD, setCrateD] = useState()

    useEffect(() => {
      console.log('crate changed', crate)
    },[crate])

    const onChangeHandler = (value:string, index: number, id: string) => {
      console.log(value, index, id)
      handleChange(value,index, id)
    }

    return (
      <div>
      {crate?.map((c:any, index:number) => 
        {return c.isDeleteFl === 'N' ? <Accordion key={c.id} id={index.toString()} expanded={expanded === index.toString()} onToggle={handleToggle}>
            {{
                header: (
                <CrateLineHeaderWrapper>
                    <StyledAccordionHeaders expanded={expanded === index.toString()}>
                      <AccordionHeaderTitle >
                        Crate: {index+1}
                      </AccordionHeaderTitle>
                      <AccordionHeaderSubTitle>
                        Total No. of Items : 
                      </AccordionHeaderSubTitle>
                    </StyledAccordionHeaders>
                    {!readMode && <IconButton
                      onClick={() => handleDeleteCrate(index)}
                      onlyIcon
                      iconVariant='icomoon-delete-empty'
                      iconSize='md'
                      color={expanded === index.toString() ? 'white' : 'grey'}
                    />}
                </CrateLineHeaderWrapper>
                ),
                content: (
                <AccordionContent>

                    <FormDataWrapper>
                    {crateColumns && Object.values(crateColumns)?.map((o:any) => {
                      if(readMode) {
                        return <ReadOnlyWrapper>
                          <div style={{fontWeight:800}}>{o.label}</div>
                          <div>{c?.[o.id] || 'Not Available'}</div>
                        </ReadOnlyWrapper>
                      } else {
                        if(o.fieldType === 'number') {
                          return <NumberInput
                          id={o.id}
                          name={o.label}
                          className='CrateTextBox'
                          label={o.label}
                          placeholder={o.label}
                          initialValue={c?.[o.id]}
                          onChange={(e) => onChangeHandler(e,index, o.id )}
                          fullWidth
                          allowDecimal
                          error={o.required && c?.[o.id] === undefined || o.required && c?.[o.id] === ''}
                          required={o.required}
                          errorMessage={o.required && c?.[o.id] === undefined || o.required && c?.[o.id] === '' ? o?.validation?.required?.message : ''}
                          
                        />
                    
                        } else if(o.fieldType === 'dropdown'){
                        return <DropDown
                        variant='form-select'
                        optionList={TemperatureDropdown}
                        label={o?.label}
                        onChange={(e:any) => {
                          console.log(e)
                          return handleChange(e, index, o.id )
                          }
                        }
                        placeholder={o?.label}
                        value={c?.[o.id] || ''}
                         />
                        }
                        else {
                          return <TextInput
                          id={o.id}
                          name={o.label}
                          className='CrateTextBox'
                          label={o.label}
                          placeholder={o.label}
                          value={c?.[o.id] || ''}
                          onChange={(e) => onChangeHandler(e.target.value,index, o.id)}
                          fullWidth
                          error={o.required && c?.[o.id] === undefined || o.required && c?.[o.id] === ''}
                          required={o.required}
                          errorMessage={o.required && c?.[o.id] === undefined || o.required && c?.[o.id] === '' ? o?.validation?.required?.message : ''}
                        />
                        } 
                      }
                    
                      }
                    )}
                    </FormDataWrapper>
                    {/* CHILD ACCORDION */}
                    <Child 
                      crateId={c.id}
                      key={c.id} 
                      crateIndex={index}
                      crateItemColumns={crateItemColumns} 
                      crateItems={crateItems?.[index] || undefined} 
                      handleCrateItemChange={handleCrateItemChange}
                      onAddCrateItem={onAddCrateItem}
                      onDeleteCrateItem={onDeleteCrateItem}
                      TemperatureDropdown={TemperatureDropdown || []}
                      readMode={readMode}
                      
                    />

                </AccordionContent>
                )
            }}
        </Accordion> : ''}
      )}
      </div>
    )
}



export default Parent