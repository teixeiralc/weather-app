function weatherApp() {
  // Make sure to not share this file online, as it will contain your api key
  // Certifique-se de não compartilhar este arquivo online, pois ele coneterá sua api key
  const YOUR_API_KEY = 'paste here your openweather api key';
  const wrapper = document.querySelector('.wrapper');

  const inputSection = wrapper.querySelector('.input');
  const inputInfo = inputSection.querySelector('.info');
  const input = inputSection.querySelector('input');
  const locationBtn = inputSection.querySelector('button');

  const results = wrapper.querySelector('.results');
  const weatherIcon = results.querySelector('img');

  const arrow = wrapper.querySelector('header i');

  let api;

  function onError(error) {
    // Displays an error message if the getCurrentPosition() goes wrong or is declined by the user
    inputInfo.innerText = error.message;
    inputInfo.classList.add('error');
  }

  function displayData(data) {
    if (data.cod === '404') {
      // if input.value is not accepted by the api
      inputInfo.classList.replace('pending', 'error');
      inputInfo.innerText = `${input.value} não é uma cidade válida.`;
    } else {
      const city = data.name;
      const { id } = data.weather[0];
      const { feels_like: feelsLike, humidity, temp } = data.main;
      let description;

      // verification by the weather id to display the dynamic icon and text
      if (id >= 200 && id <= 232) {
        weatherIcon.src = './icons/storm.svg';
        description = 'Tempestade';
      } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
        weatherIcon.src = './icons/rain.svg';
        description = 'Chuva';
      } else if (id >= 600 && id <= 622) {
        weatherIcon.src = './icons/snow.svg';
        description = 'Neve';
      } else if (id >= 701 && id <= 781) {
        weatherIcon.src = './icons/haze.svg';
        description = 'Neblina';
      } else if (id === 800) {
        weatherIcon.src = './icons/clear.svg';
        description = 'Tempo limpo';
      } else if (id >= 801 && id <= 804) {
        weatherIcon.src = './icons/cloud.svg';
        description = 'Nublado';
      }

      results.querySelector('.temp .num').innerText = Math.round(temp);
      results.querySelector('.weather').innerText = description;
      results.querySelector('.location span').innerText = city;
      results.querySelector('.details .temp .num').innerText = Math.round(feelsLike);
      results.querySelector('.details .humidity .num').innerText = `${Math.round(humidity)}%`;

      // resets the input screen and displays the results
      inputInfo.classList.remove('pending', 'error');
      input.value = '';
      wrapper.classList.add('active');
    }
  }

  async function fetchData(URL) {
    inputInfo.innerText = 'Buscando os dados...';
    inputInfo.classList.add('pending');
    try {
      const weatherApi = await fetch(URL);
      const responseJson = await weatherApi.json();
      displayData(responseJson);
    } catch {
      inputInfo.innerText = 'Algo deu errado, tente novamente.';
      inputInfo.classList.replace('pending', 'error');
    }
  }

  function requestApi(city) {
    // requests the API by the input.value
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${YOUR_API_KEY}`;
    fetchData(api);
  }

  function onSuccess(position) {
    // requests the API by the geolocation of the device
    const { latitude: lat, longitude: lon } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${YOUR_API_KEY}`;
    fetchData(api);
  }

  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && input.value !== '') {
      requestApi(input.value);
    }
  });

  locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert('O seu navegador não suporta geolocalização');
    }
  });

  arrow.addEventListener('click', () => {
    wrapper.classList.remove('active');
  });
}

weatherApp();
