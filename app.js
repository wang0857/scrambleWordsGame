/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const wordsList = ['APPLE', 'BANANA', 'ORANGE', 'MANGO', 'PINEAPPLE', 'STRAWBERRY', 'WATERMELON', 'GRAPEFRUIT', 'KIWI', 'BLUEBERRY', 'PEACH', 'LEMON']
const scrambleList = wordsList.map((words, index) => {
  return {
    id: index,
    words: words,
    shuffleWords: shuffle(words)
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'))

function Points({points}) {
  return (
    <div className="results">
      <h2>{points}</h2>
      <p>POINTS</p>
    </div>
  )
}

function Strikes({strikes}) {
  return (
    <div className="results">
      <h2>{strikes}</h2>
      <p>STRIKES</p>
    </div>
  )
}

function ScrambleGame({scrambleWord, onAnswerChange, onVerifyAnswer, pass, onPassChange, isDisabled}) {
  function formHandler(e) {
    e.preventDefault()
    onVerifyAnswer()
  }

  return(
    <>
    <h2 className="scramble-letters">{scrambleWord.shuffleWords}</h2>
    <form className="scramble-form" onSubmit={formHandler}>
      {
        isDisabled ? 
        <input type="text" name="scrambleInput" onKeyPress={e => onAnswerChange(e)} disabled /> :
        <input type="text" name="scrambleInput" onKeyPress={e => onAnswerChange(e)} />
      }
    </form>

    <div className="scramble-button">
      {
        pass === 0 || isDisabled || scrambleWord.id === scrambleList.length - 1 ? 
        <button onClick={onPassChange} disabled><span className="scramble-pass">{pass}</span> Passes Remaining</button> : 
        <button onClick={onPassChange}><span className="scramble-pass">{pass}</span> Passes Remaining</button>
      }
    </div>
    </>
  )
}

function Message({message, messageClass}) {
  return (
    <div className={messageClass}>
      <p>{message}</p>
    </div>
  )
}

function App() {
  const [answer, setAnswer] = React.useState('')
  const [scrambleWord, setScrambleWord] = React.useState(() => JSON.parse(localStorage.getItem('scrambleWord')) || scrambleList[0])
  const [points, setPoints] = React.useState(() => JSON.parse(localStorage.getItem('points')) || 0)
  const [strikes, setStrikes] = React.useState(() => JSON.parse(localStorage.getItem('strikes')) || 0)
  const [message, setMessage] = React.useState('')
  const [messageClass, setMessageClass] = React.useState('')
  const [disabled, setDisabled] = React.useState(false)
  const [pass, setPass] = React.useState(() => {
    // Fixed to 0 when user has used 3 passes
    if (localStorage.getItem('pass')) {
      return JSON.parse(localStorage.getItem('pass'))
    } else {
      return 3
    }
  })

  // Functions
  function submitAnswer(e) {
    if(e.code === 'Enter') {
      setAnswer(e.target.value.toUpperCase())
      e.target.parentElement.reset()
    }
  }

  function verifyAnswer() {
    const correctAnswer = scrambleList.filter(item => item.words === answer)

    if (correctAnswer.length === 0) {
      setStrikes(strikes + 1)
      setMessage('Wrong. Try again.')
      setMessageClass('message danger')

      if (strikes > 1) {
        setDisabled(true)
        setMessage('You lost.')
        setMessageClass('message danger')
      }
    } else {
      setPoints(points + 1)
      setMessageClass('message success')

      if (correctAnswer[0].id === scrambleList.length - 2) {
        setMessage('Correct. Last word.')
      } else {
        setMessage('Correct. Next word.')
      }

      if (correctAnswer[0].id < scrambleList.length - 1) {
        updateQuestions()
      }
      
      if (correctAnswer[0].id === scrambleList.length - 1) {
        setDisabled(true)
        setMessage('You win!')
      }
    }
  }

  function updateQuestions() {
    setScrambleWord(scrambleList[scrambleWord.id + 1])
  }

  function resetOrder() {
    setScrambleWord(scrambleList[0])
    setDisabled(false)
    setMessage('')
    setMessageClass('')
    setPoints(0)
    setStrikes(0)
    setPass(3)
  }

  function usePass() {
    setPass(pass - 1)
    setMessage('You passed. Next word.')
    setMessageClass('message info')
    updateQuestions()
  }

  // Local Storage
  React.useEffect(() => {
    localStorage.setItem('points', JSON.stringify(points))
  }, [points])

  React.useEffect(() => {
    localStorage.setItem('strikes', JSON.stringify(strikes))
  }, [strikes])

  React.useEffect(() => {
    localStorage.setItem('pass', JSON.stringify(pass))
  }, [pass])

  React.useEffect(() => {
    localStorage.setItem('scrambleWord', JSON.stringify(scrambleWord))
  }, [scrambleWord])

  React.useEffect(() => {
    localStorage.setItem('scrambleList', JSON.stringify(scrambleList))
  })

  return (
    <div className="container">
      <h1>Welcome to Scramble.</h1>
      <div className="results-container">
        <Points points={points} />
        <Strikes strikes={strikes} />
      </div>
      <Message
        message={message}
        messageClass={messageClass}
      />
      <ScrambleGame
        scrambleWord={scrambleWord}
        onAnswerChange={submitAnswer}
        onVerifyAnswer={verifyAnswer}
        pass={pass}
        onPassChange={usePass}
        isDisabled={disabled}
      />
      {
        disabled ? 
        <div className="playAgain-button">
          <button onClick={resetOrder}>Play Again?</button>
        </div> : ''
      }
    </div>
  )
}

root.render(<App />)