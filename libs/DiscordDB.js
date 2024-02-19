import configJson from '../config.json' assert {type: 'json'}
const { cryptoBKey = "", guildId, adminId, messageId = "" } = configJson
import fs from 'fs'
import CryptoB from './CryptoB.cjs'

export default class DiscordDB {
  static ddb
  #client
  #message
  #cb
  #db = {}

  constructor(client) {
    this.#client = client
    DiscordDB.ddb = this
  }

  async init() {
    if (!cryptoBKey) {
      const newRawKey = CryptoB.generateRawKey()
      await this.#updateConfig('cryptoBKey', newRawKey)
      this.#cb = new CryptoB(newRawKey)
    } else {
      this.#cb = new CryptoB(cryptoBKey)
    }
    const admin = await this.#client.guilds.cache.get(guildId).members.fetch(adminId)
    const dm = await admin.createDM()
    if (!messageId) {
      const content = this.#encode()
      this.#message = await dm.send(content)
      await this.#updateConfig('messageId', this.#message.id)
      return
    }
    this.#message = await dm.messages.fetch(messageId)
    const ct = this.#message.content.match(/^```\n(.+)\n```$/)[1]
    try {
      const json = this.#cb.decryptB(ct)
      this.#db = JSON.parse(json)
    } catch (err) {
      console.error(err)
      this.#db = {}
    }
  }

  async #updateConfig(key, val) {
    const fileName = './config.json'
    const config = configJson
    config[key] = val
    fs.writeFile(fileName, JSON.stringify(config, null, 2) + '\n', function writeJSON(err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(config));
      console.log(`Updating config with new ${key}=${val}:`, fileName);
    });
  }

  #encode() {
    const content = '```\n' + this.#cb.encryptB(JSON.stringify(this.#db)) + '\n```'
    return content
  }

  async update() {
    const content = this.#encode()
    await this.#message.edit(content)
  }

  get(id) {
    return this.#db[id]
  }

  set(id, val) {
    this.#db[id] = val
  }

  del(id) {
    delete this.#db[id]
  }

  has(id) {
    return (id in this.#db)
  }

  reset() {
    this.#db = {}
  }

  get _json() {
    return JSON.stringify(this.#db)
  }
}
