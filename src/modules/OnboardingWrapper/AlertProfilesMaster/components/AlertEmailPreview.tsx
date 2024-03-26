import React, { useState, useEffect } from 'react'
import PreviewModal from '../../../../utils/components/Preview/PreviewModal';
import DesktopPreview from '../../../../utils/components/Preview/DesktopPreview';
import MobilePreview from '../../../../utils/components/Preview/MobilePreview';
import { Box, ButtonGroup, useToast } from 'ui-library'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import styled from 'styled-components'
import { IAlertEmailPreviewProps, IAlertSettingsRoutePayload, IPreviewEmailResponse } from '../AlertProfilesMaster.models'
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import SendEmailTextBox from './SendEmailTextbox'
import { ILogiAPIResponse } from '../../../../utils/api.interfaces';
import { sendGA } from '../../../../utils/ga';
import { useLocation } from 'react-router-dom';

export const Preview = styled.div`
  padding: 15px 50px;
  background-color: #f0f0f0;
  height: 700px;
  overflow-y: auto;
`

export const PreviewModalWrapper = styled.div`
  & #modalwrapperid > div > div > div{
    padding:0px 0px 10px; 0px;
  }
  & .preview-content-wrapper {
    margin: 0px 30px 0px
  }
`

const AlertEmailPreview = ({ alertMasterId, templateId, subject, message, handleClose }: IAlertEmailPreviewProps) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.alertMessageTemplate);
  const [previewMode, setPreviewMode] = useState<string>('desktop');
  const [HTMLCode, setHTMLCode] = useState<any | undefined>()
  const toast = useToast()
  const location = useLocation<IAlertSettingsRoutePayload>()

  const handlePreviewMode = (mode: 'desktop' | 'mobile') => {
    setPreviewMode(mode);
  };

  const getHTMLCode = async (alertMasterId: number, templateId: number, subject: string, message: string) => {

    try {
      const data: ILogiAPIResponse<IPreviewEmailResponse>
        = await axios.post(apiMappings.settings.alertProfiles.getHTMLBody, {
          subject: subject.replace(/\n/g, ''),
          message: message
        }, {
          params: {
            alertMasterId: alertMasterId,
            type: 'EMAIL',
            templateId: templateId
          }
        })
      setHTMLCode(data.data.data.body)

    } catch (errorMessage) {
      const message = errorMessage?.data?.data?.message
      toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  const sendTestEmail = async (email: string) => {
    const emails = email.replace(/\s/g, "").split(',')

    sendGA('Settings > Alert Profiles Master' ,'Button Click' + `${location.state.alertName} - Send Test Email`)

    try {
      const response = await axios.post(apiMappings.settings.alertProfiles.sendTestEmail, {
        subject: subject.replace(/\n/g, ''),
        message,
        toEmails: [...emails]
      })
      toast.add(response.data.message || 'Success', 'check-round', false)

    } catch (errorMessage) {
      const message = errorMessage?.response?.data?.message
      toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  useEffect(() => {

    getHTMLCode(alertMasterId, templateId, subject, message)

  }, [alertMasterId, templateId, subject, message])

  const previewOptions = React.useMemo(() => {
    return [
      {
        id: 'desktop',
        label: dynamicLabels.desktop,
        selected: previewMode === 'desktop',
        tooltipText: dynamicLabels.desktop,
        icon: "desktop"
      },
      {
        id: "mobile",
        label: dynamicLabels.mobile,
        selected: previewMode === 'mobile',
        tooltipText: dynamicLabels.mobile,
        icon: "mobile"
      },

    ]
  }, [dynamicLabels.desktop, dynamicLabels.mobile, previewMode])

  return (
    <PreviewModalWrapper >
      <PreviewModal
        isModalOpen={true}
        modalTitle='Alerts Email Preview'
        toggleHandler={handleClose}
      >
        <Box
          display='flex'
          justifyContent='space-between'
        >
          <SendEmailTextBox onClick={(email: string) => sendTestEmail(email)} />
          <ButtonGroup
            data={previewOptions}
            onChange={(id: string) => handlePreviewMode(id as "desktop" | "mobile")}
          />
        </Box>
        {previewMode === 'desktop' ? (
          <DesktopPreview>
            <Preview
              dangerouslySetInnerHTML={{ __html: HTMLCode }}
            />
          </DesktopPreview>
        ) : (
            <MobilePreview>
              <Preview
                dangerouslySetInnerHTML={{ __html: HTMLCode }}
              />
            </MobilePreview>
          )}
      </PreviewModal>
    </PreviewModalWrapper>

  )
}

export default AlertEmailPreview