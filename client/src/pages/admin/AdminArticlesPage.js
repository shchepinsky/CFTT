import React from 'react'
import { Button, LinearProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import articles from '../../data/articles'
import paragraphs from '../../data/paragraphs'
import suggestions from '../../data/suggestions'
import { ArticlesList } from '../../components/ArticlesList'
import { Col } from '../../components/Layout'

class AdminArticlesPage extends React.Component {

  componentDidMount () {
    this.props.articleActions.fetch()
  }

  onRefreshPress = () => {
    this.props.articleActions.fetch()
  }

  renderArticles (articles) {
    if (articles.error) {
      return (
        <p>{articles.error}</p>
      )
    }

    return articles.itemsList.length
      ? <ArticlesList rows={articles.itemsList} />
      : <p>No articles</p>
  }

  render () {
    return (
      <Col>
        <h2>Articles</h2>

        <Button onClick={this.onRefreshPress} disabled={this.props.articles.fetching}>
          Refresh
        </Button>
        {
          this.props.articles.fetching
            ? <LinearProgress />
            : this.renderArticles(this.props.articles)
        }
      </Col>
    )
  }
}

function mapStateToProps (state) {
  return {
    articles: state.articles,
  }
}

function mapActionsToProps (dispatch) {
  return {
    articleActions: bindActionCreators(articles.actions, dispatch),
    paragraphActions: bindActionCreators(paragraphs.actions, dispatch),
    suggestionActions: bindActionCreators(suggestions.actions, dispatch),
  }
}

export default connect(mapStateToProps, mapActionsToProps)(AdminArticlesPage)
