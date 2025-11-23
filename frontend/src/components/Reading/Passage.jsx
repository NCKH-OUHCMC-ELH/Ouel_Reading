import React, { useState, useEffect } from 'react'
import "./Quiz.css"
import Quiz from './Quiz';
import { getPassageRandom } from '../../services/api';

const Passage = ({ onLoaded }) => {

    let [index, setIndex] = useState(0);
    let [passage, setPassages] = useState(null);

    useEffect(() => {
        const fetchPassages = async () => {
            try {
                const data = await getPassageRandom();
                setPassages(data);
                onLoaded(data); 
            } catch (error) {
                console.error('không thể fetch passage:', error);
            }
        };
        fetchPassages();
    }, []);

    if (!passage) {
        return <div className="passage-box">Đang tải đoạn văn...</div>;
    }

    return (
        <div className='container'>
            <h1>{passage.name}</h1>
            <hr />
            <h2>{passage.content}</h2>
        </div>
    )
}

export default Passage
