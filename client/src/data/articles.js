import _ from 'lodash'
import { call, put, take } from 'redux-saga/effects'
import { get } from '../api'

const MODULE = 'ARTICLES'

const FETCH = `${MODULE}_FETCH`
const FETCH_OK = `${MODULE}_FETCH_OK`
const FETCH_FAIL = `${MODULE}_FETCH_FAIL`

const fetch = () => ({
  type: FETCH,
})

function * main () {
  while (true) {
    const action = yield take(FETCH)
    yield call(handleArticleFetch, action)
  }
}

function * handleArticleFetch (action) {
  try {
    const body = yield get(`/api/articles`)
    const data = {
      itemsById: body.itemsById
    }

    yield put({type: FETCH_OK, payload: data})
  } catch (err) {
    console.error(err)
    yield put({type: FETCH_FAIL})
  }
}

function getInitialState () {
  return {
    fetching: false,
    itemsById: {},
    itemsList: [],
    error: '',
  }
}

function reducer (state = getInitialState(), action) {
  if (action.type === FETCH) {
    return {
      ...state,
      fetching: true,
      error: '',
    }
  }

  if (action.type === FETCH_OK) {
    const {itemsById} = action.payload
    const itemsList = _.values(itemsById)
    return {
      ...state,
      itemsById: itemsById,
      itemsList: itemsList,
      fetching: false,
      error: '',
    }
  }

  if (action.type === FETCH_FAIL) {
    return {
      ...state,
      fetching: false,
      error: action.payload,
    }
  }

  return state
}

export default {
  main,
  reducer,
  actions: {
    fetch,
  },
}
