import React from 'react'
import { Button, TextField, CircularProgress } from '@material-ui/core'
import { Col, Row } from './Layout'
import RangeInfo from './RangeInfo'
import ParagraphView from './ParagraphView'

class SuggestionEditor extends React.Component {
  state = {
    value: '',
    targetStart: -1,
    targetEnd: -1,
  }

  handleSuggestionChange = event => {
    this.setState({
      value: event.target.value,
    })
  }

  updateSelectionInfo = () => {
    const selection = document.getSelection()
    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0)
      this.setState({
        targetStart: range.startOffset,
        targetEnd: range.endOffset,
      })
    } else {
      this.setState({
        targetStart: -1,
        targetEnd: -1,
      })
    }
  }

  onSubmit = () => {
    this.props.onSubmit({
      paragraphId: this.props.paragraphId,
      suggestion: this.state.value,
      from: this.state.targetStart,
      to: this.state.targetEnd,
    })

    this.setState({
      value: '',
      targetStart: -1,
      targetEnd: -1,
    })
  }

  render () {
    const {targetStart, targetEnd} = this.state
    const {paragraph} = this.props
    const placeholder = paragraph.text.substring(targetStart, targetEnd)
    const isSuggestionValid = targetEnd > targetStart && paragraph.text.trim()

    return (
      <Col style={{flexGrow: 1}}>
        <div onMouseDown={this.updateSelectionInfo} onMouseUp={this.updateSelectionInfo}>
          <ParagraphView
            text={paragraph.text}
            suggestion={this.state.value}
            from={this.state.targetStart}
            to={this.state.targetEnd}
          />
        </div>
        <TextField
          id="suggestion-input"
          label="Suggestion text"
          style={{flexGrow: 1}}
          value={this.state.value}
          onChange={this.handleSuggestionChange}
          placeholder={placeholder}
          disabled={this.props.saving}
        />
        <Row style={{alignItems: 'center', justifyContent: 'space-between'}}>
          <RangeInfo from={this.state.targetStart} to={this.state.targetEnd} />
          <Button onClick={this.onSubmit} disabled={!isSuggestionValid || this.props.saving}>
            { this.props.saving && <CircularProgress size={14} style={{marginRight: 8}}/> }
            { this.props.saving
              ? 'Submitting...'
              : 'Make suggestion'
            }
          </Button>
        </Row>
      </Col>
    )
  }
}

export default SuggestionEditor
