const Modelo = require('./ModeloTabelaProduto')

module.exports = {
	listar (idFornecedor) {
		return Modelo.findAll({
			where: { fornecedor: idFornecedor },
			raw: true
		})		
	},
	inserir (dados) {
		return Modelo.create(dados)
	},
	remover (id, fornecedor) {
		return Modelo.destroy({
			where: { id, fornecedor	}
		})
	},
	async pegarPorId(id, fornecedor) {
		const encontrado = await Modelo.findOne({
			where: { id, fornecedor	},
			raw: true
		})

		if (!encontrado) {
			throw new Error('Produto não foi encontrado!')
		}

		return encontrado
	}
}