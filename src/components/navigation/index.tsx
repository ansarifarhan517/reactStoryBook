import React from 'react'
import { NavLink } from 'react-router-dom'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'navigation'

const Navigation: React.FC = () => (
  <div className={blk}>
    <ul>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/tag-manager">Tag Manager</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/case-study-category">Case study category</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/case-study-sub-category">Case study sub-category</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/case-study">Case study</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/white-paper">White paper</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/infographic">Infographic</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/media-category">Media category</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/media">Media</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/news-category">News category</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/news">News</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/job-location">Job Location</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/job-category">Job category</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/job-role">Job roles</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/pr-subscriber">PR subscriber</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/related-blog">Related blogs</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/award-recognition">Awards and recognitions</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/vodcast">Vodcast</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/event">Events</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/testimonial">Testimonials</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/news-ticker">News ticker</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/landing-page">Landing Page</NavLink>
      </li>
      <li>
        <NavLink className={bemClass([blk, 'menu'])} to="/faq">FAQ</NavLink>
      </li>
    </ul>
  </div>
)

export default Navigation
