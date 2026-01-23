import { useEffect, useState } from "react";
import { fetchReadingData } from "../services/readingService";

export function useReading() {
    const [passage, setPassage] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { passage, questions } = await fetchReadingData();
                setPassage(passage);
                setQuestions(questions);
                setCurrentQuestion(questions[0]);
            } catch (error) {
                console.error("Lỗi khi fetch Reading:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return {
        passage,
        questions,
        currentQuestion,
        setCurrentQuestion,
        loading,
    };
}
