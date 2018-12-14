import { applyMiddleware, combineReducers, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all, put, spawn } from 'redux-saga/effects'
import { reactotron } from './reactotron'
import articles from './data/articles'
import paragraphs from './data/paragraphs'
import suggestions from './data/suggestions'

export function setupStore () {
  const reducerMap = {
    articles: articles.reducer,
    paragraphs: paragraphs.reducer,
    suggestions: suggestions.reducer,
  }

  const rootReducer = combineReducers(reducerMap)
  const sagaMiddleware = createSagaMiddleware()
  const enhancer = applyMiddleware(sagaMiddleware)

  function * rootSaga () {
    yield put({type: 'BOOTING'})
    yield all([
      spawn(paragraphs.main),
      spawn(articles.main),
      spawn(suggestions.main),
    ])
  }

  const store = reactotron
    ? reactotron.createStore(rootReducer, enhancer)
    : createStore(rootReducer, enhancer)

  sagaMiddleware.run(rootSaga)
  return store
}
