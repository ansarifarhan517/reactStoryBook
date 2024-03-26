import React from 'react'
import { Grid } from 'ui-library'
import { StyledTable } from './StyledAccodion'

interface IAccordionTable {
    columnNames: string[]
    listOfValues?: Array<IList[]>
}
interface IList {
    key?: string
    value?: any
}

const AccordionTable = ({ columnNames, listOfValues }: IAccordionTable) => {
    return <StyledTable>
        <Grid spacing='5px'>
            <table>
                <thead>
                    <tr>
                        {
                            columnNames?.map((column: string, index: number) => {
                                return <th key={column + index} title={column} >{column}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        listOfValues?.map((entry) => {
                            return <tr> {entry.map(es => {
                                return <td key={es.key} title={es.value?.toString() || ''}>{isNaN(Number(es?.value))? es.value : Number(es?.value?.toFixed(3)) } </td>

                            })}</tr>

                        })
                    }
                </tbody>
            </table>
        </Grid>
    </StyledTable>
}

export default AccordionTable