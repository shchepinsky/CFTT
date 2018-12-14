const Sequelize = require('sequelize')
const {sequelize, models} = require('../database')
const {makeItemsById, parseArticleURL, send500, send400} = require('../utils')

// post url for parsing, return article id and paragraphs
async function getArticleParagraphs (url) {
  return sequelize.transaction(async t => {
    const paragraphsList = await parseArticleURL(url)

    await models.Article.destroy({
      where: {
        url: url,
      },
    })

    // chain all your queries here. make sure you return them.
    const article = await models.Article.create({url: url}, {transaction: t})
    const paragraphsData = paragraphsList.map(text => ({
      text: text,
      articleId: article.id,
    }))

    const paragraphs = await models.Paragraph.bulkCreate(paragraphsData, {
      transaction: t,
    })

    return {
      articleId: article.id,
      paragraphs: paragraphs,
    }
  })
}

async function parse (req, res) {
  try {
    if (!req.query.url) {
      return send400(res, 'url required')
    }

    const {articleId, paragraphs} = await getArticleParagraphs(req.query.url)
    const itemsById = makeItemsById(paragraphs)

    return res.send({
      articleId,
      itemsById,
    })
  } catch (err) {
    send500(res, err)
  }
}

async function get (req, res) {
  try {
    let where
    if (req.query.articleId) {
      where = {
        articleId: req.query.articleId
      }
    }

    const itemsList = await models.Paragraph.findAll({
      where,
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("suggestions.id")), "suggestionCount"]
        ]
      },
      include: [{
        model: models.Suggestion, attributes: []
      }],
      // singular/plural matters
      group: ['paragraph.id']
    })

    const itemsById = makeItemsById(itemsList)

    res.send({
      itemsById,
    })
  } catch (err) {
    send500(res, err)
  }
}

async function getById (req, res) {
  const {id} = req.params
  const row = await models.Paragraph.findOne({
    where: {id},
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("suggestions.id")), "suggestionCount"]
      ]
    },
    include: [{
      model: models.Suggestion, attributes: []
    }],
    // singular/plural matters
    group: ['paragraph.id']
  })

  res.send({
    rows: [row],
  })
}

module.exports = {
  parse,
  get,
  getById,
}
