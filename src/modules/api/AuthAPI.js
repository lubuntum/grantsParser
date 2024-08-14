import axios from "axios";
import { AUTH_API_URL } from "../../config";

export const login = async(username, password) =>{
    return axios.post(`${AUTH_API_URL}/login`, {username, password});
};

export const validateCredential = async(token) =>{
    return axios.post(`${AUTH_API_URL}/validate`,{}, {
        headers: {authorization : token},
    });
};