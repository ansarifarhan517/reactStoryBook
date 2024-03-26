import React from 'react'
import {Typography, Grid } from 'ui-library'

const GenerateManifestTableHeader = (props:any) => {
    const { dynamicLabels } = props;
    return (
        <Grid  container style={{ margin: '0px', padding: '10px 0px', display: 'flex', alignItems: 'center', borderBottom: "1px solid #eeeeee", flexWrap: 'nowrap' }}>
            <Grid item className='grid-item grid-item-drag'>
            </Grid>
            <Grid item className='grid-item grid-item-select' >
                <Typography fontWeight={600} style={{paddingLeft:'25px'}}>{dynamicLabels.field}</Typography> 
            </Grid>
            <Grid item className='grid-item grid-item-select'>
                <Typography fontWeight={600}>{dynamicLabels.configurations}</Typography>
            </Grid>
            <Grid item className='grid-item grid-item-select'>
            </Grid>
            <Grid item className='grid-item grid-item-select'>
            </Grid>
            <Grid item className='grid-item grid-item-select grid-item-select-auto'>
                <Typography fontWeight={600}>{dynamicLabels.sampleValue}</Typography>
            </Grid>
            <Grid item className='grid-item grid-item-action'>
                <Typography fontWeight={600}>{dynamicLabels.actions}</Typography>
            </Grid>
        </Grid>
    )
}

export default GenerateManifestTableHeader;
