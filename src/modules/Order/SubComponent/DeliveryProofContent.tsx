
import React, { useState } from "react";
import { Box, Grid, InputLabel, Typography, FontIcon } from "ui-library";
import { getFormattedDate } from '../OrderListOptionData/utils';
import { ShowDeliveryProofImage } from '../OrderListView/StyledOrderListView'

const DeliveryProofContent = (props: any) => {
    const { row, structure,} = props
    const [showImages, setShowImages] = useState(false)
    const [selectedImageRow, setSelectedImageRow] = useState([]);
    const [selectedImg, setSelectedImg] = useState({ index: 0, shipmentImageId: '', url: '', name: '', caption: '' });
    const handleShowImage = (value: string) => {
        setSelectedImageRow(row[value])
        setSelectedImg({ index: 0,shipmentImageId: row[value][0]['shipmentImageId'], 'url': row[value][0]['url'], name: row[value][0]['imageName'], caption: row[value][0]['comments'] });
        setShowImages(true);
    }
    const loadImg =(direction:string)=>{
        if(direction=="prev" && selectedImg.index !== 0){
            setSelectedImg({ index: selectedImg.index -1,shipmentImageId: selectedImageRow[selectedImg.index -1]['shipmentImageId'], 'url': selectedImageRow[selectedImg.index -1]['url'], name: selectedImageRow[selectedImg.index -1]['imageName'], caption: selectedImageRow[selectedImg.index -1]['comments'] });
        } else if(direction=="next" && selectedImg.index < selectedImageRow.length -1){
            setSelectedImg({ index: selectedImg.index + 1,shipmentImageId: selectedImageRow[selectedImg.index +1]['shipmentImageId'], 'url': selectedImageRow[selectedImg.index +1]['url'], name: selectedImageRow[selectedImg.index +1]['imageName'], caption: selectedImageRow[selectedImg.index +1]['comments'] });
        }
        
        console.log(direction);
    }
    return <Box><Grid container spacing='.5em'>
        {(

            Object.keys(structure.columns).map(function (value) {
                return <><Grid item md={3} spacing={20}>
                    <InputLabel fontSize="14" lineHeight="1.5" bold={true}>{structure.columns[value].label}</InputLabel>
                    <div style={{ marginBottom: "10px" }}>
                        {value !== 'podList' && value !== 'esignList' && (
                            <Typography fontSize="14" variant="tooltipWithWordWrap">
                                {(
                                    value === 'completePartial' ? row['isPartialDeliveredFl'] ? "PARTIAL" : "COMPLETE"
                                        : value === 'checkInTime' || value === 'checkOutTime' ? row[value] ? getFormattedDate(row[value],"") : "Not Available"
                                            : row[value] ? row[value] : "Not Available"
                                )}</Typography>
                        )}
                        {value === 'podList' && (
                            <ShowDeliveryProofImage onClick={() => handleShowImage(value)}>{row[value] ? row[value].length + ' Images' : '0 Images'}</ShowDeliveryProofImage>
                        )}
                        {value === 'esignList' && (
                            <ShowDeliveryProofImage onClick={() => handleShowImage(value)}>{row[value] ? row[value].length + ' Images' : '0 Images'}</ShowDeliveryProofImage>
                        )}
                    </div>
                </Grid>

                </>
            })

        )}
    </Grid>
        {showImages && <div style={{ maxHeight: '350px', overflow: 'auto', marginTop: '30px' }}>

            {selectedImageRow ? (
                <div style={{position:"relative"}}>
                    <div className="imageName" style={{ background: '#5697d3', color: '#fff', padding: '10px' }}>{selectedImg.name}
                        <a href={selectedImg.url} style={{ marginLeft: "10px", color: "#fff" }}>
                            <FontIcon
                                color="white"
                                variant="icomoon-download"
                                size={20}
                            /></a>
                    </div>
                    <div className="prev" style={{position:"absolute", left:"0", top: "40%",background: '#5697d3',borderRadius:"4px",padding:'5px',cursor:"pointer"}} onClick={()=>loadImg('prev')}>
                        <FontIcon
                            color="white"
                            variant="icomoon-angle-left"
                            size={20}
                        />
                    </div>
                    <div className="next" style={{position:"absolute", right:"0", top: "40%",background: '#5697d3',borderRadius:"4px",padding:'5px',cursor:"pointer"}} onClick={()=>loadImg('next')}>
                        <FontIcon
                            color="white"
                            variant="icomoon-angle-right"
                            size={16}
                        />
                    </div>
                    <img style={{ maxHeight: "200px", margin: "0 auto", display: 'block' }} src={selectedImg.url} />
                    <div style={{background: "rgba(0, 0, 0, 0.5)", color: "#f1f1f1", width: "150px", textAlign: "center", position: "absolute", padding: "6px 6px 0.5px 6px", fontSize: "1.3rem", lineHeight: "1.25", bottom: "90px", left:"43.6%"}} >
                        <p>{selectedImg.caption}</p>
                    </div>
                    <div className="listOfImages" style={{ background: "#ddd", padding: "10px" }}>
                        {selectedImageRow.map((key,value) => {
                            return <img style={{ width: '50px', height: '50px', padding: "2px", margin: "10px", cursor: "pointer", border: selectedImg.shipmentImageId === key['shipmentImageId'] ? "2px solid #000" : "2px solid #fff" }} src={key['url']} onClick={() => setSelectedImg({ index:value,shipmentImageId: key['shipmentImageId'], 'url': key['url'], name: key['imageName'] })}></img>
                        })}
                    </div>
                </div>

            ) : 'Not Available'}
        </div>}
    </Box>


}

export default DeliveryProofContent