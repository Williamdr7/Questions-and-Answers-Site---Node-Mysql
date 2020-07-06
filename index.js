const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const Pergunta = require("./database/Pergunta")

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
    Pergunta.findAll({ raw: true }).then(perguntas => {
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

app.listen(3001, () => {
    console.log("Servidor Rodando")
});