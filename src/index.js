const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { config } = require("dotenv")
const routes = require("./routes")

config()
require('./config')

const hostname = process.env.NODE_ENV !== 'production' ? '0.0.0.0' : "localhost"

const port = 3001

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/", routes)

app.listen(port, hostname, async () => {
	console.log(`Api rodando em ${hostname}:${port}`)
})
