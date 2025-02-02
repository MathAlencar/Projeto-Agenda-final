const mongoose = require('mongoose')
const validator = require('validator') // Realizar a validação do e-mail do usuário.
const bcryptjs = require('bcryptjs') // Iremos usar para fazer o hash da senha do usuário.

// Criando o Schema que irá ser enviado para o banco de dados.
const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const LoginModel = mongoose.model('Login', LoginSchema) // Função que será usada para enviar os dados do usuário para o banco de dados.

class Login {
    constructor(body){
        this.body = body
        this.errors = []
        this.users = null
    }

    // Sempre que for trabalhar com base de dados crie um método e trabalhe com promisses.
    async register(){
        this.valida() // Aqui ele irá realizar as validações.
        if(this.errors.length > 0) return // Se ao menos tiver um erro, ele já irá fazer o retorno.
        
        await this.userExist();

        if(this.errors.length > 0) return // Agora você está verificando se existe o usuário com o erro.
       
        // Caso contrário ele irá realizar a criação do usuário no banco de dados, a variável
        // this.users, você irá usar para exibir para o usuario, por conta de LoginModel.create ser uma promise, você deve então usar o await.
        const salt = bcryptjs.genSaltSync() // Criando um salt, que irá ser gerado a cada usuário.
        this.body.password = bcryptjs.hashSync(this.body.password, salt); // escrevendo o hash da minha senha.
        this.users = await LoginModel.create(this.body)
    }

    async userExist(){
        const exist = await LoginModel.findOne({email: this.body.email}) // Aqui você está verificando se encontra na base de dados um e-mail semelhante ao que usuário informou.
        if(exist) this.errors.push('usuário já cadastrado em nosso sistema.')
    }

    async login(){
        this.valida()
        if(this.errors.length > 0) return
        this.user = await LoginModel.findOne({email: this.body.email}) // Aqui você está verificando se encontra na base de dados um e-mail semelhante ao que usuário informou.
        if(!this.user) this.errors.push('Usuário ou senha inválida.')
        if(this.errors.length > 0) return
        if(!bcryptjs.compareSync(this.body.password, this.user.password)) this.errors.push('Usuário não encontrado.')
        if(this.errors.length > 0) return
        // Primeiro você para a senha que o usuário enviou, e no segundo a senha armazenada no banco de dados.
    }

    valida(){
        this.cleanUp() // Transformando o body em um obj válido pro db.
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido') // Aqui você está validando o e-mail com a biblioteca validator.
        if(this.body.password.length < 3 ) this.errors.push('A senha precisa ter no mínimo 3 caracter') // Aqui você está validando a senha.
        // note que em caso de o e-mail ou a senha não atenderem as condições, ele adiciona uma mensagem de erro no array this.errors()
    }

    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password,
        }
    }
}

// const ado = new RegisterContato('oi')
// ado

module.exports = Login
