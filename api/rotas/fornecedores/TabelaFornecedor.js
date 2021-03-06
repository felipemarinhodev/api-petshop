const NaoEncontrado = require('../../erros/NaoEncontrado')
const Modelo = require('./ModeloTabelaFornecedor')

module.exports = {
	listar () {
		return Modelo.findAll({ raw: true })
	},
	inserir (fornecedor) {
		return Modelo.create(fornecedor)
	},
	async buscarPorId(id) {
		const encontrado = await Modelo.findOne({ where: { id }	})
		if (!encontrado) {
			throw new NaoEncontrado('Fornecedor')
		}
		return encontrado
	},
	atualizar (id, dadosParaAtualizar) {
		return Modelo.update(	dadosParaAtualizar, { where: { id }} )
	},
	remover (id){
		return Modelo.destroy({ where: { id }} )
	}
}