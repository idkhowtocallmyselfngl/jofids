const {JsonDatabase} = require('wio.db')

const general = new JsonDatabase({
  databasePath: './src/wiodb/config.json'
})
const resgate = new JsonDatabase({
  databasePath: './src/wiodb/resgates.json'
})

module.exports = {
  general,
  resgate
}