import api, { endpoints } from "../utils/api";

export const fetchReadingData = async () => {
    const passageRes = await api.get(endpoints["getPartRandom"]);
    const passage = passageRes.data;

    const questionsRes = await api.get(
        endpoints["getPartQuestions"](passage.id)
    );

    return {
        passage,
        questions: questionsRes.data,
    };
};
