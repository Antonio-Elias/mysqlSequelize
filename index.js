/*Separar as rotas, usar a abastração pra acesso ao banco e controle de senhas, implantar sessões e tambem o controle de formularios*/

// Importação dos modulos de funcionamento do sistema
const express = require('express');
const exphbs = require('express-handlebars');
const conn = require('./db/conn')

// importando os models
const User = require('./model/User');
const Address = require('./model/address');

// configuração do server
const app = express();
const port = 3000;


// configuração da engine das views
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// configuração do arquivo staticos
app.use(express.static('public'));



//Para pegar o body da requisição
app.use(
    express.urlencoded({
        extended: true
    })
);
// usar o corpo do body como json
app.use(express.json());


//bunscando todos os dados com o sequeliza
app.get('/', async (req, res) => {
    const users = await User.findAll({ raw: true });
    res.render('home', { users: users });
});

app.get('/users/create', (req, res) => {
    res.render('adduser');
});


//inserindo dados com o sequelize
app.post('/users/create', async (req, res) => {
    const name = req.body.name;
    const occupation = req.body.occupation;
    let newsletter = req.body.newsletter;
    ''
    if (newsletter === 'on') {
        newsletter = true;
    } else {
        newsletter = false;
    }

    console.log(req.body)

    const user =  {
        name, 
        occupation,
        newsletter
    };

    await User.create(user);

    res.redirect('/');
});

//Filtrando dados com o findOne ele ira passar os parâmetros para o where
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    // o raw como tru nos traz o array de objetos somente com as informações em forma do objeto que percistimos, e não com inf a mais
    const user = await User.findOne({ raw: true, where: { id: id } });

    console.log(user);

    res.render('userview', { user })

});

//Deletando registros.
app.post('/users/delete/:id', async (req, res) => {
    const id = req.params.id;

    await User.destroy({ where: { id: id } });
    res.redirect('/')
});


// Edição de dados em duas etapas primeito com o find e depois com o update
app.get('/users/edit/:id', async (req, res) => {
    const id = req.params.id;

    try { // aqui o includes seria como uma sub tabela ou o Join porem retornoos dados em um array separado no retorno
        const user = await User.findOne({ include: Address, where: { id: id } });

        console.log(user);
        // aqui usamos o user.ger para poder ter acesso a tabela de address que estão vinculados ao usuario
        res.render('useredit', { user: user.get({ plain: true }) });
    } catch (error) {
        console.log(error);
    }
});

app.post('/user/update', async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const occupation = req.body.occupation;
    let newsletter = req.body.newsletter;

    if (newsletter === 'on') {
        newsletter = true;
    } else {
        newsletter = false;
    }

    const userData = {
        id,
        name,
        occupation,
        newsletter
    }
    await User.update(userData, { where: { id: id } });

    res.redirect('/');
});

// adicionando um endereço
app.post('/address/create', async (req, res) => {
    const UserId = req.body.UserId;
    const street = req.body.street;
    const number = req.body.number;
    const city = req.body.city;

    console.log(req.body);

    // montamos um objeto para facilitar a persistencia dos dados, um detalhe pode ser classes separadas
    const address = {
        UserId,
        street,
        number,
        city
    };

    await Address.create(address);

    res.redirect(`/users/edit/${UserId}`);
});

app.post('/address/delete',  async (req, res)=>{
    const UserId = req.body.UserId;
    const id = req.body.id;
        
    Address.destroy({
        where: { id:id },
    });

    res.redirect(`/users/edit/${UserId}`);

})



// alteramos a forma de conexão para primeiramento o sequelize validar as tabelas e criar as mesmas, para depois subir a aplicação com as
// tabelas e dependencias criadas normalente.
conn.sync()
    //conn.sync({force: true})
    .then(() => {
        app.listen(port, () => {
            console.log(`A aplicação esta rodando: http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });



