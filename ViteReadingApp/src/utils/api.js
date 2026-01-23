import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const endpoints = {
    'getHighlights': '/geminis/highlight/',
    'getParts': '/parts/',
    'getPart': (partId) => `/parts/${partId}/`,
    'getPartRandom': '/parts/random/',
    'getPartQuestions': (partId) => `/parts/${partId}/questions/`,
    'checkAnswer': (questionId) => `/questions/${questionId}/check_answer/`,
    'submitQuiz': '/part-histories/submit/'
};

export default axios.create({
    baseURL: BASE_URL,
    headers: { 
        'Content-Type': 'application/json' 
    },
    timeout: 30000
});

export const authApi = (token) => axios.create({
    baseURL: BASE_URL,
    headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
    }
});