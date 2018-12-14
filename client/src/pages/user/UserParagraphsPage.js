import React from 'react'
import QueryString from 'query-string'
import { Button, Card, LinearProgress } from '@material-ui/core'
import SuggestionEditor from '../../components/SuggestionEditor'
import CardContent from '@material-ui/core/es/CardContent/CardContent'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import paragraphs from '../../data/paragraphs'
import suggestions from '../../data/suggestions'
import { Col } from '../../components/Layout'

class UserParagraphsPage extends React.Component {

  onRefreshPress = () => {
    const {articleURL} = QueryString.parse(document.location.search)
    if (articleURL) {
      this.props.paragraphActions.parse({url: articleURL})
    }
  }

  componentDidMount () {
    const {articleURL} = QueryString.parse(document.location.search)
    if (articleURL) {
      this.props.paragraphActions.parse({url: articleURL})
    }
  }

  onSubmitSuggestion = async ({paragraphId, suggestion, from, to}) => {
    this.props.suggestionActions.create({
      paragraphId: paragraphId,
      text: suggestion,
      from: from,
      to: to,
    })
  }

  renderParagraphs (paragraphs) {
    if (paragraphs.error) {
      return (
        <p>{paragraphs.error}</p>
      )
    }

    if (paragraphs.itemsList.length) {
      return paragraphs.itemsList.map(
        (value) => {
          return (
            <Card key={value.id} style={{margin: 8}}>
              <CardContent>
                <SuggestionEditor
                  paragraph={value}
                  onSubmit={this.onSubmitSuggestion}
                  saving={this.props.suggestions.fetching}
                />
              </CardContent>
            </Card>
          )
        },
      )
    } else {
      return (
        <p>No paragraphs</p>
      )
    }
  }

  render () {
    const {paragraphs} = this.props
    const {articleURL} = QueryString.parse(document.location.search)
    const isRefreshDisabled = paragraphs.fetching || !articleURL
    return (
      <Col>
        <h2>Paragraphs</h2>

        <Button onClick={this.onRefreshPress} disabled={isRefreshDisabled}>
          Reload
        </Button>
        {
          paragraphs.fetching
            ? <LinearProgress />
            : this.renderParagraphs(paragraphs)
        }
      </Col>
    )
  }
}

function mapStateToProps (state) {
  return {
    suggestions: state.suggestions,
    paragraphs: state.paragraphs,
  }
}

function mapActionsToProps (dispatch) {
  return {
    paragraphActions: bindActionCreators(paragraphs.actions, dispatch),
    suggestionActions: bindActionCreators(suggestions.actions, dispatch),
  }
}

export default connect(mapStateToProps, mapActionsToProps)(UserParagraphsPage)
