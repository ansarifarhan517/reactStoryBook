import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Typography from '../../atoms/Typography'
import Position, { PositionProps } from '../Position'
import { colorFinder } from '../../../utilities/mixins'
import { IColorProps } from '../../../utilities/types'

export type tDirection = 'top' | 'bottom' | 'right' | 'left'
export interface ITooltipProps {
  hide?: boolean
  message?: string | JSX.Element | React.ReactNode
  children: any
  arrowPlacement?: 'start' | 'center' | 'end'
  messagePlacement?: 'start' | 'center' | 'end'
  tooltipDirection?: 'top' | 'bottom' | 'right' | 'left'
  align?: 'right' | 'left' | 'center' | undefined
  hover?: boolean
  maxWidth?: number
  color?: {
    arrow: string
    text: string
    background: string
    border: string
  }
  boundLeft?: number
  isWordWrap?: boolean
}

interface ArrowProps extends IColorProps {
  variant: 'top' | 'bottom' | 'right' | 'left'
}

const arrowSize = 5

export interface IMessageContainer extends PositionProps {
  maxWidth?: number
}

const MessageContainer = styled(Position)<IMessageContainer>`
  z-index: 2;
  word-wrap: break-word;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : '300px')};
  width: max-content;
  padding: 10px;
  font-size: 12px;
  box-shadow: 0px 5px 25px -10px #000;
`
const Arrow = styled.div<ArrowProps>`
  /*
    content: '';
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -${arrowSize}px;
    border-width: ${arrowSize}px;
    border-style: solid;
    ${({ variant, color, theme }) => {
    const borderColor = colorFinder(color, theme)
    let borderColorCSS = ''
    switch (variant) {
      case 'top':
        borderColorCSS = `${borderColor} transparent transparent transparent`
        break
      case 'bottom':
        borderColorCSS = `transparent transparent ${borderColor} transparent`
        break
      case 'right':
        borderColorCSS = `transparent ${borderColor} transparent transparent`
        break
      case 'left':
        borderColorCSS = `transparent transparent transparent ${borderColor}`
        break
    }

    return `border-color: ${borderColorCSS};`
  }}
  */

  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  z-index: 1;
  ${({ variant, color, theme }) => {
    const colorHex = colorFinder(color, theme)
    let css = ''
    switch (variant) {
      case 'top':
        css = `
        bottom: 3px;
        right: 100%;
        background-color: ${colorHex};
        `
        break
      case 'bottom':
        css = `
        top: 3px;
        right: 100%;
        background-color: ${colorHex};
        `
        break
      case 'right':
        css = `
        top: -5px;
        right: -7px;
        background-color: ${colorHex};
        `
        break
      case 'left':
        css = `
        top: -5px;
        right: 7px;
        background-color: ${colorHex};
        `
        break
    }

    return css
  }}
  transform: rotate(45deg);
`

const TooltipContainer = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme?.zIndex?.tooltip};
`

const arrowPositionMap = {
  top: {
    start: {
      top: '0px',
      left: `${arrowSize}px`
    },
    center: {
      top: '0px',
      left: `calc(50% + ${arrowSize}px)`
    },
    end: {
      top: '0px',
      right: `-${arrowSize}px`
    }
  },
  bottom: {
    start: {
      bottom: '0px',
      left: `${arrowSize}px`
    },
    center: {
      bottom: '0px',
      left: `calc(50% + ${arrowSize}px)`
    },
    end: {
      bottom: '0px',
      right: `-${arrowSize}px`
    }
  },
  left: {
    start: {
      top: '0%',
      left: `${arrowSize}px`
    },
    center: {
      top: '50%',
      left: `${arrowSize}px`
    },
    end: {
      top: '100%',
      left: `${arrowSize}px`
    }
  },
  right: {
    start: {
      top: '0%',
      right: `-${arrowSize}px`
    },
    center: {
      top: '50%',
      right: `-${arrowSize}px`
    },
    end: {
      top: '100%',
      right: `-${arrowSize}px`
    }
  }
}

const messagePositionMap = (
  left: number,
  tooltipDir: string,
  messagePlace: string
) => {
  const positionObject = {
    top: {
      start: {
        bottom: 'calc(100% + ' + arrowSize + 'px' + ')',
        left: `calc(50% - ${arrowSize * 2 + left}px)`
      },
      center: {
        bottom: 'calc(100% + ' + arrowSize + 'px' + ')',
        left: `calc(50% + ${left / 2 + (left / 2 ? 20 : 0)}px)`,
        style: { transform: 'translateX(-50%)' }
      },
      end: {
        bottom: 'calc(100% + ' + arrowSize + 'px' + ')',
        right: `calc(50% - ${arrowSize * 2 + left}px)`
      }
    },
    bottom: {
      start: {
        top: 'calc(100% + ' + arrowSize + 'px' + ')',
        left: `calc(50% - ${arrowSize * 2 + left}px)`
      },
      center: {
        top: 'calc(100% + ' + arrowSize + 'px' + ')',
        left: `calc(50% + ${left / 2 + (left / 2 ? 20 : 0)}px)`,
        style: { transform: 'translateX(-50%)' }
      },
      end: {
        top: 'calc(100% + ' + arrowSize + 'px' + ')',
        right: `calc(50% - ${arrowSize * 2 + left}px)`
      }
    },
    left: {
      start: {
        top: '-13px',
        right: `calc(100% + ${5 + left}px)`
      },
      center: {
        top: '-13px',
        // style: { transform: 'translate(-100%, -50%)' },
        right: `calc(100% + ${5 + left}px)`
      },
      end: {
        top: '-13px',
        // style: { transform: 'translateX(-100%)' },
        right: `calc(100% + ${5 + left}px)`
      }
    },
    right: {
      start: {
        top: '-13px',
        // style: { transform: 'translateX(-100%)' },
        left: `calc(100% + ${5 + left}px)`
      },
      center: {
        top: '-13px',
        // style: { transform: 'translate(-100%, -50%)' },
        left: `calc(100% + ${5 + left}px)`
      },
      end: {
        top: '-13px',
        // style: { transform: 'translateX(-100%)' },
        left: `calc(100% + ${5 + left}px)`
      }
    }
  }
  return positionObject[tooltipDir][messagePlace]
}

const Tooltip = ({
  hide = false,
  message = '',
  children,
  tooltipDirection = 'bottom',
  arrowPlacement = 'center',
  messagePlacement = 'center',
  align = 'center',
  color = {
    background: 'primary.main',
    border: 'primary.dark',
    text: 'primary.contrastText',
    arrow: 'primary.main'
  },
  maxWidth,
  hover = false,
  boundLeft,
  isWordWrap = false
}: ITooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(!hover)

  const tooltipContainerRef = React.useRef<HTMLDivElement>(null)
  const tooltipContainerRef1 = React.useRef<HTMLDivElement>(null)

  const calculatBounds = (tooltipDir: string, messagePlace: string) => {
    let leftBound = 0
    const refPosition = tooltipContainerRef?.current?.getBoundingClientRect()
    const ref1Position = tooltipContainerRef1?.current?.getBoundingClientRect()
    if (
      refPosition &&
      refPosition?.left < 300 &&
      ref1Position &&
      ref1Position?.left < 0
    ) {
      leftBound = Math.abs(ref1Position?.left) + 15
    } else if (boundLeft && ref1Position && ref1Position?.left < boundLeft) {
      leftBound = boundLeft - Math.abs(ref1Position?.left) + 15
    }

    return messagePositionMap(leftBound, tooltipDir, messagePlace)
  }

  const tooltipContainer = showTooltip && !hide && (
    <TooltipContainer data-testid='tooltipContainer'>
      <MessageContainer
        type='absolute'
        {...calculatBounds(tooltipDirection, messagePlacement)}
        px='10px'
        py='5px'
        border={1}
        borderRadius={3}
        borderColor={color.border}
        bgColor={color.background}
        maxWidth={maxWidth}
      >
        <Typography
          variant={isWordWrap ? 'tooltipWithWordWrap' : 'tooltip'}
          color={color.text}
          align={align}
          data-testid='tooltipTitle'
        >
          {message}
        </Typography>
      </MessageContainer>
      <Position
        type='absolute'
        {...arrowPositionMap[tooltipDirection][arrowPlacement]}
      >
        <Arrow variant={tooltipDirection} color={color.arrow} />
      </Position>
    </TooltipContainer>
  )

  useEffect(() => {
    setShowTooltip(!hover)
  }, [hover])

  return (
    <>
      <Position
        type='relative'
        display={
          tooltipDirection === 'left' || tooltipDirection === 'right'
            ? 'flex'
            : 'inline-block'
        }
        style={{ maxWidth: '100%' }}
      >
        {(tooltipDirection === 'top' || tooltipDirection === 'left') &&
          tooltipContainer}
        <div
          data-testid='children'
          onMouseOver={() => hover && setShowTooltip(true)}
          onMouseOut={() => hover && setShowTooltip(false)}
          ref={tooltipContainerRef}
        >
          {children}
        </div>
        {(tooltipDirection === 'bottom' || tooltipDirection === 'right') &&
          tooltipContainer}
      </Position>
      <div
        style={{
          position: 'absolute',
          visibility: 'hidden',
          height: 'auto',
          width: 'auto',
          whiteSpace: 'normal',
          right: 0,
          padding: 10
        }}
        id='textMeasureWrap'
        ref={tooltipContainerRef1}
      >
        <Typography
          variant='tooltip'
          color={color.text}
          align='center'
          data-testid='tooltipTitle'
        >
          {message}
        </Typography>
      </div>
    </>
  )
}

export default Tooltip
