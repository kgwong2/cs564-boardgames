document.addEventListener('DOMContentLoaded', async () => {
    try {
        const gameCollection = document.getElementsByClassName('uniqueTest');
        const gameDiv = gameCollection[0];
        const gameId = gameDiv.id;
        const routeString = "/boardGameInfo/" + gameId;
        const response = await fetch(routeString);
        const data = await response.json();

        // Get elements to populate
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

        // Image transformations
        let imgUrl = data[0].image;
        let htmlImg = "<img src='" + imgUrl + "' width='300'>";

        // Description transformations
        let curDesc = data[0].description;
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
        console.error('Error loading game data:', error);
        // Display an error message to the user
    }

    try {
        const gameCollection = document.getElementsByClassName('uniqueTest');
        const gameDiv = gameCollection[0];
        const gameId = gameDiv.id;
        const routeString = "/contributedBy/" + gameId;
        const response = await fetch(routeString);
        const data = await response.json();
        
        const creatorList = document.getElementById('creatorList');
        for (const creator of data) {
            const creatorName = creator.name;
            const isDesigner = creator.isDesigner ? "Yes" : "No";
            const isArtist = creator.isArtist ? "Yes" : "No";
            creatorList.innerHTML += `<tr><td>${creatorName}</td><td>${isDesigner}</td><td>${isArtist}</td></tr>`;
        }
    } catch (error) {
        console.error('Error loading creator data:', error);
        // Display an error message to the user
    }
});