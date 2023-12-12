import styled from 'styled-components'

interface StyledContainerProps {
  hasLabel?: boolean
  hideToolbar?: boolean
}
export const StyledContainer = styled.div.attrs((props) => ({
  className: `rte-container ${props.className || ''}`
}))<StyledContainerProps>`
  position: relative;
  ${({ hasLabel }) => hasLabel && 'margin-top: 7px;'}

  .logi-rte-wrapper {
    position: relative;
  }

  .logi-rte-editor {
    border: 1px solid #aaa;
    overflow: unset;

    padding: 10px;
    ${({ hideToolbar }) =>
      !hideToolbar &&
      `
    padding-bottom: 50px;
    min-height: 112px;
    `}

    &.disabled {
      cursor: not-allowed;
      opacity: 0.65;

      .rdw-mention-link {
        cursor: not-allowed;
      }
    }

    & * {
      font-weight: inherit;
    }
  }

  /* TOOLBAR STYLING */
  .logi-rte-toolbar {
    ${({ hideToolbar }) => hideToolbar && 'display: none;'}
    border: none;
    box-shadow: 0px 0.5px 3px rgba(0, 0, 0, 0.38);
    position: absolute;
    left: 12px;
    bottom: 2px;
    width: 440px;
  }

  /* MENTION LINK IN EDITOR STYLING */
  .rdw-mention-link {
    background: transparent;
    color: ${({ theme }) => theme?.colors?.primary?.main};
    span {
      color: ${({ theme }) => theme?.colors?.primary?.main} !important;
    }
  }

  /* REDUCE SPACE BETWEEN MULITPLE LINES */
  .public-DraftStyleDefault-block {
    margin: 2px 0;
  }

  /* MENTION SUGGESTION DROPDOWN CUSTOMIZATION */
  .rdw-suggestion-dropdown {
    width: 300px;
    max-height: 180px;
    box-shadow: 2px 2px 20px rgba(0,0,0,0.2);

    .rdw-suggestion-option {
      padding: 10px 5px;
      padding-left: 15px;
      border-bottom: 0px;
      cursor: pointer;
      &.rdw-suggestion-option-active {
        background-color: rgba(32, 33, 36, 0.1);
      }
    }
  }

  /* MENTION SUGGESTION OPTION CUSTOMIZATION */
  .rdw-suggestion-option:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    color: ${({ theme }) => theme?.colors?.primary?.main};
  }

  /* TOOLBAR DROPDOWN CUSTOMIZATION */
  .rdw-dropdown-wrapper {
    border: none;
  }

  /* TOOLBAR DROPDOWN OPTION CUSTOMIZATION */
  .rdw-option-wrapper {
    border: none;
  }

  .rdw-option-wrapper:hover,
  .rdw-dropdown-wrapper:hover {
    box-shadow: unset;
    background-color: rgba(32, 33, 36, 0.1);
  }

  .rdw-option-active,
  .rdw-colorpicker-wrapper[aria-expanded='true'],
  .rdw-colorpicker-wrapper[aria-expanded='true'] .rdw-option-wrapper {
    box-shadow: unset;
    background-color: rgba(32, 33, 36, 0.122);
  }

  /* SHOW SEPARATOR FOR EACH TOOLBAR OPTIONS */
  .history-wrapper,
  .rdw-fontfamily-wrapper,
  .rdw-fontsize-wrapper,
  .rdw-colorpicker-wrapper,
  .rdw-inline-wrapper {
    padding-right: 2px;
    border-right: 1px solid rgba(100, 121, 143, 0.122);
  }

  /* POSITION OF CARET IN TOOLBAR DROPDOWN */
  .rdw-dropdown-carettoopen {
    top: 45%;
  }

  /* OPEN DROPDOWN ON TOP */
  .rdw-dropdown-optionwrapper {
    position: absolute;
    bottom: 35px;
    z-index: 10000;
    right: auto;
    width: auto;
    max-height: 200px;
    overflow: auto;
  }

  .rdw-colorpicker-modal {
    top: unset;
    bottom: 35px;
    left: 0px;
  }

  .rdw-colorpicker-modal-options {
    overflow: auto;
  }

  .DraftEditor-editorContainer {
    z-index: unset;
  }
`
