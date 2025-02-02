exports.padrao = (req, res, next) => {
    res.locals.titulo = 'Estou sendo renderizado'
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    res.locals.formData = {}
    next()
}

exports.checkcrufs = (err, req, res, next) => {
    // if(err && err.code == 'EBADCSRFTOKEN'){
    //     res.render('404')
    // }
    if(err){
        res.render('404')
    }
}

exports.validate = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next()
}

// Irá proteger a rota, onde ela será acessada somente se caso tiver o req.session.user preenchido.
exports.logado = (req, res, next) => {
    if(req.session.user) next()
    else{
        res.render('login')
    }
}