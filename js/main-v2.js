import { myName, myAddr, accessToken} from './shhh.js'

//Button Listeners
document.querySelector('#btnProfile').addEventListener('click', getProfile)
document.querySelector('#btnDevices').addEventListener('click', getDevices)
document.querySelector('#btnGetSteps').addEventListener('click', getSteps)
document.querySelector('#btnPrevDate').addEventListener('click', () => dateUpdate('p'))
document.querySelector('#btnNextDate').addEventListener('click', () => dateUpdate('n'))


//FUNCTIONS
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

    for (let j=1; j<=6; j++){
      let tCell = document.createElement("td") 
      if (j===1) { 
        tCell.innerText = `${i<10 ? '0'+i : i}--${i+1<10 ? '0'+(i+1) : i+1}`
      } else if (j<=5) {
        tCell.innerText = stepsOutput[i]['q'+(j-2)]
      } else {
        tCell.innerText = stepsOutput[i].total
        if (stepsOutput[i].total<250) { tCell.classList.add("underTarget")}
        else { tCell.classList.add("metTarget") }
      }
      tRow.appendChild(tCell)
    }
    stepsTableBody.appendChild(tRow)
  }
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

function dateUpdate(action){
  console.log('hello',action)
  let curDate = new Date(document.querySelector('#inpDate').value || Date())
  if (action==='n') { curDate.setDate(curDate.getDate() + 1) }
  else { curDate.setDate(curDate.getDate() - 1) }
  
  let selYear = curDate.getFullYear()
  let selMonth = curDate.getMonth()+1
  let selDay = curDate.getDate()

  document.querySelector('#inpDate').value = `${selYear}-${selMonth<=9 ? '0'+selMonth : selMonth}-${selDay<=9 ? '0'+selDay : selDay}`
}
