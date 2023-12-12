import styled from 'styled-components'
import InputField from '../../atoms/InputField'

export const Container = styled.label`
  position: relative;
  cursor: pointer;
  display: flex;
  margin: 18px 0px;
  height: 40px;
  box-sizing: content-box;

  ${InputField} {
    display: none;
  }
`

interface IInputContainer {
  error?: boolean
}
export const InputContainer = styled.div<IInputContainer>`
  box-sizing: inherit;
  cursor: pointer;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 0 5px;
  height: calc(100% - 2px);
  border: 1px solid
    ${({ error, theme }) =>
      error ? theme?.colors?.error?.main : theme?.colors?.grey?.A200};
  border-right: unset;
`

export const Chip = styled.div`
  width: 100px;
  background-color: ${({ theme }) => theme?.colors.primary?.main};
  color: ${({ theme }) => theme?.colors.primary?.contrastText};
  border-radius: 2px;
  display: flex;
  align-items: center;
  padding: 2px 3px;
  cursor: pointer;
  margin-right: 5px;

  .text {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const IconContainer = styled.div`
  padding: 10px;
  background-color: ${({ theme }) => theme?.colors?.primary?.main};
`

export const ShowMoreLabel = styled.div`
  color: ${({ theme }) => theme?.colors?.primary?.main};
`

export const ChipsContainer = styled.div`
  flex-grow: 1;
  overflow: hidden;
  display: flex;
`

export const Placeholder = styled.div`
  font-size: 12px;
  padding: 3px;
  color: ${({ theme }) => theme?.colors?.grey['400']};
`
