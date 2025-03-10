document.getElementById("search-button").addEventListener("click", fetchCountryData);

async function fetchCountryData() {
    const countryName = document.getElementById("country-input").value.trim();
    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    const countryInfoSection = document.getElementById("country-info");
    const borderingCountriesSection = document.getElementById("bordering-countries");

    // Clear previous results
    countryInfoSection.innerHTML = "";
    borderingCountriesSection.innerHTML = "";

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        
        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const countryData = await response.json();
        const country = countryData[0];

        // Extract required data
        const capital = country.capital ? country.capital[0] : "No capital available";
        const population = country.population.toLocaleString();
        const region = country.region;
        const flagUrl = country.flags.svg || country.flags.png;
        const borders = country.borders || [];

        // Display country info
        countryInfoSection.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flagUrl}" alt="Flag of ${country.name.common}" width="200">
        `;

        // Fetch and display bordering countries
        if (borders.length > 0) {
            const borderPromises = borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                    .then(res => res.json())
                    .then(data => ({
                        name: data[0].name.common,
                        flag: data[0].flags.svg || data[0].flags.png
                    }))
            );

            const borderingCountries = await Promise.all(borderPromises);

            borderingCountriesSection.innerHTML = `<h3>Bordering Countries:</h3>`;
            borderingCountries.forEach(country => {
                borderingCountriesSection.innerHTML += `
                    <p>${country.name}</p>
                    <img src="${country.flag}" alt="Flag of ${country.name}" width="100">
                `;
            });
        } else {
            borderingCountriesSection.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        countryInfoSection.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}
