const roteador = require('express').Router({ mergeParams: true }) // faz com que o parametros do Router pai sejam visiveis pelo Route filho
const Produto = require('./Produto')
const Tabela = require('./TabelaProduto')

roteador.get('/', async (req, res) => {
	const { idFornecedor } = req.params
	const produtos = await Tabela.listar(Number(idFornecedor))
	res.send(
		JSON.stringify(produtos)
	)
})

roteador.post('/', async (req, res, proximo) => {
	try {
		const { idFornecedor } = req.params
		const { body } = req
		const dados = Object.assign({}, body, { fornecedor: Number(idFornecedor) })
		const produto = new Produto(dados)
		await produto.criar()
		res.status(201).send(produto)
	} catch (erro) {
		proximo(erro)
	}
})

roteador.delete('/:id', async (req, res) => {
	const { idFornecedor, id } = req.params
	const produto = new Produto({ id, fornecedor: Number(idFornecedor) })
	await produto.apagar()
	res.status(204).send()
})




module.exports = roteador