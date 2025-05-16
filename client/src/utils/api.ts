import axios from "axios";

const base_url = "https://task-manager-socket-yhj9.onrender.com";

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