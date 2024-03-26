import React from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import { Typography, Box, FontIcon, Button, Loader } from 'ui-library'
import { useTypedSelector } from '../redux/rootReducer'

const UploadArea = styled.div`
  position: relative;
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(151, 151, 151, .4);
  border-radius: 9px;
  background-color: ${({ theme }) => theme?.colors?.grey?.['100']};

  &.highlight {
    border-color: ${({ theme }) => theme?.colors?.primary?.main};
  }

  label.select-file-to-upload {
    color: ${({ theme }) => theme?.colors?.primary?.main};
    font-size: 15px;
    cursor: pointer;
  }

  input.upload-file {
    display: none;
  }
`

const InstructionsArea = styled.div`
  color: ${({ theme }) => theme?.colors?.grey?.A900};

  .heading {
    margin: 20px 0px 10px;

    .instructions {
      margin: 5px 0;
    }
  }
`

const ErrorArea = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 3px;
  line-height: 18px;
  border: 1px solid ${({ theme }) => theme?.colors?.error?.main};
  background-color: ${({ theme }) => theme?.colors?.error?.light};
  font-size: 12px;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const SuccessArea = styled(ErrorArea)`
  border: 1px solid ${({ theme }) => theme?.colors?.success?.main};
  background-color: ${({ theme }) => theme?.colors?.success?.light};
`

export interface IFileUploadModalProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileUpload?: (file: FileList | null) => void
  onDownloadSampleFile?: () => void
  loading?: boolean
  error?: boolean
  page?:string
  message?: string | JSX.Element
  errorFileLink?: string
  acceptFileType?: string
}

const FileUploadModalContent = ({
  message = '',
  error = false,
  loading = false,
  errorFileLink = '',
  page='',
  onFileUpload = () => { },
  onDownloadSampleFile = () => { },
  acceptFileType='.xls'
}: IFileUploadModalProps) => {
  const [isInDropZone, setInDropZone] = React.useState<boolean>(false)
  const [isMaximumBatch, setMaximumBatch] = React.useState<boolean>(false)

  const dragOver = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
  }

  const dragEnter = (e: React.DragEvent<HTMLInputElement>) => {
    setInDropZone(true)
    e.preventDefault();
  }

  const dragLeave = (e: React.DragEvent<HTMLInputElement>) => {
    setInDropZone(false)
    e.preventDefault();
  }

  const fileDrop = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log(files);
    onFileUpload(files)
  }

  const handleDownloadErrorFile = () => {
    window.location.href = errorFileLink
  }


  useEffect(()=>{
    if(page=='order'|| page == 'itemConfiguration')
    setMaximumBatch(true)
  },[])

  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  return <Box verticalSpacing='10px'>
    <UploadArea
      onDragOver={dragOver}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDrop={fileDrop}
      className={isInDropZone ? 'highlight' : ''}
    >
      {loading && <Loader center />}
      {!loading &&
        (<>
          <input
            type='file'
            id='upload-file'
            className='upload-file'
            accept={acceptFileType}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onFileUpload(e.target.files) }}
          />
          <Box my='10px'>
            <Typography color='grey.A900' fontSize='15px'>
              {`${dynamicLabels.dropFileToUpload} ${dynamicLabels.or} `}
              <label htmlFor='upload-file' className='select-file-to-upload' id='select-file-to-upload'>{dynamicLabels.selectFile}</label>
            </Typography>
          </Box>

          <Button id='Download-file-format' variant='link' onClick={onDownloadSampleFile}>
            <FontIcon variant='icomoon-download-report' color='primary.main' size={12} />
            <Typography style={{ display: 'inline-block' }} color='primary.main' fontSize='12px' underline>{dynamicLabels.downloadFileFormat}</Typography>
          </Button>

          {error && <ErrorArea>
            {message && <Box color='error.main'>{message}</Box>}
            {errorFileLink && <Button variant='link' onClick={handleDownloadErrorFile}>
              <Typography color='primary.main' fontSize='12px' underline>{dynamicLabels.downloadErrorFile}</Typography>
            </Button>}
          </ErrorArea>}

          {!error && message &&
            <SuccessArea>
              <Box color='success.main'>
                <div style={{ textAlign: 'center' }}>{message}</div>
              </Box>
            </SuccessArea>}
        </>)
      }
    </UploadArea>

    <InstructionsArea>
      <Typography id='instructions' className='heading' bold>{dynamicLabels.instructions}</Typography>
      <ol>
        <li id='uploadAllowedFormats' className='instruction'>1. {dynamicLabels.uploadAllowedFormats}</li>
        <li id='batchMax500Records' className='instruction'>2. {isMaximumBatch?dynamicLabels.maximumBatchRecords:dynamicLabels.batchMax500Records}</li>
      </ol>
    </InstructionsArea>
  </Box>
}

export default FileUploadModalContent