import React, { Dispatch, useEffect, useState } from 'react'
import { Box, IconButton } from 'ui-library'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { IWPPost } from '../../../utils/Wordpress.interfaces'
import moment from 'moment-timezone'
import { FeatureCardContainer, TagChip } from './styles'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { contentTagIds, industryTagIds, productTagIds, tagSlugColorMapping } from '../FeaturePanel.constants'
import { tFeaturePanelActions } from '../FeaturePanel.actions'
import { useDispatch } from 'react-redux'
import store from '../../../utils/redux/store'
import { sendGA } from '../../../utils/ga'
import { IFeaturePanelFeedbackResponse } from '../FeaturePanel.models'

interface IFeatureCardProps {
  post: IWPPost
  type: 'announcement' | 'explore'
}
const FeatureCard = ({ post, type }: IFeatureCardProps) => {
  const clientProperties = useTypedSelector(state => state.clientProperties || {})
  const tagsMap = useTypedSelector(state => state.featurePanel.tags)
  const feedbacks = useTypedSelector(state => state.featurePanel.feedbacks)
  const dispatch = useDispatch<Dispatch<tFeaturePanelActions>>()

  const [content, setContent] = useState<string>('')
  const ref = React.useRef<HTMLDivElement>(null)
  const likeRef = React.useRef<HTMLDivElement>(null)
  const disLikeRef = React.useRef<HTMLDivElement>(null)

  const dateTimeStamp = React.useMemo(() => {
    if (!clientProperties.TIMEZONE || !clientProperties.DATEFORMAT) {
      return ''
    }

    return moment.utc(post.date_gmt).tz(clientProperties.TIMEZONE.propertyValue).format(clientProperties.DATEFORMAT.propertyValue.toUpperCase())
  }, [clientProperties.TIMEZONE, clientProperties.DATEFORMAT])

  useEffect(() => {
    setContent(post.content.rendered)
    // setContent(`\n\n\n\n\n\n<p>This is draft.</p>\n<p>&nbsp;</p>\n<p><a href=\"https://support.loginextsolutions.com/index.php/2013/01/12/orders-overview-3/\">Learn More</a></p>\n`)

    const handleExternalLinkClick = async (event: MouseEvent) => {
      if (!event.target?.['dataset']?.url) {
        return
      }
      const url = encodeURIComponent(event.target?.['dataset']?.url)

      if (url.includes('support.loginextsolutions.com')) {
        const { data: { token } } = await axios.get(apiMappings.wordpress.autoLogin, { params: { url } })
        open(`https://support.loginextsolutions.com/auto-login.php?token=${token}`, '_blank')
        sendGA(type === 'announcement' ? 'What’s New' : 'Explore','Click on read more')
      } else {
        open(event.target?.['dataset']?.url, '_blank')
      }

    }
    ref.current?.addEventListener && ref.current?.addEventListener('click', handleExternalLinkClick)


    const handleLike = async () => {
      if (store.getState().featurePanel.feedbacks[post.id] === true) {
        return
      }

      const payload: Omit<IFeaturePanelFeedbackResponse, 'userId'>[] = [
        { articleId: String(post.id), liked: true, articleCategory: type }
      ]
      try {
        await axios.put(apiMappings.featurePanel.updateUserPostFeedback, payload)
        dispatch({ type: '@@FEATURE_PANEL/SET_FEEDBACKS', payload: { [post.id]: true } })
      } catch (errorResponse) {
        console.log('Feedback Like Failed: ', post.id, errorResponse, errorResponse?.response)
      }
    }

    const handleDislike = async () => {
      if (store.getState().featurePanel.feedbacks[post.id] === false) {
        return
      }

      const payload: Omit<IFeaturePanelFeedbackResponse, 'userId'>[] = [
        { articleId: String(post.id), liked: false, articleCategory: type }
      ]
      try {
        await axios.put(apiMappings.featurePanel.updateUserPostFeedback, payload)
        dispatch({ type: '@@FEATURE_PANEL/SET_FEEDBACKS', payload: { [post.id]: false } })
      } catch (errorResponse) {
        console.log('Feedback DisLike Failed: ', post.id, errorResponse, errorResponse?.response)
      }
    }

    likeRef.current?.addEventListener('click', handleLike)
    disLikeRef.current?.addEventListener('click', handleDislike)

    return () => {
      ref.current?.removeEventListener('click', handleExternalLinkClick)
      likeRef.current?.removeEventListener('click', handleLike)
      disLikeRef.current?.removeEventListener('click', handleDislike)
    }
  }, [])

  const contentWithModifiedLinks = React.useMemo(() => {
    const re = new RegExp('<a([^>]* )href="#"', "g");
    // return content.replace(re, "<a onclick=\"alert('$2')\"");
    return content.replace(re, `<a data-url='$2' href='#'`);

  }, [content])

  const renderTags = React.useMemo(() => {
    let contentTagId = 0
    let renderOtherTags = post.tags.filter(tagId => {
      if (contentTagIds.has(tagId)) {
        contentTagId = tagId
      }
      return !industryTagIds.has(tagId) && !productTagIds.has(tagId) && !contentTagIds.has(tagId)
    }).map((tagId) => {
      const tagObj = tagsMap.get(tagId)
      const backgroundColor = tagSlugColorMapping[tagObj?.slug || ''] || tagSlugColorMapping.default
      return tagObj?.name && <TagChip key={tagId} style={{ backgroundColor }}>{tagObj?.name}</TagChip>
    })

    return [
      contentTagId ? (<TagChip key={contentTagId}
        style={{ backgroundColor: tagSlugColorMapping[tagsMap.get(contentTagId)?.slug || ''] || tagSlugColorMapping.default }}
      >
        {tagsMap.get(contentTagId)?.name}
      </TagChip>) : <div />,
      ...renderOtherTags]
  }, [post.tags, tagsMap])

  return (<FeatureCardContainer>
    <Box display='flex' alignItems='flex-start'>
      <div className='title' title={post.title.rendered}>{post.title.rendered}</div>
      {type === 'announcement' && <Box className='sub-title' pl='15px'>{dateTimeStamp}</Box>}
    </Box>
    <Box horizontalSpacing='5px' mb='5px' style={{ wordBreak: 'break-word' }}>
      {renderTags}
    </Box>
    <div style={{ fontSize: 12, color: '#555' }} ref={ref} dangerouslySetInnerHTML={{
      __html: contentWithModifiedLinks
    }} />
    <div className='horizontal-line' />
    <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
      <Box my='4.5px' className='sub-title'>Was this helpful ?</Box>
      <Box mb='4.5px' display='flex' justifyContent='center' alignItems='center' fullWidth horizontalSpacing='40px'>
        <div ref={likeRef} id={`helpcenter--${feedbacks[post.id] === true ? 'thumb-up-filled' : 'thumb-up'}`}>
          <IconButton className='icon-button' iconSize={23}
            iconVariant={feedbacks[post.id] === true ? 'thumb-up-filled' : 'thumb-up'}
            hoverFeedback={feedbacks[post.id] !== true}
            onlyIcon />
        </div>
        <div ref={disLikeRef} id={`helpcenter--${feedbacks[post.id] === false ? 'thumb-down-filled' : 'thumb-down'}`}>
          <IconButton className='icon-button' iconSize={23}
            iconVariant={feedbacks[post.id] === false ? 'thumb-down-filled' : 'thumb-down'}
            hoverFeedback={feedbacks[post.id] !== false}
            onlyIcon style={{ color: '#666' }} />
        </div>
      </Box>
    </Box>
  </FeatureCardContainer>)
}

export default FeatureCard