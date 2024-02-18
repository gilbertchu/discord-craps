import CrapsPlayer from "./libs/CrapsPlayer.js"
import Craps from "./libs/Craps.js"

const p = new CrapsPlayer('G', 200)
Craps.addPlayer(123, p)

import readline from 'node:readline'

const rl = readline.createInterface({input: process.stdin, output: process.stdout})

while (true) {
  rl.question('', answer => {
    console.log(`TODO Attempt ${answer}`)
    rl.close()
  })
}
