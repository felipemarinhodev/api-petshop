const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const app = express()

app.use(bodyParser.json())

app.use('/api/fornecedores', roteador)

// Middleware que controla os erros da API
app.use((erro, req, res, proximo) => {
	if (erro instanceof NaoEncontrado) {
		res.status(404)
	} else {
		res.status(400)
	}
	res.send(JSON.stringify({ mensagem: erro.message, id: erro.idErro }))
})

app.listen(config.get('api.porta'), () => console.log('A API está funcionando!'));