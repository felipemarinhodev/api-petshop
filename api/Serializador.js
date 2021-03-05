const ValorNaoSuportado = require("./erros/ValorNaoSuportado")

class Serializador {
	json (dados) {
		return JSON.stringify(dados)
	}

	serializar (dados) {
		if (this.contentType === 'application/json') {
			return this.json(dados)
		}
		throw new ValorNaoSuportado(this.contentType)
	}
}

class SerializadorFornecedor extends Serializador {
	constructor(contentType, camposExtras) {
		super()
		this.contentType = contentType
		this.camposParaMostrar = ['id', 'empresa', 'categoria'].concat(camposExtras || [])
	}

	serializar (dados) {
		if (this.contentType === 'application/json') {
			return this.json(this.filtrar(dados))
		}
		throw new ValorNaoSuportado(this.contentType)
	}

	filtrarObjeto (dados) {
		const novoObjeto = {}

		this.camposParaMostrar.forEach(campo => {
			if (dados.hasOwnProperty(campo)) {
				novoObjeto[campo] = dados[campo]
			}
		})
		return novoObjeto
	}

	filtrar (dados) {
		if (Array.isArray(dados)) {
			dados = dados.map(item => this.filtrarObjeto(item))
		} else {
			dados = this.filtrarObjeto(dados)
		}
		return dados
	}
}

class SerializadorErro extends Serializador {
	constructor(contentType, camposExtras) {
		super()
		this.contentType = contentType
		this.camposParaMostrar = ['id', 'mensagem'].concat(camposExtras || [])
	}
}

module.exports = {
	Serializador,
	SerializadorErro,
	SerializadorFornecedor,
	formatosAceitos: ['application/json', '*/*']
}