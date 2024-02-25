export default class CrapsBets {
  static point = null
  static roll = [0, 0]

  static pass(bet) {
    if (!this.point) {
      if (this.#sum === 7 || this.#sum === 11) {
        return bet
      } else if (this.#sum === 2 || this.#sum === 3 || this.#sum === 12) {
        return null
      } else {
        return 0
      }
    } else {
      if (this.#sum === this.point) {
        return bet
      } else if (this.#sum === 7) {
        return null
      } else {
        return 0
      }
    }
  }

  static passOdds(bet) {
    if (!this.point) {
      return 0
    } else if (this.#sum === 7) {
      return null
    } else if (this.#sum === this.point) {
      switch (this.point) {
        case 4:
        case 10:
          return bet * 2
        case 5:
        case 9:
          return Math.floor(bet * 3 / 2)
        case 6:
        case 8:
          return Math.floor(bet * 6 / 5)
      }
    } else {
      return 0
    }
  }

  static dontPass(bet) {
    if (!this.point) {
      if (this.#sum === 7 || this.#sum === 11) {
        return null
      } else if (this.#sum === 2 || this.#sum === 3 || this.#sum === 12) {
        return bet
      } else {
        return 0
      }
    } else {
      if (this.#sum === this.point) {
        return null
      } else if (this.#sum === 7) {
        return bet
      }
    }
  }

  static dontPassOdds(bet) {
    if (!this.point) {
      return 0
    } else if (this.#sum === 7) {
      switch (this.point) {
        case 4:
        case 10:
          return Math.floor(bet * 1 / 2)
        case 5:
        case 9:
          return Math.floor(bet * 2 / 3)
        case 6:
        case 8:
          return Math.floor(bet * 5 / 6)
      }
    } else if (this.#sum === this.point) {
      return null
    } else {
      return 0
    }
  }

  static come4(bet) {
    if (this.#sum === 4) {
      return bet
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come5(bet) {
    if (this.#sum === 5) {
      return bet
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come6(bet) {
    if (this.#sum === 6) {
      return bet
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come8(bet) {
    if (this.#sum === 8) {
      return bet
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come9(bet) {
    if (this.#sum === 9) {
      return bet
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come10(bet) {
    if (this.#sum === 10) {
      return bet
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come4odds(bet) {
    if (this.#sum === 4) {
      return bet * 2
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come5odds(bet) {
    if (this.#sum === 4) {
      return Math.floor(bet * 3 / 2)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come6odds(bet) {
    if (this.#sum === 4) {
      return Math.floor(bet * 6 / 5)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come8odds(bet) {
    if (this.#sum === 4) {
      return Math.floor(bet * 6 / 5)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come9odds(bet) {
    if (this.#sum === 4) {
      return Math.floor(bet * 3 / 2)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come10odds(bet) {
    if (this.#sum === 4) {
      return bet * 2
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static come(bet) {
    if ([4,5,6,8,9,10].includes(this.#sum)) return [`come${this.#sum}`, bet]
    if (this.#sum === 7 || this.#sum === 11) {
      return bet
    } else if (this.#sum === 2 || this.#sum === 3 || this.#sum === 12) {
      return null
    } else {
      return 0
    }
  }

  static dontCome4(bet) {
    if (this.#sum === 4) {
      return null
    } else if (this.#sum === 7) {
      return bet
    } else {
      return 0
    }
  }

  static dontCome5(bet) {
    if (this.#sum === 5) {
      return null
    } else if (this.#sum === 7) {
      return bet
    } else {
      return 0
    }
  }

  static dontCome6(bet) {
    if (this.#sum === 6) {
      return null
    } else if (this.#sum === 7) {
      return bet
    } else {
      return 0
    }
  }

  static dontCome8(bet) {
    if (this.#sum === 8) {
      return null
    } else if (this.#sum === 7) {
      return bet
    } else {
      return 0
    }
  }

  static dontCome9(bet) {
    if (this.#sum === 9) {
      return null
    } else if (this.#sum === 7) {
      return bet
    } else {
      return 0
    }
  }

  static dontCome10(bet) {
    if (this.#sum === 10) {
      return null
    } else if (this.#sum === 7) {
      return bet
    } else {
      return 0
    }
  }

  static dontCome4odds(bet) {
    if (this.#sum === 4) {
      return null
    } else if (this.#sum === 7) {
      return Math.floor(bet * 1 / 2)
    } else {
      return 0
    }
  }

  static dontCome5odds(bet) {
    if (this.#sum === 4) {
      return null
    } else if (this.#sum === 7) {
      return Math.floor(bet * 2 / 3)
    } else {
      return 0
    }
  }

  static dontCome6odds(bet) {
    if (this.#sum === 4) {
      return null
    } else if (this.#sum === 7) {
      return Math.floor(bet * 5 / 6)
    } else {
      return 0
    }
  }

  static dontCome8odds(bet) {
    if (this.#sum === 4) {
      return null
    } else if (this.#sum === 7) {
      return Math.floor(bet * 5 / 6)
    } else {
      return 0
    }
  }

  static dontCome9odds(bet) {
    if (this.#sum === 4) {
      return null
    } else if (this.#sum === 7) {
      return Math.floor(bet * 2 / 3)
    } else {
      return 0
    }
  }

  static dontCome10odds(bet) {
    if (this.#sum === 4) {
      return null
    } else if (this.#sum === 7) {
      return Math.floor(bet * 1 / 2)
    } else {
      return 0
    }
  }

  static dontCome(bet) {
    if ([4,5,6,8,9,10].includes(this.#sum)) return [`dontCome${this.#sum}`, bet]
    if (this.#sum === 7 || this.#sum === 11) {
      return null
    } else if (this.#sum === 2 || this.#sum === 3 || this.#sum === 12) {
      return bet
    } else {
      return 0
    }
  }

  static place6(bet) {
    if (this.#sum === 6) {
      return Math.floor(bet * 7 / 6)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static place8(bet) {
    if (this.#sum === 8) {
      return Math.floor(bet * 7 / 6)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static place5(bet) {
    if (this.#sum === 5) {
      return Math.floor(bet * 7 / 5)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static place9(bet) {
    if (this.#sum === 9) {
      return Math.floor(bet * 7 / 5)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static place4(bet) {
    if (this.#sum === 4) {
      return Math.floor(bet * 9 / 5)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static place4(bet) {
    if (this.#sum === 10) {
      return Math.floor(bet * 9 / 5)
    } else if (this.#sum === 7) {
      return null
    } else {
      return 0
    }
  }

  static hard4(bet) {
    if (this.#sum === 7) {
      return null
    } else if (this.#sum === 4) {
      if (this.roll[0] === this.roll[1]) {
        return bet * 7
      } else {
        return null
      }
    } else {
      return 0
    }
  }

  static hard6(bet) {
    if (this.#sum === 7) {
      return null
    } else if (this.#sum === 6) {
      if (this.roll[0] === this.roll[1]) {
        return bet * 9
      } else {
        return null
      }
    } else {
      return 0
    }
  }

  static hard8(bet) {
    if (this.#sum === 7) {
      return null
    } else if (this.#sum === 8) {
      if (this.roll[0] === this.roll[1]) {
        return bet * 9
      } else {
        return null
      }
    } else {
      return 0
    }
  }

  static hard10(bet) {
    if (this.#sum === 7) {
      return null
    } else if (this.#sum === 10) {
      if (this.roll[0] === this.roll[1]) {
        return bet * 7
      } else {
        return null
      }
    } else {
      return 0
    }
  }

  static big6(bet) {
    if (this.#sum === 7) {
      return null
    } else if (this.#sum === 6) {
      return bet
    } else {
      return 0
    }
  }

  static big8(bet) {
    if (this.#sum === 7) {
      return null
    } else if (this.#sum === 8) {
      return bet
    } else {
      return 0
    }
  }

  static field(bet) {
    if ([3, 4, 9, 10, 11].includes(this.#sum)) {
      return bet
    } else if (this.#sum === 2) {
      return bet * 2
    } else if (this.#sum === 12) {
      return bet * 3
    } else {
      return null
    }
  }

  static buy4(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [false, null, vig]
    } else if (this.#sum === 4) {
      return [true, actualBet * 2, vig]
    } else {
      return 0
    }
  }

  static buy5(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [false, null, vig]
    } else if (this.#sum === 5) {
      return [true, Math.floor(actualBet * 3 / 2), vig]
    } else {
      return 0
    }
  }

  static buy6(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [false, null, vig]
    } else if (this.#sum === 6) {
      return [true, Math.floor(actualBet * 6 / 5), vig]
    } else {
      return 0
    }
  }

  static buy8(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [false, null, vig]
    } else if (this.#sum === 8) {
      return [true, Math.floor(actualBet * 6 / 5), vig]
    } else {
      return 0
    }
  }

  static buy9(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [false, null, vig]
    } else if (this.#sum === 9) {
      return [true, Math.floor(actualBet * 3 / 2), vig]
    } else {
      return 0
    }
  }

  static buy10(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [false, null, vig]
    } else if (this.#sum === 10) {
      return [true, actualBet * 2, vig]
    } else {
      return 0
    }
  }

  static lay4(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [true, Math.floor(actualBet * 1 / 2), vig]
    } else if (this.#sum === 4) {
      return [false, null, vig]
    } else {
      return 0
    }
  }

  static lay5(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [true, Math.floor(actualBet * 2 / 3), vig]
    } else if (this.#sum === 5) {
      return [false, null, vig]
    } else {
      return 0
    }
  }

  static lay6(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [true, Math.floor(actualBet * 5 / 6), vig]
    } else if (this.#sum === 6) {
      return [false, null, vig]
    } else {
      return 0
    }
  }

  static lay8(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [true, Math.floor(actualBet * 5 / 6), vig]
    } else if (this.#sum === 8) {
      return [false, null, vig]
    } else {
      return 0
    }
  }

  static lay9(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [true, Math.floor(actualBet * 2 / 3), vig]
    } else if (this.#sum === 9) {
      return [false, null, vig]
    } else {
      return 0
    }
  }

  static lay10(bet) {
    const vig = Math.round(bet * 1 / 21)
    const actualBet = bet - vig
    if (this.#sum === 7) {
      return [true, Math.floor(actualBet * 1 / 2), vig]
    } else if (this.#sum === 10) {
      return [false, null, vig]
    } else {
      return 0
    }
  }

  static prop2(bet) {
    if (this.#sum === 2) {
      return bet * 30
    } else {
      return null
    }
  }

  static prop3(bet) {
    if (this.#sum === 3) {
      return bet * 15
    } else {
      return null
    }
  }

  static prop11(bet) {
    if (this.#sum === 11) {
      return bet * 15
    } else {
      return null
    }
  }

  static prop12(bet) {
    if (this.#sum === 12) {
      return bet * 30
    } else {
      return null
    }
  }

  static hiLow(bet) {
    if (this.#sum === 2 || this.#sum === 12) {
      return bet * 15
    } else {
      return null
    }
  }

  static anyCraps(bet) {
    if ([2,3,12].includes(this.#sum)) {
      return bet * 7
    } else {
      return null
    }
  }

  static cAndE(bet) {
    if ([2,3,12].includes(this.#sum)) {
      return bet * 3
    } else if (this.#sum === 11) {
      return bet * 7
    } else {
      return null
    }
  }

  static horn(bet) {
    if (this.#sum === 2 || this.#sum === 12) {
      return Math.floor(bet * 27 / 4)
    } else if (this.#sum === 3 || this.#sum === 11) {
      return bet * 3
    } else {
      return null
    }
  }

  static anySeven(bet) {
    if (this.#sum === 7) {
      return bet * 4
    } else {
      return null
    }
  }

  static whirl(bet) {
    if (this.#sum === 2 || this.#sum === 12) {
      return Math.floor(bet * 26 / 5)
    } else if (this.#sum === 3 || this.#sum === 11) {
      return Math.floor(bet * 11 / 5)
    } else if (this.#sum === 7) {
      return 0
    } else {
      return null
    }
  }

  static get #sum() {
    return this.roll[0] + this.roll[1]
  }
}
