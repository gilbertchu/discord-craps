export default class CrapsPlayer {
  static #aliases = {
    'odds': 'passOdds',
    '4': 'place4',
    '5': 'place5',
    '6': 'place6',
    '8': 'place8',
    '9': 'place9',
    '10': 'place10',
    'hardways': ['hard4', 'hard6', 'hard8', 'hard10'],
    'snakeeyes': 'prop2',
    'acedeuce': 'prop3',
    'yo': 'prop11',
    'boxcars': 'prop12',
    'ce': 'cAndE',
    'world': 'whirl',
  }
  static #minBets = ['pass', 'passOdds', 'dontPass', 'dontPassOdds','field',
                     'come', 'come4Odds', 'come5Odds', 'come6Odds', 'come8Odds', 'come9Odds', 'come10Odds',
                     'dontCome', 'dontCome4Odds', 'dontCome5Odds', 'dontCome6Odds', 'dontCome8Odds', 'dontCome9Odds', 'dontCome10Odds',
                     'place4', 'place5', 'place6', 'place8', 'place9', 'place10',
                     'buy4', 'buy5', 'buy6', 'buy8', 'buy9', 'buy10',
                     'lay4', 'lay5', 'lay6', 'lay8', 'lay9', 'lay10']
  static #comeBets = ['come4', 'come5', 'come6', 'come8', 'come9', 'come10',
                      'dontCome4', 'dontCome5', 'dontCome6', 'dontCome8', 'dontCome9', 'dontCome10']
  static #lineBets = ['pass', 'dontPass']
  static #min = 5
  static #max = 1000
  static point = null
  autoOffOnComeOut = {
    'hardways': true,
    'comeOdds': true,
    'placeBuy': true,
  }
  settings = {
    'autoMovePlaceBuyToComeOdds': true,
    'autoIncrementByUnits': true,
    'autoRebuyPassLine': true,
  }
  name
  id
  bets = {
    'pass': 0,
    'passOdds': 0,
    'dontPass': 0,
    'dontPassOdds': 0,
    'field': 0,
    'place4': 0,
    'place5': 0,
    'place6': 0,
    'place8': 0,
    'place9': 0,
    'place10': 0,
    'buy4': 0,
    'buy5': 0,
    'buy6': 0,
    'buy8': 0,
    'buy9': 0,
    'buy10': 0,
    'lay4': 0,
    'lay5': 0,
    'lay6': 0,
    'lay8': 0,
    'lay9': 0,
    'lay10': 0,
    'hard4': 0,
    'hard6': 0,
    'hard8': 0,
    'hard10': 0,
    'big6': 0,
    'big8': 0,
    'prop2': 0,
    'prop3': 0,
    'prop11': 0,
    'prop12': 0,
    'hiLow': 0,
    'anyCraps': 0,
    'cAndE': 0,
    'horn': 0,
    'anySeven': 0,
    'whirl': 0,
    'come4Odds': 0,
    'come5Odds': 0,
    'come6Odds': 0,
    'come8Odds': 0,
    'come9Odds': 0,
    'come10Odds': 0,
    'come4': 0,
    'come5': 0,
    'come6': 0,
    'come8': 0,
    'come9': 0,
    'come10': 0,
    'come': 0,
    'dontCome4Odds': 0,
    'dontCome5Odds': 0,
    'dontCome6Odds': 0,
    'dontCome8Odds': 0,
    'dontCome9Odds': 0,
    'dontCome10Odds': 0,
    'dontCome4': 0,
    'dontCome5': 0,
    'dontCome6': 0,
    'dontCome8': 0,
    'dontCome9': 0,
    'dontCome10': 0,
    'dontCome': 0,
  }
  static #units = {
    'passOdds': [5, 2, 1],
    'dontPassOdds': [6, 3, 2],
    'place': [6, 5, 5]
  }
  bank = 0

  constructor(name, id, startingBank = 0) {
    this.name = name
    this.id = id
    this.bank = startingBank
  }

  static get allBets() {
    return this.#minBets.concat(this.#noMinBets).map(v => this.camelToFull(v))
  }

  static get formattedAliases() {
    return Object.entries(this.#aliases).map(([k,v]) => `> \`${k}\`: \`${v}\``).join('\n')
  }

  static camelToFull(name) {
    const nameCap = name.charAt(0).toUpperCase() + name.slice(1)
    let last = 0, words = [];
    for (let i=0; i<nameCap.length; i++) {
      if (name[i].match(/^[A-Z]|[1-9]$/)) {
        words.push(nameCap.slice(last, i))
        last = i
      }
      if (name[i] === '1') i++
    }
    words.push(nameCap.slice(last, nameCap.length))
    return words.join(' ')
  }

  _summary() {
    console.log(`*** ${this.name} ***`)
    const entries = Object.entries(this.bets).filter(v => !v[0].includes('Odds') && v[1] > 0)
    if (!entries.length) {
      console.log('[Bets]\n  (none)')
    } else {
      console.log('[Bets]')
      entries.forEach(([name, bet]) => {
        const oddsName = `${name}Odds`
        const odds = this.bets[oddsName] > 0 ? ['/', 'odds', this.bets[oddsName]] : []
        console.log(`  - ${CrapsPlayer.camelToFull(name)}:`, bet, ...odds)
      })
    }
    console.log(`[Chips]`)
    console.log(`  - Total:`, this.money)
    console.log(`  - Available:`, this.bank)
  }

  summary() {
    const msg = []
    const betArray = Object.entries(this.bets).filter(v => !v[0].includes('Odds') && v[1] > 0)
    for (const underlying of CrapsPlayer.#lineBets) {
      const underlyingIndex = betArray.findIndex(v => v[0] === underlying)
      if (underlyingIndex >= 0) {
        const [underlyingBet] = betArray.splice(underlyingIndex, 1)
        const underlyingMsgs = [`${CrapsPlayer.camelToFull(underlyingBet[0])}: **$${underlyingBet[1]}**`]
        if (this.bets[`${underlying}Odds`] > 0) underlyingMsgs.push(`${CrapsPlayer.camelToFull(underlying)} Odds: **$${this.bets[`${underlying}Odds`]}**`)
        msg.push(underlyingMsgs.join(' / '))
      }
    }
    for (const type of ['place', 'buy', 'lay', 'hard', 'big']) {
      const typeBets = []
      while (true) {
        const typeBetIndex = betArray.findIndex(v => v[0].startsWith(type))
        if (typeBetIndex === -1) break
        const [typeBet] = betArray.splice(typeBetIndex, 1)
        typeBets.push(typeBet)
      }
      if (typeBets.length) msg.push(typeBets.map(v => `${CrapsPlayer.camelToFull(v[0])}: **$${v[1]}**`).join(' / '))
    }
    for (const [name, amount] of betArray) {
      msg.push(`${CrapsPlayer.camelToFull(name)}: **$${amount}**`)
    }
    msg.unshift(msg.length ? `[BETS]` : `[BETS] _(none)_`)
    msg.unshift(`[PLAYER] **${this.name}**`)
    msg.push(`[CHIPS] Total: **$${this.money}** / Available: **$${this.bank}**`)
    return msg.map(v => `> ${v}`).join('\n')
  }

  get money() {
    return this.bank + Object.values(this.bets).reduce((a,v) => a+v)
  }

  get availableMoney() {
    return this.bank + Object.entries(this.bets).filter(v => !CrapsPlayer.#lineBets.includes(v[0])).reduce((a,v) => a+v[1], 0)
  }

  lineBetsValue() {
    return this.money - this.availableMoney
  }

  bet(rawName, rawBet) {
    let bet = typeof rawBet === 'number' ? rawBet : Number.parseInt(rawBet.trim())
    if (Number.isNaN(bet) || bet < 0 || !Number.isInteger(bet)) return `Invalid bet ("${rawBet}" not a valid amount)`
    const formattedName = rawName.trim().replaceAll(' ', '').toLowerCase()
    if (Object.keys(CrapsPlayer.#aliases).includes(formattedName)) {
      if (Array.isArray(CrapsPlayer.#aliases[formattedName])) {
        const remainder = bet % CrapsPlayer.#aliases[formattedName].length
        if (remainder) return `Bet ${name} ${bet} not divisible by ${CrapsPlayer.#aliases[formattedName].length}`
        const subBet = bet / CrapsPlayer.#aliases[formattedName].length
        const combinedOld = CrapsPlayer.#aliases[formattedName].reduce((a,v) => a + this.bets[v], 0)
        const res = CrapsPlayer.#aliases[formattedName].map(subName => this.bet(subName, subBet)).filter(v => typeof v === 'string')
        return res.length ? res.join('\n') : ['Hard Ways', bet === 0 && combinedOld, false, bet]
      } else {
        return this.bet(CrapsPlayer.#aliases[name], bet)
      }
    }
    const name = Object.keys(this.bets).find(v => v.toLowerCase() === formattedName)
    if (typeof name === 'undefined') return `Invalid bet ("${rawName}" does not exist).`
    let raised = false
    if (this.settings.autoIncrementByUnits) {
      let relevantNum, unitIndex, settingName
      if (name === 'passOdds' || name === 'dontPassOdds') {
        relevantNum = CrapsPlayer.point
        settingName = name
      } else if (name.startsWith('place')) {
        relevantNum = Number.parseInt(name.slice(name.charAt(5) === '1' ? -2 : -1))
        settingName = 'place'
      } else if ((name.startsWith('come') || name.startsWith('dont')) && name.endsWith('Odds')) {
        relevantNum = Number.parseInt(name.slice(name.slice(-5, -4) === '0' ? -6 : -5, -4))
        settingName = name.startsWith('come') ? 'passOdds' : 'dontPassOdds'
      }
      if (typeof settingName === 'string') {
        switch (relevantNum) {
          case 6:
          case 8:
            unitIndex = 0
            break
          case 5:
          case 9:
            unitIndex = 1
            break
          case 4:
          case 10:
            unitIndex = 2
            break
        }
        const remainder = bet % CrapsPlayer.#units[settingName][unitIndex]
        if (remainder > 0) {
          const raise = CrapsPlayer.#units[settingName][unitIndex] - remainder
          bet = bet + raise
          raised = true
        }
      }
    }
    const note = raised ? ' _(auto topped up amount)_' : ''
    if (bet > CrapsPlayer.#max) return `Cannot bet more than absolute max of ${CrapsPlayer.#max} - your bet is ${bet}${note}.`
    if (bet > this.bank) return `Not enough money - only have ${this.bank} of ${bet}${note}!`
    if (CrapsPlayer.#minBets.includes(name) && CrapsPlayer.#checkMin(name, bet))
      return `This bet requires minimum $${CrapsPlayer.#min}${name.startsWith('buy') || name.startsWith('lay') ? ' (+ vig 5%)' : ''}.`
    const fullName = CrapsPlayer.camelToFull(name)
    if (bet === 0 && this.bets[name] === 0) return `Bet on ${fullName} is already zero (no bet).`
    if (CrapsPlayer.point === null && name === 'come') return `Cannot bet come before point established (use pass instead).`
    if ((name === 'pass' || name === 'dontPass') && CrapsPlayer.point !== null) return `Cannot change ${fullName} line bet after point established.`
    if (name === 'passOdds') {
      if (CrapsPlayer.point === null) return `Cannot bet ${fullName} before point established.`
      if (this.bets['pass'] === 0) return `Cannot bet ${fullName} without pass line bet.`
      const oddsCap = CrapsPlayer.#checkOdds(bet, this.bets['pass'], CrapsPlayer.point)
      if (oddsCap !== null) return `Cannot bet over pass's odds limit x${oddsCap} ($${oddsCap * this.bets['pass']} max)`
    } else if (name === 'dontPassOdds') {
      if (CrapsPlayer.point === null) return `Cannot bet ${fullName} before point established.`
      if (this.bets['dontPass'] === 0) return `Cannot bet ${fullName} without dont pass line bet.`
      const oddsCap = CrapsPlayer.#checkDontOdds(bet, this.bets['dontPass'], CrapsPlayer.point)
      if (oddsCap !== null) return `Cannot bet over dontPass's odds limit x${oddsCap} ($${oddsCap * this.bets['dontPass']} max).`
    } else if (name !== 'come' && name.startsWith('come')) {
      if (name.length <= 6) return `Cannot bet ${fullName} directly (must be established from come).`
      const underlying = name.slice(0, name.charAt(4) === '1' ? 6 : 5)
      if (this.bets[underlying] === 0) return `Cannot bet ${fullName} without a ${CrapsPlayer.camelToFull(underlying)} bet.`
      const num = Number.parseInt(underlying.slice(4))
      const oddsCap = CrapsPlayer.#checkOdds(bet, this.bets[underlying], num)
      if (oddsCap !== null) return `Cannot bet over ${underlying}'s odds limit x${oddsCap[1]} ($${oddsCap * this.bets[underlying]} max).`
    } else if (name !== 'dontCome' && name.startsWith('dontCome')) {
      if (name.length <= 10) return `Cannot bet ${fullName} directly (must be established from dont come).`
      const underlying = name.slice(0, name.charAt(8) === '1' ? 10 : 9)
      if (this.bets[underlying] === 0) return `Cannot bet ${fullName} without a ${CrapsPlayer.camelToFull(underlying)} bet.`
      const oddsCap = CrapsPlayer.#checkDontOdds(bet, this.bets[underlying])
      if (oddsCap !== null) return `Cannot bet over ${underlying}'s odds limit x${oddsCap[1]} ($${oddsCap * this.bets[underlying]} max).`
    }
    if ((name.startsWith('buy') || name.startsWith('lay')) && bet > 0) {
      const vig = Math.round(bet * 1 / 21)
      const actualBet = bet - vig
      console.log(this.name,`bet *${name}* ${actualBet} (vig ${vig})`)
      this.#adjustBet(name, bet)
      return [CrapsPlayer.camelToFull(name), false, raised, actualBet, vig]
    } else {
      console.log(this.name,`BET *${name}* $${bet}${note}`)
    }
    const old = this.bets[name]
    this.#adjustBet(name, bet)
    const cleared = bet === 0 && old
    return [CrapsPlayer.camelToFull(name), cleared, raised, bet]
  }

  resolveBet(name, outcome) {
    let note = '', finalOutcome, res
    if (Array.isArray(outcome)) {
      switch (typeof outcome[0]) {
        case 'string':
          this.bets[outcome[0]] = outcome[1]
          this.bets[name] = 0
          return [CrapsPlayer.camelToFull(name), 0, outcome[0]]
        case 'boolean':
          if (outcome[0]) {
            note = ` (paid vig $${outcome[2]})`
          } else {
            note = ` (returned vig $${outcome[2]})`
            this.bank += outcome[2]
          }
          finalOutcome = outcome[1]
          break
      }
    } else {
      finalOutcome = outcome
    }
    if (finalOutcome === null) {
      const actualBet = name.startsWith('buy') || name.startsWith('lay') ?
        this.bets[name] - Math.max(Math.round(this.bets[name] * 1 / 21), 1) : this.bets[name]
      console.log(this.name, name, `lost ${actualBet}${note}.`)
      res = [CrapsPlayer.camelToFull(name), -1 * actualBet, note]
      this.bets[name] = 0
    } else if (finalOutcome > 0) {
      console.log(this.name, name, `won ${finalOutcome}${note}!`)
      res = [CrapsPlayer.camelToFull(name), finalOutcome, note]
      if (name === 'pass' || name === 'dontPass') {
        // User setting: rebuy pass/don't pass on win
        this.settings.autoRebuyPassLine || this.#adjustBet(name, 0)
      } else if (typeof ['place', 'buy', 'lay', 'hard', 'big'].find(v => name.startsWith(v)) === 'undefined') {
        // For other non multi-roll bets, clear bet after win
        this.#adjustBet(name, 0)
      }
      this.bank += finalOutcome
    } else {
      return
    }
    // If come odds were turned off, they will return to player on the come number resolution
    if (name.startsWith('come') && name.length <= 6 && name !== 'come') {
      const odds = `${name}Odds`
      if (this.bets[odds] > 0) this.#adjustBet(odds, 0)
    } else if (name.startsWith('dontCome') && name.length <= 10 && name !== 'dontCome') {
      const odds = `${name}Odds`
      if (this.bets[odds] > 0) this.#adjustBet(odds, 0)
    }
    return res
  }

  movePlaceBuyToComeOdds() {
    const comeBet = this.bets[`come${CrapsPlayer.point}`]
    // if (!comeBet) return
    const available = this.bets[`place${CrapsPlayer.point}`] + this.bets[`buy${CrapsPlayer.point}`]
    if (!available) return
    const multiplier = CrapsPlayer.#oddsMultiplier(CrapsPlayer.point)
    const maxOdds = multiplier * comeBet
    const remaining = maxOdds - this.bets[`come${CrapsPlayer.point}Odds`]
    this.bets[`place${CrapsPlayer.point}`] = 0
    this.bets[`buy${CrapsPlayer.point}`] = 0
    this.bets[`come${CrapsPlayer.point}Odds`] += Math.min(remaining, available)
    if (remaining) console.log(`Auto moved place/buy ${CrapsPlayer.point} to come ${CrapsPlayer.point} odds.`)
    const release = available - remaining
    this.bank += release
    if (release) console.log(`Returned extra place/buy ${CrapsPlayer.point} to available chips.`)
  }

  removeAllBets() {
    for (const name in this.bets) {
      if (CrapsPlayer.#comeBets.includes(name) ||
        (CrapsPlayer.#lineBets.includes(name) && CrapsPlayer.point !== null)) {
        // Cannot remove line bet once number is established, bet is forfeited
        this.bets[name] = 0
      } else {
        this.#adjustBet(name, 0)
      }
    }
  }

  static #checkMin(name, bet) {
    if (name.startsWith('buy') || name.startsWith('lay')) return bet !== 0 && bet < (this.#min + Math.ceil(this.#min * 0.05))
    return bet !== 0 && bet < this.#min
  }

  static #checkOdds(bet, underlying, num) {
    const multiplier = this.#oddsMultiplier(num)
    if (bet > underlying * multiplier) {
      return multiplier
    } else {
      return null
    }
  }

  static #oddsMultiplier(num) {
    switch (num) {
      case 4:
      case 10:
        return 3
      case 5:
      case 9:
        return 4
      case 6:
      case 8:
        return 5
    }
  }

  static #checkDontOdds(bet, underlying) {
    const multiplier = 6
    if (bet > underlying * multiplier) {
      return multiplier
    } else {
      return null
    }
  }

  // #addBet(name, bet) {
  //   this.bank -= bet
  //   this.bets[name] += bet
  // }

  #adjustBet(name, bet = 0) {
    this.bank -= (bet - this.bets[name])
    this.bets[name] = bet
  }
}
