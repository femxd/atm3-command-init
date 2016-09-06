import 'babel-polyfill'
import React, {Component, PropTypes} from 'react'
import { render } from 'react-dom'

import 'guide/commons/css-reset/index.scss'
import 'guide/commons/css-fonticon/index.scss'
import "../styles/g.scss"

import Header from 'guide/commons/Header'
import Card from 'guide/commons/Card'
import ViewAll from 'guide/commons/ViewAll'
import Tag from 'guide/commons/Tag'
import Footer from 'guide/commons/Footer'
import Comment from 'guide/commons/Comment'

import Nav from 'guide/novel/Nav'
import BookItems from 'guide/novel/BookItems'
import ImgWrap from 'guide/novel/ImgWrap'
import Tags from 'guide/novel/Tags'
import Book3col from 'guide/novel/Book3col'
import BookList from 'guide/novel/BookList'
import Totop from 'guide/novel/Totop'
import Topic from 'guide/novel/Topic'

import ItemArrow from 'guide/bookpublish/ItemArrow'

const Root = () => {
  return (
    <div>
      <Header/>
      <Card/>
      <Comment/>
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
