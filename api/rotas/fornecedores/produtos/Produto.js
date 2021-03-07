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

	async criar () {
		const resultado = await Tabela.inserir({
			titulo: this.titulo,
			preco: this.preco,
			quantidade: this.quantidade,
			fornecedo: this.fornecedor
		})
		this.id = resultado.id
		this.dataCriacao = resultado.dataCriacao
		this.dataAtualizacao = resultado.dataAtualizacao
		this.versao = resultado.versao
	}
}

module.exports = Produto
