module.exports = (sequelize, types, Article) => {
  const Paragraph = sequelize.define('paragraph', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: types.TEXT,
  })

  Article.hasMany(Paragraph)
  Paragraph.belongsTo(Article, {
    onDelete: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  })
  return Paragraph
}


