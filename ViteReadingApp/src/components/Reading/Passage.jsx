import React, { useState, useEffect } from 'react';
import "./Quiz.css";
import "./Passage.css";
// import { getHighlightFromGemini } from '../../services/aiGemini';
import { getHighlights } from '../../services/api';
const Passage = ({ passage, question, lock, setLock }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedContent, setHighlightedContent] = useState(null);
    const [aiSuggested, setAiSuggested] = useState(false);


    useEffect(() => {
        setHighlightedContent(null);
        setAiSuggested(false);
        setIsLoading(false);
    }, [question]);

    const getAiSuggestion = async () => {
        if (aiSuggested || !question || isLoading || lock) return;
        const contentToSlice = passage.content.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
        setIsLoading(true);
        try {
            const highlight = await getHighlights(
                contentToSlice,
                question.question_text
            );
            // const highlight = await getHighlightFromGemini(contentToSlice, question.question_text);
            const parts = [];
            let lastIndex = 0;
            if (highlight && highlight.answerText) {
                const answerText = highlight.answerText;
                const correctedStart = contentToSlice.indexOf(answerText);
                if (correctedStart !== -1) {
                    const correctedEnd = correctedStart + answerText.length;
                    if (lastIndex < correctedStart) {
                        parts.push(
                            <span key={"text-before"}>
                                {contentToSlice.slice(lastIndex, correctedStart)}
                            </span>
                        );
                    }
                    parts.push(
                        <mark key={`highlight-${correctedStart}-${correctedEnd}`}>
                            {contentToSlice.slice(correctedStart, correctedEnd)}
                        </mark>
                    );
                    lastIndex = correctedEnd;
                }
            }
            if (lastIndex < contentToSlice.length) {
                parts.push(<span key="text-end">{contentToSlice.slice(lastIndex)}</span>);
            }
            setHighlightedContent(parts);
            setAiSuggested(true);
        } catch (error) {
            console.error("Lỗi khi lấy gợi ý từ Gemini: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className='container'>
            <h1>{passage.name}</h1>
            <hr />
            <h2>{highlightedContent ? highlightedContent : passage.content}</h2>
            {!aiSuggested && question && (
                !lock && <button onClick={getAiSuggestion} disabled={isLoading} > {isLoading ? 'Đang gợi ý...' : 'Gợi ý AI'} </button>
            )}
        </div>
    )
}

export default Passage
