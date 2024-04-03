'use client'

import Link from 'next/link'
// import { useState, useEffect } from 'react'

import { bemClass } from '@/utils'

import './style.scss'

type newsDetailSocialProps = {
  url: string
  dataAutoId?: string
}

const blk = 'news-detail-social'

const NewsDetailSocial = ({ url, dataAutoId }: newsDetailSocialProps) => {
  const shareUrl = `${window.location.host}${url}`
  return (
    <div className={blk}>
      <Link
        href={`http://www.facebook.com/sharer.php?u=${shareUrl}`}
        target="_blank"
        className={bemClass([blk, 'link'])}
        data-auto-id={`${dataAutoId}_facebook`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          stroke="#d4d4d4"
          stroke-width="4"
          viewBox="0 0 100 100"
        >
          <path
            d="M62.57 13.656h13.635V0H58.309c-9.375 0-17.045 8.37-17.045 18.502v17.621h-17.47v12.775h17.47V100h14.914V48.898h20.028V36.123H56.178V21.145c0-3.965 2.983-7.489 6.392-7.489z"
            clip-rule="evenodd"
          />
        </svg>
      </Link>
      <Link
        href={`https://twitter.com/share?url=${shareUrl}`}
        target="_blank"
        className={bemClass([blk, 'link'])}
        data-auto-id={`${dataAutoId}_twitter`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="#d4d4d4"
          stroke-width="4"
          viewBox="0 0 100 100"
        >
          <path
            // eslint-disable-next-line max-len
            d="M100 18.388a40.06 40.06 0 0 1-11.78 3.292 20.942 20.942 0 0 0 9.02-11.561 40.51 40.51 0 0 1-13.028 5.07c-3.742-4.055-9.077-6.594-14.983-6.594-11.326 0-20.51 9.36-20.51 20.896 0 1.638.172 3.241.527 4.765-17.055-.871-32.178-9.189-42.29-21.837a21.086 21.086 0 0 0-2.778 10.505c0 7.249 3.617 13.654 9.121 17.403a20.178 20.178 0 0 1-9.296-2.608v.26c0 10.138 7.076 18.577 16.463 20.507a19.99 19.99 0 0 1-9.26.355c2.614 8.304 10.185 14.356 19.173 14.517-7.026 5.61-15.871 8.956-25.486 8.956-1.655 0-3.297-.115-4.894-.295 9.085 5.932 19.872 9.392 31.456 9.392 37.739 0 58.377-31.853 58.377-59.479 0-.906-.018-1.809-.065-2.703A41.63 41.63 0 0 0 100 18.388z"
            clip-rule="evenodd"
          />
        </svg>
      </Link>
      <Link
        href={`http://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
        target="_blank"
        className={bemClass([blk, 'link'])}
        data-auto-id={`${dataAutoId}_linkedin`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          stroke="#d4d4d4"
          stroke-width="4"
          viewBox="0 0 100 100"
        >
          <path
            fill-rule="evenodd"
            // eslint-disable-next-line max-len
            d="M1.279 97.917h21.429V33.253H1.279v64.664zM75.304 31.74c-11.388 0-16.458 6.276-19.321 10.681v.222h-.121c.029-.084.092-.147.121-.222v-9.164H34.558c.288 6.066 0 64.656 0 64.656h21.421V61.801c0-1.916.171-3.86.733-5.248 1.563-3.852 5.063-7.856 10.996-7.856 7.758 0 10.85 5.912 10.85 14.614v34.605H100V60.845c0-19.865-10.562-29.104-24.696-29.105zM12.129 2.083C4.8 2.083 0 6.906 0 13.266c0 6.19 4.659 11.173 11.854 11.173h.129c7.492 0 12.133-4.983 12.133-11.173-.145-6.36-4.641-11.183-11.987-11.183z"
            clip-rule="evenodd"
          />
        </svg>
      </Link>
    </div>
  )
}

export default NewsDetailSocial
