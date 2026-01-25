import api, { endpoints } from "../utils/api";

export const partByType = async (type) => {
    const res = await api.post(endpoints["getPartByType"], {
        type:type
    });
    return res.data;
};
