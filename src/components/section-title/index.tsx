import { bemClass } from '@/utils'

import Text, { TextProps } from '../text'

import './style.scss'

type sectionTitleProps = {
  category?: 'primary' | 'secondary' | 'dual' | 'dual-reverse';
  children?: string;
  borderPosition?: 'center' | 'left' | 'full';
  fontWeight?: 'thin' | 'normal' | 'semi-bold' | 'bold';
  color?: 'black' | 'gray-darker' | 'gray-dark' | 'white' | 'primary' | 'secondary';
  className? : string;
  dataAutoId?: string;
};

const blk = 'section-title'

const SectionTitle = ({
  category = 'primary',
  children = '',
  borderPosition = 'center',
  color = 'gray-darker',
  fontWeight = 'normal',
  className = '',
  dataAutoId
}: sectionTitleProps) => {
  if (category === 'dual' || category === 'dual-reverse') {
    const splitArray: Array<string> = children?.split(' ')
    const firstWord = splitArray?.shift()
    const remainingWords = splitArray.join(' ')
    return (
      <Text
        tag="h2"
        typography="xxl"
        fontWeight={fontWeight}
        color={color}
        className={bemClass([blk, category, {}, className])}
        dataAutoId={dataAutoId}
      >
        <>
          <span className={bemClass([blk, category, ['first-word']])}>
            {`${firstWord} `}
          </span>
          <span className={bemClass([blk, category, ['remaining-words']])}>
            {remainingWords}
          </span>
        </>
      </Text>
    )
  }

  return (
    <Text
      tag="h2"
      typography="xxl"
      fontWeight={fontWeight}
      color={color}
      className={
        bemClass([
          blk,
          category,
          {
            [borderPosition]: !!borderPosition
          },
          className
        ])
      }
      dataAutoId={dataAutoId}
    >
      {children}
    </Text>
  )
}

export default SectionTitle
