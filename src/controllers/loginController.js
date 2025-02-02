const Login = require('../model/LoginModel')

exports.loginPage = (req, res) => {
    if(req.session.user) return res.render('usuario_logado')
        else{
            return res.render('login')
    }
}

exports.register = async (req, res) => {
    const register = new Login(req.body)

    try {
        await register.register()

        if(register.errors.length > 0){
            req.flash('errors', register.errors)
            // retornando a página, caso de algum erro.
            // Salvando a sessão.
            req.session.save(function() {
                // Agora que a sessão está salva, você irá redirecionar ela para o back, ou seja para a sessão anteriro a que foi salva.
                return res.redirect('/login/index')
            })
            return;
        }
        
        req.flash('success', 'Usuário criado com sucesso!')
        req.session.save(function() {
            return res.redirect('/login/index')
        })

    } catch(e){
        console.log(e)
        return res.render('404')
    }
    
}

exports.login = async (req, res) => {
    const login = new Login(req.body)

    try{
        await login.login()

        if(login.errors.length > 0){    
            req.flash('errors', login.errors)

            req.session.save(function(){
                return res.redirect('/login/index')
            })
            return
        }

        req.flash('success', 'Você está logado!')
        req.session.user = login.user; // Aqui vocÇe está criando a sessão que será enviada ao banco de dados.
        req.session.save(function(){
            return res.redirect('/login/index')
        })

    }catch(e){
        console.log(e)
        res.render('404')
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login/index')
}