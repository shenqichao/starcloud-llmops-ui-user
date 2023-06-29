import { config } from 'utils/axios/config';
import { getAccessToken } from 'utils/auth';
const { base_url } = config;
export default function fetchRequest(url: string, method: string, body: any, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            method,
            credentials: 'include' as RequestCredentials,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getAccessToken()
            },
            body: body ? JSON.stringify(body) : null
        };

        const controller = new AbortController();
        const signal = controller.signal;

        const timer = setTimeout(() => {
            controller.abort(); // 请求超时时中断请求
            reject(new Error('Request timeout'));
        }, 30000);

        fetch(base_url + url, { ...options, signal })
            .then((response) => {
                clearTimeout(timer); // 请求成功时，清除计时器
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
                return response.body;
            })
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                clearTimeout(timer); // 请求失败时，清除计时器
                reject(error);
            });
    });
}
