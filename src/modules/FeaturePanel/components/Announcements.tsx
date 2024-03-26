import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Box, Loader } from 'ui-library'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import withRedux from '../../../utils/redux/withRedux'
import { theme } from '../../../utils/theme'
import FeatureCard from './FeatureCard'

const Announcements = () => {
  const announcementPosts = useTypedSelector(state => state.featurePanel.announcements.posts)
  const isLoading = useTypedSelector(state => state.featurePanel.announcements.fetchStatus === 'loading')

  return (
    <ThemeProvider theme={theme}>
      <Box p='12px' verticalSpacing='12px' fullHeight style={{ position: 'relative' }}>
        {isLoading && <Loader center fadeBackground />}
        {announcementPosts.map((post) => (
          <FeatureCard post={post} key={post.id} type='announcement' />
        ))}

        {announcementPosts.length === 0 && !isLoading && (
          <Box display='flex' flexDirection='column' fullHeight justifyContent='center' alignItems='center'>
            <img
              src='https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-images/No_WP_Posts_Found.png'
              width={280}
            // style={{height: 'auto'}}
            />

            <Box mt='48px' style={{ textAlign: 'center', color: '#636363' }}>
              We'll let you know when we have something New for you
              </Box>
          </Box>)}
      </Box>
    </ThemeProvider>
  )
}

export default withRedux(Announcements)