import React from 'react';
import { sample } from '../../utils';
import { WORDS } from '../../data';
// importing react confetti
import Confetti from 'react-confetti';

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

function Game() {
  const [guessInput, setGuessInput] = React.useState('');
  const [guesses, setGuesses] = React.useState([]);
  const [gameStatus, setGameStatus] = React.useState('playing'); // 'playing', 'won', 'lost'
  const NUM_OF_GUESSES_ALLOWED = 6;

  function handleSubmit(event) {
    event.preventDefault();
    
    if (guessInput.length === 5) {
      const newGuesses = [...guesses, guessInput];
      setGuesses(newGuesses);
      setGuessInput('');

      // Check for win
      if (guessInput.toUpperCase() === answer) {
        setGameStatus('won');
      } else if (newGuesses.length >= NUM_OF_GUESSES_ALLOWED) {
        setGameStatus('lost');
      }
    }
  }

  function handleKeyDown(event) {
    // Allow backspace, delete, and letter keys only
    if (!/^[A-Za-z]$/.test(event.key) && 
        event.key !== 'Backspace' && 
        event.key !== 'Delete' &&
        event.key !== 'Enter') {
      event.preventDefault();
    }
  }

  function handleChange(event) {
    const nextGuess = event.target.value.toUpperCase();
    const validatedGuess = nextGuess.replace(/[^A-Z]/g, '');
    if (validatedGuess.length <= 5) {
      setGuessInput(nextGuess);
    }
  }

  function checkGuess(guess) {
    const guessChars = guess.split('');
    const answerChars = answer.split('');
    
    return guessChars.map((char, index) => {
      if (char === answerChars[index]) {
        return 'correct';
      }
      if (answer.includes(char)) {
        return 'misplaced';
      }
      return 'incorrect';
    });
  }

  return (
    <div>
      {gameStatus === 'won' && (
        <>
          <Confetti />
          <div className="happy banner">
            <p>Congratulations! You won!</p>
          </div>
        </>
      )}
      
      {gameStatus === 'lost' && (
        <div className="sad banner">
          <p>Sorry, the correct answer was {answer}</p>
        </div>
      )}

      <div className="guess-results" style={{ marginBottom: '2rem' }}>
        {Array(NUM_OF_GUESSES_ALLOWED).fill().map((_, rowIndex) => (
          <p key={rowIndex} className="guess">
            {guesses[rowIndex]
              ? guesses[rowIndex].split('').map((letter, letterIndex) => {
                  const status = checkGuess(guesses[rowIndex])[letterIndex];
                  return (
                    <span 
                      key={letterIndex} 
                      className={`cell ${status}`}
                    >
                      {letter}
                    </span>
                  );
                })
              : Array(5).fill().map((_, index) => (
                  <span key={index} className="cell">
                  </span>
                ))
            }
          </p>
        ))}
      </div>

      {gameStatus === 'playing' && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="guess-input">Enter guess:</label>
          <input
            id="guess-input"
            type="text"
            value={guessInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            pattern="[A-Za-z]{5}"
            title="Please enter exactly 5 letters"
            maxLength={5}
          />
        </form>
      )}
    </div>
  );
}

export default Game;
