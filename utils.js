const {JSDOM} = require('jsdom')

function getNextParagraph (children) {
  const paragraphs = []
  for (let i = 0; i < children.length; i++) {
    const element = children[i]
    if (element.tagName.toLowerCase() === 'p') {
      const text = element.textContent && element.textContent.trim()
      if (text) {
        paragraphs.push(text)
      }
    }

    const childParagraphs = getNextParagraph(element.children)
    paragraphs.push(...childParagraphs)
  }

  return paragraphs
}

async function parseArticleURL (articleURL) {
  const dom = await JSDOM.fromURL(articleURL)

  return getNextParagraph(dom.window.document.body.children)
}

function makeItemsById (itemList = []) {
  const itemsById = {}
  for (const item of itemList) {
    if (item.id) {
      itemsById[item.id] = item
    }
  }

  return itemsById
}

/**
 * Default exception handler
 * @param res {Object}
 * @param err {Error}
 */
function send500(res, err) {
  res.status(500)
  if (process.env.NODE_ENV === 'production') {
    res.send({error: err.message})
  } else {
    res.send({error: err.stack})
  }
}

/**
 * Bad Request default handler
 * @param res {Object}
 * @param msg {String}
 */
function send400(res, msg) {
  res.status(400)
  res.send({error: msg})
}

/**
* Not Found default handler
* @param res {Object}
* @param msg {String}
*/
function send404(res, msg = 'not found') {
  res.status(404)
  res.send({error: msg})
}

module.exports = {
  parseArticleURL,
  makeItemsById,
  send500,
  send400,
  send404,
}
