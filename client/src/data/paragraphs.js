import _ from 'lodash'
import { put, takeEvery } from 'redux-saga/effects'
import { get } from '../api'

const MODULE = 'PARAGRAPHS'

const PARSE = `${MODULE}_PARSE`
const PARSE_OK = `${MODULE}_PARSE_OK`
const PARSE_FAIL = `${MODULE}_PARSE_FAIL`

const FETCH = `${MODULE}_FETCH`
const FETCH_OK = `${MODULE}_FETCH_OK`
const FETCH_FAIL = `${MODULE}_FETCH_FAIL`

const parse = ({url}) => ({
  type: PARSE,
  payload: {
    url,
  },
})

const fetch = ({articleId}) => ({
  type: FETCH,
  payload: {
    articleId,
  },
})

function * main () {
  yield takeEvery(PARSE, handleParse)
  yield takeEvery(FETCH, handleFetch)
}

function * handleParse (action) {
  try {
    const {url} = action.payload
    const body = yield get(`/api/paragraphs/parse`, {url})

    const data = {
      articleId: body.articleId,
      itemsById: body.itemsById,
    }

    yield put({type: PARSE_OK, payload: data})
  } catch (err) {
    console.error(err)
    yield put({type: PARSE_FAIL, payload: err.message})
  }
}

function * handleFetch (action) {
  try {
    const {articleId} = action.payload
    const body = yield get(`/api/paragraphs/?articleId=${articleId}`)

    yield put({type: FETCH_OK, payload: body})
  } catch (err) {
    console.error(err)
    yield put({type: FETCH_FAIL, payload: err.message})
  }
}

function getInitialState () {
  return {
    fetching: false,
    articleId: null,
    itemsById: {},
    itemsList: [],
    error: '',
  }
}

function reducer (state = getInitialState(), action) {
  if (action.type === FETCH || action.type === PARSE) {
    return {
      ...state,
      fetching: true,
      articleId: action.payload.articleId,
      error: '',
    }
  }

  if (action.type === FETCH_OK || action.type === PARSE_OK) {
    const {itemsById} = action.payload
    const itemsList = _.values(itemsById)
    return {
      ...state,
      itemsById: itemsById,
      itemsList: itemsList,
      fetching: false,
      articleId: action.payload.articleId,
      error: '',
    }
  }

  if (action.type === FETCH_FAIL || action.type === PARSE_FAIL) {
    return {
      ...state,
      fetching: false,
      articleId: action.payload.articleId,
      error: action.payload,
    }
  }

  return state
}

export default {
  main,
  reducer,
  actions: {
    parse,
    fetch,
  },
}
