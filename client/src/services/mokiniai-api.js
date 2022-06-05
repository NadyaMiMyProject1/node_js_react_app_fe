const API_URL = `${process.env.REACT_APP_BASE_URL}/mokiniai`;

export class MokiniaiApi {

    static async addMokiniai(mokinis, token) {
        if (!mokinis) throw new Error("No argument");
        const res = await fetch(
            `${API_URL}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(mokinis),
        });
        console.log(mokinis, token);

        return res.json();
    }

    static async getMokiniai(token) {
        const res = await fetch(
            `${API_URL}/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                }
            }
        );

        return res.json();
    }

    static async updateMokiniai(mokinis, token) {
        if (!mokinis) {
            throw new Error("Nepaduotas mokinis atnaujinimui.");
        }
        const res = await fetch(
            `${API_URL}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(mokinis),
        });
        console.log(mokinis, token);

        return res.json();
    }

    static async deleteMokiniai(mokinis_id, token) {
        if (!mokinis_id) throw new Error("No argument");
        const res = await fetch(
            `${API_URL}/${mokinis_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            }
        });
        console.log(mokinis_id, token);

        return res.json();
    }


}