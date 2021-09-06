import { myName, myAddr, accessToken} from './shhh.js'

//const access_token = "used to go here"


//Button Listeners
// document.querySelector('#btnAuth').addEventListener('click', getAuth)
document.querySelector('#btnProfile').addEventListener('click', getProfile)
document.querySelector('#btnDevices').addEventListener('click', getDevices)
document.querySelector('#btnGetSteps').addEventListener('click', getSteps)


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
