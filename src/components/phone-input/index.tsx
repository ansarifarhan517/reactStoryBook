import IntlTelInput from 'react-intl-tel-input'
import 'react-intl-tel-input/dist/main.css'

import { bemClass } from '@/utils'

import './style.scss'

type phoneInputProps = {
  errorMessage?: string;
  label: string;
  className?: string;
  invalid?: boolean;
  value?: string;
  name: string;
  changeHandler: (e: any) => void;
  dataAutoId?: string;
}

const blk = 'phone-input'

const PhoneInput = ({
  className,
  errorMessage,
  invalid,
  label,
  value,
  name,
  changeHandler,
  dataAutoId
}: phoneInputProps) => {

  const phoneFieldClass = bemClass([blk, 'text', {
    invalid: !!invalid,
  }, className])

  const onChangeHandler = (isValid: boolean, value: string, selectedCountryData: any, fullNumber: string, extension: string) => {
    const { name, dialCode } = selectedCountryData
    changeHandler({
      isValid,
      value,
      countryName: name,
      dialCode,
      fullNumber
    })
  }

  return (
    <div className={bemClass([blk, {}, className])}>
      <label className={bemClass([blk, 'label'])} data-auto-id={dataAutoId}>{label}</label>
      <IntlTelInput
        containerClassName="intl-tel-input phone-inputCustom"
        inputClassName={phoneFieldClass}
        separateDialCode={true}
        fieldName={name}
        defaultValue={value}
        onPhoneNumberChange={onChangeHandler}
        format
      />
      {invalid && (
        <span data-auto-id={`${dataAutoId}_error`} className={bemClass([blk, 'error'])}>
          {errorMessage}
        </span>)
      }
    </div>
  )
}

export default PhoneInput
