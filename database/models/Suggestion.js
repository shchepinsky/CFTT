module.exports = (sequelize, types, Paragraph) => {
  const Suggestion = sequelize.define('suggestion', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    from: types.INTEGER,
    to: types.INTEGER,
    text: types.TEXT,
  })

  Paragraph.hasMany(Suggestion)
  Suggestion.belongsTo(Paragraph, {
    onDelete: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  })
  return Suggestion
}


