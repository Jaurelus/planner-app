let tdy = new Date()
isoDate = tdy.toISOString()
split = isoDate.slice(0,-1)
let tmr = tdy
tmr.setUTCHours(20,30,23)
console.log(tmr.toLocaleString([],{hour12:false}))
console.log(tmr.toTimeString())
