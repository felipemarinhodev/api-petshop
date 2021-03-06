const Sequelize = require('sequelize')
const instancia = require('../../../banco-dados')

const colunas = {
	titulo: {
		type: Sequelize.STRING,
		alloNull: false
	},
	preco: {
		type: Sequelize.DOUBLE,
		alloNull: false
	},
	quantidade: {
		type: Sequelize.INTEGER,
		alloNull: false,
		defaultValue: 0
	},
	fornecedor: {
		type: Sequelize.INTEGER,
		alloNull: false,
		references: {
			model: require('../ModeloTabelaFornecedor'),
			key: 'id'
		}
	}
}

const opcoes = {
	freezeTableName: true,
	tableName: 'produtos',
	timestamps: true,
	createdAt: 'dataCriacao',
	updatedAt: 'dataAtualizacao',
	version: 'versao'
}

module.exports = instancia.define('produtos', colunas, opcoes)