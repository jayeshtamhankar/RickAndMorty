document.addEventListener('DOMContentLoaded', () => {
    const quoteWrap = document.getElementById('quote-wrapper') // Get the element to display quotes
    const charList = document.getElementById('char-list') // Get the element to display characters

    let currentQuote = 0 // Keep track of the current quote index

    // Function to fetch quotes from a JSON file
    const getQuote = async () => {
        try {
            const response = await fetch('quotes/quotes.json') // Fetch the JSON file
            const data = await response.json() // Parse the JSON data
            return data.quotes // Return the array of quotes
        } catch (error) {
            console.log(error) // Log any error that occurs during fetching
        }
    }

    // Function to display a quote in the quote wrapper
    const putQuote = async () => {
        quoteWrap.innerHTML = `` // Clear the existing quote content

        try {
            const quotes = await getQuote() // Fetch the quotes
            if (quotes.length === 0) return // If no quotes are found, do nothing

            const quoteCycle = quotes[currentQuote] // Get the current quote

            const quoteElement = document.createElement('div') // Create a div element for the quote
            quoteElement.setAttribute('class', 'quote') // Set the class name to 'quote'
            quoteElement.innerHTML = `
                <h1>
                    <i class="fa-solid fa-quote-left"></i>
                    ${quoteCycle.text}
                    <i class="fa-solid fa-quote-right"></i>
                </h1>
            `
            quoteWrap.appendChild(quoteElement) // Append the quote element to the wrapper

            currentQuote = (currentQuote + 1) % quotes.length // Increment the current quote index and cycle back to the beginning
        } catch (error) {
            console.error('Failed to put quotes:', error); // Log any errors during quote display
        }
    }

    putQuote() // Display the initial quote

    // Update the quote every 10 seconds
    setInterval(putQuote, 10000)

    // Change the quote when the quote wrapper is clicked
    quoteWrap.addEventListener('click', putQuote)

    // Function to fetch Rick and Morty character data from the API
    const getQuoteData = async () => {
        const apiURL = 'https://rickandmortyapi.com/api/character'

        try {
            const response = await axios.get(apiURL) // Fetch the data using axios

            if (response.data.info && response.data.results) {
                const Info = response.data.info
                const Results = response.data.results
                return { Info, Results } // Return the info and results from the API response
            } else {
                console.log('Info or Results not found in response') // Log if info or results are missing
                return { Info: null, Results: null } 
            }

        } catch (error) {
            console.error(error) // Log any errors during data fetching
        }
    }

    // Function to display Rick and Morty characters on the page
    const createChar = async () => {
        const { Info, Results } = await getQuoteData() // Fetch character data

        charList.innerHTML = `` // Clear the existing character list

        try {
            Results.forEach(char => { // Loop through each character in the results
                const characters = document.createElement('div') // Create a div for the character

                characters.setAttribute('class', 'character') // Set the class name to 'character'
                characters.innerHTML = `
                    <img src="${char.image}" alt="${char.name}"> 
                    <h2>${char.name}</h2>
                    <h4>Status <span id="stat" class="stat">${char.status}</span></h4> 
                    <p>
                        <span class="tag">species</span> 
                        <span class="info">${char.species}</span>
                    </P>
                    <p>
                        <span class="tag">gender</span>
                        <span class="info">${char.gender}</span>
                    </P>
                    <p>
                        <span class="tag">origin</span>
                        <span class="info">${char.origin.name}</span>
                    </P>
                    <p>
                        <span class="tag">location</span>
                        <span class="info">${char.location.name}</span>
                    </P>
                `
                charList.appendChild(characters) // Append the character element to the list
            })
        } catch (error) {
            console.error(error); // Log any errors during character display
        }

        checkStatus() // Check and style the status of each character
    }

    createChar() // Display the initial characters

    // Function to style the status indicators based on the status text
    const checkStatus = () => {
        const status = document.querySelectorAll('.stat') // Select all status elements

        status.forEach(stat => {
            if (stat.textContent === 'Alive') {
                stat.style.backgroundColor = '#A6C85A' // Green background for 'Alive'
            } 

            if (stat.textContent === 'Dead') {
                stat.style.backgroundColor = '#B84495' // Red background for 'Dead'
            }

            if (stat.textContent === 'unknown') {
                stat.style.backgroundColor = '#F7F3E7' // Light gray background for 'unknown'
                stat.style.color = '#1D3525' // Dark text color for 'unknown'
            }
            
        })
    }
    
})