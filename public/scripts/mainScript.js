document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/topTenGames');
        const data = await response.json();
        console.log(data);
        //console.log(data[0]);

        const topTenContainer = document.getElementById('topTenContainer');
        const loader = document.getElementById('loadingBar');
        loader.remove();

        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                // Create container
                const gameContainer = document.createElement('div');
                gameContainer.classList.add('_listedGame');
                topTenContainer.appendChild(gameContainer);

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

                let imgUrl = data[i].image;
                let htmlImg = "<img src='" + imgUrl + "' width='300'>";
                imgColumn.innerHTML = htmlImg;
                tr1.appendChild(imgColumn);

                // Game title
                const titleColumn = document.createElement('td');
                titleColumn.classList.add('_gameTitle');
                tr1.appendChild(titleColumn);

                const gameTitle = document.createElement('a');
                gameTitle.href = '/game';
                gameTitle.id = data[i].id;
                gameTitle.textContent = data[i].name;
                titleColumn.appendChild(gameTitle);

                // Row 2
                const tr2 = document.createElement('tr');
                gameTable.appendChild(tr2);

                const gameInfoColumn = document.createElement('td');
                gameInfoColumn.classList.add('_gameInfo');
                tr2.appendChild(gameInfoColumn);

                // Rating
                const gameRating = document.createElement('div');
                gameRating.textContent = 'Rating: ' + data[i].score;
                gameInfoColumn.appendChild(gameRating);

                const br = document.createElement('br');
                gameInfoColumn.appendChild(br);

                // Description
                const gameDesc = document.createElement('div');
                let curDesc = data[i].description;
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