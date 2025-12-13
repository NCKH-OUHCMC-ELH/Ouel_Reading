import React, { useState, useEffect } from 'react';
import Quiz from "./Quiz";
import Passage from "./Passage";
import './Reading.css';
import { getPassageRandom } from '../../services/api';
import { getPassageQuestions } from '../../services/api';

function Reading() {
    console.log("Rendering Reading component");
    const [passage, setPassage] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [lock, setLock] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const p = await getPassageRandom();
                setPassage(p);
                const qs = await getPassageQuestions(p.id);
                setQuestions(qs);
                setCurrentQuestion(qs[0]);
            } catch (error) {
                console.error("Lỗi khi fetch passage và questions:", error);
            }
        };
        fetchData();
    }, []);

    if (!passage || questions.length === 0 || !currentQuestion) {
        return <div>Đang tải dữ liệu...</div>;
    }
    return (
        <div className="reading">
            <div className="left">
                <Passage
                    passage={passage}
                    question={currentQuestion}
                    lock={lock}
                    setLock={setLock}
                />
            </div>

            <div className="right">
                <Quiz
                    passage={passage}
                    questions={questions}
                    question={currentQuestion}
                    setQuestion={setCurrentQuestion}
                    lock={lock}
                    setLock={setLock}
                />
            </div>
        </div>
    );
}

export default Reading;
