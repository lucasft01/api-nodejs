const mongoose = require('mongoose')
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env

const uri = process.env.NODE_ENV !== 'production' ? `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}` : `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

mongoose.Promise = global.Promise
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  error => {
    if (error) {
      console.error(error)
    }
  }
)
