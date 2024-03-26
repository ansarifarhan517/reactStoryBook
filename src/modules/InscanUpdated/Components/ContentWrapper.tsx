import React, { ReactNode } from "react";
import { Box,Grid, Card } from "ui-library"

interface IContentWrapperProps {
    children: ReactNode
}
const ContentWrapper = ({ children }: IContentWrapperProps) => {
    return <Box display='flex' flexDirection='column' style={{ width: '100%', height: '90vh', marginRight: '2px' }}>
        <Grid container spacing={5} style={{ flexGrow: 1, width: '100%', boxShadow: '0 2px 20px -10px #000' }}> {/* overflow: 'hidden'*/}
            <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                    {children}
                </Card>
            </Grid>
        </Grid>
    </Box>
}


export default ContentWrapper;
