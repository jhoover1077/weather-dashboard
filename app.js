let input1
let uvdata
let loggedcity = JSON.parse(localStorage.getItem('citymultiple')) || []
let viewpoint = document.getElementById('cityInfo')
let daysfive = document.getElementById('fiveDay')
let choosecity = document.getElementById('loggedcity')



//API call
document.addEventListener('click', () => {
  let target = event.target
  if (target.classList.contains('btn')) {
    input1 = document.getElementById('findcity').value
    weatherdot(input1)
    document.getElementById('findcity').value = ''
  }
})

//log previous city
const previouscity = _ => {
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
const weatherdot = input1 => {
  //pushing input1 to local storage
  input1 = titleCase(input1)
  loggedcity.push(input1)
  console.log(loggedcity)
  localStorage.setItem('citymultiple', JSON.stringify(loggedcity))
  previouscity()
  weatherincity(input1)
}

const weatherincity = input1 => {
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
      let uvn = document.createElement('p')
      uvn.textContent = 'UV Index: '
      let uvs = document.createElement('span')
      uvs.textContent = `${value}`
      value = Math.floor(value)
      if (value < 3) {
        uvs.setAttribute('class', 'Safe')
      }
      else if (value > 2 && value < 6) {
        uvs.setAttribute('class', 'Medium')
      }
      else if (value > 5 && value < 8) {
        uvs.setAttribute('class', 'Moderate')
      }
      else {
        uvs.setAttribute('class', 'High')
      }
      uvn.append(uvs)
      viewpoint.append(uvn)
    })

    .catch(error => console.error(error))
}

const fivedayget = (lon, lat) => {
  daysfive.innerHTML = ''
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=504fb55759317621b3658208c57633c9`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      //convert
      let list = data.list
      console.log(moment.unix(list[0].dt).format("MM/DD/YYYY"))
      for (let i = 7; i < list.length; i += 7) {
        let daysoffive = document.createElement('div')
        daysoffive.setAttribute('class', 'col-sm-2.4 fiveDayStyle')
        daysoffive.innerHTML = `
            <h5>${moment.unix(list[i].dt).format("MM/DD/YYYY")}</h5>
            <img src ="https://openweathermap.org/img/wn/${list[i].weather[0].icon}.png" alt = "${list[i].weather[0].icon}">
            <p>Temp: ${farenheit(list[i].main.temp)} ºF</p>
            <p>Humidity: ${list[i].main.humidity}%</p>
        `
        console.log(daysoffive)
        daysfive.append(daysoffive)
      }
    })
    .catch(error => console.error(error))
}

previouscity()