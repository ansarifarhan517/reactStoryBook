import React from 'react'
import { Box, Loader } from 'ui-library'
import { ThemeProvider } from 'styled-components'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { theme } from '../../../utils/theme'
import FeatureCard from './FeatureCard'
import withRedux from '../../../utils/redux/withRedux'

const Explore = () => {
  const explorePosts = useTypedSelector(state => state.featurePanel.explores.posts)
  const isLoading = useTypedSelector(state => state.featurePanel.explores.fetchStatus === 'loading')

  return (
    <ThemeProvider theme={theme}>
      <Box p='12px' verticalSpacing='12px' fullHeight style={{ position: 'relative' }}>
        {isLoading && <Loader center fadeBackground />}
        {explorePosts.map((post) => (
          <FeatureCard post={post} key={post.id} type='explore' />
        ))}

        {explorePosts.length === 0 && !isLoading && (
          <Box display='flex' flexDirection='column' fullHeight justifyContent='center' alignItems='center'>
            <img
              src='https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-images/No_WP_Posts_Found.png'
              width={280}
            // style={{height: 'auto'}}
            />

            <Box mt='48px' style={{ textAlign: 'center', color: '#636363' }}>
              Explore article not available
            </Box>
          </Box>)}
      </Box>
    </ThemeProvider>
  )
}

export default withRedux(Explore)