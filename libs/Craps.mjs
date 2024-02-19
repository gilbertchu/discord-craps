import CrapsPlayer from "./CrapsPlayer.mjs"
import CrapsBets from "./CrapsBets.mjs"

export default class Craps {
  static point = null
  static players = {}

  static addPlayer(id, player) {
    this.players[id] = player
  }

  static roll() {
    const outcomes = {}
    const dieOne = this.#rollDie()
    const dieTwo = this.#rollDie()
    const sum = dieOne + dieTwo
    outcomes.roll = [dieOne, dieTwo]
    outcomes.sum = sum
    const status = this.point == null ? `COME OUT` : `POINT ${this.point}`
    console.log(`[${status}] ROLL *[${dieOne}] [${dieTwo}]* (${sum})`)
    if (!this.point) {
      if ([4,5,6,8,9,10].includes(sum)) {
        outcomes.establishedPoint = true
        console.log(`Established point:`, sum)
      }
    } else if (sum === 7) {
      outcomes.sevenOut = true
      console.log(`Seven out.`)
    } else if (sum === this.point) {
      outcomes.hit = true
      console.log(`${sum}! Hit the point!`)
    }
    CrapsBets.roll = [dieOne, dieTwo]
    outcomes.players = {}
    for (const [id, player] of Object.entries(this.players)) {
      const results = []
      for (const [name, bet] of Object.entries(player.bets)) {
        if (bet === 0) continue
        if (this.point == null) {
          if (player.autoOffOnComeOut['comeOdds'] && name.startsWith('come') && name.length > 6) continue
          if (player.autoOffOnComeOut['comeOdds'] && name.startsWith('dontCome') && name.length > 10) continue
          if (player.autoOffOnComeOut['hardways'] && name.startsWith('hard')) continue
          if (player.autoOffOnComeOut['placeBuy'] && (name.startsWith('place') || name.startsWith('buy'))) continue
        }
        const outcome = CrapsBets[name](bet)
        const res = player.resolveBet(name, outcome)
        if (typeof res !== 'undefined') results.push(res)
      }
      outcomes.players[id] = {
        name: player.name,
        betOutcomes: results
      }
    }
    if (!this.point) {
      if ([4,5,6,8,9,10].includes(sum)) {
        this.point = sum
        CrapsBets.point = sum
        CrapsPlayer.point = sum
        for (const player of Object.values(this.players)) {
          if (player.settings.autoMovePlaceBuyToComeOdds) player.movePlaceBuyToComeOdds()
        }
      }
    } else if (sum === 7 || sum === this.point) {
      this.point = null
      CrapsBets.point = null
      CrapsPlayer.point = null
    }
    return outcomes
  }

  static status() {
    const status = this.point == null ? `COME OUT ROLL` : `POINT ESTABLISHED - **${this.point}**`
    return `< CURRENTLY ON: ${status} >`
  }

  static #rollDie() {
    return Math.floor(Math.random() * 6 + 1)
  }
}
