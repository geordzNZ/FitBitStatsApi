
const access_token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkM4Vk4iLCJzdWIiOiIyQ0pHSEQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcmFjdCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNjMyOTM5MjE1LCJpYXQiOjE2MzAzNDcyMTV9.lGH9vBzjXt2luv2ThLY5b7PabBCBEA7AzLrxEQ-SRhQ"


fetch('https://api.fitbit.com/1/user/-/profile.json',{
  method: "GET",
  headers: {"Authorization": "Bearer " + access_token}
})
.then(response => response.json())
.then(json => console.log(json))