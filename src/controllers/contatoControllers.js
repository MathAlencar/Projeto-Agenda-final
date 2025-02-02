const RegisterContato = require('../model/ContatoModel')

exports.contato = ( req, res) => {
    res.render('contato', {contato: {}, formData: {}})
}

exports.register = async ( req, res) => {
    const cadastro = new RegisterContato(req.body)

    try{
        await cadastro.register()

        if(cadastro.errors.length > 0){
            req.flash('errors', cadastro.errors)

            req.session.save(function(){
                return res.render('contato', {
                    formData: req.body,
                    contato: {},
                    errors: cadastro.errors
                })
            })

            return
        }

        req.flash('success', 'Usuário cadastrado com sucesso.')
        req.session.save(function(){
            return res.redirect(`/contato/index/${cadastro.contato._id}`) // Aqui você está pegando o ID registrado no banco de dados e exibindo na URL.
        })
    }catch(e){
        console.log(e)
        res.render('404')
    }
}

exports.editContato = async function(req, res){
    if(!req.params.id) return res.render('404')
    const contato = await RegisterContato.SearchUser(req.params.id) // Aqui você está realizando uma pesquisa de acordo com o parâmetro da url.
    if(!contato) return res.render('404')
    res.render('contato', {contato})
}

exports.edit = async function(req, res) {
    try{
        if(!req.params.id) return res.render('404')
            const contato = new RegisterContato(req.body)
            await contato.Edit(req.params.id)

            console.log(contato)

            if(contato.errors.length > 0){
                req.flash('errors', contato.errors)
        
                req.session.save(function(){
                    return res.redirect('back')
                })
                return
            }
            
            console.log(contato.contato._id)

            req.flash('success', 'Contato editado com sucesso!')
            req.session.save(function(){
                res.redirect(`/contato/index/${contato.contato._id}`) // Aqui você está pegando o ID registrado no banco de dados e exibindo na URL.
            })
        }catch(e){
            console.log(e)
            return res.render('404')
        }
}

exports.delete = async function(req, res){
    if(!req.params.id) return res.render('404')

    try{
        await RegisterContato.DeleteUser(req.params.id)

        req.flash('success', 'Usuário deletado com sucesso!')
        req.session.save(function(){
            return res.redirect('back')
        })
        return 

    }catch(e){
        console.log(e)
        res.render('404')
    }
}