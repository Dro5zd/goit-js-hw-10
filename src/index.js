import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import _ from 'lodash';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

input.addEventListener('input', _.debounce(e => {
    const countryName = e.target.value.trim();
    if (countryName === '') {
      nullFunc();
      return;
    }
    countryList.innerHTML = 'loading...';
    return fetchCountries(countryName)
      .then(countries => {
        renderCountriesList(countries);
        countryInfoOnclickHandler(countries);
      })
      .catch(() => {
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
  const x = countries.length;
  switch (true) {
    case (x === 1):
      countryList.innerHTML = '';
      countryInfo.innerHTML = countries.map(c => {
        return `<h2>${c.name['official']}</h2>
                    <img src='${c.flags['svg']}' alt='${c.name}' width='500'>
                    <p><b>Capital</b>: ${c.capital}</p>
                    <p><b>Population</b>: ${c.population}</p>
                    <p><b>Languages</b>: ${Object.values(c.languages)}</p>`;
      });
      break;
    case (x < 10):
      countryInfo.innerHTML = '';
      countryList.innerHTML = countries.map(c => {
        return `<li class='country-li' data-country-name='${c.name['official']}'>
                 <img src='${c.flags['svg']}' alt='${c.name['official']}' width='50'>
                 <p >${c.name['official']}</p>
               </li>`;
      }).join('');
      break;
    default:
      nullFunc();
      return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function countryInfoOnclickHandler(countries) {
  document.querySelector('.country-list').addEventListener('click', (e) => {
    const filterValue = e.target.dataset.countryName || e.target.innerHTML || e.target.alt;
    const filteredCountry = countries.filter(c => filterValue === c.name['official'])[0];
    const { name, flags, capital, population, languages } = filteredCountry;
    countryList.innerHTML = '';
    return countryInfo.innerHTML = `<h2>${name['official']}</h2>
                    <img src='${flags['svg']}' alt='${name}' width='500'>
                    <p><b>Capital</b>: ${capital}</p>
                    <p><b>Population</b>: ${population}</p>
                    <p><b>Languages</b>: ${Object.values(languages)}</p>`;
  });
}