const {models} = require('../database')
const {makeItemsById, send500, send400} = require('../utils')

// make new suggestion
async function post (req, res) {
  try {
    const {paragraphId, from, to, text} = req.body
    if (typeof from !== 'number' || typeof to !== 'number' || from >= to) {
      return send400(res, `range invalid: from=${from} to=${to}`)
    }

    if (!paragraphId || typeof paragraphId !== 'number') {
      return send400(res, `paragraphId must be number but got ${paragraphId}`)
    }

    const suggestion = await models.Suggestion.create({
      paragraphId,
      text,
      from,
      to,
    })

    const itemsById = makeItemsById([suggestion])

    res.send({itemsById})
  } catch (err) {
    send500(res, err)
  }
}

async function getSuggestionsForArticleId (articleId) {
  return models.Suggestion.findAll({
    where: {
      '$Paragraph.articleId$': articleId,
    },
    include: [
      {
        model: models.Paragraph,
        required: false,
      }],
  })
}

async function getSuggestionsForParagraphId (paragraphId) {
  return models.Suggestion.findAll({
    where: {
      paragraphId: paragraphId,
    },
  })
}

// return all suggestions
async function get (req, res) {
  try {
    if (req.query.articleId) {
      const articleId = Number(req.query.articleId)
      if (isNaN(articleId)) {
        return send400(res, 'articleId must be a number')
      }

      const itemsList = await getSuggestionsForArticleId(articleId)
      const itemsById = makeItemsById(itemsList)

      res.send({
        itemsById,
      })
    }

    if (req.query.paragraphId) {
      const paragraphId = Number(req.query.paragraphId)
      if (isNaN(paragraphId)) {
        return send400(res, 'paragraphId must be a number')
      }

      const itemsList = await getSuggestionsForParagraphId(paragraphId)
      const itemsById = makeItemsById(itemsList)

      res.send({
        itemsById,
      })
    }
  } catch (err) {
    return send500(res, err)
  }
}

async function getById (req, res) {
  const {id} = req.params
  const item = await models.Suggestion.findOne({
    where: {id},
  })

  const itemsById = makeItemsById([item])

  res.send({
    itemsById,
  })
}

//
// async function del (req, res) {
//   const {url} = req.query
//   if (!url) {
//     res.status(400)
//     res.send('url filter required')
//   }
//
//   const id = await models.Suggestion.destroy({
//     where: {url},
//   })
//
//   res.send({
//     rows: [id],
//   })
// }

// async function del_id (req, res) {
//   const {id} = req.params
//   const row = await models.Article.destroy({
//     where: {id},
//   })
//
//   res.send({
//     rows: [row],
//   })
// }

module.exports = {
  get,
  // getById,
  // del,
  // del_id,
  post,
}
