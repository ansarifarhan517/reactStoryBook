import React, { SetStateAction, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, ModalHeader, ModalFooter, RadioGroup, Radio, Grid, IconButton } from 'ui-library'
import { useTypedSelector } from '../../../utils/redux/rootReducer'

interface IManifestIDConfirmationPopupProps {
  isOpen: boolean
  actionType: string
  submitAPICall: (actionType: string, generateNew: boolean) => void
  onClose: React.Dispatch<SetStateAction<boolean>>;
  dynamicLabelsAngular: Record<string, string>
  setToggleIDgenerate: React.Dispatch<SetStateAction<boolean>>; 
  toggledIDgenerate: boolean;
}

const Container = styled.div`
  #select-manifest-id-creation-type {
    display: flex;  
  }
`

const ManifestIDConfirmationPopup = ({ isOpen, actionType, submitAPICall, onClose, dynamicLabelsAngular, setToggleIDgenerate, toggledIDgenerate }: IManifestIDConfirmationPopupProps) => {
  const [generateNew, setGenerateNew] = React.useState<boolean>(false)
  const dynamicLabelsReact = useTypedSelector(state => state.dynamicLabels)

  const dynamicLabels = React.useMemo(() => {
    return { ...dynamicLabelsAngular, ...dynamicLabelsReact }
  }, [dynamicLabelsReact, dynamicLabelsAngular])

  const handleSubmit = () => {
    setToggleIDgenerate(true);
  }
  // api call on submit
  useEffect(() => {
    if(toggledIDgenerate) {
      submitAPICall(actionType, generateNew)
    }
  },[toggledIDgenerate])

  return <Modal open={isOpen} onToggle={() => { }}>
    {{
      header: <ModalHeader headerTitle={dynamicLabels.manifestIdConfirmation} handleClose={() => onClose(false)} />,
      content: <Container>
        <RadioGroup
          id='select-manifest-id-creation-type'
          variant='form'
          label={dynamicLabels.manifestId}
          orientation={true}
        >
          <Grid container>
            <Grid item>
              <Radio id='use-existing' label={dynamicLabels.useExisting}
                name='use-existing'
                value='use-existing'
                radioSize='md'
                style={{ fontSize: '12px' }}
                color='inherit'
                checked={!generateNew}
                onChange={() => {
                  setGenerateNew(false)
                }}
              />
            </Grid>
            <Grid item>
              <Radio id='generate-new' label={dynamicLabels.generateNew}
                name='generate-new'
                value='generate-new'
                radioSize='md'
                style={{ fontSize: '12px' }}
                color='inherit'
                checked={generateNew}
                onChange={() => {
                  setGenerateNew(true)
                }}
              />
            </Grid>
          </Grid>
        </RadioGroup >
      </Container>,
      footer: <ModalFooter>
        <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => handleSubmit()}>{dynamicLabels.submit}</IconButton>
        <IconButton iconVariant='icomoon-close' onClick={() => onClose(false)}>{dynamicLabels.cancel}</IconButton>
      </ModalFooter>
    }}
  </Modal>
}

export default ManifestIDConfirmationPopup;
