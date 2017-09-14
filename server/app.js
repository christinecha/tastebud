const express = require('express')
const path = require('path')
const app = express()

const PUBLIC_DIRECTORY = path.join(__dirname, '../public')
const HTML = path.join(__dirname, '../public/index.html')

app.set('port', process.env.PORT || 3000)
app.use(express.static(PUBLIC_DIRECTORY))

app.get('*', (req, res) => {
  res.sendFile(HTML)
})

app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'))
})
