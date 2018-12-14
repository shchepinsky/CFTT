import React from 'react'
import ParagraphView from './ParagraphView'
import { Col } from './Layout'

class ParagraphsList extends React.Component {
  render () {
    return (
      <Col>
        {this.props.rows.map(
          (paragraph) => (
            <ParagraphView
              key={paragraph.id}
              text={paragraph.text}
            />
          ))}
      </Col>
    )
  }
}

export default ParagraphsList
