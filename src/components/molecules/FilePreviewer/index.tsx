import React, { useState, useEffect } from 'react'
import {
  FilePreviewerContainer,
  FileName,
  Preview,
  PaginationContainer,
  ThumbnailsContainer,
  Thumbnail
} from './FilePreviewer.styles'
import IconButton from '../../atoms/IconButton'
import {
  IFilePreviewObject,
  IFilePreviewerProps
} from './FilePreviewer.interfaces'
import FontIcon from '../../atoms/FontIcon'
import Box from '../../atoms/Box'

const getExtension = (filename: string): string => {
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length)
}

const isImageExtension = (extension?: string): boolean => {
  let flag = false
  switch (extension?.toLowerCase()) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'bmp':
      flag = true
      break
  }

  return flag
}
const FilePreviewer = ({
  files = [],
  pageIndex = 0,
  onPageChange = () => {}
}: IFilePreviewerProps) => {
  const [currentPage, setCurrentPage] = useState<number>(pageIndex)
  const [_files, _setFiles] = useState<IFilePreviewObject[]>(files)

  useEffect(() => {
    _setFiles(files.map((f) => ({ ...f, extension: getExtension(f.filename) })))
  }, [files])

  useEffect(() => {
    setCurrentPage(pageIndex)
  }, [pageIndex])

  const handlePageChange = (index: number) => {
    setCurrentPage(index)
    onPageChange(index)
  }
  return (
    <FilePreviewerContainer>
      <FileName>{_files[currentPage].filename}</FileName>
      <Preview>
        {isImageExtension(_files[currentPage].extension) ? (
          <img src={_files[currentPage].url} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <FontIcon variant='file-empty' size={60} color='grey.500' />
            <Box mt='15px' color='grey.500'>
              No Preview Available
            </Box>
          </div>
        )}
      </Preview>
      <PaginationContainer>
        <IconButton
          iconSize={14}
          iconVariant='angle-left'
          onlyIcon
          color='grey.A1000'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        />
        <div>{`${currentPage + 1} of ${_files.length}`}</div>
        <IconButton
          iconSize={14}
          iconVariant='angle-right'
          onlyIcon
          color='grey.A1000'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === _files.length - 1}
        />
      </PaginationContainer>
      <ThumbnailsContainer>
        {_files.map((file, i) => (
          <Thumbnail
            selected={i === currentPage}
            key={file.id}
            onClick={() => handlePageChange(i)}
          >
            {isImageExtension(file.extension) ? (
              <img src={file.url} />
            ) : (
              <FontIcon variant='file-empty' size={11} color='grey.500' />
            )}
          </Thumbnail>
        ))}
      </ThumbnailsContainer>
    </FilePreviewerContainer>
  )
}

export default FilePreviewer
