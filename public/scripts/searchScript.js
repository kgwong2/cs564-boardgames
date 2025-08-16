// Set up player count slider
const playerCountCheckbox = document.getElementById('playerCountCheckboxId');
const playerCountSliderContainer = document.getElementById('playerCountSliderContainerId');

playerCountCheckbox.addEventListener('change', function() {
    if (this.checked) {
        // Append slider
        const playerCountSlider = document.createElement('input');
        playerCountSlider.type = 'range';
        playerCountSlider.min = 0;
        playerCountSlider.max = 999;
        playerCountSlider.value = 0;
        playerCountSlider.id = 'playerCountSliderId';
        playerCountSlider.classList.add('_slider');
        playerCountSliderContainer.append(playerCountSlider);

        // Append slider value
        const playerCountSliderValue = document.createElement('div');
        playerCountSliderValue.id = 'playerCountSliderValueId';
        playerCountSliderValue.classList.add('_sliderValue');
        playerCountSliderValue.innerText = 0;
        playerCountSliderContainer.append(playerCountSliderValue);

        // Update slider value as slider is dragged
        playerCountSlider.addEventListener('input', (event) => {
        const currentValue = event.target.value;
        playerCountSliderValue.innerText = currentValue; // Update a display element
        });

    } else {
        // Get elements to delete
        const playerCountSlider = document.getElementById('playerCountSliderId');
        const playerCountSliderValue = document.getElementById('playerCountSliderValueId');

        // Remove elements
        playerCountSlider.remove();
        playerCountSliderValue.remove();
    }
});

// Set up playtime slider
const playtimeCheckbox = document.getElementById('playtimeCheckboxId');
const playtimeSliderContainer = document.getElementById('playtimeSliderContainerId');

playtimeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        // Append slider
        const playtimeSlider = document.createElement('input');
        playtimeSlider.type = 'range';
        playtimeSlider.min = 0;
        playtimeSlider.max = 84000;
        playtimeSlider.value = 0;
        playtimeSlider.id = 'playtimeSliderId';
        playtimeSlider.classList.add('_slider');
        playtimeSliderContainer.append(playtimeSlider);

        // Append slider value
        const playtimeSliderValue = document.createElement('div');
        playtimeSliderValue.id = 'playtimeSliderValueId';
        playtimeSliderValue.classList.add('_sliderValue');
        playtimeSliderValue.innerText = 0;
        playtimeSliderContainer.append(playtimeSliderValue);

        // Update slider value as slider is dragged
        playtimeSlider.addEventListener('input', (event) => {
        const currentValue = event.target.value;
        playtimeSliderValue.innerText = currentValue; // Update a display element
        });

    } else {
        // Get elements to delete
        const playtimeSlider = document.getElementById('playtimeSliderId');
        const playtimeSliderValue = document.getElementById('playtimeSliderValueId');

        // Remove elements
        playtimeSlider.remove();
        playtimeSliderValue.remove();
    }
});

// Search button
const searchButton = document.getElementById('searchButtonId');

searchButton.addEventListener('click', async () => {
    try {
        // Get elements
        const gameTitleSearchField = document.getElementById('gameNameEfId');
        const gameContributorsSearchField = document.getElementById('gameContributorEfId');

        // Set search values
        let gameTitleValue = gameTitleSearchField.value;
        let gamePlayerCount;
        if (playerCountCheckbox.checked) {
            const playerCountSlider = document.getElementById('playerCountSliderId');
            gamePlayerCount = playerCountSlider.value;
        }
        let gameContributorValue = gameContributorsSearchField.value;
        let gamePlaytime;
        if (playtimeCheckbox.checked) {
            const playtimeSlider = document.getElementById('playtimeSliderId');
            gamePlaytime = playtimeSlider.value;
        }

        // Query from database based on search criteria...
        // No search criteria used
        if (gameTitleValue === '' && playerCountCheckbox.checked === false && gameContributorValue === '' && playtimeCheckbox.checked === false) {
            const zeroStateText = document.getElementById('zeroStateTextId');
            zeroStateText.innerText = 'No search criteria used.\nEnter search criteria to view a list of board games.';
            return;
        }

        // Set up loading
        const loadingContainer = document.getElementById('loadingContainerId');

        const loadingBar = document.createElement('div');
        loadingBar.id = 'loadingBar';
        loadingBar.classList.add('_loader');
        loadingContainer.append(loadingBar);
        
        const loadingText = document.createElement('div');
        loadingText.id = 'loadingText';
        loadingText.innerText = 'Loading...';
        loadingContainer.append(loadingText);

        // Clear out zero state text
        document.getElementById('searchZeroStateId').innerText = '';
        // Clear out search result text
        document.getElementById('_searchResultsCountId').innerText = '';


        let routeString;

        // All search criteria used
        if (gameTitleValue !== '' && playerCountCheckbox.checked && gameContributorValue !== '' && playtimeCheckbox.checked) {
            routeString = "all/" + gameTitleValue + "/" + gamePlayerCount + "/" + gamePlaytime + "/" + gameContributorValue;
        }
        // Three search criteria: Game title, Player count, Contributor
        else if (gameTitleValue !== '' && playerCountCheckbox.checked && gameContributorValue !== '') {
            routeString = "three/titleCountContr/" + gameTitleValue + "/" + gamePlayerCount + "/" + gameContributorValue;
        }
        // Three search criteria: Game title, Player count, Playtime
        else if (gameTitleValue !== '' && playerCountCheckbox.checked && playtimeCheckbox.checked) {
            routeString = "three/titleCountTime/" + gameTitleValue + "/" + gamePlayerCount + "/" + gamePlaytime;
        }
        // Three search criteria: Game title, Contributor, Playtime
        else if (gameTitleValue !== '' && gameContributorValue !== '' && playtimeCheckbox.checked) {
            routeString = "three/titleTimeContr/" + gameTitleValue + "/" + gamePlaytime + "/" + gameContributorValue;
        }
        // Three search criteria: Player count, Contributor, Playtime
        else if (playerCountCheckbox.checked && gameContributorValue !== '' && playtimeCheckbox.checked) {
            routeString = "three/countTimeContr/" + gamePlayerCount + "/" + gamePlaytime + "/" + gameContributorValue;
        }   
        // Two search criteria: Game title, Player count
        else if (gameTitleValue !== '' && playerCountCheckbox.checked) {
            routeString = "two/titleCount/" + gameTitleValue + "/" + gamePlayerCount;
        }
        // Two search criteria: Game title, Contributor
        else if (gameTitleValue !== '' && gameContributorValue !== '') {
            routeString = "two/titleContr/" + gameTitleValue + "/" + gameContributorValue;
        }
        // Two search criteria: Game title, Playtime
        else if (gameTitleValue !== '' && playtimeCheckbox.checked) {
            routeString = "two/titleTime/" + gameTitleValue + "/" + gamePlaytime;
        }
        // Two search criteria: Player count, Contributor
        else if (playerCountCheckbox.checked && gameContributorValue !== '') {
            routeString = "two/countContr/" + gamePlayerCount + "/" + gameContributorValue;
        }
        // Two search criteria: Player count, Playtime
        else if (playerCountCheckbox.checked && playtimeCheckbox.checked) {
            routeString = "two/countTime/" + gamePlayerCount + "/" + gamePlaytime;
        }
        // Two search criteria: Contributor, Playtime
        else if (gameContributorValue !== '' && playtimeCheckbox.checked) {
            routeString = "two/timeContr/" + gamePlaytime + "/" + gameContributorValue;
        }
        // One search criterion: Game title
        else if (gameTitleValue !== '') {
            let routeString = "gameName/" + gameTitleValue;
        }
        // One search criterion: Player count
        else if (playerCountCheckbox.checked) {
            let routeString = "playerCount/" + gamePlayerCount;
        }
        // One search criterion: Contributor
        else if (gameContributorValue !== '') {
            let routeString = "contributor/" + gameContributorValue;
        }
        // One search criterion: Playtime
        else if (playtimeCheckbox.checked) {
            routeString = "playtime/" + gamePlaytime;
        }

        // Query database
        let responseData = await fetch("/searchGames/" + routeString);
        let boardGameData = await responseData.json();
        let responseCount = await fetch("/searchCount/" + routeString);
        let boardGameCount = await responseCount.json();

        // Remove loading
        loadingBar.remove();
        loadingText.remove();

        // If no results...
        if (boardGameCount[0] === 0) {
            document.getElementById('searchZeroStateId').innerText = 'No results returned.';
            return;
        }

        // Show count
        const searchResults = document.getElementById('_searchResultsCountId');
        searchResults.innerText = 'Showing ' + boardGameCount[0] + ' results';

        const searchContainer = document.getElementById('searchContainerId');

        // Show games
        if (boardGameData.length > 0) {
            for (let i = 0; i < boardGameData.length; i++) {
                // Create container
                const gameContainer = document.createElement('div');
                gameContainer.classList.add('_listedGame');
                searchContainer.appendChild(gameContainer);

                // Create table
                const gameTable = document.createElement('table');
                gameContainer.appendChild(gameTable);

                // Row 1
                const tr1 = document.createElement('tr');
                gameTable.appendChild(tr1);

                // Image
                const imgColumn = document.createElement('td');
                imgColumn.classList.add('_gameImg');
                imgColumn.rowSpan = 2;

                let imgUrl = boardGameData[i].image;
                let htmlImg = "<img src='" + imgUrl + "' width='300'>";
                imgColumn.innerHTML = htmlImg;
                tr1.appendChild(imgColumn);

                // Game title
                const titleColumn = document.createElement('td');
                titleColumn.classList.add('_gameTitle');
                tr1.appendChild(titleColumn);

                const gameTitle = document.createElement('a');
                gameTitle.href = '/game/' + boardGameData[i].id;
                gameTitle.id = boardGameData[i].id;
                gameTitle.textContent = boardGameData[i].name;
                titleColumn.appendChild(gameTitle);

                // Row 2
                const tr2 = document.createElement('tr');
                gameTable.appendChild(tr2);

                const gameInfoColumn = document.createElement('td');
                gameInfoColumn.classList.add('_gameInfo');
                tr2.appendChild(gameInfoColumn);

                // Description
                const gameDesc = document.createElement('div');
                let curDesc = boardGameData[i].description;
                let newDesc = curDesc
                    .replaceAll("&#10;", "\n")
                    .replaceAll("&mdash;", "—")
                    .replaceAll("&quot;", "\"")
                    .replaceAll("&ldquo;", "\"")
                    .replaceAll("&rdquo;", "\"")
                    .replaceAll("&rsquo;", "'")
                    .replaceAll("&lsquo;", "'")
                    .replaceAll("&amp;", "&")
                    .replaceAll("&nbsp;", " ")
                    .replaceAll("&#9;", "   ")
                    .replaceAll("&uuml;", "ü")
                    .replaceAll("&times;", "×")
                    .replaceAll("&Prime;", "″");
                gameDesc.textContent = newDesc;
                gameInfoColumn.appendChild(gameDesc);

            }
        }
        

    } catch (error) {
        console.error('Error loading data:', error);
        // Display an error message to the user
    }
});