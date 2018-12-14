import React, { Component } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CircularProgress } from '@material-ui/core'
import UserParagraphs from './pages/user/UserParagraphsPage'
import AdminArticles from './pages/admin/AdminArticlesPage'
import { Col, Middle } from './components/Layout'
import { setupStore } from './store'
import AdminArticlePage from './pages/admin/AdminArticlePage'

class AppWithRouter extends Component {
  state = {
    store: null,
  }

  componentDidMount () {
    this.setState({
      store: setupStore(),
    })
  }

  render () {
    if (!this.state.store) {
      return (
        <Middle>
          <CircularProgress />
        </Middle>
      )
    }

    return (
      <Provider store={this.state.store}>
        <Router>
          <div style={{flex: 1}}>
            <Route path="/admin/:article" exact component={AdminArticlePage} />
            <Route path="/admin" exact component={AdminArticles} />
            {/* default to client area route */}
            <Route path="/fb" component={UserParagraphs} />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default AppWithRouter
