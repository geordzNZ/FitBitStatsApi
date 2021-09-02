
const access_token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkM4Vk4iLCJzdWIiOiIyQ0pHSEQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNjMyOTM5MjE1LCJpYXQiOjE2MzAzNDg2NzJ9.f1iyj9s0pAfA_SoQHWCLnz4Rp-QZWOsBbpUfM94UMcs"


//Button Listeners
// document.querySelector('#btnAuth').addEventListener('click', getAuth)
document.querySelector('#btnProfile').addEventListener('click', getProfile)
document.querySelector('#btnTodaySteps').addEventListener('click', getTodaySteps)
document.querySelector('#btnDevices').addEventListener('click', getDevices)

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
  fetch('https://api.fitbit.com/1/user/-/profile.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + access_token}
  })
  .then(response => response.json())
  .then(json => console.log(json))
}


function getTodaySteps(){
  let res = ''
  fetch('https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json',{
    method: "GET",
    headers: {"Authorization": "Bearer " + access_token}
  })
  .then(response => response.json())
  .then(data => displaySteps(data))
}

function displaySteps(data){
  // console.log(data['activities-steps-intraday']['dataset'].length)
  // console.log(data['activities-steps-intraday']['dataset'][0])
  // console.log(data['activities-steps-intraday']['dataset'][1])
  // console.log(data['activities-steps-intraday']['dataset'][2])
  // console.log(data['activities-steps-intraday']['dataset'][3])
  // console.log(data['activities-steps-intraday']['dataset'][3]['time'])
  // console.log(data['activities-steps-intraday']['dataset'][3]['value'])
  // document.querySelector('#stepsTotal').innerText = data['activities-steps'][0]['value']
  // document.querySelector('#stepsBreakdown').innerText = data['activities-steps-intraday']['dataset'].length

  let dataLength = data['activities-steps-intraday']['dataset'].length
  let stepsTotal = document.getElementById("stepsTotal");
  let stepsBreakdown = document.getElementById("stepsBreakdown");

  for (let i=0;i<dataLength;i++){
    let div = document.createElement("div");
    div.innerHTML = 'Time Part: ' + data['activities-steps-intraday']['dataset'][i].time + '  -  ' + data['activities-steps-intraday']['dataset'][i].value + ' steps'
    stepsBreakdown.appendChild(div);
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
