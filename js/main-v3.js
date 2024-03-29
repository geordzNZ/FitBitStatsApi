//Adding a comment to check the uploads to Github
import { accessToken} from './shhh.js'

//Button Listeners
document.querySelector('#btnProfile').addEventListener('click', getProfile)
document.querySelector('#btnDevices').addEventListener('click', getDevices)
document.querySelector('#btnSetToday').addEventListener('click', () => dateUpdate('t'))
document.querySelector('#btnSetPrevDate').addEventListener('click', () => dateUpdate('p'))
document.querySelector('#btnSetNextDate').addEventListener('click', () => dateUpdate('n'))
document.querySelector('#inpDate').addEventListener('change', () => dateUpdate('s'))
document.querySelector('#tglDisplay').addEventListener('click', changeTableHeader)
// document.querySelector('#btnCopy').addEventListener('click', copyStats)
// document.querySelector('#btnRefresh').addEventListener('click', getRefreshedToken)


//FUNCTIONS
function getProfile(){
  fetch('https://api.fitbit.com/1/user/-/profile.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + accessToken}
  })
  .then(response => response.json())
  .then(json => displayInfo(json))
}

function getDevices(){
  //Get Data
  fetch('https://api.fitbit.com/1/user/-/devices.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + accessToken}
  })
  .then(response => response.json())
  // .then(json => console.log(json))
  .then(json => displayInfo(json))
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

function displayInfo(data){
  let infoDiv = document.querySelector('#info')
  console.log(data)
  infoDiv.innerHTML = JSON.stringify(data, null, '  ')
}


function displaySteps(data) {
    
    //Data Variables
    let stepsData = data['activities-steps-intraday']['dataset']
    let stepsDataLastHour = stepsData.slice(-(new Date().getMinutes() + 1))
    let stepsDataLastHourActuals = stepsDataLastHour.filter(d => d.value>0)
    let dataLength = stepsData.length
    let stepsPerHr = []
    let step15MinTotals = []
    let stepsOutput = []
    let tRow7Steps = [0, 0, 0, 0]
    let breakLoop = false;
    let stepsDateParts = [...data['activities-steps'][0].dateTime.split('-').reverse()]
    let stepsDayName = new Date(data['activities-steps'][0].dateTime).toLocaleDateString('en', { weekday: 'short' })
    let stepsMonthName = new Date(data['activities-steps'][0].dateTime).toLocaleDateString('en', { month: 'short' })
    

    //HTML Elements
    let stepsTotal = document.getElementById("stepsTotal")
    let stepsDate = document.getElementById("stepsDate")
    let stepsTableBody = document.getElementById("stepsTableBody")
    let displayType = document.getElementById("tglDisplay").checked
    let infoTitle = document.querySelector('#infoTitle')
    let infoContent = document.querySelector('#infoContent')
    let consoleLogCheck = document.querySelector('#chkConsole')

    
    console.warn(data['activities-steps'][0])
    if (consoleLogCheck.checked) {
        console.table(data['activities-steps-intraday']['dataset'].filter(v => v.value > 0))
    }
    

    //Work with data on the page
    stepsTableBody.innerText = ""
    stepsTotal.innerText = data['activities-steps'][0].value
    stepsDate.innerText = `${stepsDateParts[0]}/${stepsMonthName}/${stepsDateParts[2]}(${stepsDayName})`

  //v2 process data for table.
  //   1) split into hr's
  for (let i=0; i <= dataLength; i+=15){
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
    if (breakLoop) { break }
    if (displayType){
      if (i===17) (breakLoop = true)
      for (let j=1; j<=4; j++) {
        let tCell = document.createElement("td") 
        if (i<=6){
          tRow7Steps[j-1] += stepsOutput[i]['q'+(j-1)]
          if (i===6){
            tCell.innerText = tRow7Steps[j-1]
          tRow.appendChild(tCell)
          }
        } else {
          tCell.innerText = stepsOutput[i]['q'+(j-1)]
          tRow.appendChild(tCell)
          if (i>=1 && i<=17) {
            if (stepsOutput[i].total>=250) { tCell.classList.add("metTarget")}
          }
        }
      }
    } else {
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
        }
        tRow.appendChild(tCell)
        if (i>=1 && i<=17) {
          if (stepsOutput[i].total>=250) { tRow.classList.add("metTarget")}
        }
      }
    }
    stepsTableBody.appendChild(tRow)
  }
  
    //Display current hour's data
    let curD = new Date() 
    let curYear = curD.getFullYear()
    let curMonth = curD.getMonth()+1
    let curDay = curD.getDate()
    let curDate = `${curYear}-${curMonth <= 9 ? '0' + curMonth : curMonth}-${curDay <= 9 ? '0' + curDay : curDay}`
    

    if (document.querySelector('#inpDate').value == curDate) {
        let outputCurrentHourSteps = JSON.stringify(stepsDataLastHourActuals)
            .replace(/}\,{/g, '\n')
            .replace(/[\[{}\]"]/g, '')
            .replace(/,value/g, ' -- steps')
        let outputCurrentHourTotal = stepsDataLastHourActuals.reduce((t, s) => t += s.value, 0)
        if (stepsDataLastHourActuals.length !== 0) {
            infoTitle.innerText = `${outputCurrentHourTotal} steps so far this hour ... (${curD.getHours()}-${curD.getHours()+1})`
                
            infoContent.innerText = outputCurrentHourSteps
        } else {
            infoTitle.innerText = `No steps so far this hour ... (${curD.getHours()}-${curD.getHours()+1})`
            infoContent.innerText = ""
        }
    } else {
        infoTitle.innerText = "Only shown for current day"
        infoContent.innerText = ""
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

function changeTableHeader() {
    let infoTitle = document.querySelector('#infoTitle')
    let infoContent = document.querySelector('#infoContent')
    
    document.getElementById("stepsTableBody").innerText = ""
    
  if (document.getElementById("tglDisplay").checked){
    document.getElementById("hdrWeb").classList.add("hdrHidden")
    document.getElementById("hdrExcel").classList.remove("hdrHidden")
    document.getElementById("fa-excel").classList.add("selectedBackground")
    document.getElementById("fa-web").classList.remove("selectedBackground")

  } else {
    document.getElementById("hdrExcel").classList.add("hdrHidden")
    document.getElementById("hdrWeb").classList.remove("hdrHidden")
    
    document.getElementById("fa-web").classList.add("selectedBackground")
    document.getElementById("fa-excel").classList.remove("selectedBackground")
  }
    getSteps()
}

function getRefreshedToken() {
  console.log('getRefreshToken')
  let urlFB = 'https://api.fitbit.com/oauth2/token'
  
  fetch(urlFB,{
    method: "POST",
    mode: 'no-cors',
    headers: {"Authorization": "Basic " + accessToken}
  })
  .then(response => response.json())
  .then(data => console.log(data))
}


// function copyStats(){
//   let body = document.body, range, sel;
//   let theTable = document.getElementById("stepsTableBody")
	
//   if (document.createRange && window.getSelection) {
// 		range = document.createRange();
// 		sel = window.getSelection();
// 		sel.removeAllRanges();
// 		try {
// 			range.selectNodeContents(theTable);
// 			sel.addRange(range);
// 		} catch (e) {
// 			range.selectNode(theTable);
// 			sel.addRange(range);
// 		}
// 	} else if (body.createTextRange) {
// 		range = body.createTextRange();
// 		range.moveToElementText(theTable);
// 		range.select();
// 	}
// }

// var copyBtn = document.querySelector('#btnCopy');
// copyBtn.addEventListener('click', function () {
//   console.log("Hi 1");
//   var theTable = document.querySelector('#stepsTable');
//   console.log(theTable);
//   // create a Range object
//   var range = document.createRange();  
//   console.log(range);
//   // set the Node to select the "range"
//   range.selectNode(theTable);
//   console.log(range);
//   // add the Range to the set of window selections
//   window.getSelection().addRange(range);
   
//   // execute 'copy', can't 'cut' in this case
//   document.execCommand('copy');
//   console.log("Hi 2");
// }, false);
