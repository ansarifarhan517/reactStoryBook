import React from 'react'
import { Accordion, AccordionHeaderTitle, AccordionContent, IconButton, TextInput, NumberInput, DropDown} from 'ui-library'
import {CrateLineHeaderWrapper, StyledAccordionHeaders, StyledCrate, FormDataWrapper, ReadOnlyWrapper} from '../styled'
import {IChildProps} from '../interfaces'

const Child = ({
    crateId,
    crateIndex, 
    crateItemColumns, 
    crateItems, 
    handleCrateItemChange, 
    onAddCrateItem, 
    onDeleteCrateItem,
    TemperatureDropdown,
    readMode
  }:IChildProps) => {
    
    const [expanded, setExpanded] = React.useState('1')
    const handleToggle = (accordionId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordionId : '')
    } 

    return (
      <>
      {crateItems?.map((i:any, index:number) => 
         {return i.isDeleteFl === 'N' ? <Accordion key={i.id+crateId} id={index.toString()} expanded={expanded === index.toString()} onToggle={handleToggle}>
            {{
             header: (
                <CrateLineHeaderWrapper>
                    <StyledAccordionHeaders expanded={expanded === index.toString()}>
                      <AccordionHeaderTitle >
                        Items: {index+1}
                      </AccordionHeaderTitle>
                     
                    </StyledAccordionHeaders>
                    {!readMode && <IconButton
                      onClick={() => onDeleteCrateItem(index, crateIndex)}
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
                    
                    {crateItemColumns && Object.values(crateItemColumns)?.map((o:any) => {
                        if(readMode) {
                          return <ReadOnlyWrapper>
                            <div style={{fontWeight:800}}>{o.label}</div>
                            <div>{i?.[o.id] || 'Not Avaialble'}</div>
                          </ReadOnlyWrapper>
                        } else {
                        if(o.fieldType === 'number') {
                          return <NumberInput
                          id={o.id}
                          name={o.label}
                          className='CrateTextBox'
                          label={o.label}
                          placeholder={o.label}
                          initialValue={i?.[o.id]}
                          onChange={(e) => handleCrateItemChange(e,index, o.id, crateIndex)}
                          fullWidth
                          allowDecimal={true}
                          error={o.required && i?.[o.id] === undefined || o.required && i?.[o.id] === ''}
                          required={o.required}
                          errorMessage={o.required && i?.[o.id] === undefined || o.required && i?.[o.id] === '' ? o?.validation?.required?.message : ''}
                          
                        />
                    
                        } else if(o.fieldType === 'dropdown'){
                        return <DropDown
                        variant='form-select'
                        optionList={TemperatureDropdown}
                        label={o?.label}
                        onChange={(e:any) => {
                          console.log(e)
                          return handleCrateItemChange(e,index, o.id, crateIndex)
                          }
                        }
                        placeholder={o?.label}
                        value={i?.[o.id]}
                         />
                        }
                        else {
                          return <TextInput
                          id={o.id}
                          name={o.label}
                          className='CrateTextBox'
                          label={o.label}
                          placeholder={o.label}
                          value={i?.[o.id]}
                          onChange={(e) => handleCrateItemChange(e.target.value,index, o.id, crateIndex)}
                          fullWidth
                          required={o.required}
                          error={o.required && i?.[o.id] === undefined || o.required && i?.[o.id] === ''}
                          errorMessage={o.required && i?.[o.id] === undefined || o.required && i?.[o.id] === '' ? o?.validation?.required?.message : ''}

                        />
                        } 
                      }
                      }
                    )}
                    
                    </FormDataWrapper>
                </AccordionContent>
            )
            }}
        </Accordion>: ''}
      )}
       {!readMode && <StyledCrate onClick={() => onAddCrateItem(crateIndex)}>
            + Add Item
       </StyledCrate>}
      
      </>
  )
  }
  
export default Child 