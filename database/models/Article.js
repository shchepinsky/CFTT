module.exports = (sequelize, types) => {
  return sequelize.define('article', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: types.STRING,
  })
}

