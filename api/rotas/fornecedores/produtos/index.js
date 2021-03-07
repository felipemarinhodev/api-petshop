const roteador = require('express').Router({ mergeParams: true }) // faz com que o parametros do Router pai sejam visiveis pelo Route filho
const { SerializadorProduto } = require('../../../Serializador')
const Produto = require('./Produto')
const Tabela = require('./TabelaProduto')

roteador.get('/', async (req, res) => {
	const { idFornecedor } = req.params
	const produtos = await Tabela.listar(Number(idFornecedor))
	const serializador = new SerializadorProduto(
		res.getHeader('Content-Type')
	)
	res.status(200).send(serializador.serializar(produtos))
})

roteador.post('/', async (req, res, proximo) => {
	try {
		const { idFornecedor } = req.params
		const { body } = req
		const dados = Object.assign({}, body, { fornecedor: Number(idFornecedor) })
		const produto = new Produto(dados)
		await produto.criar()
		const serializador = new SerializadorProduto(
			res.getHeader('Content-Type')
		)
		res.status(201).send(serializador.serializar(produto))
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

roteador.get('/:id', async (req, res, proximo) => {
	try {
		const { id, idFornecedor } = req.params
		const dados = {
			id,
			fornecedor: idFornecedor
		}
		const produto = new Produto(dados)
		await produto.carregar()
		const serializador = new SerializadorProduto(
			res.getHeader('Content-Type'),
			['preco', 'quantidade', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
		)
		res.status(200).send(serializador.serializar(produto))
	} catch (erro) {
		proximo(erro)
	}
})

module.exports = roteador
