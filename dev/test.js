const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();
// bitcoin.createNewBlock(1234, "ABCDEFIOU", "78s49sdx674sf");
// bitcoin.createNewBlock(1213, "OIEFHHF34", "ABCDEFIOU");
// bitcoin.createNewTransaction(12, "abcd", "dweewf");
// bitcoin.createNewBlock(1224, "DWWDADX67", "OIEFHHF34");
// console.log(bitcoin);
// console.log(bitcoin.chain[2]);

//testing proof of work

const previousBlockHash = "8773423423532342423262324225";

const currentBlockData = [
    {
        amount: 10,
        sender: "Ababjbefbsefbsbfs",
        recipient: "sdjsfeusaoS"
    },
    {
        amount: 13,
        sender: "sdjsfeusoS",
        recipient: "assfsfsfsefsgs"
    },
    {
        amount: 15,
        sender: "assfsfsfsefsgs",
        recipient: "Ababjbefbsefbsbfs"
    }
];

console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));

// console.log(bitcoin);
