const port = process.argv[2];
const rp = require("request-promise");
var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1");
const bitcoin = new Blockchain();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    res.send("Hello hi World");
});

app.get("/blockchain", function(req, res) {
    res.send(bitcoin);
});
app.post("/transaction", function(req, res) {
    const blockIndex = bitcoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    );
    res.json({ note: `Transaction will be added in block ${blockIndex}` });
});
app.get("/mine", function(req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const nodeAddress = uuid()
        .split("-")
        .join("");
    bitcoin.createNewTransaction(12.5, "00", nodeAddress);
    const previousBlockHash = lastBlock["hash"];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock["index"] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(
        previousBlockHash,
        currentBlockData,
        nonce
    );
    const newBlock = bitcoin.createNewBlock(
        nonce,
        previousBlockHash,
        blockHash
    );
    res.json({
        note: "New Block mined successfully",
        block: newBlock
    });
});

app.post("/register-and-broadcast-node", function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1)
        bitcoin.networkNodes.push(newNodeUrl);
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        //... '/register-node"
        const regNodesPromises = [];
        const requestOptions = {
            uri: networkNodeUrl + "/register-node",
            method: "POST",
            body: { newNodeUrl: newNodeUrl },
            json: true
        };
        regNodesPromises.push(rp(requestOptions));
    });
    Promise.all(regNodesPromises)
        .then(data => {
            //use the data
            const bulkRegisterOptions = {
                uri: newNodeUrl + "/register-nodes-bulk",
                method: "POST",
                body: {
                    allNetworkNodes: [
                        ...bitcoin.networkNodes,
                        bitcoin.currentNodeUrl
                    ]
                },
                json: true
            };
            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({ note: "New Node registered with network succesfully" });
        });
});

app.post("/register-node", function(req, res) {});

app.post("/register-nodes-bulk", function(req, res) {});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
