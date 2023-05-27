const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { loremIpsum } = require("lorem-ipsum");

async function run() {
    const app = express();

    app.use(bodyParser.json());

    app.post("/events", async function(req, res) {
        const body = req.body;
        console.log("Got /events", "with id", body.id);
        res.set({
            "Cache-Control": "no-cache",
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive"
        });
        res.flushHeaders();

        // Tell the client to retry every 10 seconds if connectivity is lost
        res.write("retry: 10000\n\n");
        let count = 0;

        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const data = loremIpsum({
                count: 20,
                units: "sentences",
                format: "plain",
                suffix: "\n"
            });
            console.log("Emit #", ++count, "Sent: ", data.length, "bytes");
            res.write(`data: ${data}\n\n`);
        }
    });

    await app.listen(3000);
    console.log("Listening on port 3000");
}


run().catch(console.error);
