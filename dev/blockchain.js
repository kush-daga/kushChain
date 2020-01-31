const sha256 = require("sha256");
const currentNodeUrl = process.argv[3];
/*
CONSTRUCTOR FUNCTION
*/
function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    this.createNewBlock(100, "0", "0");
}
/*
We can also use 
class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];

    }
    HEre you can write other methods
}
*/

//Create New Block Method
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };
    this.pendingTransactions = []; //to clear out all the transactions, as they have been added in the block
    this.chain.push(newBlock);
    return newBlock;
};

//Function to return the last block of the chain..
Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
};
//Function to create new Transaction, now these are not in blockchain yet, they are in the queue and will be added when they are
// mined
// Every time a new transaction is carried out they are addeed in the array.
Blockchain.prototype.createNewTransaction = function(
    amount,
    sender,
    recipient
) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };
    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock()["index"] + 1; // This will tell us about the index of block our transaction can be found in when its mined
};

//hashing data
Blockchain.prototype.hashBlock = function(
    previousBlockHash,
    currentBlockData,
    nonce
) {
    const dataAsString =
        previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
};

//Proof of work method
Blockchain.prototype.proofOfWork = function(
    previousBlockHash,
    currentBlockData
) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    //verifying that if it is a valid hash, i.e. with 4 zeroes in the start
    while (hash.substring(0, 4) !== "0000") {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        // console.log(hash);
    }
    return nonce;
};
// to export our blockchain constructor functions
module.exports = Blockchain;
