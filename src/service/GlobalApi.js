export const GlobalApi = async (url, method, data, token) => {
    const request = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
        }
    };

    if (data) {
        request.body = JSON.stringify(data);
    }

    //console.log('Request:', request);

    try {
        const response = await fetch(url, request);
        console.log('Response:', response);

        const contentType = response.headers.get('Content-Type');
        let responsedata;

        if (contentType && contentType.includes('application/json')) {
            responsedata = await response.json();
        } else {
            responsedata = await response.text();
        }

        return {
            data: responsedata,
            status: response.status
        };
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Failed to fetch API');
    }
}
