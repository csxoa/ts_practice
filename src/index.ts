import * as CryptoJs from "crypto-js";

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    static calculateHash = (index: number, previousHash:string, timestamp: number, data:string): string =>
    CryptoJs.SHA256(index + previousHash + timestamp + data).toString();

    static validateStructure = (aBlock: Block) : boolean => 
        typeof aBlock.index === "number" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string";
    
    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number,
    ){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, '해시', 'previous해시', '데이터', 517);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = () : Block[] => blockchain;

const getLatestBlock = () : Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = () : number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data:string) : Block => {
    const previousBlock : Block = getLatestBlock();
    const newIndex : number = previousBlock.index + 1;
    const newTimestamp : number = getNewTimeStamp();
    const newHash : string = Block.calculateHash(newIndex, previousBlock.hash, newTimestamp, data);
    const newBlock : Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimestamp);
    addBlock(newBlock);
    return newBlock;
}

const getHashforBlock = (aBlock: Block) : string =>
    Block.calculateHash(
        aBlock.index,
        aBlock.previousHash,
        aBlock.timestamp,
        aBlock.data
        );

// candidate block 과 previous block 을 불러와 비교하면서 validation 이 어떻게 돌아가는지 파악해보자
const isBlockValid = (candidateBlock: Block, previousBlock: Block) : boolean => {
    if(!Block.validateStructure(candidateBlock)){
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index){
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash){
        return false;
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash){
        return false;
    } else {
        return true;
    }
};

// 아무것도 return 하지 않아서 void
const addBlock = (candidateBlock: Block) : void => {
    if(isBlockValid(candidateBlock, getLatestBlock())){
        blockchain.push(candidateBlock);
    }
};

createNewBlock("second block");
createNewBlock("third block");

console.log(blockchain);

export {};