import React from 'react'
import ArticleInfo from './ArticleView'
import { Col } from './Layout'

export class ArticlesList extends React.Component {
  render () {
    return (
      <Col>
        {this.props.rows.map(
          (value) => (
            <ArticleInfo article={value} key={value.id} />
          ))}
      </Col>
    )
  }
}
