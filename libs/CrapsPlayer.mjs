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
  static #minBets = ['pass', 'passOdds', 'come', 'come4odds', 'come5odds', 'come6odds', 'come8odds', 'come9odds', 'come10odds', 'field',
                      'dontCome', 'dontCome4odds', 'dontCome5odds', 'dontCome6odds', 'dontCome8odds', 'dontCome9odds', 'dontCome10odds',
                      'place4', 'place5', 'place6', 'place8', 'place9', 'place10',
                      'buy4', 'buy5', 'buy6', 'buy8', 'buy9', 'buy10',
                      'lay4', 'lay5', 'lay6', 'lay8', 'lay9', 'lay10',
                    ]
  static #noMinBets = ['hard4', 'hard6', 'hard8', 'hard10', 'big6', 'big8', 'prop2', 'prop3', 'prop11', 'prop12',
                        'hiLow', 'anyCraps', 'cAndE', 'horn', 'anySeven', 'whirl',
                      ]
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
    // 'autoIncrementByUnits': true,
    'autoRebuyPassLine': false,
  }
  name
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
  bank = 0

  constructor(name, startingBank = 0) {
    this.name = name
    this.bank = startingBank
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

  summary() {
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

  get money() {
    return this.bank + Object.values(this.bets).reduce((a,v) => a+v)
  }

  bet(name, rawBet) {
    const bet = typeof rawBet === 'number' ? rawBet : Number.parseInt(rawBet)
    if (Number.isNaN(bet)) return `Invalid bet ("${rawBet}" not a valid amount)`
    if (bet > CrapsPlayer.#max) return `Cannot bet more than absolute max (${CrapsPlayer.#max}).`
    if (bet > this.bank) return `Not enough money! (${this.bank} of ${bet})`
    if (Object.keys(CrapsPlayer.#aliases).includes(name)) {
      if (Array.isArray(CrapsPlayer.#aliases[name])) {
        const remainder = bet % CrapsPlayer.#aliases[name].length
        if (remainder) return `Bet ${name} ${bet} not divisible by ${CrapsPlayer.#aliases[name].length}`
        const subBet = bet / CrapsPlayer.#aliases[name].length
        const res = CrapsPlayer.#aliases[name].map(subName => this.bet(subName, subBet)).filter(v => typeof v !== 'undefined')
        return res.length ? res : res?.undefined
      } else {
        return this.bet(CrapsPlayer.#aliases[name], bet)
      }
    }
    const formattedName = name.replaceAll(' ', '').toLowerCase()
    name = Object.keys(this.bets).find(v => v.toLowerCase() === formattedName)
    if (CrapsPlayer.#minBets.includes(name)) {
      if (CrapsPlayer.#checkMin(name, bet)) return `This bet requires minimum ${CrapsPlayer.#min}${name.startsWith('buy') || name.startsWith('lay') ? ' (+ vig 5%)' : ''}.`
    } else if (!CrapsPlayer.#noMinBets.includes(name)) {
      return `Invalid bet ("${name}" does not exist).`
    }
    if (CrapsPlayer.point == null && name === 'come') return `Cannot bet come before point established (use pass instead).`
    if ((name === 'pass' || name === 'dontPass') && CrapsPlayer.point != null) return `Cannot change ${name} line bet after point established.`
    if (name === 'passOdds') {
      if (CrapsPlayer.point == null) return `Cannot bet ${name} before point established.`
      if (this.bets['pass'] === 0) return `Cannot bet ${name} without pass line bet.`
      const oddsCap = CrapsPlayer.#checkOdds(bet, this.bets['pass'], CrapsPlayer.point)
      if (oddsCap != null) return `Cannot bet over pass's odds limit x${oddsCap} (${oddsCap * this.bets['pass']} max)`
    } else if (name === 'dontPassOdds') {
      if (CrapsPlayer.point == null) return `Cannot bet ${name} before point established.`
      if (this.bets['dontPass'] === 0) return `Cannot bet ${name} without dont pass line bet.`
      const oddsCap = CrapsPlayer.#checkDontOdds(bet, this.bets['dontPass'], CrapsPlayer.point)
      if (oddsCap != null) return `Cannot bet over dontPass's odds limit x${oddsCap} (${oddsCap * this.bets['dontPass']} max).`
    } else if (name !== 'come' && name.startsWith('come')) {
      if (name.length <= 6) return `Cannot bet ${name} directly (must be established from come).`
      const underlying = name.slice(0, name.charAt(4) === '1' ? 6 : 5)
      if (this.bets[underlying] === 0) return `Cannot bet ${name} without a ${underlying} bet.`
      const num = Number.parseInt(underlying.slice(4))
      const oddsCap = CrapsPlayer.#checkOdds(bet, this.bets[underlying], num)
      if (oddsCap != null) return `Cannot bet over ${underlying}'s odds limit x${oddsCap[1]} (${oddsCap * this.bets[underlying]} max).`
    } else if (name !== 'dontCome' && name.startsWith('dontCome')) {
      if (name.length <= 10) return `Cannot bet ${name} directly (must be established from dont come).`
      const underlying = name.slice(0, name.charAt(8) === '1' ? 10 : 9)
      if (this.bets[underlying] === 0) return `Cannot bet ${name} without a ${underlying} bet.`
      const num = Number.parseInt(underlying.slice(4))
      const oddsCap = CrapsPlayer.#checkDontOdds(bet, this.bets[underlying], num)
      if (oddsCap != null) return `Cannot bet over ${underlying}'s odds limit x${oddsCap[1]} (${oddsCap * this.bets[underlying]} max).`
    }
    if (name.startsWith('buy') || name.startsWith('lay')) {
      const vig = Math.round(bet * 1 / 21)
      const actualBet = bet - vig
      console.log(this.name,`bet *${name}* ${actualBet} (vig ${vig})`)
    } else {
      console.log(this.name,`bet *${name}* ${bet}`)
    }
    this.#adjustBet(name, bet)
  }

  resolveBet(name, outcome) {
    let note = '', finalOutcome
    if (Array.isArray(outcome)) {
      switch (typeof outcome[0]) {
        case 'string':
          this.bets[outcome[0]] = outcome[1]
          break
        case 'boolean':
          if (outcome[0]) {
            note = ` (paid vig ${outcome[2]})`
          } else {
            note = ` (returned vig ${outcome[2]})`
            this.bank += outcome[2]
          }
          finalOutcome = outcome[1]
          break
      }
    } else {
      finalOutcome = outcome
    }
    if (finalOutcome == null) {
      console.log(this.name, name, `lost ${this.bets[name]}${note}.`)
      this.bets[name] = 0
    } else if (finalOutcome > 0) {
      console.log(this.name, name, `won ${finalOutcome}${note}!`)
      const lowerName = name.toLowerCase()
      if (name === 'pass') {
        this.settings.autoRebuyPassLine || this.#adjustBet(name, 0)
      } else if (typeof ['place', 'buy', 'lay', 'hard', 'big'].find(v => name.startsWith(v)) === 'undefined') {
        this.#adjustBet(name, 0)
      }
      this.bank += finalOutcome
    } else {
      return
    }
    if (name.startsWith('come') && name.length <= 6) {
      const odds = `${name}Odds`
      if (this.bets[odds] > 0) this.#adjustBet(odds, 0)
    } else if (name.startsWith('dontCome') && name.length <= 10) {
      const odds = `${name}Odds`
      if (this.bets[odds] > 0) this.#adjustBet(odds, 0)
    }
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
