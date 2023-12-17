import React from 'react'
import { SectionHeader, Grid } from 'ui-library'
import { Shimmer } from 'react-shimmer'
import { SectionHeaderContainer } from './Form/Form.styles'
import styled from 'styled-components'

export interface IFormLoaderProps {
  sections?: number
  fieldsPerSection?: number
}

const Container = styled.div`
  width: 100%;
`
const FormLoader = ({ sections = 3, fieldsPerSection = 8 }: IFormLoaderProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  return (
    <Container ref={containerRef}>
      {Array(sections).fill(0).map((_, i) => (
        <div key={i}>
          <SectionHeaderContainer >
            <SectionHeader headerTitle={<Shimmer width={200} height={20}></Shimmer>} />
          </SectionHeaderContainer>
          <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
            {Array(fieldsPerSection).fill(0).map((_, j) => (
              <Grid item key={j} xs={12} sm={6} md={3} >
                <Shimmer width={(((containerRef.current?.clientWidth || 0) / 4) || 350) - 15} height={40}></Shimmer>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </Container>
  )
}

export default FormLoader