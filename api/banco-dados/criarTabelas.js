const ModeloTabela = require('../rotas/fornecedores/ModeloTabelaFornecedor')

ModeloTabela
	.sync()
	.then(() => console.log('Tabela criada com sucesso'))
	.catch(() => console.log('Aconteceu um erro ao criar a tabela'))