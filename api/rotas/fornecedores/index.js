const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const { SerializadorFornecedor } = require('../../Serializador')
const roteadorProdutos = require('./produtos')

roteador.options('/', (req, res) => {
	res.set('Access-Control-Allow-Methods', 'GET, POST')
	res.set('Access-Control-Allow-Headers', 'Content-Type')
	res.status(204).end()
})

roteador.get('/', async (req, res) => {
	const resultados = await TabelaFornecedor.listar()
	const serializador = new SerializadorFornecedor(
		res.getHeader('Content-Type'),
		['empresa']

	)
	res.status(200).send(serializador.serializar(resultados))
})

roteador.post('/', async (req, res, proximo) => {
	try {
		const dadosRecebidos = req.body
		const fornecedor = new Fornecedor(dadosRecebidos)
		await fornecedor.criar()
		const serializador = new SerializadorFornecedor(
			res.getHeader('Content-Type'),
			['empresa']
		)
		res.status(201).send(serializador.serializar(fornecedor))
	} catch (erro) {
		proximo(erro)
	}
})

roteador.options('/:id', (req, res) => {
	res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
	res.set('Access-Control-Allow-Headers', 'Content-Type')
	res.status(204).end()
})

roteador.get('/:id', async (req, res, proximo) => {
	try {
		const { id } = req.params
		const fornecedor = new Fornecedor({ id })
		await fornecedor.carregar()
		const serializador = new SerializadorFornecedor(
			res.getHeader('Content-Type'),
			[ 'empresa', 'email', 'dataCriacao', 'dataAtualizacao',	'versao' ])
		res.send(serializador.serializar(fornecedor))
	} catch (erro) {
		proximo(erro)
	}
})


roteador.put('/:id', async (req, res, proximo) => {
	try {
		const { id } = req.params
		const dadosRecebidos = req.body
		const dados = Object.assign({}, dadosRecebidos, { id })
		const fornecedor = new Fornecedor(dados)
		await fornecedor.atualizar()
		const serializador = new SerializadorFornecedor(
			res.getHeader('Content-Type'),
			['empresa']
		)
		res.status(200).send(serializador.serializar(fornecedor))
	} catch (erro) {
		proximo(erro) // Middleware que responde os erros da API
	}
})

roteador.delete('/:id', async (req, res, proximo) => {
	try {
		const { id } = req.params
		const fornecedor = new Fornecedor({id})
		await fornecedor.remover()
		res.status(204).send()
	} catch (erro) {
		proximo(erro)
	}
})

const verificarFornecedor = async (req, res, proximo) => {
	try {
		const id = req.params.idFornecedor
		const fornecedor = new Fornecedor({id})
		await fornecedor.carregar()
		req.fornecedor = fornecedor
		proximo()
	} catch (error) {
		proximo(error)
	}
}

roteador.use('/:idFornecedor/produtos',verificarFornecedor, roteadorProdutos)

module.exports = roteador