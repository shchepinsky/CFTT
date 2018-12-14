const Sequelize = require('sequelize')

let sequelize

sequelize = new Sequelize('ciklumtest', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  operatorsAliases: false,
})

sequelize.sync({
  // force: true
})

const Article = require('./models/Article')(sequelize, Sequelize)
const Paragraph = require('./models/Paragraph')(sequelize, Sequelize, Article)
const Suggestion = require('./models/Suggestion')(sequelize, Sequelize, Paragraph)

module.exports = {
  sequelize,
  models: {
    Article,
    Paragraph,
    Suggestion,
  },
}
