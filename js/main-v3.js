import { accessToken} from './shhh.js'

//Button Listeners
document.querySelector('#btnProfile').addEventListener('click', getProfile)
document.querySelector('#btnDevices').addEventListener('click', getDevices)
document.querySelector('#btnSetToday').addEventListener('click', () => dateUpdate('t'))
document.querySelector('#btnSetPrevDate').addEventListener('click', () => dateUpdate('p'))
document.querySelector('#btnSetNextDate').addEventListener('click', () => dateUpdate('n'))
document.querySelector('#tglDisplay').addEventListener('click', changeTableHeader)


//FUNCTIONS
function getProfile(){
  fetch('https://api.fitbit.com/1/user/-/profile.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + accessToken}
  })
  .then(response => response.json())
  .then(json => console.log(json))
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
  console.log(data)

  //Data Variables
  let stepsData = data['activities-steps-intraday']['dataset']
  let dataLength = stepsData.length
  let stepsPerHr = []
  let step15MinTotals = []
  let stepsOutput = []
  let displayTo = ''
  let tempStepsDate = []

  //HTML Elements
  let stepsTotal = document.getElementById("stepsTotal")
  let stepsDate = document.getElementById("stepsDate")
  let stepsTableBody = document.getElementById("stepsTableBody")
  let displayType = document.getElementById("tglDisplay").checked



  //Work with data on the page
  stepsTableBody.innerText = ""
  stepsTotal.innerText = data['activities-steps'][0].value
  stepsDate.innerText = data['activities-steps'][0].dateTime.split('-').reverse().join('-')

  //v2 process data for table.
  //   1) split into hr's
  for (let i=0; i<=dataLength; i+=15){
    stepsPerHr.push(stepsData.slice(i,i+15))
  }

  for (let s of stepsPerHr){
    step15MinTotals.push(s.reduce((t,v)=>t+=v.value,0))
  }

  for (let i=0; i<step15MinTotals.length; i+=4){
    let a = step15MinTotals[i]
    let b = step15MinTotals[i+1]
    let c = step15MinTotals[i+2]
    let d = step15MinTotals[i+3]
    stepsOutput.push({q0: a, q1: b, q2: c, q3: d, total: a+b+c+d})
  }

  for (let i=0; i<stepsOutput.length-1; i++){
    let tRow = document.createElement("tr")

    for (let j=1; j<=6; j++){
      let tCell = document.createElement("td") 
      if (j===1) { 
        tCell.innerText = `${i<10 ? '0'+i : i}--${i+1<10 ? '0'+(i+1) : i+1}`
        tCell.classList.add("tblCol1")
      } else if (j<=5) {
        tCell.innerText = stepsOutput[i]['q'+(j-2)]
      } else {
        tCell.innerText = stepsOutput[i].total
        tCell.classList.add("tblCol6")
        if (stepsOutput[i].total<250) { tCell.classList.add("underTarget")}
        else { tCell.classList.add("metTarget") }
      }
      tRow.appendChild(tCell)
    }
    stepsTableBody.appendChild(tRow)
  }
}

function dateUpdate(action){
  let curDate = new Date(document.querySelector('#inpDate').value || Date())
  
  if (action!='t') {
    if (action==='n') { curDate.setDate(curDate.getDate() + 1) }
    else { curDate.setDate(curDate.getDate() - 1) }
  } else {
    curDate = new Date(Date())
  }
  
  let selYear = curDate.getFullYear()
  let selMonth = curDate.getMonth()+1
  let selDay = curDate.getDate()

  document.querySelector('#inpDate').value = `${selYear}-${selMonth<=9 ? '0'+selMonth : selMonth}-${selDay<=9 ? '0'+selDay : selDay}`
  getSteps()
}

function changeTableHeader(){
  console.log("Change 1")
  if (document.getElementById("tglDisplay").checked){
    console.log("Change 2")
    document.getElementById("hdrWeb").classList.add("hdrHidden")
    document.getElementById("hdrExcel").classList.remove("hdrHidden")
  } else {
    console.log("Change 3")
    document.getElementById("hdrExcel").classList.add("hdrHidden")
    document.getElementById("hdrWeb").classList.remove("hdrHidden")
  }
}