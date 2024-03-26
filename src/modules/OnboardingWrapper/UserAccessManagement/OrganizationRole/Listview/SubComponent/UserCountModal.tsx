import React, { useEffect, useState, Dispatch } from 'react'
import { useDispatch } from 'react-redux';
import { OrganizationRoleActions } from '../OrganizationRole.actions'
import { ListView, Modal, ModalHeader, IconButton, Box, Loader, IFetchDataOptions } from 'ui-library'
import apiMappings from '../../../../../../utils/apiMapping'
import axios from '../../../../../../utils/axios'
import DYNAMIC_LABELS_MAPPING from '../../../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../../../common/DynamicLabels/useDynamicLabels'
import { StyledFooter } from '../OrganizationRole.Styled'
import { transformMongoListViewToColumns } from '../../../../../../utils/mongo/ListView'
import { useTypedSelector } from '../../../../../../utils/redux/rootReducer'

interface IUserCountModal {
    userCount: { activeRequest: boolean, customOrgRoleId: (number | undefined) }
    setUserCount: ({ activeRequest, customOrgRoleId }: { activeRequest: boolean, customOrgRoleId: (number | undefined) }) => void
}

const UserCountModal = ({ userCount, setUserCount }: IUserCountModal) => {
    const dispatch = useDispatch<Dispatch<OrganizationRoleActions>>()
    const rowsLoading = useTypedSelector(state => state.settings.organizationRole.listView.userCountListLoading.rows);
    const columnsLoading = useTypedSelector(state => state.settings.organizationRole.listView.userCountListLoading.columns);
    const userList = useTypedSelector(state => state.settings.organizationRole.listView.userCountModalData.results)
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.organizationRole)

    const [columnNames, setColumnNames] = useState<any>([])
    const [dataLoad, setDataLoad] = useState<any>(true)
    const [columns, setColumns] = useState<any>([])
    const [orgRoleId, setOrgRoleId] = useState<number>();


    const getUserData = React.useCallback(async () => {
        try {
            let promiseList = []
            promiseList.push(axios.get(apiMappings.organizationRole.listView.userCountStructure))
            const result = await Promise.all(promiseList);
            const structure = result[0]?.data.columns
            const mongoStructure = structure;
            if (Object.keys(mongoStructure).length) {
                const newColumns = transformMongoListViewToColumns(mongoStructure, 'userCount', {});
                setColumns(newColumns)
            }
            setOrgRoleId(userCount.customOrgRoleId)
            setColumnNames(columnNames)
            setDataLoad(false)
        } catch (error) {
            console.log(error, error?.response)
        }
    }, [])

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions }: IFetchDataOptions) => {
        dispatch({
            type: '@@userCount/SET_DATA',
            payload: {
                key: 'userCountListLoading',
                value: {
                    rows: true,
                    columns: false
                }
            }
        })

        dispatch({
            type: '@@userCount/FETCH_DATA',
            payload: {
                params: {
                    orgRoleId: orgRoleId,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    searchBy: filterOptions?.searchBy,
                    searchText: filterOptions?.searchText,
                    sortBy: sortOptions?.sortBy,
                    sortOrder: sortOptions?.sortOrder,
                },
            }
        })
    }, [orgRoleId])


    useEffect(() => {
        getUserData()
    }, [userCount.activeRequest])


    return <Modal
        open={userCount.activeRequest}
        onToggle={(value) => {
            setUserCount({ ...userCount, activeRequest: value })
        }}
        width='1000px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={`${dynamicLabels.user} ${dynamicLabels.details}`}
                    handleClose={() => setUserCount({ ...userCount, activeRequest: false })}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                    width='100%'
                />
            ),
            content: !dataLoad ? (
                <div>
                    <ListView
                        rowIdentifier='userId'
                        style={{ height: '250px', overflow: 'visible' }}
                        columns={columns}
                        data={userList}
                        hideToolbar
                        hideColumnSettings
                        heightBuffer={10}
                        onFetchData={handleFetchData}
                        loading={rowsLoading}
                        isColumnLoading={columnsLoading}
                    />
                </div>
            ) : <div><Loader center /></div>,
            footer: (
                <StyledFooter>
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>

                        <IconButton
                            iconVariant='icomoon-close'
                            iconSize={11}
                            onClick={() => setUserCount({ ...userCount, activeRequest: false })}
                        >{dynamicLabels.cancelLabel}
                        </IconButton>
                    </Box>
                </StyledFooter>
            )
        }}
    />


}

export default UserCountModal