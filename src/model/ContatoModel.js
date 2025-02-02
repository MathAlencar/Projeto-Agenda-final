const mongoose = require('mongoose')
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sobrenome: {type: String, required: true},
    email: {type: String, required: true},
    telefone: {type: String, required: true},
    data: {type: Date, default: Date.now}
})

const ContatoModel = mongoose.model('Contatos', ContatoSchema)

class Contato {
    constructor(body){
        this.body = body
        this.errors = []
        this.contato = null
    }

    async register(){
        this.Valida()
        if(this.errors.length > 0) return
        await this.Exists()
        if(this.errors.length > 0) return
        // Castratando contato.
        this.contato = await ContatoModel.create(this.body)
    }

    Valida(){
        this.CleanUp()
        if(!this.body.nome) this.errors.push('O nome é um campo obrigatório.')
        if(!validator.isEmail(this.body.email)) this.errors.push('Por favor, informe um e-mail válido.')
        if(!validator.isMobilePhone(this.body.telefone, 'pt-BR')) this.errors.push('Número inválido')
    }

    async Exists(){
        const exits = await ContatoModel.findOne({email: this.body.email})
        const exitsTel = await ContatoModel.findOne({telefone: this.body.telefone})
        if(exits) this.errors.push('Contato com este e-mail já foi cadastrado!')
        if(exitsTel) this.errors.push('Contato com este número já foi cadastrado!')
    }

    CleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
        }
    }

    static async SearchUser(id){
        if(typeof id !== 'string') return
        const find_user = await ContatoModel.findById(id)
        return find_user
    }

    async Edit(id){
        if(typeof id !== 'string') return 
        this.Valida()
        if(this.errors.length > 0) return
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true});
    }

    static async BuscaContatos(){
        const contatos = await ContatoModel.find()
        .sort({data: -1}) // Aqui você está definindo a ordem em que seus contatos irão vim do banco de dados, sendo decrescente (-1) e crescente (1).
        return contatos
    }

    static async DeleteUser(id){
        const delete_user = await ContatoModel.deleteOne({_id: id})
    }
}

module.exports = Contato