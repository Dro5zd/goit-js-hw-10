export const fetchCountries = (value) => {
  return fetch(`https://restcountries.com/v3.1/name/${value}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.status);
      }
      return res.json();
    })
};


