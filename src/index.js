import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import _ from 'lodash';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

let input = document.querySelector('#search-box');


input.addEventListener('input', _.debounce(e => {
    if (e.target.value === '') {
      document.querySelector('.country-info').innerHTML = '';
      document.querySelector('.country-list').innerHTML = '';
      return
    }
    return fetchCountries(e.target.value)
      .then(countries => countriesMarkup(countries))
      .catch(error => onError(error));
  }
  , DEBOUNCE_DELAY));

// Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
// Notiflix.Notify.failure('Oops, there is no country with that name')

function countriesMarkup(countries) {
  if (countries.length === 1) {
    document.querySelector('.country-list').innerHTML = '';
    document.querySelector('.country-info').innerHTML = countries.map(c => {
      return `<img src='${c.flags['png']}' alt='${c.name['common']}'> ${c.name['common']}`;
    });
  } else if (countries.length < 10) {
    document.querySelector('.country-info').innerHTML = '';
    document.querySelector('.country-list').innerHTML = countries.map(c => {
      return `<li>${c.flag} ${c.name['common']}</li>`;
    }).join('');
  }
}

function onError(countries) {
  if (countries.length > 10) {
    document.querySelector('.country-list').innerHTML = '';
    return Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
  }
}


