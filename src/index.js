import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import _ from 'lodash';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

let input = document.querySelector('#search-box');
let countryInfo = document.querySelector('.country-info');
let countryList = document.querySelector('.country-list');

input.addEventListener('input', _.debounce(e => {
    let countryName = e.target.value.trim();
    if (countryName === '') {
      nullFunc();
      return;
    }
    countryList.innerHTML = 'loading...';
    return fetchCountries(countryName)
      .then(countries => {
        if (countries.length > 10) {
          nullFunc();
          return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
        renderCountriesList(countries);
        countryInfoOnclickHandler(countries);
      })
      .catch(error => {
        nullFunc();
        return Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
  , DEBOUNCE_DELAY));

function nullFunc() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function renderCountriesList(countries) {
  if (countries.length === 1) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = countries.map(c => {
      return `<h2>${c.name['official']}</h2>
                    <img src='${c.flags['svg']}' alt='${c.name}' width='500'>
                    <p><b>Capital</b>: ${c.capital}</p>
                    <p><b>Population</b>: ${c.population}</p>
                    <p><b>Languages</b>: ${Object.values(c.languages)}</p>`;
    });
  } else if (countries.length < 10) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = countries.map(c => {
      return `<li class='country-li'>
                       <img src='${c.flags['svg']}' alt='${c.name['official']}' width='50'>
                       <p >${c.name['official']}</p>
                    </li>`;
    }).join('');
  }
}

function countryInfoOnclickHandler(countries) {
  document.querySelector('.country-list').addEventListener('click', (e) => {
    let filteredCountry = countries.filter(c => e.target.innerHTML === c.name['official'])[0];
    const { name, flags, capital, population, languages } = filteredCountry;
    countryList.innerHTML = '';
    return countryInfo.innerHTML = `<h2>${name['official']}</h2>
                    <img src='${flags['svg']}' alt='${name}' width='500'>
                    <p><b>Capital</b>: ${capital}</p>
                    <p><b>Population</b>: ${population}</p>
                    <p><b>Languages</b>: ${Object.values(languages)}</p>`;
  });
}