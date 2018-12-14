import React from 'react'
import IconButton from '@material-ui/core/es/IconButton/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import { Link } from 'react-router-dom'
import { Row } from './Layout'
import CardContent from '@material-ui/core/CardContent/CardContent'
import Card from '@material-ui/core/Card/Card'

class ArticleView extends React.Component {
  onClick = () => {

  }

  render () {
    const {article} = this.props

    return (
      <Card>
        <CardContent>
          <Row style={{alignItems: 'center'}}>
            <h3 style={{margin: 8}}>
              {article.suggestionCount}
            </h3>
            <h3 style={{flex: 1}}>
              {article.url}
            </h3>

            <Link to={`/admin/${article.id}/`}>
              <IconButton>
                <EditIcon fontSize="small" />
              </IconButton>
            </Link>
          </Row>
        </CardContent>
      </Card>
    )
  }
}

export default ArticleView
