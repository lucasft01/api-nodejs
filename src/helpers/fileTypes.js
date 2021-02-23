const filtros = {
  logo: {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
  },
  menuImg: {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
  },
  promotionImg: {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
  }
}

const getExtensao = (mimetype) => {
  let cont = false
  let keysFiltros = Object.keys(filtros)
  let extensaoEscolhida = []
  keysFiltros.map(key => {
    if (filtros[key][mimetype] && cont === false) {
      cont = true
      extensaoEscolhida.push(filtros[key][mimetype])
    }
  })

  return extensaoEscolhida[0]
}

const isMimetypePermitido = (tipo, mimetype) => {
  return (filtros[tipo] && filtros[tipo][mimetype])
}

module.exports = { getExtensao, isMimetypePermitido }