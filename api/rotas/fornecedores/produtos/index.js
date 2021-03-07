const roteador = require('express').Router({ mergeParams: true }) // faz com que o parametros do Router pai sejam visiveis pelo Route filho
const Produto = require('./Produto')
const Tabela = require('./TabelaProduto')

roteador.get('/', async (req, res) => {
	const { idFornecedor } = req.params
	const produtos = await Tabela.listar(idFornecedor)
	res.send(
		JSON.stringify(produtos)
	)
})

roteador.post('/', async (req, res) => {
	const { idFornecedor } = req.params
	const { body } = req
	const dados = Object.assign({}, body, { fornecedor: idFornecedor })
	const produto = new Produto(dados)
	await produto.criar()
	res.status(201).send(produto)
})

module.exports = roteador