import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const handleSubmitQuestion = (payload) => {
  console.info('LearningRadar student question payload:', payload);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App onSubmitQuestion={handleSubmitQuestion} />
  </React.StrictMode>
);
