let input1
let uvdata
let loggedcity = JSON.parse(localStorage.getItem('citymultiple')) || []
let viewpoint = document.getElementById('cityInfo')
let daysfive = document.getElementById('fiveDay')
let choosecity = document.getElementById('loggedcity')



//API call by city name: api.openweathermap.org/data/2.5/weather?q=<cityName>
document.addEventListener('click', () => {
  let target = event.target
  if (target.classList.contains('btn')) {
    input1 = document.getElementById('lookforcity').value
    // console.log(input1)
    viewpointWeather(input1)
    //empty out input1
    document.getElementById('lookforcity').value = ''
  }
})


const showformercity = _ => {
  //set to empty before every render
  choosecity.innerHTML = ''
  for (let i = 0; i < loggedcity.length; i++) {
    let cityNode = document.createElement('div')
    cityNode.innerHTML = `${loggedcity[i]} <hr>`
    choosecity.append(cityNode)
  }
}
const farenheit = value => {
  value = (value * (9 / 5) - 459.67).toFixed(2)
  return value
}
//Capitalize first letter of every word in the string
const titleCase = str => {
  let splitStr = str.toLowerCase().split(' ');
  // console.log(splitStr)
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}
const viewpointWeather = input1 => {
  //pushing input1 to local storage
  input1 = titleCase(input1)
  loggedcity.push(input1)
  console.log(loggedcity)
  localStorage.setItem('citymultiple', JSON.stringify(loggedcity))
  showformercity()
  getCityWeather(input1)
}

const getCityWeather = input1 => {
  viewpoint.innerHTML = ''
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input1}&appid=504fb55759317621b3658208c57633c9`)
    .then(response => response.json())
    .then(({ main: { temp, humidity }, wind: { speed }, coord: { lon, lat } }) => {
      let info = document.createElement('div')
      temp = farenheit(temp)

      // console.log(temp, humidity, speed, lon, lat)
      info.innerHTML = `<h2>${input1} ${moment().format('MM/DD/YYYY')}</h2>
    <p>Temperature: ${temp} ºF</p>
    <p>Humidity: ${humidity}</p>
    <p> Wind Speed: ${speed} mph </p>
    `
      viewpoint.append(info)
      getuvdata(lon, lat)
      fivedayget(lon, lat)

    })
    .catch(error => console.error(error))
}
const getuvdata = (lon, lat) => {
  fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=504fb55759317621b3658208c57633c9&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(({ value }) => {
      let uvNode = document.createElement('p')
      uvNode.textContent = 'UV Index: '
      let uvSpan = document.createElement('span')
      uvSpan.textContent = `${value}`
      value = Math.floor(value)
      if (value < 3) {
        uvSpan.setAttribute('class', 'Safe')
      }
      else if (value > 2 && value < 6) {
        uvSpan.setAttribute('class', 'Medium')
      }
      else if (value > 5 && value < 8) {
        uvSpan.setAttribute('class', 'Moderate')
      }
      else {
        uvSpan.setAttribute('class', 'High')
      }
      uvNode.append(uvSpan)
      viewpoint.append(uvNode)
    })

    .catch(error => console.error(error))
}

const fivedayget = (lon, lat) => {
  daysfive.innerHTML = ''
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=504fb55759317621b3658208c57633c9`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      //converting unix time stamp to a date time
      let list = data.list
      console.log(moment.unix(list[0].dt).format("MM/DD/YYYY"))
      for (let i = 7; i < list.length; i += 7) {
        let fiveNode = document.createElement('div')
        fiveNode.setAttribute('class', 'col-sm-2.4 fiveDayStyle')
        fiveNode.innerHTML = `
            <h6>${moment.unix(list[i].dt).format("MM/DD/YYYY")}</h6>
            <img src ="https://openweathermap.org/img/wn/${list[i].weather[0].icon}.png" alt = "${list[i].weather[0].icon}">
            <p>Temp: ${farenheit(list[i].main.temp)} ºF</p>
            <p>Humidity: ${list[i].main.humidity}%</p>
        `
        console.log(fiveNode)
        daysfive.append(fiveNode)
      }
      // starts at index 0 and increases by 7
    })
    .catch(error => console.error(error))
}

showformercity()