import styled from 'styled-components'
export const GenerateManifestIdWrapper= styled.div`
    .grid-item {
        padding-right: 25px;
        .dashed-input {
            width: 100%;
            border: 0;
            border-bottom: 1px dashed;
            min-height: 30px;
            margin: 0;
            font-size: 13px;
            &[disabled] {
                opacity: .4 !important;
            }
            &.hasError {
                border-color: rgb(244, 67, 54)
            }
        }
        &.grid-item-drag {
            width: 30px;
            flex-basis: 30px;
            max-width: 30px;
        }
        &.grid-item-select {
            width: 20%;
            flex-basis: 20%;
            max-width: 20%;
            > div {
                display: block;
                .sc-fzpmMD {
                    display:none;
                    z-index: 1;
                }
                &:hover {
                    .sc-fzpmMD {
                        display:block;
                    }
                }
            }
        }
        &.grid-item-select-auto {
            width: 30%;
            flex-basis: 30%;
            max-width: 30%;
        }
        &.grid-item-action {
            width: 50px;
            flex-basis: 50px;
            max-width: 50px;
        }
    }
    .card {
        padding: 20px;
        margin: 15px;
        font-size: 14px;
    }
    .custom-select-box {
        .react-select__control {
            border: 0;
            border-bottom: 1px dashed;
            border-radius: 0;
            box-shadow: none;
            min-height: 30px;
        }
        .react-select__indicator-separator {
            width: 0;
        }
        .react-select__indicator {
            &::before {
                content: '\\e800';
                font-family: "font-icons" !important;
                color: rgb(0, 0, 0);
                font-size: 8px;
                line-height: 8px;
                height: 8px;
            }
            svg {
                display: none;
            }
        }
        .react-select__menu {
            margin: 0;
            .react-select__option {
                font-size: 12px;
                line-height: 20px;
                height: 35px;
                white-space: nowrap;
                &.react-select__option--is-selected {
                    background: #5698d3;
                }
                &:not(.react-select__option--is-selected):hover {
                    color: #5698d3;
                    background: #f9f9fa;
                }
            }
        }
    }
`