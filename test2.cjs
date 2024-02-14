// import CrapsPlayer from "./libs/CrapsPlayer.js"
// import Craps from "./libs/Craps.js"

const p1 = import('./libs/CrapsPlayer.mjs')
const p2 = import('./libs/Craps.mjs')

Promise.all([p1, p2]).then(v => {
  const { default: CrapsPlayer } = v[0]
  const { default: Craps } = v[1]
  const p = new CrapsPlayer('G', 200)
  Craps.addPlayer(p)
  p.bet('pass', 5)
  p.bet('hardways', 4)
  p.bet('ce', 1)
  p.bet('place6', 6)
  p.bet('place8', 6)
  Craps.roll()
  p.bet('passOdds', 100)
  p.bet('passOdds', 25)
  p.bet('buy4', 25)
  p.bet('come', 5)
  Craps.roll()
  p.summary()
})
