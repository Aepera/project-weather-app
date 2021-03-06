const apiKey = 'c292983c49498a3cff73c1806ef955ba'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=' + apiKey
const weatherForcastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID='+ apiKey
const weatherSection = document.getElementById('weatherSection')
const forcast = document.getElementById('forcast')

// Function that expect date in format that can be used to create a date object
// Function also adjust for iOS limitations in Date
const returnWeekDay = (date) => {
  const daysInWeek = ["Sunday", "Monday","Tuesday", "Wednesday","Thursday","Friday","Saturday"];
  let inputDate = new Date(date.replace(' ', 'T'));
  return daysInWeek[inputDate.getDay()];
}

const fetchTodaysWeather = () => {
  fetch(weatherUrl)
    .then((response) => {
      if (response.ok) {
        return response.json() 
      } else {
          throw 'Something went wrong'
      }
    })

    .then((json) => {
      let tempToday = `${json.main.temp}`
      let tempTodayRounded = Math.round(tempToday)
      let cityName = json.name;
      let weatherDescription = json.weather[0].description;
      let iconId = json.weather[0].icon;
      let sunriseAPI = `${json.sys.sunrise}`
      let sunsetAPI = `${json.sys.sunset}`
      let sunrise = new Date(sunriseAPI*1000).toLocaleTimeString([], {timeStyle: 'short'});
      let sunset = new Date(sunsetAPI*1000).toLocaleTimeString([], {timeStyle: 'short'});

      weatherSection.innerHTML = `
        <div class="today-temp">
          <div class="today">
            <h2>${tempTodayRounded} °C</h2>
            <h1>${cityName}</h1>
            <h3>${weatherDescription} </h3>
          </div>
          <div class="weather-icon">
            <img src="http://openweathermap.org/img/wn/${iconId}@2x.png">
          </div>
        </div>
        <div class="sun-hours">
          <p>Sunrise: ${sunrise}</p>
          <p>Sunset: ${sunset}</p>
        </div>
        `
    })
    .catch(error => {
      weatherSection.innerHTML = `${error}`
    })
}

const fetch5DayForcast = () => {
  fetch(weatherForcastUrl)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw 'Something went wrong'
      }
    })
    .then((json) => {
      const filteredForecast = json.list.filter(item => item.dt_txt.includes('12:00'))
      console.log(filteredForecast)

      filteredForecast.forEach((filteredForecast) => {
        let dayInWeek = returnWeekDay(filteredForecast.dt_txt)
        let temp5Days = `${filteredForecast.main.temp}`
        let temp5DaysRounded = Math.round(temp5Days)
        let iconId = filteredForecast.weather[0].icon
        forcast.innerHTML += `
          <div class='five-days'>
            <p> ${dayInWeek}: </p>
            <img src="http://openweathermap.org/img/wn/${iconId}@2x.png">
            <p> ${temp5DaysRounded} °C </p>
          </div>
          `
      })
    })
    .catch(error => {
      filteredForecast.innerHTML = `${error}`
    })
}


fetchTodaysWeather()
fetch5DayForcast()