import axios from "axios";

const base_url = import.meta.env.BACKEND_URL || "http://localhost:3001";

export const getBoard = async () => {

    try {
        const response = await axios.get(`${base_url}/api/board`);

        return {
            tasks: response.data.tasks,
            columns: response.data.columns

        }
    } catch (err) {
        console.error("Error in Fetching board: ", err)
    }
 
}