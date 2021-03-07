const Modelo = require('./ModeloTabelaProduto')

module.exports = {
	listar (idFornecedor) {
		return Modelo.findAll({
			where: { fornecedor: idFornecedor }
		})		
	},
	inserir (dados) {
		return Modelo.create(dados)
	},
	remover (id, fornecedor) {
		return Modelo.destroy({
			where: { id, fornecedor	}
		})
	}
}