import { myName, myAddr, accessToken} from './shhh.js'

//Button Listeners
document.querySelector('#btnProfile').addEventListener('click', getProfile)
document.querySelector('#btnDevices').addEventListener('click', getDevices)
document.querySelector('#btnGetSteps').addEventListener('click', getSteps)


function getProfile(){
  fetch('https://api.fitbit.com/1/user/-/profile.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + accessToken}
  })
  .then(response => response.json())
  .then(json => console.log(json))
}

function getSteps(){
  let xDate = document.querySelector('#inpDate').value || 'today'
  let urlFB = 'https://api.fitbit.com/1/user/-/activities/steps/date/' + xDate + '/1d.json'

  fetch(urlFB,{
    method: "GET",
    headers: {"Authorization": "Bearer " + accessToken}
  })
  .then(response => response.json())
  .then(data => displaySteps(data))
}



function displaySteps(data){
  //Data Variables
  let stepsData = data['activities-steps-intraday']['dataset']
  let dataLength = stepsData.length
  let stepsPerHr = []
  let step15MinTotals = []
  let stepsOutput = []

  //HTML Elements
  let stepsTotal = document.getElementById("stepsTotal")
  let stepsDate = document.getElementById("stepsDate")
  let stepsTableBody = document.getElementById("stepsTableBody")

  console.log(data)

  //Work with data on the page
  stepsTableBody.innerText = ""
  stepsTotal.innerText = data['activities-steps'][0].value
  stepsDate.innerText = data['activities-steps'][0].dateTime

  //v2 process data for table.
  //   1) split into hr's
  for (let i=0; i<=dataLength; i+=15){
    stepsPerHr.push(stepsData.slice(i,i+15))
  }
  //console.log(stepsPerHr)

  for (let s of stepsPerHr){
    step15MinTotals.push(s.reduce((t,v)=>t+=v.value,0))
  }
  //console.log(step15MinTotals)

  for (let i=0; i<step15MinTotals.length; i+=4){
    let a = step15MinTotals[i]
    let b = step15MinTotals[i+1]
    let c = step15MinTotals[i+2]
    let d = step15MinTotals[i+3]
    stepsOutput.push({q0: a, q1: b, q2: c, q3: d, total: a+b+c+d})
  }
  //console.log(stepsOutput)

  for (let i=0; i<stepsOutput.length-1; i++){
    let tRow = document.createElement("tr")
    let tCell1 = document.createElement("td")
    let tCell2 = document.createElement("td")
    let tCell3 = document.createElement("td")
    let tCell4 = document.createElement("td")
    let tCell5 = document.createElement("td")
    let tCell6 = document.createElement("td")
    
    tCell1.innerText = `${i<10 ? '0'+i : i}--${i+1<10 ? '0'+(i+1) : i+1}`
    tCell2.innerText = stepsOutput[i].q0
    tCell3.innerText = stepsOutput[i].q1
    tCell4.innerText = stepsOutput[i].q2
    tCell5.innerText = stepsOutput[i].q3
    tCell6.innerText = stepsOutput[i].total

    tRow.appendChild(tCell1)
    tRow.appendChild(tCell2)
    tRow.appendChild(tCell3)
    tRow.appendChild(tCell4)
    tRow.appendChild(tCell5)
    tRow.appendChild(tCell6)

    stepsTableBody.appendChild(tRow)
  }






  // for (let i=0; i<dataLength; i+=15){
  //   let hrPart = `${i>10 ? '0'+i : i} - ${i+1>10 ? '0'+(i+1) : i+1}`
  //   //console.log(hrPart)

  //   //console.log(i)
  //   let tRow = document.createElement("tr")
  //   let tCell1 = document.createElement("td")
  //   let tCell2 = document.createElement("td")
  //   let tCell3 = document.createElement("td")
  //   let tCell4 = document.createElement("td")


  //   let stepCtr = 0
  //   for (let j=i; j<i+15; j++){
  //     //console.log('  --',j)
  //     stepCtr += stepsData[j].value
      
  //     //div.innerHTML = `${stepsData[i].time} to ${j===1438 ? '00:00:00' : stepsData[j+1].time} = ${stepCtr}`
  //     //stepsBreakdown.appendChild(div)
  //     stepsTotal.push(stepCtr)
  //     console.log(stepsTotal)

  //     //console.log(`${stepsData[i].time} / ${stepsData[j+1].time} -- ${i} / ${j} / ${j+1}`)
  //   }
  // }

console.log('done')

}

function getDevices(){
  //Get Data
  fetch('https://api.fitbit.com/1/user/-/devices.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + access_token}
  })
  .then(response => response.json())
  .then(json => console.log(json))
}
