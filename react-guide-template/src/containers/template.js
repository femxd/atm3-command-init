import 'babel-polyfill'
import React, {Component, PropTypes} from 'react'
import { render } from 'react-dom'

import 'guide/lib/css-reset/index.scss'
import 'guide/lib/css-fonticon/index.scss'
import "../styles/g.scss"

import Header from 'guide/commons/mod-header'
import Card from 'guide/commons/mod-card'
import Footer from 'guide/commons/mod-footer'
import Comment from 'guide/commons/mod-comment'

const Root = () => {
  return (
    <div>
      <Header/>
      <Card/>
      <Comment />
      <Footer/>
    </div>
  )
}

if (__CLIENT__) {
  render(
    <Root/>,
    document.getElementById('root')
  )
}

export default Root;
