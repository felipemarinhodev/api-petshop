const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

roteador.get('/', async (req, res) => {
	const resultados = await TabelaFornecedor.listar()
	res.status(200).send(JSON.stringify(resultados))
})

roteador.post('/', async (req, res, proximo) => {
	try {
		const dadosRecebidos = req.body
		const fornecedor = new Fornecedor(dadosRecebidos)
		await fornecedor.criar()
		res.status(201).send(JSON.stringify(fornecedor))
	} catch (erro) {
		proximo(erro)
	}
})

roteador.get('/:id', async (req, res, proximo) => {
	try {
		const { id } = req.params
		const fornecedor = new Fornecedor({ id })
		await fornecedor.carregar()
		res.send(JSON.stringify(fornecedor))
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
		res.status(200).send(JSON.stringify(fornecedor))
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

module.exports = roteador