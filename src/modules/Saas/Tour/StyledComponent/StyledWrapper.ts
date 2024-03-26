import styled from "styled-components";
export const StyledWrapper = styled.div`
  .main__content {
    width: 100%;
    display: inline-block;
    height: calc(100vh - 4rem);
    vertical-align: top;
    position: relative;
    text-align: center;
      // max-height: 100vh;
      // overflow-y: auto;
      // overflow-x: hidden;
    // padding-bottom: 11rem;
    background-color: #fff;
    border-radius: 10px;
    padding: 3rem;
    padding-right: 5px;

  }

  .content__block {
    text-align: center;
    width: 100%;
    z-index: 1;
    height: calc(100vh - 9rem);
    max-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 15px;
  }
  .accordion__head {
    margin: 0;
    padding: 1.5rem 1rem;
    background: #ccc;
    border-radius: 5px;
  }
`;
