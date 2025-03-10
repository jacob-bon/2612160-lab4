document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-button");
    const countryInput = document.getElementById("country-input");
    const countryInfo = document.getElementById("country-info");
    const borderingCountries = document.getElementById("bordering-countries");

    searchBtn.addEventListener("click", fetchCountryData);

    async function fetchCountryData() {
        const countryName = countryInput.value.trim();
        if (!countryName) return;

        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
            if (!response.ok) throw new Error("Country not found");

            const [country] = await response.json(); // Destructuring to get the first match
            displayCountryInfo(country);
        } catch (err) {
            countryInfo.innerHTML = `<p class="error">Error: ${err.message}</p>`;
            borderingCountries.innerHTML = "";
        }
    }

    function displayCountryInfo(country) {
        const { name, capital, population, flags, borders = [] } = country;

        countryInfo.innerHTML = `
            <h2>${name.common}</h2>
            <img src="${flags.svg}" alt="Flag of ${name.common}" width="100">
            <p><strong>Capital:</strong> ${capital?.[0] || "N/A"}</p>
            <p><strong>Population:</strong> ${population.toLocaleString()}</p>
        `;

        displayBorderingCountries(borders);
    }

    async function displayBorderingCountries(codes) {
        if (codes.length === 0) {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
            return;
        }

        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes.join(",")}`);
            if (!response.ok) throw new Error("Bordering countries not found");

            const countries = await response.json();
            borderingCountries.innerHTML = `
                <h3>Bordering Countries:</h3>
                ${countries.map(({ name, flags }) => `
                    <div class="border-country">
                        <img src="${flags.svg}" alt="Flag of ${name.common}" title="${name.common}">
                    </div>
                `).join("")}
            `;
        } catch {
            borderingCountries.innerHTML = "<p>Could not fetch bordering countries.</p>";
        }
    }
});

