import CrapsPlayer from "./CrapsPlayer.mjs"
import CrapsBets from "./CrapsBets.mjs"

export default class Craps {
  static point = null
  static players = []

  static addPlayer(player) {
    this.players.push(player)
  }

  static roll() {
    const dieOne = this.#rollDie()
    const dieTwo = this.#rollDie()
    const sum = dieOne + dieTwo
    const status = this.point == null ? `COME OUT` : `POINT ${this.point}`
    console.log(`[${status}] ROLL *[${dieOne}] [${dieTwo}]* (${sum})`)
    if (!this.point) {
      if ([4,5,6,8,9,10].includes(sum)) {
        console.log(`Established point:`, sum)
      }
    } else if (sum === 7) {
      console.log(`Seven out.`)
    } else if (sum === this.point) {
      console.log(`${sum}! Hit the point!`)
    }
    CrapsBets.roll = [dieOne, dieTwo]
    for (const player of this.players) {
      for (const [name, bet] of Object.entries(player.bets)) {
        if (bet === 0) continue
        if (this.point == null) {
          if (player.autoOffOnComeOut['comeOdds'] && name.startsWith('come') && name.length > 6) continue
          if (player.autoOffOnComeOut['comeOdds'] && name.startsWith('dontCome') && name.length > 10) continue
          if (player.autoOffOnComeOut['hardways'] && name.startsWith('hard')) continue
          if (player.autoOffOnComeOut['placeBuy'] && (name.startsWith('place') || name.startsWith('buy'))) continue
        }
        const outcome = CrapsBets[name](bet)
        player.resolveBet(name, outcome)
      }
    }
    if (!this.point) {
      if ([4,5,6,8,9,10].includes(sum)) {
        this.point = sum
        CrapsBets.point = sum
        CrapsPlayer.point = sum
        for (const player of this.players) {
          if (player.settings.autoMovePlaceBuyToComeOdds) player.movePlaceBuyToComeOdds()
        }
      }
    } else if (sum === 7 || sum === this.point) {
      this.point = null
      CrapsBets.point = null
      CrapsPlayer.point = null
    }
  }

  static status() {
    const status = this.point == null ? `COME OUT ROLL` : `POINT ESTABLISHED - ${this.point}`
    return `< CURRENTLY ON: ${status} >`
  }

  static #rollDie() {
    return Math.floor(Math.random() * 6 + 1)
  }
}
