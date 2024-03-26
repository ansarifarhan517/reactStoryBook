import React from "react";
import { StyledTextContent, StyledSimpleTextContent } from '../Layouts/StyledOnboardingView';

function TextContent({
    isHTML,
    textContent,
    type = 'primary'

}) {
  function createMarkup(htmlMarkup: any) {
    return { __html: htmlMarkup };
  }

  function checkMarkup() {
    return createMarkup(textContent);
  }

  return (
    <div>
        {
            type === 'primary' && 
            <>
            {isHTML ? (
                <StyledTextContent dangerouslySetInnerHTML={checkMarkup()}></StyledTextContent>
              ) : (
                <StyledTextContent>{textContent}</StyledTextContent>
              )}
            </>
        }
        {
            type === 'secondary' && 
            <>
            {isHTML ? (
                <StyledSimpleTextContent dangerouslySetInnerHTML={checkMarkup()} />
              ) : (
                <StyledSimpleTextContent>{textContent}</StyledSimpleTextContent>
              )}
            </>
        }
      
      
    </div>
  );
}

export default TextContent;
