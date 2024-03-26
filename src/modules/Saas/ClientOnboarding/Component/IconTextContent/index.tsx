import React from 'react';
import './style.css';

interface IIconTextContentProps {
  title: string;
  description: string;
  iconPosition: string;
  icon: string;
}

interface ICapitalizeTitleFirstCharacter {
  text: string;
}

const CapitalizeTitleFirstCharacter = ({
  text,
}: ICapitalizeTitleFirstCharacter) => {
  let initailCharacter = text.slice(0, 1);
  let remainingCharacter = text.slice(1);

  return (
    <h4>
      <span>{initailCharacter}</span>
      {remainingCharacter}
    </h4>
  );
};

const IconTextContent = ({
  title,
  description,
  iconPosition,
  icon,
}: IIconTextContentProps) => {
  return (
    <div className="icon__text__wrapper">
      <div >
        {iconPosition === 'left' && (
          <div className="icon__wrapper left">
            <img src={icon} alt="not available" />
          </div>
        )}

        <div className="text__wrapper">
          <CapitalizeTitleFirstCharacter text={title} />
          <p className="description_color">{description}</p>
        </div>
        {iconPosition === 'right' && (
          <div className="icon__wrapper right">
            <img src={icon} alt="not available" />
          </div>
        )}
      </div>
    </div>
  );
};

export default IconTextContent;
