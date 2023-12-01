import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ... other imports ...
import Question from './components/Question';
import ToggleButton from './components/ToggleButton';
import './styles.css';

function App() {
  const questions = [
    { 
      id: 1,
      img: "question01-img01.png",
      imgAlt: "A red apple.", // Alt text for the image 
      question: "Question 1: {name} went to the store and bought 3 red apples and 4 green apples. When {name} got home, they found 2 yellow apples in their kitchen. How many apples does {name} have now?", 
      correctAnswer: 9
    },
    { 
      id: 2, 
      img: "question02-img01.png",
      imgAlt: "A spiral seashell.", // Alt text for the image
      question: "Question 2: {name} went to the beach to collect seashells. {name} found 2 spiral seashells, 3 clam seashells, and 2 scallop seashells. How many seashells did {name} find in total?", 
      correctAnswer: 7
    },
    { 
      id: 3,
      img: "question03-img01.png",
      imgAlt: "A sandwich.", // Alt text for the image 
      question: "Question 3: {name} is helping to organize a picnic. {name} has 4 sandwiches and their friend brings 5 more. How many sandwiches do they have for the picnic?", 
      correctAnswer: 9
    },
  {
    id: 4,
    img: "question04-img01.png",
    imgAlt: "A building block.", // Alt text for the image
    question: "Question 4: {name} was playing with building blocks. {name} stacked up 2 blue blocks, 3 red blocks, and 1 green block. How many blocks did {name} stack up in total?",
    correctAnswer: 6
  },
  {
    id: 5,
    img: "question05-img01.png",
    imgAlt: "A flower.", // Alt text for the image
    question: "Question 5: {name} is counting the flowers in a garden. {name} sees 4 daisy flowers and 2 rose flowers. How many flowers does {name} see in total?",
    correctAnswer: 6
  },
  // ... subtraction questions ...
  {
    id: 6,
    img: "question06-img01.png",
    imgAlt: "A colorful marker.", // Alt text for the image
    question: "Question 6: {name} had 10 colorful markers. {name} gave 3 markers to one friend and 2 to another friend. How many markers does {name} have left?",
    correctAnswer: 5
  },
  {
    id: 7,
    img: "question07-img01.png",
    imgAlt: "A cookie.", // Alt text for the image
    question: "Question 7: {name} baked 9 cookies. {name} ate 2 cookies and gave 3 to a friend. How many cookies are left?",
    correctAnswer: 4
  },
  {
    id: 8,
    img: "question08-img01.png",
    imgAlt: "A scallop seashell.", // Alt text for the image
    question: "Question 8: {name} collected 8 seashells at the beach. {name} gave 3 seashells to a sibling. How many seashells does {name} have now?",
    correctAnswer: 5
  },
  {
    id: 9,
    img: "question09-img01.png",
    imgAlt: "A balloon.", // Alt text for the image
    question: "Question 9: {name} had 10 balloons. During the party, 3 balloons popped and {name} gave away 2 balloons to a friend. How many balloons does {name} have left?",
    correctAnswer: 5
  },
  {
    id: 10,
    img: "question10-img01.png",
    imgAlt: "A bird.", // Alt text for the image
    question: "Question 10: {name} spotted 10 birds in the morning. In the afternoon, {name} could only see 4 birds. How many birds flew away?",
    correctAnswer: 6
  }  
];

  const [selectedStudentId, setSelectedStudentId] = useState('1');
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [pnpSettings, setPnpSettings] = useState({ DarkMode: true, LargeText: true, TextToSpeech: true });
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const fetchPnpSettings = async () => {
      try {
        const response = await fetch(`http://localhost:8080/pnp/${selectedStudentId}`);
        if (response.ok) {
          const data = await response.json();
          setPnpSettings(data);
          setDarkMode(data.darkMode);
          setLargeText(data.largeText);
          setTextToSpeech(data.textToSpeech);
        // Automatically apply Dark Mode
        if (data.darkMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }

        // Apply Large Text setting
        // This could involve setting a class or directly manipulating the CSS
        // For example, if you have a CSS class for large text:
        if (data.largeText) {
          document.body.classList.add('large-text');
        } else {
          document.body.classList.remove('large-text');
        }

      }
    } catch (error) {
      console.error('Error fetching PNP settings:', error);
    }
  };

  fetchPnpSettings();
}, [selectedStudentId]); // Refetch when selectedStudentId changes

  // Debugging useEffect
  useEffect(() => {
    console.log("PNP Settings:", pnpSettings);
    console.log("Dark Mode:", darkMode);
    console.log("Large Text:", largeText);
  }, [pnpSettings, darkMode, largeText]); // This effect runs whenever these state variables change

  // ... rest of your component ...

  
  const studentNames = {
    '1': 'Gwynn',
    '2': 'James',
    '3': 'Nolan',
    // ... other students
  };

  //const currentQuestion = questions[0];

  const notify = (message) => {
    toast(message, {
      autoClose: 8000, // Adjust the time as needed
      // ... other toast options...
    });
    if (textToSpeech) {
      const speech = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(speech);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const studentName = studentNames[selectedStudentId];
    const isCorrect = parseInt(currentAnswer) === currentQuestion.correctAnswer; // Use correctAnswer from currentQuestion
    setAttempts(attempts + 1);
  
  
    if (isCorrect || attempts >= 2) {
      if (isCorrect) {
        notify(`Great job ${studentName}! The correct answer is ${questions[currentQuestionIndex].correctAnswer}. Now try the next question.`);
      } else {
        notify(`Good try, ${studentName}, but the correct answer is ${questions[currentQuestionIndex].correctAnswer}. Now try the next question.`);
      }
      // Move to the next question or reset to the first question if at the end
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
      resetQuestion();
    } else {
      notify(`Sorry ${studentName}, that's not correct. Try again.`);
    }
  };
  
  const resetQuestion = () => {
    setCurrentAnswer('');
    setAttempts(0);
    // You can also update the question and correctAnswer here for the next question
  };

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  }

  function toggleLargeText() {
    setLargeText(!largeText);
    document.body.classList.toggle('large-text');
  }

  function toggleTextToSpeech() {
    setTextToSpeech(!textToSpeech);
  }

  const processQuestionText = (questionText) => {
    const studentName = studentNames[selectedStudentId];
    return questionText.replace(/{name}/g, studentName);
  };

  function speak(text) {
    if (textToSpeech) {
      const processedText = processQuestionText(text);
      const speech = new SpeechSynthesisUtterance(processedText);
      // speech.rate = 0.75; // Speech rate is set to 0.75
      window.speechSynthesis.speak(speech);
    }
  }
  const skipQuestion = () => {
    setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questions.length);
    resetQuestion();
  };

  return (
    <main className={`app ${darkMode ? 'dark-mode' : ''} ${largeText ? 'large-text' : ''}`}>
      <h1>Math Practice For {studentNames[selectedStudentId]}!</h1>
      <div>
    <label htmlFor="studentSelect">Select Student:&nbsp;
    <select id="studentSelect" value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
        <option value="1">Gwynn</option>
        <option value="2">James</option>
        <option value="3">Nolan</option>
    </select>
    </label>
</div>

      <div className="button-container">
      <button onClick={skipQuestion}>Skip Question</button>
        <ToggleButton 
          toggle={toggleDarkMode} 
          label={darkMode ? "Dark Mode is On" : "Dark Mode is Off"} 
        />
        <ToggleButton 
          toggle={toggleLargeText} 
          label={largeText ? "Large Text is On" : "Large Text is Off"} 
        />
        <button onClick={toggleTextToSpeech}>
          {textToSpeech ? 'Read Aloud is On' : 'Read Aloud is Off'}
        </button>
        <button onClick={() => speak(currentQuestion.question)} disabled={!textToSpeech} aria-label="read">&#9654;</button>
      </div>

      <img 
        className="question-image"
        src={currentQuestion.img} 
        alt={currentQuestion.imgAlt} 
      />
      <Question key={currentQuestion.id} question={processQuestionText(currentQuestion.question)} onSpeak={speak} />
      <form onSubmit={handleSubmit}>
  <label>
    The answer is:&nbsp;
    <select 
      value={currentAnswer} 
      onChange={(e) => setCurrentAnswer(e.target.value)}
    >
      <option value="">0</option>
      {[...Array(10).keys()].map(num => (
        <option key={num + 1} value={num + 1}>{num + 1}</option>
      ))}
    </select>
  </label>
  <input type="submit" value="Go" />
</form>
<ToastContainer />
    </main>
  );
}

export default App;
