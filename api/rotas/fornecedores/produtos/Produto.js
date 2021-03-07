const CampoInvalido = require('../../../erros/CampoInvalido')
const Tabela = require('./TabelaProduto')

class Produto {
	constructor ({
		id,
		titulo,
		preco,
		quantidade,
		fornecedor,
		dataCriacao,
		dataAtualizacao,
		versao
	}) {
		this.id = id
		this.titulo = titulo
		this.preco = preco
		this.quantidade = quantidade
		this.fornecedor = fornecedor
		this.dataCriacao = dataCriacao
		this.dataAtualizacao = dataAtualizacao
		this.versao = versao
	}

	validar () {
		if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
			throw new CampoInvalido('titulo')
		}
		if (typeof this.preco !== 'number' || this.preco === 0) {
			throw new CampoInvalido('preço')
		}
	}

	async criar () {
		this.validar()
		const resultado = await Tabela.inserir({
			titulo: this.titulo,
			preco: this.preco,
			quantidade: this.quantidade,
			fornecedor: this.fornecedor
		})
		this.id = resultado.id
		this.dataCriacao = resultado.dataCriacao
		this.dataAtualizacao = resultado.dataAtualizacao
		this.versao = resultado.versao
	}

	async apagar () {
		return await Tabela.remover(this.id, this.fornecedor)
	}

	async carregar () {
		const produto = await Tabela.pegarPorId(this.id, this.fornecedor)
		this.titulo = produto.titulo
		this.preco = produto.preco
		this.quantidade = produto.quantidade
		this.dataCriacao = produto.dataCriacao
		this.dataAtualizacao = produto.dataAtualizacao
		this.versao = produto.versao
	}
}

module.exports = Produto
