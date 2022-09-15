export default {
    async send(event, data = {}) {
        return await fetch(`https://ipear/ipear:${event}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(data)
        }).then((resp) => resp.json());
    }
}
