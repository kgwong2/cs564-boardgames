document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/boardGameInfo');
        const data = await response.json();
        //console.log(data);
        //console.log(data[0]);

        const gameTitle = document.getElementById('gameTitleId');
        const gameImage = document.getElementById('gameImageId');
        const gamePublishYear = document.getElementById('gamePublishYearId');
        const gameDesc = document.getElementById('gameDescriptionId');
        const gameWeight = document.getElementById('gameWeightId');
        const minPlayers = document.getElementById('gameMinPlayersId');
        const maxPlayers = document.getElementById('gameMaxPlayersId');
        const minPlaytime = document.getElementById('gameMinPlaytime');
        const maxPlaytime = document.getElementById('gameMaxPlaytime');
        const minAge = document.getElementById('gameMinAge');

        let imgUrl = data[0].image;
        let htmlImg = "<img src='" + imgUrl + "' width='300'>";
        let curDesc = data[0].description;
        let newDesc = curDesc.replaceAll("&#10;", "\n");
        // clean up &mdash; to —
        // create new function to do this

        // Populate
        gameTitle.innerText = data[0].name;
        gameImage.innerHTML = htmlImg;
        gamePublishYear.innerText = "(" + data[0].yearpublished + ")";
        gameDesc.innerText = newDesc;
        gameWeight.innerText = data[0].averageweight;
        minPlayers.innerText = data[0].minplayers;
        maxPlayers.innerText = data[0].maxplayers;
        minPlaytime.innerText = data[0].minplaytime;
        maxPlaytime.innerText = data[0].maxplaytime;
        minAge.innerText = data[0].minage;

    } catch (error) {
        console.error('Error loading data:', error);
        // Display an error message to the user
    }
});