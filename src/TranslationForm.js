import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TranslationForm() {
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [translatedText, setTranslatedText] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Fetch content from the API
    axios
      .get(process.env.REACT_APP_JOKE_API_URL)
      .then(response => {
        setContent(response.data?.setup);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleLanguageChange = e => {
    setTargetLanguage(e.target.value);
  };

  const handleFormSubmit = e => {
    e.preventDefault();

    // Send text to translation API
    axios
      .post(
        process.env.REACT_APP_RAPID_API_URL,
        {
          q: content,
          source: 'en',
          target: targetLanguage
        },
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
          }
        }
      )
      .then(response => {
        setTranslatedText(
          response?.data?.data?.translations[0]?.translatedText || ''
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <p>Content: {content}</p>
        <select value={targetLanguage} onChange={handleLanguageChange}>
          <option value='fr'>French</option>
          <option value='es'>Spanish</option>
          <option value='de'>German</option>
        </select>
        <button type='submit'>Translate</button>
      </form>
      {translatedText && <p>Translated Text: {translatedText}</p>}
    </div>
  );
}

export default TranslationForm;
