const Sequelize = require('sequelize')
const config = require('config')

const instancia = new Sequelize(
	config.get('postgres.banco-dados'),
	config.get('postgres.usuario'),
	config.get('postgres.senha'),
	{
		host: config.get('postgres.host'),
		dialect: 'postgres',
		quoteIdentifiers: false,
		operatorsAliases: false,
	}
)



module.exports = instancia