import React, { useEffect, useState } from 'react'
import { Grid, Modal, ModalHeader, IconButton, Box, Loader } from 'ui-library'
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { IRowData } from '../../../Driver/DriverListView/DriverListView.models'
import { StyledFooter, StyledNoOFUsers } from '../StyledShipperListView'

interface INoOfUsersModal {
    noOfUsersModal: { activeRequest: boolean, customClientId: (number | undefined) }
    setNoOfUsersModal: ({ activeRequest, customClientId }: { activeRequest: boolean, customClientId: (number | undefined) }) => void
}

//css formatting pending
const NoOfUsersModal = ({ noOfUsersModal, setNoOfUsersModal }: INoOfUsersModal) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.shipper)
    const [listOfUsers, setListOfUser] = useState<any>([])
    const [columnNames, setColumnNames] = useState<any>([])
    const [dataLoad, setDataLoad] = useState<any>(true)

    const getClientUserData = async () => {
        try {
            let promiseList = []
            promiseList.push(axios.get(apiMappings.shipper.listView.getClientUserStructure))
            promiseList.push(axios.get(apiMappings.shipper.listView.getClientUserList, {
                params: {
                    customClientId: noOfUsersModal.customClientId
                }
            }))
            const result = await Promise.all(promiseList)
            const structure = result[0]?.data.columns
            const userList = result[1]?.data.results
            const columnNames: any = []
            const propertyNames: any = []
            Object.values(structure).forEach((column: any) => {
                columnNames.push(column?.label)
                propertyNames.push(column?.id)
            });
            const newUserList: any = []
            userList.forEach((user: IRowData) => {
                const userInfo = {}
                propertyNames.forEach((property: string) => {
                    userInfo[property] = user[property]
                })
                newUserList.push(userInfo)
            })
            setColumnNames(columnNames)
            setDataLoad(false)
            setListOfUser(newUserList)


        } catch (error) {
            console.log(error, error?.response)
        }
    }

    useEffect(() => {

        getClientUserData()

    }, [noOfUsersModal.activeRequest])
    return <Modal
        open={noOfUsersModal.activeRequest}
        onToggle={(value) => {
            setNoOfUsersModal({ ...noOfUsersModal, activeRequest: value })
        }}
        width='800px'
        children={{
            header: (
                <ModalHeader
                    headerTitle='Users'
                    handleClose={() => setNoOfUsersModal({ ...noOfUsersModal, activeRequest: false })}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                    width='100%'
                />
            ),
            content: !dataLoad ? (
                <StyledNoOFUsers>
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
                                    listOfUsers?.map((user: any) => {
                                        const list = Object.values(user)
                                        return <tr>
                                            {
                                                list.map((userProp: any, index: number) => {
                                                    return <td key={userProp + index} title={userProp}>{userProp}</td>
                                                })
                                            }</tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </Grid>
                </StyledNoOFUsers>
            ) : <div><Loader center /></div>,
            footer: (
                <StyledFooter>
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>

                        <IconButton
                            iconVariant='icomoon-close'
                            iconSize={11}
                            onClick={() => setNoOfUsersModal({ ...noOfUsersModal, activeRequest: false })}
                        >{dynamicLabels.cancel}
                        </IconButton>
                    </Box>
                </StyledFooter>
            )
        }}
    />
}

export default NoOfUsersModal