import axios from "axios";
import apiActions from "../../enum/apiActions";
const API_URL = process.env.REACT_APP_API_URL;


export const uploadForm = async (data) => {
    try {
        return await axios.post(`${API_URL}/contact/contactus`, data);
    } catch (error) {
        return error;
    }
};

export const Reviews = async (action, data) => {
    try {
        let response;
        switch (action) {
            case apiActions.POST:
                response = await axios.post(`${API_URL}/review/addreview`, data);
                break;
            case apiActions.GET:
                response = await axios.get(`${API_URL}/review/getreview`);
                break;
            default:
                throw new Error('Invalid action');
        }
        return response;
    } catch (error) {
        throw error;
    }
};
