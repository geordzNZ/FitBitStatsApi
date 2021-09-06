import { myName, myAddr, accessToken} from './shhh.js'

//const access_token = "used to go here"


//Button Listeners
// document.querySelector('#btnAuth').addEventListener('click', getAuth)
document.querySelector('#btnProfile').addEventListener('click', getProfile)
document.querySelector('#btnDevices').addEventListener('click', getDevices)
document.querySelector('#btnTodaySteps').addEventListener('click', getTodaySteps)
document.querySelector('#btnPastSteps1').addEventListener('click', getPastSteps1)
document.querySelector('#btnPastSteps2').addEventListener('click', getPastSteps2)
document.querySelector('#btnXDateSteps').addEventListener('click', getXDateSteps)


// function getAuth(){
//   //Get Data
//   fetch('https://api.fitbit.com/1/user/-/profile.json',{
//     method: "GET",
//     headers: {"Authorization": "Bearer " + access_token}
//   })
//   .then(response => response.json())
//   .then(json => console.log(json))
// }


function getProfile(){
  // console.log(myName,myAddr)
  fetch('https://api.fitbit.com/1/user/-/profile.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + accessToken}
  })
  .then(response => response.json())
  .then(json => console.log(json))
}


function getTodaySteps(){

  let res = ''
  fetch('https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + accessToken}
  })
  .then(response => response.json())
  .then(data => displaySteps(data))
}

function getPastSteps1(){
  let res = ''
  fetch('https://api.fitbit.com/1/user/-/activities/steps/date/2021-09-02/1d.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + accessToken}
  })
  .then(response => response.json())
  .then(data => displaySteps(data))
}

function getPastSteps2(){
  let res = ''
  fetch('https://api.fitbit.com/1/user/-/activities/steps/date/2021-08-31/1d.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + accessToken}
  })
  .then(response => response.json())
  .then(data => displaySteps(data))
}

function getXDateSteps(){
  let xDate = document.querySelector('#inpXDate').value
  let res = ''
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

  //HTML Elements
  let stepsTotal = document.getElementById("stepsTotal")
  let stepsDate = document.getElementById("stepsDate")
  let stepsBreakdown = document.getElementById("stepsBreakdown")
  
  console.log(data)

  //Work with data on the page
  stepsBreakdown.innerText = ''
  stepsTotal.innerText = data['activities-steps'][0].value
  stepsDate.innerText = data['activities-steps'][0].dateTime

  console.log(dataLength)

  for (let i=0; i<dataLength; i+=15){
    //console.log(i)
    let div = document.createElement("div")
    let stepCtr = 0
    for (let j=i; j<i+15; j++){
      //console.log('  --',j)
      stepCtr += stepsData[j].value
      
      div.innerHTML = `${stepsData[i].time} to ${j===1438 ? '00:00:00' : stepsData[j+1].time} = ${stepCtr}`
      stepsBreakdown.appendChild(div)
      //console.log(`${stepsData[i].time} / ${stepsData[j+1].time} -- ${i} / ${j} / ${j+1}`)
    }
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
