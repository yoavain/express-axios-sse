const axios = require("axios");
const { randomUUID } = require("crypto");

const ENDPOINT = "http://localhost:3000/events";

axios.post(ENDPOINT, { id: randomUUID() }, {
    headers: {
        "Content-Type": "application/json",
        accept: "text/event-stream"
    },
    responseType: "stream"
}).then((response) => {
    console.log("Got 'response' object back");
    const stream = response.data;
    stream.on("data", data => {
        console.log(`Got: ${data.toString().length - 8} bytes`); // minus the "data: " and the "\n\n\"
    });
});
