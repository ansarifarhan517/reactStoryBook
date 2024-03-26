import styled from 'styled-components'
const CustomFormsContainer = styled.div`

.icon-icomoon-edit-empty{
  display: none;
}
.addButton{
    position: absolute;
    top: 20px;
    left: 71vw;
    z-index: 1000;
}
.triggerEventCount {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 1px solid #999;
    padding-top: 7px;
    margin-top: 2px;
    color: #999;
    text-align: center;
}
.triggerIndex {
    padding: 0px 2%;
    margin-top: 0px;
    width: 8%;
}
.triggerElement {
    flex: 1;
    font-size: 12px;
}
.triggerToggle {
    flex: 1;
    margin-top: 0;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    div  {
      label {
        display: flex;
        flex-direction: row-reverse;
        > div + div {
          margin-top: 5px;
        }
      }
    }
}
input[disabled] {
    cursor: not-allowed;
    opacity: 1;
    background-color: white;
    color:black;
}
.addFieldWrapper .addFieldItems .addFieldItemsList li.dragElement-wrapper .icon:before {
    color: #5698d3;
  }
  .fieldDropWrapper {
    margin: 0 auto;
    min-height: 795px;
    max-height: 795px;
    overflow: hidden;
    position: relative;
  }
  .fieldDropWrapper .fieldDropContainer {
    position: absolute;
    top: 65px;
    left: 110px;
    width: 358px;
    min-height: 400px;
    max-height: 628px;
    margin-bottom: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .fieldDropWrapper .fieldDropContainer .formNameHeader {
    padding: 15px 10px;
    text-transform: capitalize;
    font-size: 14px;
    background: #5698d3;
    color: #fff;
    box-shadow: 1px 1px 4px rgba(0,0,0,0.6);
    margin-bottom: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .fieldDropWrapper .fieldDropContainer .formNameHeader .fa.fa-long-arrow-left {
    top: 0px;
  }
  .fieldDropWrapper .fieldDropContainer .formNameHeader .fa.fa-long-arrow-left:before {
    color: #f6f6ff;
    margin-right: 10px;
  }
  .fieldDropWrapper .input-as-label {
    display: block;
    font-size: 12px;
    letter-spacing: 0.3px;
    color: #42425c;
    margin-bottom: 3px;
    background: transparent;
  }
  .fieldDropWrapper .form-group {
    margin-bottom: 10px;
    padding: 10px 20px;
    border: 1px dashed transparent;
  }
  .liSpacing {
    margin: 7px 0px
  }
  .fieldDropWrapper .form-control {
    padding-left: 9px;
    width: 100%;
    -webkit-transition: all ease-in-out 0.2s;
    -moz-transition: all ease-in-out 0.2s;
    -o-transition: all ease-in-out 0.2s;
    transition: all ease-in-out 0.2s;
    font-size: 12px;
    letter-spacing: 0.3px;
    border-radius: 0px;
    box-shadow: none !important;
  }
  [draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  /* Required to make elements draggable in old WebKit */
    -khtml-user-drag: element;
    -webkit-user-drag: element;
  }
  .drop-to-add {
    height: 80px;
    padding: 10px 0px;
  }
  .form-group.active-field {
    background-color: #f6f9fd;
    border: 1px dashed #5698d3;
  }
  .form-group i.remove-ico {
    position: absolute;
    right: 20px;
    top: -10px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
  }

  .fieldDropWrapper input[type=radio],
  .fieldDropWrapper input[type=checkbox]{
    display: none;
  }
  .sortable-field .form-group .logiCustomCheck+label,
  .sortable-field .form-group .logiCustomRadio+label {
      top: -2px;
      vertical-align: middle;
  }
  .logiCustomRadio+label {
    cursor: pointer;
    height: 15px;
    width: 15px;
    border: 1px solid #979797;
    border-radius: 50%;
    color: black
}
input[type="checkbox"].logiCustomCheck {
  position: absolute;
  visibility: hidden;
}
input[type="checkbox"][disabled].logiCustomCheck+label {
  background-color: white;
  cursor: not-allowed;
  border: 1px solid #979797;
}
.form-control.edpod_gallery, .form-control.edpod_camera {
  width: 150px;
  height: 95px;
  border-radius: 2px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  padding: 0px;
  background-color: #fcfcfd;
  border: solid 1px #979797;
}
.no-data-cont {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.no-data-cont img , .no-data-cont div {
  margin-bottom : 30px
}
.no-data-text {
  font-size: 14px;
  font-weight: 600;
}
.sc-pRtAn {
  overflow-y : auto; 
  max-height: calc(100vh - 45px - 71px - 71px);
}
`
export default CustomFormsContainer 
