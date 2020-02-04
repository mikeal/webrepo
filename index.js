const CID = require('cids')
const Block = require('@ipld/block')

const maybeCID = cid => {
  if (CID.isCID(cid)) return cid
  try {
    return new CID(cid)
  } catch (e) {
    return false
  }
}

const parsePath = str => {
  const i = str.indexOf('/')
  return [str.slice(0, i), str.slice(i + 1)]
}

const selectorEngine = async selector => {

}

class WebRepo {
  constructor (blockStore, nameStore, opts) {
    this.blockStore = blockStore
    this.nameStore = nameStore
    this.opts = opts
  }

  async tag (name, cid) {
    if (Block.isBlock(cid)) cid = await cid.cid()
    if (!CID.isCID(cid)) cid = new CID(cid)
    return this.nameStore.set(name, cid)
  }

  async _resolve (name) {
    let cid = maybeCID(name)
    if (!cid) {
      cid = await this.nameStore.get(name)
    }
  }

  async get (path) {
    const [name, selector] = parsePath(path)
    const cid = await this._resolve(name)
    return selectorEngine(cid, selector, this.blockStore)
  }
}

module.exports = (...args) => new WebRepo(...args)
