const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    titulo: {type: String, required: true}
})

const HomeModel = mongoose.model('home', schema)

module.exports = HomeModel

