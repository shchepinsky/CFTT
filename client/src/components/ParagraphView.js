import React from 'react'
import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'

class ParagraphView extends React.Component {
  render () {
    const {text, from, to, suggestion} = this.props

    let content = <p>{text}</p>

    if (to > from) {
      const targetTextBefore = text.substring(0, from)
      const targetTextAfter = text.substring(to)
      const targetTextOriginal = text.substring(from, to)

      content = (
        <p>
          <span>{targetTextBefore}</span>
          <span style={{backgroundColor: 'rgba(255, 0, 0, 0.2)'}}>{targetTextOriginal}</span>
          <span style={{backgroundColor: 'rgba(0, 255, 0, 0.2)'}}>{suggestion}</span>
          <span>{targetTextAfter}</span>
        </p>
      )
    }

    return (
      <Card>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    )
  }
}

export default ParagraphView
