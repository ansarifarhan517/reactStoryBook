import React, { Dispatch } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { OrganizationRoleActions } from './OrganizationRole.actions'
import  AccessProfileCountModal  from './SubComponent/AccessProfileCountModal'
import UserCountModal from './SubComponent/UserCountModal';



const OrganizationModal = () => {
    const dispatch = useDispatch<Dispatch<OrganizationRoleActions>>()
    const accessProfileCount = useTypedSelector(state => state.settings.organizationRole.listView.accessProfileCount)
    const userCount = useTypedSelector(state=>state.settings.organizationRole.listView.userCount)

    return <>
    {/*AccessProfileCount Modal*/}
        {accessProfileCount.activeRequest &&
            <AccessProfileCountModal
            accessProfileCount={accessProfileCount}
            setAccessProfileCount={(payload => {
                    dispatch({ type: '@@organizationRole/SET_NO_OF_ACCESSPROFILE_MODAL', payload })
                })}
            />
        }

    {/*UserCount Modal*/}
    {userCount.activeRequest &&
            <UserCountModal
            userCount={userCount}
            setUserCount={(payload => {
                    dispatch({ type: '@@organizationRole/SET_NO_OF_USERS_MODAL', payload })
                })}
            />
        }
    </>

}

export default OrganizationModal