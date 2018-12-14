import Reactotron from 'reactotron-react-js'
import { reactotronRedux } from 'reactotron-redux'

const USE_REACTOTRON = true

function getReactotron () {
  const reduxPlugin = reactotronRedux()
  const reactotron = Reactotron
    .use(reduxPlugin)
    .connect()

  reactotron.clear()

  return reactotron
}

export const reactotron = USE_REACTOTRON
  ? getReactotron()
  : null
