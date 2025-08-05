/**
 * async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log(data); // Process your data here
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();
 */

// setting .value is used for input/form elements
// setting .innerHTML is for div/span/td/etc. elements

function getGameImage() {
    document.getElementById("gameImageId").innerHTML = "<img src='https://cf.geekdo-images.com/lqmt2Oti_qJS65XqHcB8AA__itemrep/img/_iR9fdW4a3BsMh296ljKJj_EYOo=/fit-in/246x300/filters:strip_icc()/pic5146864.png'>";
}
getGameImage()

function getGameTitle() {
    document.getElementById("gameTitleId").innerText = "Betrayal at House on the Hill";
}
getGameTitle();

function getGamePublishYear() {
    document.getElementById("gamePublishYearId").innerText = "(2004)";
}
getGamePublishYear()

function getGameDescription() {
    document.getElementById("gameDescriptionId").innerText = "Betrayal at House on the Hill is a tile game that allows players to lay out the haunted house room by room, tile by tile, creating a new thrilling game board every time. The game is designed for three to six people, each of whom plays one of six possible characters. \nSecretly, one of the characters betrays the rest of the party, and the innocent members of the party must defeat the traitor in their midst before it's too late! Betrayal at House on the Hill will appeal to any game player who enjoys a fun, suspenseful, and strategic game. \nBetrayal at House on the Hill includes detailed game pieces, including character cards, pre-painted plastic figures, and special tokens, all of which help create a spooky atmosphere and streamline game play. \nAn updated reprint of Betrayal at House on the Hill was released on October 5, 2010.";
}
getGameDescription()

function getGameComplexity() {
    document.getElementById("gameWeightId").innerText = "2.4";
}
getGameComplexity()

function getMinPlayers() {
    document.getElementById("gameMinPlayersId").innerText = "3";
}
getMinPlayers()

function getMaxPlayers() {
    document.getElementById("gameMaxPlayersId").innerText = "6";
}
getMaxPlayers()

function getMinPlaytime() {

}

function getMaxPlaytime() {

}

function getMinAge() {

}