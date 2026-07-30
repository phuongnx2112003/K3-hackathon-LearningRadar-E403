import React from 'react';
import StudentFlow from './student-flow';

function App({ onSubmitQuestion }) {
  return <StudentFlow onSubmitQuestion={onSubmitQuestion} />;
}

export default App;
