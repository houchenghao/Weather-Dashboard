
const openWeatherMapAPIKey = "50683084c635b159436650822e72d357";
const units = "imperial";
const searchInputEl = document.querySelector("#search-input");
const searchFormEl = document.querySelector("#search-form");
const searchHistoryContainerEl = document.querySelector("#search-history");
const todayWeatherEl = document.querySelector("#today-weather");
                                                

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

            //https://openweathermap.org/img/wn/04n@2x.png

            // console.log(data.main.temp);
            // console.log(data.wind.speed);
            // console.log(data.main.humidity);

            const date = dayjs.unix(data.dt).format('D/M/YYYY')

            while(todayWeatherEl.lastElementChild){
                todayWeatherEl.removeChild(todayWeatherEl.lastElementChild);
            }
            
            const todayCityDateEl = document.createElement("p");
            const todayTempEl = document.createElement("p");
            const todayWindEl = document.createElement("p");
            const todayHumidityEl = document.createElement("p");
            const weatherImageEl = document.createElement("img");


            weatherImageEl.setAttribute("src",`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            weatherImageEl.setAttribute("width","50px");
            weatherImageEl.setAttribute("height","50px");

            
            todayCityDateEl.textContent = `${data.name} ${date}`;
            todayTempEl.textContent = `${data.main.temp} °F`;
            todayWindEl.textContent = `${data.wind.speed} MPH`
            todayHumidityEl.textContent = `${data.main.humidity} %`

            todayCityDateEl.append(weatherImageEl);

            todayWeatherEl.appendChild(todayCityDateEl);
            //todayWeatherEl.appendChild(weatherImageEl);
            todayWeatherEl.appendChild(todayTempEl);
            todayWeatherEl.appendChild(todayWindEl);
            todayWeatherEl.appendChild(todayHumidityEl);

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
        console.log(data);



    })
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