document.addEventListener('DOMContentLoaded', () => {
  const words = ["adventure", "axe", "arrow", "berserker", "boat", "bow", "dragonship", "odin", "runes", "shield", "thor", "valkyrie"]; // Liste des mots à trouver
  const maxChances = 7; // Nombre maximum de tentatives

  let currentWord = '';
  let remainingChances = 0;
  let lettersFound = [];
  let guessedLetters = [];
  let isGameOver = false;

  const wordElement = document.getElementById('word');
  const chancesElement = document.getElementById('chances');
  const lettersElement = document.getElementById('letters');
  const inputElement = document.getElementById('input-letter');
  const submitButton = document.getElementById('submit');
  const messageElement = document.getElementById('message');
  const restartButton = document.getElementById('restart');
  const alphabetButtons = document.getElementsByClassName('alphabet-button');

  function init() {
    currentWord = getRandomWord();
    remainingChances = maxChances;
    lettersFound = Array(currentWord.length).fill('_');
    guessedLetters = [];
    isGameOver = false;

    wordElement.textContent = lettersFound.join(' ');
    chancesElement.textContent = `Remaining Chances: ${remainingChances}`;
    lettersElement.textContent = 'Guessed Letters: ';
    inputElement.value = '';
    messageElement.textContent = '';
    restartButton.style.display = 'none';

    // Activation des boutons de l'alphabet
    for (let i = 0; i < alphabetButtons.length; i++) {
      alphabetButtons[i].disabled = false;
    }
  }

  function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  function updateWord(letter) {
    const indices = [];
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === letter) {
        indices.push(i);
      }
    }
    indices.forEach(index => {
      lettersFound[index] = letter;
    });
    wordElement.textContent = lettersFound.join(' ');
  }

  function updateGuessedLetters(letter) {
    guessedLetters.push(letter);
    lettersElement.textContent = 'Guessed Letters: ' + guessedLetters.join(', ');
  }

  function checkStatus() {
    if (lettersFound.join('') === currentWord) {
      messageElement.textContent = 'Congratulations! You won!';
      messageElement.style.color = 'green';
      // audioElement.src = 'win.mp3'; // Ajouter plus tard chemin vers le fichier audio pour la victoire
      // audioElement.play();
      isGameOver = true;
    } else if (remainingChances === 0) {
      messageElement.textContent = 'Game Over! You lost! The word was: ' + currentWord;
      messageElement.style.color = 'red';
      // audioElement.src = 'lose.mp3'; // Ajouter plus tard chemin vers le fichier audio pour la défaite
      // audioElement.play();
      isGameOver = true;
    }
    if (isGameOver) {
      restartButton.style.display = 'block';
      // Désactivation des boutons de l'alphabet
      for (let i = 0; i < alphabetButtons.length; i++) {
        alphabetButtons[i].disabled = true;
      }
    }
  }

  function makeGuess(letter) {
    if (isGameOver) return;

    if (guessedLetters.includes(letter)) {
      messageElement.textContent = 'You already guessed that letter.';
      return;
    }

    if (currentWord.includes(letter)) {
      updateWord(letter);
    } else {
      remainingChances--;
      chancesElement.textContent = `Remaining Chances: ${remainingChances}`;
    }

    updateGuessedLetters(letter);

    checkStatus();
  }

  submitButton.addEventListener('click', () => {
    const letter = inputElement.value.toLowerCase();
    if (letter && letter.length === 1) {
      makeGuess(letter);
      inputElement.value = '';
    }
  });

  inputElement.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      const letter = inputElement.value.toLowerCase();
      if (letter && letter.length === 1) {
        makeGuess(letter);
        inputElement.value = '';
      }
    }
  });

  restartButton.addEventListener('click', init);

  // Événement de clic pour chaque bouton de l'alphabet
  for (let i = 0; i < alphabetButtons.length; i++) {
    alphabetButtons[i].addEventListener('click', function () {
      const letter = this.textContent.toLowerCase();
      makeGuess(letter);
      this.disabled = true; // Désactive le bouton après avoir cliqué dessus
    });
  }

  init();
});
