import React, { Dispatch, useEffect, useState } from 'react'
import { IconButton, FontIcon, Box, withPopup, useToast, Loader, Position, FilePreviewer } from 'ui-library'
import styled from 'styled-components'
import { getAPIModuleData } from '../utils'
import axios from '../../axios'
import { useTypedSelector } from '../../redux/rootReducer'
import { useDispatch } from 'react-redux'
import { tGlobalPopupAction } from '../../../modules/common/GlobalPopup/GlobalPopup.reducer'
// import { downloadFromS3Bucket } from '../../core'
import { tGlobalsAction } from '../../../modules/common/Globals/globals.actions'

export const validFileExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.pdf', '.zip']
export const validFileExtensionsJoined = validFileExtensions.join(',')

export interface ICfFileProps {
  value?: string
  id: string | number
  moduleKey: string
  field: string
  url?: string
  onFetchUrl?: (url: string) => void
}

export interface ICfFileUploadProps {
  id: string | number
}

export const FileUploadLabel = styled.label`
  cursor: pointer;
`

interface IFilePreviewerContainer extends ICfFileProps {
  fileName: string
}
const FilePreviewContainer = ({ value, moduleKey, field, fileName, id, url, onFetchUrl = () => { } }: IFilePreviewerContainer) => {
  const [isURLFetched, setIsURLFetched] = useState<boolean>(url ? true : false)
  const [_url, _setUrl] = useState<string | undefined>(url)

  const fetchURL = async () => {
    const { url, moduleKey: apiModuleKey } = getAPIModuleData(moduleKey)
    try {
      const { data: response } = await axios.post(`${url}/customfield/file/geturi`, {
        field,
        type: 'file',
        moduleName: apiModuleKey,
        value
      })

      if (response.status === 200) {
        _setUrl(response.data)
        onFetchUrl(response.data)
        setIsURLFetched(true)
      }
      throw response
    } catch (error) {
      console.log(error, error?.response)
      setIsURLFetched(true)
    }
  }
  useEffect(() => {
    !url && fetchURL()
  }, [])

  return isURLFetched ? <FilePreviewer files={[{ id: value || id, filename: fileName, url: _url }]} /> : <Loader center />
}

export const CfFile = withPopup(({ id, value, moduleKey, field, onFetchUrl = () => { } }: ICfFileProps) => {
  const [fileKey, setFileKey] = useState<string | undefined>(value)
  const [url, setUrl] = useState<string>()
  const urlRef = React.useRef<string | undefined>(url)
  const fileNameRef = React.useRef<string | undefined>()
  const globalsDispatch = useDispatch<Dispatch<tGlobalsAction>>()
  const isFileUploaded = useTypedSelector(state => state.globals?.[`CFFile-${id}-${moduleKey}`])?.isFileUploadSuccess;
  const CFFilekey = useTypedSelector(state => state.globals?.[`CFFile-${id}-${moduleKey}`])?.uploadedFileName;

  useEffect(() => {
    urlRef.current = url
  }, [url])
  const toast = useToast()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const popupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

  React.useEffect(() => {
    setFileKey(value)
  }, [value])

  const fileName = React.useMemo(() => {
    if (!fileKey) {
      fileNameRef.current = fileKey
      return fileKey
    }

    const tokens = (fileKey || '/').split('/')

    fileNameRef.current = tokens[tokens.length - 1]
    return tokens[tokens.length - 1]
  }, [fileKey])

  

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { url, moduleKey: apiModuleKey, uniqueIdentifier } = getAPIModuleData(moduleKey)

    const file = e?.target?.files?.[0]
    if (!file) {
      return
    }

    const { size } = file
    if (size > 5000000) {
      toast.add('The file size shall not exceed 5MB', 'warning', false);
      return
    }

    if (size === 0) {
      toast.add('The file cannot be blank', 'warning', false);
      return
    }

    const fd = new FormData()
    fd.append('file', file || '')
    fd.append('type', 'file')
    fd.append('moduleName', apiModuleKey)
    fd.append('field', field)

    try {
      const { data: responseUpload } = await axios.post(`${url}/customfield/file/upload`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (responseUpload.status === 200) {
        const _fileKey = responseUpload.data

        const { data: responseUpdate } = await axios.post(`${url}/customfield/file/update`, {
          [uniqueIdentifier]: id,
          "customFieldsEntity": [
            {
              "field": field,
              "type": "file",
              "value": _fileKey
            }
          ]
        })

        if (responseUpdate.status === 200) {
          toast.add(responseUpload?.message, 'check-round', false)
          setFileKey(_fileKey)
          globalsDispatch({type: '@@globals/SET_DATA', payload: { [`CFFile-${id}-${moduleKey}`]: {
            isFileUploadSuccess : true,
            uploadedFileName : _fileKey
          } }})
          return
        }

        throw responseUpdate
      }

      throw responseUpload
    } catch (error) {
      toast.add(error?.response?.message || error?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  const processDelete = async () => {
    try {
      popupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
      const { url, moduleKey: apiModuleKey } = getAPIModuleData(moduleKey)
      const { data: response } = await axios.delete(`${url}/customfield/file`, {
        data: [{
          field, value,
          moduleName: apiModuleKey,
          type: 'file',
          moduleId: id
        }]
      })

      if (response.status === 200) {
        toast.add(response.message, 'check-round', false)
        setFileKey(undefined)
        globalsDispatch({type: '@@globals/SET_DATA', payload: { [`CFFile-${id}-${moduleKey}`]: {
          isFileUploadSuccess : false,
          uploadedFileName : null
        } }})
        return
      }

      throw response
    } catch (error) {
      toast.add(error?.response?.message || error?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  const handleDelete = () => {
    popupDispatch({
      type: '@@globalPopup/SET_PROPS',
      payload: {
        isOpen: true,
        title: 'Confirmation',
        content: dynamicLabels?.areYouSurePermanentDeleteFile || 'Are you sure you want to permanently delete the file?',
        footer: <>
          <IconButton iconVariant='icomoon-tick-circled' primary onClick={processDelete}>{dynamicLabels.ok}</IconButton>
          <IconButton iconVariant='icomoon-close' onClick={handleFilePreview}>{dynamicLabels.cancel}</IconButton>
        </>
      }
    })
  }

  const handleDownload = () => {
    window.open(urlRef.current, '_blank')
    // return
    // downloadFromS3Bucket(urlRef.current || '', fileNameRef.current || '')
  }

  const handleFilePreview = () => {
    const tokens = (CFFilekey || '/').split('/');
    const CFFileName = tokens[tokens.length - 1]
    popupDispatch({
      type: '@@globalPopup/SET_PROPS',
      payload: {
        isOpen: true,
        title: fileName,
        onClose: () => popupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }),
        content: <Position type='relative'>
          <FilePreviewContainer
            value={fileKey  || CFFilekey} id={id} field={field} moduleKey={moduleKey}
            fileName={fileName || CFFileName || ''}
            url={url}
            onFetchUrl={(u: string) => {
              setUrl(u)
              onFetchUrl(u)
              urlRef.current = u;
            }}
          />
        </Position>,
        footer: <>
          <IconButton iconVariant='icomoon-download' primary onClick={handleDownload}>{dynamicLabels.download}</IconButton>
          <IconButton iconVariant='icomoon-delete-empty' onClick={handleDelete}>{dynamicLabels.Delete}</IconButton>
          <IconButton iconVariant='icomoon-close' onClick={() => popupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
        </>
      }
    })
  }
  return <Box display='flex' justifyContent='center' fullWidth>
    {(isFileUploaded === true || (isFileUploaded === undefined && !!fileKey)) ?
      (<>
        <IconButton onlyIcon iconVariant='file-empty' color='primary.main' iconSize={16} onClick={handleFilePreview} />
      </>) :
      (<>
        <input type='file' id={String(id)} 
        hidden onChange={handleFileUpload} style={{ display: 'none' }} 
        accept={validFileExtensionsJoined}
        />
        <FileUploadLabel htmlFor={String(id)}>
          <FontIcon variant='icomoon-upload' size={16} color='primary.main' />
        </FileUploadLabel>
      </>)}
  </Box>
})