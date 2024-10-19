import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startListening, stopListening, updateTranscript, resetTranscript, translateText } from '../store/speechSlice';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

const SpeechToText = () => {
  const dispatch = useDispatch();
  const { transcript, isListening, translatedText } = useSelector((state) => state.speech);
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default to Spanish
  const [pastedText, setPastedText] = useState('');

  useEffect(() => {
    if (isListening) {
      recognition.start();

      recognition.onresult = (event) => {
        const transcriptText = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        dispatch(updateTranscript(transcriptText));
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    } else {
      recognition.stop();
    }
  }, [isListening, dispatch]);

  // Translate whenever transcript updates or pasted text changes
  useEffect(() => {
    if (transcript) {
      dispatch(translateText(transcript, targetLanguage));
    }
    if (pastedText) {
      dispatch(translateText(pastedText, targetLanguage));
    }
  }, [transcript, pastedText, targetLanguage, dispatch]);

  const handleStart = () => {
    dispatch(startListening());
  };

  const handleStop = () => {
    dispatch(stopListening());
  };

  const handleReset = () => {
    dispatch(resetTranscript());
    setPastedText(''); // Reset pasted text
  };

  const handleLanguageChange = (e) => {
    setTargetLanguage(e.target.value);
  };

  const handlePaste = (e) => {
    const text = e.target.value;
    setPastedText(text); // Update pasted text state
  };

  return (
    <div className="speech-to-text-container">
      <h2>Speech to Text Converter with Translation</h2>
      <div className="controls">
        <button onClick={handleStart} disabled={isListening}>Start Listening</button>
        <button onClick={handleStop} disabled={!isListening}>Stop Listening</button>
        <button onClick={handleReset}>Reset Transcript</button>
      </div>
      <div className="language-selector">
        <label>Select Target Language:</label>
        <select value={targetLanguage} onChange={handleLanguageChange}>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="ar">Arabic</option>
          <option value="ur">Urdu</option> {/* Added Urdu option */}
        </select>
      </div>
      <textarea readOnly value={transcript} placeholder="Your speech will appear here..." />
      <textarea
        value={pastedText}
        onChange={handlePaste}
        placeholder="Paste text to translate here..."
        rows="4"
      />
      <textarea readOnly value={translatedText} placeholder="Translated text will appear here..." />
    </div>
  );
};

export default SpeechToText;



