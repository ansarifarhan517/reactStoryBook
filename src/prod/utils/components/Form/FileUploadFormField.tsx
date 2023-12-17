import React, { useState, useEffect } from 'react'
import { FileUpload, FilePreviewer, useToast, IFileObject, Modal, ModalHeader, Box, IconButton } from 'ui-library'
import { ISpecificFormFieldProps, IFileFormFieldObject } from './interface'
import { errorTypeMapping } from './FormField'
import { useTypedSelector } from '../../redux/rootReducer'
import { getAPIModuleData } from '../../mongo/utils'
import axios from '../../axios'
import apiMappings from '../../apiMapping'
import { ILogiAPIResponse } from '../../api.interfaces'
// import { Controller, FieldName, FieldValuesFromControl } from 'react-hook-form'

export const validFileExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.pdf', '.zip']
export const validFileExtensionsJoined = validFileExtensions.join(',')

const FileUploadFormField = ({
  name,
  meta,
  formInstance: { register, errors, setValue, watch }
}: ISpecificFormFieldProps) => {
  const toast = useToast()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const fieldValue = watch(name)
  const moduleKey = watch('moduleKey')
  const [disabled, setDisabled] = useState<boolean>(false);
  const [newFiles, setNewFiles] = useState<IFileFormFieldObject[]>([])
  const [deletedFiles, setDeletedFiles] = useState<IFileFormFieldObject[]>([])
  const [existingFiles, setExistingFiles] = useState<IFileFormFieldObject[]>(fieldValue?.existingFiles || [])

  const allFiles = React.useMemo(() => {
    return [...newFiles, ...existingFiles]
  }, [existingFiles, newFiles])

  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [previewIndex, setPreviewIndex] = useState<number>(0)
  const [isDirty, setIsDirty] = useState<boolean>(false)

  useEffect(() => {
    register({ name });
  }, [register]);

  useEffect(() => {
    setValue(name, { newFiles, existingFiles, deletedFiles }, { shouldDirty: isDirty })

  }, [newFiles, existingFiles, deletedFiles])

  useEffect(() => {
    if ((fieldValue?.existingFiles || []).length !== existingFiles.length) {
      setExistingFiles(fieldValue?.existingFiles || [])
      setNewFiles([])
      setDeletedFiles([])
    }
  }, [fieldValue?.existingFiles])

  useEffect(() => {
    if (showPreview) {
      fetchFilePreview(previewIndex)
    }
  }, [previewIndex, showPreview])

  const fetchFilePreview = async (index: number) => {
    const existingFilesIndex = index - newFiles.length
    if(existingFilesIndex>=0){
      if (existingFiles[existingFilesIndex].shortUrl && !existingFiles[existingFilesIndex].url) {
        const url = await getFullUrl(existingFiles[existingFilesIndex].shortUrl || '')
        setExistingFiles((e) => {
          e[existingFilesIndex].url = url || existingFiles[existingFilesIndex].shortUrl
          return [...e]
        })
      }
      else if(existingFiles[existingFilesIndex].shortUrl || existingFiles[existingFilesIndex].url){
        setExistingFiles((e) => {
          e[existingFilesIndex].url = existingFiles[existingFilesIndex].url || existingFiles[existingFilesIndex].filename || ''
          return [...e]
        })
      }
    }
    //in case of shipper, url is received in filename. 
    else if(existingFiles.length && existingFiles[0]?.url || existingFiles[0]?.filename){
      setExistingFiles((e) => {
        e[0].url = existingFiles[0].url || existingFiles[0].filename || ''
        return [...e]
      })
    }
    else{
      if (newFiles[0]?.shortUrl && newFiles[0]?.url) {
        setNewFiles((e) => {
          e[0].url =newFiles[0].url || newFiles[0].shortUrl
          return [...e]
        })
      }
     
    }
    
  }

  const getFullUrl = async (shortUrl: string): Promise<string> => {
    const { moduleKey: apiModuleKey } = getAPIModuleData(moduleKey)

    const payload = {
      field: name,
      type: 'file',
      value: shortUrl,
      moduleName: apiModuleKey
    }

    try {
      const { data: responseUpload } = await axios.post<ILogiAPIResponse>(apiMappings.common.getFileURI, payload)

      if (responseUpload.status === 200) {
        return responseUpload.data
      }

      throw responseUpload
    } catch (error) {
      // toast.add(error?.response?.message || error?.message || dynamicLabels.somethingWendWrong, 'warning', false)
      return ''
    }
  }

  const uploadFileToServer = async (file: File, index: number) => {
    const { moduleKey: apiModuleKey } = getAPIModuleData(moduleKey)
    const fd = new FormData()
  let fileUploadUrl:string="";
  if(moduleKey=='shipper' && !name.includes("cf_") ){
    fileUploadUrl= apiMappings.shipper.form.uploadLogo;
    fd.append('clientName', file.name)
    fd.append('uploadLogo', file);
  } 
  else{
    fileUploadUrl= apiMappings.common.uploadFileData
    fd.append('file', file || '')
    fd.append('type', 'file')
    fd.append('moduleName', apiModuleKey)
    fd.append('field', name)
  }    
    try {
     setDisabled(true)
      const { data: responseUpload } = await axios.post(fileUploadUrl, fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (responseUpload.status === 200) {
        if(moduleKey=='shipper' && !name.includes("cf_") ){
          setNewFiles(nf => {
            if(nf && nf[index]){
              nf[index].shortUrl = responseUpload.data
              nf[index].url = responseUpload.data
            }
            return [...nf]
        })
        }
        else{
          const url = await getFullUrl(responseUpload.data)
          setNewFiles(nf => {
            if(nf && nf[index]){
              nf[index].shortUrl = responseUpload.data
              nf[index].url = url
            }
            return [...nf]
        })
        }
        setDisabled(false)
      } else {
        throw responseUpload
      }
    } catch (error) {
      setDisabled(false)
      if (meta.customField) {
        toast.add(error?.response?.message || error?.message || dynamicLabels.somethingWendWrong, 'warning', false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _newFiles: IFileFormFieldObject[] = []
    Array.from(e?.target?.files || []).forEach((file: File, i) => {
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

      if (meta.customField) {
        uploadFileToServer(file, i)
      }

      _newFiles.push({
        id: file.name,
        filename: file.name,
        type: 'new',
        index: i,
        data: file
      })
    })
    setNewFiles(_newFiles)
    setIsDirty(true)
  }

  const handleFileClick = (file: IFileObject) => {
    let index = 0
    if (file.type === 'new') {
      index = file.index
    } else {
      index = existingFiles.findIndex((e) => e.id === file.id) + newFiles.length
    }
    // Show preview once the file is uploaded
    setPreviewIndex(index)
    if(!disabled){
      setShowPreview(true)
    }
   
  }

  const handleFileRemove = (file: IFileObject) => {
    if (file.type === 'new') {
      setNewFiles(f => f.filter(_f => _f.id !== file.id))
    } else {
      setExistingFiles(f => f.filter((_f) => {
        if (_f.id === file.id) {
          setDeletedFiles(d => [...d, _f])
          return false
        }
        return true
      }))
    }
    setIsDirty(true)
  }

  const handleDownload = React.useCallback(() => {
    const { url } = existingFiles?.[previewIndex + newFiles.length] || newFiles?.[previewIndex]
    url && window.open(url)
  }, [existingFiles, previewIndex, newFiles])

  const handleDelete = () => {
    /** If only 1 file is to be deleted. */
    if (allFiles.length === 1) {
      setShowPreview(false)
      if (existingFiles.length) {
        setDeletedFiles(d => [...d, existingFiles[0]])
        setExistingFiles([])
      } else {
        setNewFiles([])
      }

      return
    }

    /** If last file to be delelted */
    if (previewIndex === allFiles.length - 1) {
      setPreviewIndex(p => p - 1)
    }

    /** Process Deletiong */
    if (previewIndex < newFiles.length) {
      setNewFiles(f => f.filter((_f, i) => i !== previewIndex))
    } else {
      let deletedFile: IFileFormFieldObject | undefined = undefined
      setExistingFiles(f => f.filter((_f, i) => {
        if (i === previewIndex - newFiles.length) {
          deletedFile = _f
          return false
        }
        return true
      }))
      setDeletedFiles(d => deletedFile ? ([...d, deletedFile]) : d)
    }
  }

  return (
    <>
      <FileUpload
        id={name}
        label={meta.label}
        name={name}
        // ref={register(validationRules)}
        onChange={handleChange}
        placeholder={`${dynamicLabels.Upload} ${meta.label}`}
        required={meta.required}
        style={{ height: '100%' }}
        error={errors[name]}
        files={allFiles}
        onFileClick={handleFileClick}
        onFileRemove={handleFileRemove}
        // accept='application/pdf,image/*'
        accept={validFileExtensionsJoined}
        multiple={meta.multipleFiles}
        errorMessage={meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
      />
      <Modal open={showPreview} onToggle={() => { }} size='md'>
        {{
          header: <ModalHeader
            headerTitle={meta.label}
            imageVariant='icomoon-close'
            handleClose={() => {
              setShowPreview(false)
            }}
          />,
          content: <>
            <FilePreviewer
              files={allFiles}
              pageIndex={previewIndex}
              onPageChange={setPreviewIndex}
            />
          </>,
          footer: <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
            <IconButton iconVariant='icomoon-download' primary disabled={newFiles.length? !newFiles[previewIndex]?.url: !existingFiles[previewIndex]?.url} onClick={handleDownload}>{dynamicLabels.download}</IconButton>
            <IconButton iconVariant='icomoon-delete-empty' onClick={handleDelete}>{dynamicLabels.Delete}</IconButton>
            <IconButton iconVariant='icomoon-close' onClick={() => setShowPreview(false)}>{dynamicLabels.cancel}</IconButton>
          </Box>
        }}
      </Modal>
    </>)
}


export default FileUploadFormField