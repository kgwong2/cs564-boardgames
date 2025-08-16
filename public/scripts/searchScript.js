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

        // All search criteria used
        if (gameTitleValue !== '' && playerCountCheckbox.checked && gameContributorValue !== '' && playtimeCheckbox.checked) {
            console.log('All search criteria used');
        }
        // Three search criteria

        // Two search criteria


        // One search criterion: Game title
        else if (gameTitleValue !== undefined) {

        }

        // One search criterion: Player count
        else if (playerCountCheckbox.checked) {

        }

        // One search criterion: Contributor
        else if (gameContributorValue !== undefined) {

        }

        // One search criterion: Playtime
        else if (playtimeCheckbox.checked) {

        }


        

    } catch (error) {
        console.error('Error loading data:', error);
        // Display an error message to the user
    }
});