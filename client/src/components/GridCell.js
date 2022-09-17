import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { config } from 'react-spring'
import lodash from 'lodash'
// import 'antd/dnpmist/antd.css'
import { Button, Input } from 'antd'
import Icon from '@ant-design/icons'
import { Slug, Fade } from '../helpers'

const Cell = ({ toggle, name, height, description, css, maximized }) => {
  console.log(name)
  return (
    <div
      className="cell"
      style={{ backgroundImage: css, cursor: !maximized ? 'pointer' : 'auto' }}
      onClick={!maximized ? toggle : undefined}> 
      <Fade show={maximized} delay={maximized ? 400 : 0}>
        <div className="details">
          <Slug delay={600}>
            <div className="circle" style={{ background: css }} />
            <div className="close">
              <Icon type="close" style={{ cursor: 'pointer' }} onClick={toggle} />
            </div>
            <h1>{name}</h1>
            <p>{description}</p>
          </Slug>
        </div>
      </Fade>
      <Fade
        show={!maximized}
        from={{ opacity: 0, transform: 'translate3d(0,140px,0)' }}
        enter={{ opacity: 1, transform: 'translate3d(0,0px,0)' }}
        leave={{ opacity: 0, transform: 'translate3d(0,-50px,0)' }}
        delay={maximized ? 0 : 400}>
        <div className="default">{name}</div>
      </Fade>
    </div>
  )
}

export default Cell