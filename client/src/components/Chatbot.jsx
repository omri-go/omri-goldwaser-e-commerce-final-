import React, { useState } from 'react';
import axios from 'axios';
import { CHATBOT } from "../constants";
import { useAppContext } from "../context/AppContext";


const Chatbot = () => {
    const { messages, setMessages }  = useAppContext();
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSendMessage = async () => {
        if (inputValue !== '') {            
            try {
                const response = await axios.post(CHATBOT, {
                    text: inputValue,
                });
                const botResponse = response.data.text;
                setMessages([...messages, { text: inputValue, user: true }, { text: botResponse, user: false }]);
                console.log(messages);
            } catch (error) {
                console.error(error);
            }
            setInputValue('');
        }
    };

    return (
        <div>
        <h1>Chatbot  - using chatGPT</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        {message.user ? (
                            <p >&#x1F464; You: {message.text}</p>
                        ) : (
                            <p>&#x1F916; Bot: {message.text}</p>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <input type="text" value={inputValue} onChange={handleInputChange} />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;