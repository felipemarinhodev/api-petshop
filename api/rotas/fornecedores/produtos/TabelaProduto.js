const instancia = require('../../../banco-dados')
const NaoEncontrado = require('../../../erros/NaoEncontrado')
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
			throw new NaoEncontrado('Produto')
		}

		return encontrado
	},
	atualizar (dadosDoProduto, dadosParaAtualizar) {
		return Modelo.update(
			dadosParaAtualizar,
			{
				where: dadosDoProduto
			}
		)
	},
	subtrair (idProduto, idFornecedor, campo, quantidade) {
		return instancia.transaction(async transacao => {
			const produto = await Modelo.findOne({
				where: {
					id: idProduto,
					fornecedor: idFornecedor
				}
			})

			produto[campo] = quantidade
			await produto.save()
			return produto
		})
	}
}