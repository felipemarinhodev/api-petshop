const roteador = require('express').Router({ mergeParams: true }) // faz com que o parametros do Router pai sejam visiveis pelo Route filho
const Tabela = require('./TabelaProduto')

roteador.get('/', async (req, res) => {
	const { idFornecedor } = req.params
	const produtos = await Tabela.listar(idFornecedor)
	res.send(
		JSON.stringify(produtos)
	)
})

module.exports = roteador