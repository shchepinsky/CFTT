import _ from 'lodash'
import { put, takeEvery } from 'redux-saga/effects'
import { get, post } from '../api'

const MODULE = 'SUGGESTIONS'

const CREATE = `${MODULE}_CREATE`
const CREATE_OK = `${MODULE}_CREATE_OK`
const CREATE_FAIL = `${MODULE}_CREATE_FAIL`

const FETCH = `${MODULE}_FETCH`
const FETCH_OK = `${MODULE}_FETCH_OK`
const FETCH_FAIL = `${MODULE}_FETCH_FAIL`

const create = ({paragraphId, text, from, to}) => ({
  type: CREATE,
  payload: {
    paragraphId,
    text,
    from,
    to,
  },
})

const fetch = ({paragraphId}) => ({
  type: FETCH,
  payload: {
    paragraphId,
  },
})

function * main () {
  yield takeEvery(CREATE, handleCreate)
  yield takeEvery(FETCH, handleFetch)
}

function * handleCreate (action) {
  try {
    const {
      paragraphId,
      text,
      from,
      to,
    } = action.payload

    const body = yield post(`/api/suggestions/`, {
      paragraphId,
      text,
      from,
      to,
    })

    const data = {
      paragraphId: body.paragraphId,
      itemsById: body.itemsById,
    }

    yield put({type: CREATE_OK, payload: data})
  } catch (err) {
    console.error(err)
    yield put({type: CREATE_FAIL, payload: err.message})
  }
}

function * handleFetch (action) {
  try {
    const {paragraphId} = action.payload
    const body = yield get(`/api/paragraphs/?paragraphId=${paragraphId}`)

    yield put({type: FETCH_OK, payload: body})
  } catch (err) {
    console.error(err)
    yield put({type: FETCH_FAIL, payload: err.message})
  }
}

function getInitialState () {
  return {
    fetching: false,
    paragraphId: null,
    itemsById: {},
    itemsList: [],
    error: '',
  }
}

function reducer (state = getInitialState(), action) {
  if (action.type === FETCH || action.type === CREATE) {
    return {
      ...state,
      fetching: true,
      paragraphId: action.payload.paragraphId,
      error: '',
    }
  }

  if (action.type === FETCH_OK || action.type === CREATE_OK) {
    const {itemsById} = action.payload
    const itemsList = _.values(itemsById)
    return {
      ...state,
      itemsById: itemsById,
      itemsList: itemsList,
      fetching: false,
      paragraphId: action.payload.paragraphId,
      error: '',
    }
  }

  if (action.type === FETCH_FAIL || action.type === FETCH_FAIL) {
    return {
      ...state,
      fetching: false,
      paragraphId: action.payload.paragraphId,
      error: action.payload,
    }
  }

  return state
}

export default {
  main,
  reducer,
  actions: {
    create,
    fetch,
  },
}
