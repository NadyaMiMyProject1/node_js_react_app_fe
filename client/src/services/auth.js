//import process from "process";
const { REACT_APP_BASE_URL } = process.env;


export class Auth {
    static async register(email, password) {
        const res = await fetch(`${REACT_APP_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        console.log(res);
        return res.json();

    }

    static async login(email, password) {
        const res = await fetch(`${REACT_APP_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        return res.json();
    }
}