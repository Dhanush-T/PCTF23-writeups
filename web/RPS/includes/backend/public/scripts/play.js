let playerScore = 0, gameEnded = false, gameStarted = false;
const result = document.querySelector('.result');
const player = document.querySelector('.player-score');
const cpu_choice = document.querySelector('.choice')
const moves = document.querySelectorAll('.move');
const start = document.querySelector('.start')
const weapons = ['rock', 'paper', 'scissors'];


moves.forEach(move => move.addEventListener('click', (e) => play(e, move.textContent.toLowerCase())))
start.addEventListener('click', (e) => gameStart(e))

function gameStart(e){
    gameStarted = true;
    start.classList.add('hide');
}

function play(e, choice){
    if(gameStarted == true && gameEnded == false){
        let computerChoice = weapons[Math.floor(Math.random()*3)];
        cpu_choice.textContent = computerChoice;
        if(computerChoice == weapons[(weapons.indexOf(choice) + 2)%3]){
            playerScore += 1;
            player.textContent = playerScore
            result.textContent = `You chose ${choice}. You won the Round`;
        }
        else if(computerChoice == choice){
            result.textContent = `You chose ${choice}. Round ended in a Draw`;
        }
        else {
            gameEnded = true;
            const xhr = new XMLHttpRequest()
            xhr.open('POST', 'http://localhost:3000/play')
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.onload = () => {
                document.documentElement.innerHTML = xhr.response
            }
            xhr.send(JSON.stringify({score: playerScore}))
        }
    }

}