const bs58 = require('bs58');


const base58Key = "5pX7KnReaDLK14ARqqosUPyKqFnkCid2iJyueViNn7ufaxGEpSApL1X186LLt375K9etayPh53KABAuLVGKnGKC";

const privateKeyBytes = bs58.decode(base58Key);
console.log(privateKeyBytes);