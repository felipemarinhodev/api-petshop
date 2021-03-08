const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const { formatosAceitos, SerializadorErro } = require('./Serializador')
const app = express()

app.use(bodyParser.json())


app.use((req, res, proximo) => {
	let formatoRequisitado = req.header('Accept')

	if ( formatoRequisitado === '*/*' ) {
		formatoRequisitado = 'application/json'
	}

	if (formatosAceitos.indexOf(formatoRequisitado) === -1 ) {
		res.status(406).end()
		return
	}

	res.setHeader('Content-Type', formatoRequisitado)
	proximo()
})

app.use((req, res, proximo) => {
	res.set('X-Powered-By', 'api-petshop')
	res.set('Access-Control-Allow-Origin', '*')
	proximo()
})

app.use('/api/fornecedores', roteador)

// Middleware que controla os erros da API
app.use((erro, req, res, proximo) => {
	let status = 500
	if (erro instanceof NaoEncontrado) {
		status = 404
	} 
	if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
		status = 400
	}
	if (erro instanceof ValorNaoSuportado) {
		status = 406
	}
	const serializador = new SerializadorErro(res.getHeader('Content-Type'))
	res.status(status)
			.send(serializador.serializar({
				mensagem: erro.message,
				id: erro.idErro
			}))
})

app.listen(config.get('api.porta'), () => console.log('A API está funcionando!'));