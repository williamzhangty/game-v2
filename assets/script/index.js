'use stirct';
// Before all functions, declare the scores array
let scores = JSON.parse(localStorage.getItem('scores')) || [];

function createWall() {
    var wall = document.getElementById("wall");
    var blockWidth = 51; // 50px block + 1px spacing
    var blockHeight = 51; // 50px block + 1px spacing
    var numBlocksPerLayer = Math.floor(window.innerWidth / blockWidth);
    var totalWallWidth = numBlocksPerLayer * blockWidth; // Total width of the wall
    var wallLeftOffset = (window.innerWidth - totalWallWidth) / 2; // Calculate the left offset

    for (var layer = 0; layer < 3; layer++) {
        for (var i = 0; i < numBlocksPerLayer; i++) {
            var wallBlock = document.createElement("div");
            wallBlock.classList.add("wall-block");
            wallBlock.style.left = (i * blockWidth + wallLeftOffset) + 'px'; // Position with offset
            wallBlock.style.bottom = (layer * blockHeight) + 'px';
            wall.appendChild(wallBlock);
        }
    }
}

function createAndMoveDiv() {

    var newDiv = document.createElement("div");
    newDiv.classList.add("block");
    document.body.appendChild(newDiv);

    setTimeout(function() {
        newDiv.style.top = "100vh"; // Move downwards
        let endX = Math.random() * (window.innerWidth - newDiv.offsetWidth);
        newDiv.style.left = endX + 'px';
        checkCollision(newDiv);
    }, 100);
}

function checkCollision(block) {
    var interval = setInterval(function() {
        var blockRect = block.getBoundingClientRect();
        var wallBlocks = document.querySelectorAll('.wall-block');

        wallBlocks.forEach(function(wallBlock) {
            var wallBlockRect = wallBlock.getBoundingClientRect();
            
            if (blockRect.right > wallBlockRect.left && blockRect.left < wallBlockRect.right &&
                blockRect.bottom > wallBlockRect.top && blockRect.top < wallBlockRect.bottom) {
                document.getElementById('clash-sound').play();
                // Collision detected
                block.remove();
                wallBlock.remove();
                clearInterval(interval);
            }
        });

        if (blockRect.bottom > window.innerHeight) {
            clearInterval(interval);
        }
    }, 20);
}

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById('start-button');
    const wordDisplay = document.getElementById('word-display');
    const wordInput = document.getElementById('word-input');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');

    let score = 0;

    let timeLeft = 18;
    let isPlaying = false;
    let interval;
    const words = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
                'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
                'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
                'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
                'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
                'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
                'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
                'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
                'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
                'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
                'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
                'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
                'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
                'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
                'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
                'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
                'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
                'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
                ];

    startButton.addEventListener('click', startGame);
    createWall();
    displayScores();
    
    function startGame() {
        if (isPlaying) {
            restartGame();
            return;
        }
        //if (isPlaying) return;
        isPlaying = true;
        startButton.textContent = 'Restart'; // Change button label to Restart

        timeLeft = 18;
        score = 0;
        timerDisplay.textContent = 18;

        wordInput.disabled = false;
        //wordInput.disabled = true;
        wordInput.focus();
        shuffleWords();
        interval = setInterval(updateTimer, 1000);
        document.getElementById('background-sound').play();
        createWall();
        scoreDisplay.innerHTML = '';
        wordInput.value = '';
        document.getElementById('scoreboard-container').style.display = "none";
    }

    function restartGame() {
        timerDisplay.textContent = 18;
        //alert(timerDisplay.textContent);
        timeLeft = 18;

        clearInterval(interval);
        score = 0;
        wordInput.disabled = false;
        wordInput.focus();
        shuffleWords();
        interval = setInterval(updateTimer, 1000);
        // ... rest of the restart logic ...
        document.querySelectorAll('.block').forEach(block => block.remove());
        createWall();
        scoreDisplay.innerHTML = '';
        wordInput.value = '';
        
    }
    
    function shuffleWords() {
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.textContent = words[randomIndex];
    }

    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}`;
        if (timeLeft === 0) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(interval);
        isPlaying = false;
        wordInput.disabled = true;
    
        //let currentDate = new Date();
        //let totalHits = score; 
        //let gamePercentage = Math.round(100*score/30); 
        //let gameScore = new Score(currentDate, totalHits, gamePercentage);
        let currentDate = new Date();
        let formattedDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        let gamePercentage = Math.round(100 * score / 30); 
        //let formattedDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        saveScore(formattedDate, score, gamePercentage);
        
        displayScores(); // Update the scoreboard display

       

        let modalText = document.getElementById('modalText');
        modalText.innerHTML = `<h1>Game Over !</h1>Date: ${formattedDate} <br>Hits: ${score} <br>Object: 30 <br>Hit Percentage: ${gamePercentage}%`;

        let modal = document.getElementById('gameOverModal');
        modal.style.display = "block";

        let span = document.getElementsByClassName("close")[0];

        span.onclick = function() {
            modal.style.display = "none";
            document.getElementById('scoreboard-container').style.display = "block";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                document.getElementById('scoreboard-container').style.display = "block";
            }
        }
    }

    wordInput.addEventListener('input', () => {
        if (wordInput.value === wordDisplay.textContent) {
            score++;
            scoreDisplay.innerHTML = '<p><img src="./assets/img/tnt.png"> ' + ` ${score}` + '</p>';
            wordInput.value = '';
            shuffleWords();
            createAndMoveDiv();
        }
    });
});

function saveScore(date, hits, percentage) {
    scores.push({ date, hits, percentage });

    // Sort by hits in descending order and keep only the top 10
    scores.sort((a, b) => b.hits - a.hits);
    scores.splice(10);

    // Store in localStorage
    localStorage.setItem('scores', JSON.stringify(scores));
}

function displayScores() {
    // Fetch and parse the score data from localStorage
    let storedScores = localStorage.getItem('scores');
    let scores = storedScores ? JSON.parse(storedScores) : [];
    //alert(scores);
    // Get the scoreboard element
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = ''; // Clear existing scoreboard entries

    // Check for and handle an empty scoreboard
    if (scores.length === 0) {
        scoreboard.innerHTML = '<p id="score-text">No games have been played.</p>';
        scoreboard.classList.add('empty'); // Add class for empty state styling
    } else {
        scoreboard.classList.remove('empty'); // Remove class if not empty
        // Only show the top 9 scores
        scores.slice(0, 9).forEach((score, index) => {
            
            const scoreElement = document.createElement('div');
            scoreElement.classList.add('score-entry');
            //scoreElement.textContent = `#${index + 1}  ${score.hits}hits ${score.date}`;
            //scoreboard.appendChild(scoreElement);

            const scoreIndex = document.createElement('div');
            scoreIndex.classList.add('score-index');
            scoreIndex.textContent = `#${index + 1}`;

            const scoreHits = document.createElement('div');
            scoreHits.classList.add('score-hits');
            scoreHits.textContent = `${score.hits} hits`;

            const scoreDate = document.createElement('div');
            scoreDate.classList.add('score-date');
            scoreDate.textContent = `${score.date}`; // Ensure formattedDate is correctly defined

            scoreElement.appendChild(scoreIndex);
            scoreElement.appendChild(scoreHits);
            scoreElement.appendChild(scoreDate);

            scoreboard.appendChild(scoreElement);
            
        });
    }
}

