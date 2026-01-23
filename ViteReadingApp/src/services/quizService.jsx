import api, { endpoints } from "../utils/api";

export const submitQuizApi = async (payload) => {
  try {
    const res = await api.post(endpoints["submitQuiz"], payload);
    return res.data;
  } catch (err) {
    console.error("Submit quiz error:", err);
    throw err;
  }
};
