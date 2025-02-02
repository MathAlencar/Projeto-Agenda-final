const HomeModel = require('../model/HomeModel')
const Contato = require('../model/ContatoModel')

// HomeModel.create({
//     titulo: 'Matheus Nascimento'
// })
// .then(response => {
//     console.log(response)
// })
// .catch(e => {
//     console.log(e)
// })

exports.index = async (req, res) => {
    const contatos = await Contato.BuscaContatos()
    res.render('index', {contatos})
}
