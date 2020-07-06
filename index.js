const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

//Configurando o EJS
app.set("view engine", "ejs");
app.use(express.static("public"));

//Configurando Body-Parser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Configurando Mysql 
const connection = require("./database/database")

connection.authenticate().then(() => {
    console.log("Conexão Feita")
}).catch((erro) => {
    console.log("Erro" + erro)
})

//ROTAS

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.get("/", (req, res) => {
    Pergunta.findAll({
        raw: true,
        order: [
            ['id', "DESC"]
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        })
    })
})

app.post("/perguntar", (req, res) => {
    var titulo = req.body.titulo
    var pergunta = req.body.pergunta

    Pergunta.create({
        titulo: titulo,
        pergunta: pergunta
    }).then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req, res) => {
    var iduser = req.params.id
    Pergunta.findOne({
        where: { id: iduser }
    }).then((pagina) => {
        if (pagina != undefined) {

            Resposta.findAll({
                where: { pergunta_id: pagina.id }
            }).then(respostas => {
                res.render('pergunta', {
                    pagina: pagina,
                    respostas: respostas
                })

            })
        } else {
            res.redirect("/")
        }
    })
})

app.post("/resposta", (req, res) => {
    const corpo = req.body.corpo
    const pergunta_id = req.body.pergunta_id

    Resposta.create({
        corpo: corpo,
        pergunta_id: pergunta_id
    }).then(() => {
        res.redirect('/pergunta/' + pergunta_id)
    })
})


app.listen(3001, () => {
    console.log("Servidor Rodando")
});