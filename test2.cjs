const p1 = import('./libs/CrapsPlayer.mjs')
const p2 = import('./libs/Craps.mjs')

let p, Craps;
Promise.all([p1, p2]).then(v => {
  const { default: CrapsPlayer } = v[0]
  ;({ default: Craps } = v[1])
  p = new CrapsPlayer('G', 123, 200)
  Craps.addPlayer(123, p)
  p.summary()
  console.log(Craps.status)
})
