import * as React from 'react';
import { Card, Checkbox, Typography }  from 'ui-library';
import CardMedia from '../CardMedia';
import './customcard.css';

export default function CustomCard({
  optionDescLabel,
  optionLabel,
  optionId,
  optionValue,
  multiselect,
  optionLabelKey,
  isIcon,
  icon,
  selected,
  getSelectedOption,
  defaultSelectedValue,
  isHTML
}: any) {
  const [raised, setRaised] = React.useState(false);
  const [ checked, setChecked] = React.useState(defaultSelectedValue?.questions.findIndex(item => item.answerData === optionValue) >= 0 ? true : false)

  function createMarkup(htmlMarkup: any) {
    return { __html: htmlMarkup };
  }

  function checkMarkup(){
    return createMarkup(icon.filter(item => item.id === optionLabelKey)[0]?.description)
  }

  const toggleRaised = () => {
    setRaised(!raised);
  };

  const checkChange = (event) => {
    setChecked(!checked)
    getSelectedOption({optionId: optionId, optionValue: optionValue, checked:!checked})
  }

  return (
    <Card
      onMouseEnter={toggleRaised}
      onMouseLeave={toggleRaised}
      style={{ height: '100%', boxShadow: 'none' }}
      className={!multiselect ? 'card__icon__btn draw meet' : '' }
    >
      {isIcon && (
        <CardMedia
          component="img"
          height="140"
          image={ icon.filter(item => item.id === optionLabelKey)[0]?.icon }
          alt="green iguana"
          sx={{
            backgroundSize: 'contain',
            height: '85px',
            objectFit: 'contain',
            padding: '0',
            boxSizing: 'border-box',
            marginBottom: '1.5rem'
          }}
        />
      )}


        <Typography
          fontSize="17px"
          fontFamily="Gotham-Rounded-Book"
          className="text__title"
        >
          {multiselect && <Checkbox color="#5698d3" className="select__checkbox" checked={checked} onClick={(event) => checkChange(event)}/>}
          {optionLabel}
        </Typography>
        <Typography
          fontSize="13px"
          fontFamily="Gotham-Rounded-Book"
          className="text__description"
        >
          {/* <p>{isHTML ? createMarkup(icon.filter(item => item.id === optionLabelKey)[0]?.description) : optionDescLabel}</p> */}
          {
            isHTML ?
            <p dangerouslySetInnerHTML={checkMarkup()}></p>
            :
            <p>{optionDescLabel}</p>
          }
        </Typography>
    </Card>
  );
}
