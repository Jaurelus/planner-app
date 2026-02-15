object1 = {date1: {subkey1:1, dot:[{subkey3:3}]}, date2: {subkey: 2}}
object2 = {date1: {subkey1:5, dot:[{subkey4:4}]}, date7: {subkey1:7}, date2: {subkey1:10}} 

const dates = Object.keys(object1)
dates.forEach((date)=>{
    if(object2[date]){   
        let sK= object2[date]; 
        if(sK.dot){let tmpArray = sK.dot

                sK.dot.push({subkey6:7})

        console.log("sK\n",sK)

         
    }
                
    } else if(object2[!date]) {console.log("Not included: ", date)
    }
    })
console.log(dates)
