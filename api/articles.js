const {sequelize, models} = require('../database')
const {makeItemsById, send404, send500} = require('../utils')

// return all articles
async function get (req, res) {
  try {
    // need to get suggestion count
    const itemsList = await models.Article.findAll({
      attributes: [
        'id',
        [sequelize.col('paragraphs.text'), 'text'],
      ],
      include: [
        {
          // FIXME: still dit not figured out how to count from indirectly associated table
          model: models.Paragraph,
          // attributes: [
          //   [sequelize.col('suggestions.id'), 's_id'],
          // ],
          include: [
            {
              model: models.Suggestion,
            },
          ],
        },
      ],

      group: ['article.id', 'paragraphs.id', 'paragraphs->suggestions.id'],
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
  try {
    const {id} = req.params
    const item = await models.Article.findOne({
      where: {id},
    })

    if (!item) {
      return send404(res)
    }

    const itemsById = makeItemsById([item])

    res.send({
      itemsById,
    })
  } catch (err) {
    send500(res, err)
  }
}

async function del (req, res) {
  const {url} = req.query
  if (!url) {
    res.status(400)
    res.send('url filter required')
  }

  const id = await models.Article.destroy({
    where: {url},
  })

  res.send({
    rows: [id],
  })
}

async function delById (req, res) {
  const {id} = req.params
  const row = await models.Article.destroy({
    where: {id},
  })

  res.send({
    rows: [row],
  })
}

module.exports = {
  get,
  getById,
  del,
  delById,
}
