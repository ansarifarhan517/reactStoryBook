import React, { useState, useEffect } from 'react'
import { IconButton, ModalHeader, Modal, Box, useToast, Button } from 'ui-library'
import FileUploadModalContent, { IFileUploadModalProps } from '../components/FileUploadModalContent'
import axios from '../axios'
import { useTypedSelector } from '../redux/rootReducer'
import apiMappings from '../apiMapping'
import { DownloadParams } from './constant'
import { sendGA } from '../../utils/ga'
import { toCapitalized } from '../helper'


interface IwithUploadExcelProps {
  children?: JSX.Element
  isOpen: boolean
  onSuccess?: () => void
  onClose: () => void
  featureName: string
}

const WithUploadExcel = ({ children = <div/>, isOpen = false , featureName = '' , onSuccess = () => { }, onClose = () => { } }: IwithUploadExcelProps) => {

  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const toast = useToast()

  
  const [fileUploadProps, setFileUploadProps] = useState<IFileUploadModalProps>({
    loading: false,
    error: false,
    page:'',
    message: '',
    errorFileLink: ''
  })

  useEffect(() => {
    if (isOpen && !fileUploadProps.loading) {
      setFileUploadProps({
        loading: false,
        error: false,
        page:featureName,
        message: '',
        errorFileLink: ''
      })
    }
  }, [isOpen])


  const handleFileUpload = async (files: FileList | null) => {
    /** No file uploaded */
    if (!files?.length) {
      setFileUploadProps(props => ({ ...props, error: true, message: dynamicLabels?.somethingWendWrong }))
      return
    }

    /** File Extension not XLS */
    const { name: fileName } = files[0]
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    if (extension !== 'xls') {
      setFileUploadProps(props => ({ ...props, error: true, message: 'Wrong file format. Please upload xls file. ' }))
      return
    }

    /** Process File */
    const fd = new FormData();
    fd.append('importExcel', files[0])

    setFileUploadProps(props => ({ ...props, loading: true }))

    try {
      const { data: response }  = await axios.post(apiMappings.uploadExcel[featureName], fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response?.status === 200 || response?.status === 201) {
        /** Success Message */
      
        setFileUploadProps(props => ({
          ...props,
          error: false,
          loading: false,
          message: response?.message &&
            <>
              <div>{response?.message}</div>
              <div><Button primary variant='link' onClick={onSuccess}>{dynamicLabels.clickHere}</Button>{dynamicLabels.toViewTheUploadedRecords}</div>
            </>,
        }))
        return
      }

      throw response
    } catch (errorResponse) {
  
      if (featureName == 'order') {
        setFileUploadProps(props => ({ ...props, error: true, errorFileLink: errorResponse?.response?.data?.data?.errorFileName || '', message: errorResponse?.response?.data?.message || 'Please contact support.', loading: false }))
      }  else if (featureName === "customer") {
        setFileUploadProps(props => ({ ...props, error: true, errorFileLink: errorResponse?.data || '', message: errorResponse?.response?.data?.message || errorResponse?.message || 'Please contact support.', loading: false }))
      } else {
        setFileUploadProps(props => ({ ...props, error: true, errorFileLink: errorResponse?.data || '', message: errorResponse?.message || 'Please contact support.', loading: false }))

      }

    }
  }
  const handleDownloadSampleFile = async () => {
    sendGA('Column Preference Action', toCapitalized(featureName) + ' List View Download Format')
    try {
      if (featureName == 'contract' || featureName == 'fleetType' || featureName == 'orderRequest' || featureName == 'serviceType' || featureName == 'tracker' || featureName == 'checkpoints') {
        const url = apiMappings.downloadFormat[featureName]
        const { data: { status, data: response } } = await axios.get(url)
        if (status === 200 || status == 0) {
          window.location = response
        } else {
          throw response
        }
      } else {
        const { data: { status, data: response } } = await axios.get(apiMappings.common.downloadExcel, {
          params: DownloadParams[featureName] ? DownloadParams[featureName] : undefined
        })
        if (status === 200) {
          window.location = response
        } else {
          throw response
        }
      }

    } catch (error) {
      toast.add(error?.message || dynamicLabels.somethingWendWrong, '', false)
    }
  }

  return (
    <div>
      <Modal open={isOpen} onToggle={() => { }} size='md' width='600px'>
        {{
          header:
            <ModalHeader headerTitle={dynamicLabels?.uploadFiles}
              handleClose={() => {
                if (!fileUploadProps.error) {
                  setFileUploadProps(fp => ({ ...fp, message: '' }))
                }
                onClose()
              }}
            />,
          content: <div>
            <FileUploadModalContent
              onFileUpload={handleFileUpload}
              onDownloadSampleFile={handleDownloadSampleFile}
              {...fileUploadProps}
            />
            {children}
          </div>,
          footer:
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton iconVariant='icomoon-close'
                id='cancel-uploadModal'
                onClick={() => {
                  if (!fileUploadProps.error) {
                    setFileUploadProps(fp => ({ ...fp, message: '' }))
                  }
                  onClose()
                }}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>

        }}
      </Modal>
    </div>

  )
}

export default WithUploadExcel
