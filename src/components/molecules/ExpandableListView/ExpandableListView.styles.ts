import styled from 'styled-components'

export const ShowMoreContainer = styled.span`
  text-decoration: underline;
  color: #5698d3;
  text-align: center;
  cursor: pointer;
  padding-top: 15px;
`

export const StyledTable = styled.div`
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  table {
    border-spacing: 0;

    th, td {
      margin: 0;
      padding: 0.85rem 0;
      border-bottom: 1px solid grey;
    }

    th {
      text-align: left;
    }
  }
`
