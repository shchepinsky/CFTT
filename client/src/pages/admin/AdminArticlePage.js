import React from 'react'
import { Button, LinearProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import paragraphs from '../../data/paragraphs'
import suggestions from '../../data/suggestions'
import ParagraphsList from '../../components/ParagraphsList'
import { Col } from '../../components/Layout'

class AdminArticlePage extends React.Component {

  componentDidMount () {
    const {params} = this.props.match
    const articleId = params.article
    this.props.paragraphActions.fetch({articleId})
  }

  onRefreshPress = () => {
    const {params} = this.props.match
    const articleId = params.article
    this.props.paragraphActions.fetch({articleId})
  }

  renderParagraphs () {
    const {paragraphs} = this.props
    if (paragraphs.error) {
      return (
        <p>{paragraphs.error}</p>
      )
    }

    return paragraphs.itemsList.length
      ? <ParagraphsList rows={paragraphs.itemsList.filter(paragraph => paragraph.suggestionCount > 0)} />
      : <p>No paragraphs</p>
  }

  render () {
    return (
      <Col>
        <h2>Article Paragraphs</h2>

        <Button onClick={this.onRefreshPress} disabled={this.props.paragraphs.fetching}>
          Refresh
        </Button>
        {
          this.props.paragraphs.fetching
            ? <LinearProgress />
            : this.renderParagraphs()
        }
      </Col>
    )
  }
}

function mapStateToProps (state) {
  return {
    paragraphs: state.paragraphs,
  }
}

function mapActionsToProps (dispatch) {
  return {
    paragraphActions: bindActionCreators(paragraphs.actions, dispatch),
    suggestionActions: bindActionCreators(suggestions.actions, dispatch),
  }
}

export default connect(mapStateToProps, mapActionsToProps)(AdminArticlePage)
