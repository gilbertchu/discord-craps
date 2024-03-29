import CrapsPlayer from "./libs/CrapsPlayer.mjs"
import Craps from "./libs/Craps.mjs"

const p = new CrapsPlayer('G', 123, 200)
Craps.addPlayer(123, p)
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
p._summary()
console.log(p.summary())
