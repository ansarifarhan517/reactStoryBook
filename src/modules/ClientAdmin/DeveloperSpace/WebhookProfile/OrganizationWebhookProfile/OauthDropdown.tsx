import React, { useState } from "react"
import { DropDown } from "ui-library"

const OauthDropdown = (props) => {
    console.log(props , "ads")
    // const [tokenName , setTokenName] = useState('')
    // const [appnedTo , setAppendTo]  =useState('')

    const options = [
        {
            value: 'emailVerificationPending',
            label: 'Email Verification Pending Shipper',
            title: 'Email Verification Pending Shipper'
        },
        { value: 'allShippers', label: 'All Shippers', title: 'All Shippers' },
        {
            value: 'approvalPendingShippers',
            label: 'Approval Pending Shippers',
            title: 'Approval Pending Shippers'
        }
    ]
    const optionsAppend = [
        {
            value: 'header',
            label: 'Header',
            title: 'Header'
        },
        { value: 'url', label: 'URL', title: 'URL' },

    ]
    return (
        <>
            <DropDown
                id="oauthwebhook"
                name="oauthwebhook"
                optionList={options}
                label={'Token Name'}
                error={props.errors?.oauthwebhook }
                errorMessage={props.errors?.oauthwebhook &&  "Token name is mandatory"}
                required={true}
                onChange={(e: string) => {
                    props.setTokenName(e)
                  }}
                placeholder={'Select'}
                value={props.tokenName}
                width={props.width || '300px'}
            />
            <DropDown
                id="oauthAppendto"
                optionList={optionsAppend}
                label={'Append to'}
                required={true}
                onChange={(e: string) => {
                    props.setAppendTo(e)
                  }}
                placeholder={'Select'}
                value={props.appnedTo}
                width={props.width || '300px'}

            />
        </>
    )
}

export default OauthDropdown