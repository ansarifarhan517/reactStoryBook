'use client'

import { bemClass } from '@/utils'

import './style.scss'
import { useEffect, useState } from 'react'

const blk = 'pricing-quantity'

type pricingQuantityProps = {
  minValue: number
  counter: number
  setCounter: (value: number) => void
  maxValue: number
  billingCycle: string
  preference: string
  dataAutoId?: string
}

const PricingQuantity = ({ minValue, counter, setCounter, maxValue, billingCycle, preference, dataAutoId }: pricingQuantityProps) => {
  const [isErrorVisible, setErrorVisible] = useState<boolean>(false)
  const decrementHandler = () => {
    setCounter(Math.max(counter - 1, minValue))
  }

  const incrementHandler = () => {
    setCounter(Math.min(counter + 1, maxValue))
  }

  const decrementDisabled = counter === minValue
  const incrementDisabled = counter === maxValue
  const [errorMessage, setErrorMessage] = useState<string>('')

  const errorMapping: Record<string, any> = {
    'Driver': {
      'plus': 'Please enter a value less than or equal to 39.',
      'minus': 'Please enter a value greater than or equal to 5.'
    },
    'Quarter': {
      'plus': 'Please enter a value less than or equal to 59999.',
      'minus': 'Please enter a value greater than or equal to 7500.'
    },
    'Annum': {
      'plus': 'Please enter a value less than or equal to 239996.',
      'minus': 'Please enter a value greater than or equal to 30000.'
    }
  }

  const handleErrorMessage = (currentValue: number) => {
    const driverErrorMessage =
    currentValue < minValue
      ? errorMapping['Driver']?.minus
      : errorMapping['Driver']?.plus
    const orderErrorMessage =
    currentValue < minValue
      ? errorMapping[`${billingCycle}`]?.minus
      : errorMapping[`${billingCycle}`]?.plus
    const message =
      preference === 'Driver' ? driverErrorMessage : orderErrorMessage
    setErrorMessage(message)
    setErrorVisible(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = +e.target.value
    setCounter(newValue)
    if (newValue <= maxValue && newValue >= minValue) {
      setErrorVisible(false)
    } else {
      handleErrorMessage(newValue)
    }
  }

  useEffect(() => {
    setErrorVisible(false)
  }, [billingCycle, preference])

  return (
    <div className={blk}>
      <div className={bemClass([blk, 'quantity-counter'])} >
        <button
          type="button"
          onClick={decrementHandler}
          className={bemClass([
            blk,
            'btn',
            {
              disabled: decrementDisabled,
            },
          ])}
          data-auto-id={`${dataAutoId}_decrement`}
        >
          -
        </button>
        <input
          type="number"
          className={bemClass([
            blk,
            'input'
          ])}
          value={counter}
          onChange={handleChange}
          data-auto-id={`${dataAutoId}_input_value`}
        />
        <button
          type="button"
          onClick={incrementHandler}
          className={bemClass([
            blk,
            'btn',
            {
              disabled: incrementDisabled
            }
          ])}
          data-auto-id={`${dataAutoId}_increment`}
        >
          +
        </button>
      </div>
      {isErrorVisible && <div className={bemClass([blk, 'error'])} data-auto-id={`${dataAutoId}_error`}>
        {errorMessage}
      </div>}
    </div>
  )
}

export default PricingQuantity
