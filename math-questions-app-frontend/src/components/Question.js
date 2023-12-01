import React from 'react';

function Question({ question, onSpeak }) {
  return (
    <div onClick={() => onSpeak(question)}>
      {question}
    </div>
  );
}

export default Question;
