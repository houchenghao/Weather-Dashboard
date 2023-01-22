
const openWeatherMapAPIKey = "50683084c635b159436650822e72d357";
const units = "imperial";
const searchInputEl = document.querySelector("#search-input");
const searchFormEl = document.querySelector("#search-form");
const searchHistoryContainerEl = document.querySelector("#search-history");
const todayWeatherEl = document.querySelector("#today-weather");
const forecastWeatherEl = document.querySelector("#forecast-weather")
const forecastContainerEl = document.querySelector("#forcast-container")
                                                

const localStorageKey = "searchHistory";


function getWeatherAPI(){
    const city = searchInputEl.value;

    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units +"&APPID=" + openWeatherMapAPIKey;

    fetch(url)
        .then(function(response){
            if(!response.ok){
                throw response.json();
            }
            return response.json();  
        })
        .then(function(data){
            //console.log(data);
            // console.log(data.name);
            // console.log(data.dt);
            // console.log(data.weather[0].icon);
            // console.log(data.main.temp);
            // console.log(data.wind.speed);
            // console.log(data.main.humidity);

            const date = dayjs.unix(data.dt).format('D/M/YYYY')

            while(todayWeatherEl.lastElementChild){
                todayWeatherEl.removeChild(todayWeatherEl.lastElementChild);
            }
            
            const todayCityDateEl = document.createElement("h1");
            const todayTempEl = document.createElement("p");
            const todayWindEl = document.createElement("p");
            const todayHumidityEl = document.createElement("p");
            const weatherImageEl = document.createElement("img");


            weatherImageEl.setAttribute("src",`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            weatherImageEl.setAttribute("width","40px");
            //weatherImageEl.setAttribute("height","50px");

            
            todayCityDateEl.textContent = `${data.name} ${date}`;
            todayTempEl.textContent = `Temp: ${data.main.temp} °F`;
            todayWindEl.textContent = `Wind: ${data.wind.speed} MPH`
            todayHumidityEl.textContent = `Humidity: ${data.main.humidity} %`

            todayCityDateEl.append(weatherImageEl);

            todayWeatherEl.appendChild(todayCityDateEl);
            todayWeatherEl.appendChild(todayTempEl);
            todayWeatherEl.appendChild(todayWindEl);
            todayWeatherEl.appendChild(todayHumidityEl);

            //todayWeatherEl.style.border = "1px solid rgb(128, 128, 128)"

            //console.log(data.coord);
            //console.log(data.coord.lon);
            //console.log(data.coord.lat);
        
            displayHistory(data.name);

            getWeatherForecast(data.coord.lat,data.coord.lon);
            
        })
        .catch(function (error) {
            console.error(error);
        });
}

function getWeatherForecast(lat,lon){
    
    var url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat +"&lon=" + lon +"&units=" + units +"&appid=" + openWeatherMapAPIKey;

    fetch(url)
    .then(function(response){
        if(!response.ok){
            throw response.json();
        }
        return response.json();  
    })
    .then(function(data){
            console.log(data.list);

            const arrayInterval = data.list.length/5; //8
            //console.log(arrayInterval)
            // console.log(data.dt);
            // console.log(data.weather[0].icon);
            // console.log(data.main.temp);
            // console.log(data.wind.speed);
            // console.log(data.main.humidity);
            
            while(forecastContainerEl.lastElementChild){
                forecastContainerEl.removeChild(forecastContainerEl.lastElementChild);
            }

            const forecastListEl = document.createElement("ol");          
            forecastListEl.classList.add("forecast-ol");

         for (var i = data.list.length-1; i >= 0; i=i-arrayInterval){
            console.log(i);

            const date = dayjs.unix(data.list[i].dt).format('D/M/YYYY')

            const infoContainer = document.createElement("div");
            const listEl = document.createElement("li");
            const forecastDateEl = document.createElement("p");
            const forecastTemp = document.createElement("p");
            const forecastWindEl = document.createElement("p");
            const forecastHumidityEl = document.createElement("p");
            const forecastWeatherConditionImageEl = document.createElement("img");

            forecastDateEl.textContent = `${date}`;
            forecastTemp.textContent = `Temp: ${data.list[i].main.temp} °F`;
            forecastWindEl.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
            forecastHumidityEl.textContent = `Humidity: ${data.list[i].main.humidity} %`;
            
            //forecastDateEl.setAttribute("style","font-weight:bold");
            //forecastWeatherConditionImageEl.setAttribute("src",`https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`);

            forecastDateEl.style.fontSize = "25px"
            infoContainer.style.width = "19%"
            forecastDateEl.style.fontWeight = "bold";
            forecastWeatherConditionImageEl.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
            forecastWeatherConditionImageEl.style.width = "40px";
            //forecastWeatherConditionImageEl.setAttribute("width","40px");

            listEl.style.backgroundColor = "rgb(10, 25, 94)";
            listEl.style.color = "rgb(240, 255, 255)";
            
            listEl.appendChild(forecastDateEl);
            listEl.appendChild(forecastWeatherConditionImageEl);
            listEl.appendChild(forecastTemp);
            listEl.appendChild(forecastWindEl);
            listEl.appendChild(forecastHumidityEl);

            infoContainer.appendChild(listEl);
            forecastListEl.appendChild(infoContainer);
            forecastContainerEl.appendChild(forecastListEl);
         }
        }
    )
    .catch(function (error) {
        console.error(error);
      })    
}

function saveToLocalStorage(newHistoryList){
    localStorage.setItem(localStorageKey,JSON.stringify(newHistoryList))
}

function getFromLocalStorage(){
    var historyList = JSON.parse(localStorage.getItem(localStorageKey));

    if(historyList==null){
        var historyList = [];
    }

    return historyList;
}

function displayHistory(newSearchCity){
    const historyList = getFromLocalStorage();
    //filter the duiplicated city 
    if(newSearchCity){
        historyList.unshift(newSearchCity);
        //console.log(historyList)
        for(let i = 0; i<historyList.length;i++){
            for(let j = 0; j<historyList.length;j++){
                if (i!=j){
                    if(historyList[i]===historyList[j]){
                        historyList.splice(j,1);
                    }
                }
            }
        }
        saveToLocalStorage(historyList);
    }

    const searchlistEl = document.createElement("ol");
    //var child = searchHistoryContainerEl.lastElementChild;
    while(searchHistoryContainerEl.lastElementChild){
        searchHistoryContainerEl.removeChild(searchHistoryContainerEl.lastElementChild);
    }

    for(let i = 0; i < historyList.length; i++){
        const liEl = document.createElement("li");
        const btnEl = document.createElement("button");
        btnEl.textContent = historyList[i];
        liEl.appendChild(btnEl);
        searchlistEl.appendChild(liEl);
        searchHistoryContainerEl.appendChild(searchlistEl);

        btnEl.style.width = "100%";
        btnEl.style.padding = "10px";
        btnEl.style.marginTop = "10px";
        btnEl.style.fontSize = "18px";

    }
}

function clickFromHistoryList(event){
    event.preventDefault();
    var targetEvent = event.target.textContent;
    console.log(targetEvent);
    searchInputEl.value = targetEvent;
    getWeatherAPI();
}


function start(event){
    event.preventDefault();
    
    getWeatherAPI();
}


displayHistory();
searchFormEl.addEventListener('submit', start);

searchHistoryContainerEl.addEventListener('click',clickFromHistoryList)