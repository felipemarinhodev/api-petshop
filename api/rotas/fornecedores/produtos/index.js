const roteador = require('express').Router({ mergeParams: true }) // faz com que o parametros do Router pai sejam visiveis pelo Route filho
const { SerializadorProduto } = require('../../../Serializador')
const Produto = require('./Produto')
const Tabela = require('./TabelaProduto')

roteador.options('/', (req, res) => {
	res.set('Access-Control-Allow-Methods', 'GET, POST')
	res.set('Access-Control-Allow-Headers', 'Content-Type')
	res.status(204).end()
})

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
		res.set('ETag', produto.versao)
		const timestamp = (new Date(produto.dataAtualizacao)).getTime()
		res.set('Last-Modified', timestamp)
		res.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
		res.status(201).send(serializador.serializar(produto))
	} catch (erro) {
		proximo(erro)
	}
})

roteador.options('/:id', (req, res) => {
	res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, HEAD')
	res.set('Access-Control-Allow-Headers', 'Content-Type')
	res.status(204).end()
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
		res.set('ETag', produto.versao)
		const timestamp = (new Date(produto.dataAtualizacao)).getTime()
		res.set('Last-Modified', timestamp)
		res.status(200).send(serializador.serializar(produto))
	} catch (erro) {
		proximo(erro)
	}
})

roteador.head('/:id', async (req, res, proximo) => {
	try {
		const { id, idFornecedor } = req.params
		const dados = {
			id,
			fornecedor: idFornecedor
		}
		const produto = new Produto(dados)
		await produto.carregar()
		res.set('ETag', produto.versao)
		const timestamp = (new Date(produto.dataAtualizacao)).getTime()
		res.set('Last-Modified', timestamp)
		res.status(200).end()
	} catch (erro) {
		proximo(erro)
	}
})

roteador.put('/:id', async (req, res, proximo) => {
	try {
		const { id, idFornecedor } = req.params
		const dados = Object.assign(
			{},
			req.body,
			{ id, fornecedor: idFornecedor }
		)
		const produto = new Produto(dados)
		await produto.atualizar()
		await produto.carregar()
		res.set('ETag', produto.versao)
		const timestamp = (new Date(produto.dataAtualizacao)).getTime()
		res.set('Last-Modified', timestamp)
		const serializador = new SerializadorProduto(
			res.getHeader('Content-Type'),
		)
		res.status(200).send(serializador.serializar(produto))
	} catch (erro) {
		proximo(erro)
	}
})

roteador.options('/:id/diminuir-estoque', (req, res) => {
	res.set('Access-Control-Allow-Methods', 'POST')
	res.set('Access-Control-Allow-Headers', 'Content-Type')
	res.status(204).end()
})
roteador.post('/:id/diminuir-estoque', async (req, res, proximo) => {
	try {
		const produto = new Produto({
			id: req.params.id,
			fornecedor: req.fornecedor.id
		})
		await produto.carregar()
		res.set('ETag', produto.versao)
		const timestamp = (new Date(produto.dataAtualizacao)).getTime()
		res.set('Last-Modified', timestamp)
		const { quantidade } = req.body
		produto.quantidade = produto.quantidade - quantidade
		await produto.diminuirEstoque()
		res.status(204).end()
	} catch (erro) {
		proximo(erro)
	}
})

module.exports = roteador
