import React from 'react';
import { Box, Typography } from 'ui-library';
import InformationIcon from './InformationIcon';
import "./SubComponentStyles.scss";

export const SectionHeader = ({ title, message }) => {
    return (
        <>
            <div className="sub-component__section-header">
                <Box display="flex" alignItems="center" flexDirection="row">
                    <Typography className="sub-component__section-title">{title}</Typography>
                    <InformationIcon isError={false} dimension={'20px'} direction="right" message={message} />
                </Box>
            </div>
            <div className="sub-component__underline" />
        </>
    )
}
