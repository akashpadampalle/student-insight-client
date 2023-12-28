import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ErrorMessage } from "../models/Error";
import store from "./store";
import { login, logout, selectAccessToken } from "../features/authentication/authSlice";
import { RefreshResponse } from "../models/Token";


class Service {
    private http: AxiosInstance;

    constructor() {
        this.http = axios.create({
            baseURL: "https://student-insight-server.vercel.app/",
            withCredentials: true
        });
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.http.interceptors.request.use(async (config) => {
            const state = store.getState();
            const accessToken = selectAccessToken(state)
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        });

        this.http.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const response = await this.http.get<RefreshResponse>("/refresh");
                        console.log("Refresh successful:", response);
                        store.dispatch(login(response.data));
                        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                        return this.http(originalRequest);
                    } catch (refreshError) {
                        console.error("Error refreshing token:", refreshError);
                        store.dispatch(logout());
                    }
                }
                return Promise.reject(error);
            }
        );
    }


    private handleAxiosError(error: unknown): ErrorMessage {

        if (axios.isAxiosError(error)) {
            if (error.response?.data?.message) {
                return new ErrorMessage(error.response.data.message)
            }
            // Handle network error or other errors
            console.error("An unexpected error occurred:", error.message);
        }

        return new ErrorMessage("Unknown Error");
    }


    async getRequest<T>(url: string): Promise<T | ErrorMessage> {
        try {
            const response: AxiosResponse<T> = await this.http.get(url);
            return response.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }

    async postRequest<T>(url: string, data: any): Promise<T | ErrorMessage> {
        try {
            const response: AxiosResponse<T> = await this.http.post(url, data);
            return response.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }

    async patchRequest<T>(url: string, data: any): Promise<T | ErrorMessage> {
        try {
            const response: AxiosResponse<T> = await this.http.patch(url, data);
            return response.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }

    async deleteRequest<T>(url: string): Promise<T | ErrorMessage> {
        try {
            const response: AxiosResponse<T> = await this.http.delete(url);
            return response.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }
}



export default new Service();