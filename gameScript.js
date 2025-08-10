// Set connections
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: "147.219.74.241",
    port: "3306",
    user: "boardgame",
    password: "uwmadison",
    database: "boardgames"
});

connection.connect(function(e) {
    if (e) throw e;
    
        connection.query("SELECT * FROM boardgame b WHERE b.id = 13", function (e, result, fields) {
        if (e) throw e;
        //let gameTitle = console.log(result[0].name);
    });

    //document.getElementById("gameImageId").innerText = gameTitle;
});

// Javascript
function getGameImage() {
    document.getElementById("gameImageId").innerHTML = "<img src='https://cf.geekdo-images.com/lqmt2Oti_qJS65XqHcB8AA__itemrep/img/_iR9fdW4a3BsMh296ljKJj_EYOo=/fit-in/246x300/filters:strip_icc()/pic5146864.png'>";
};
getGameImage();


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