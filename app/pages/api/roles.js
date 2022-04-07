import axios from 'axios';

export async function getRoles() {
    // TODO - Replace with API url from the .env file
    const response = await axios.get('https://modulo.local/api/roles');
    return response.data;
}
