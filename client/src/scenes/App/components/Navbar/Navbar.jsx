import React from 'react'
import { Link } from 'react-router-dom'

import { useConfiguration } from 'contexts'
import { Authenticated, Button, Icon } from 'components'

import { GithubIcon, UserMenu } from './components'

import './Navbar.scss'

const Navbar = () => {
  const conf = useConfiguration()

  return (
    <div className="navbar">
      <div className="brand">
        <Link to="/" className="title">
          <img alt="emoji" src="/img/favicon/favicon-64.png" />
          FAQ {conf.title || ''}
        </Link>
      </div>
      <div className="navigation">
        {conf.bugReporting === 'GITHUB' ? (
          <a
            href="https://github.com/zenika-open-source/FAQ/issues/new?template=bug_report.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            <span>report a bug</span>
          </a>
        ) : (
          <a href={`mailto:bug@${process.env.REACT_APP_FAQ_URL}`}>
            <Icon material="mail" style={{ fontSize: '14px' }} />
            <span>report a bug</span>
          </a>
        )}
        <Authenticated>
          <UserMenu />
          <Link to="/q/new">
            <Button label={<b>New question</b>} primary fixed />
          </Link>
        </Authenticated>
      </div>
    </div>
  )
}

export default Navbar
