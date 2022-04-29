var Web3 = require("web3");

export const loadTotalMintCount = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
  var web3 = window.web3;

  const Elephant = require("./Elephant.json");
  const contractAddress = web3.utils.toChecksumAddress(
    process.env.REACT_APP_CONTRACT_ADDRESS_TESTNET_TESTNET
  );
  const contract = new web3.eth.Contract(Elephant.abi, contractAddress);
  var message = await contract.methods.totalToken().call();
  return message;
};

export const mintNft = async (price, tokenAmount, address) => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
  var web3 = window.web3;

  const Elephant = require("./Elephant.json");
  const contractAddress = web3.utils.toChecksumAddress(
    process.env.REACT_APP_CONTRACT_ADDRESS_TESTNET
  );
  const contract = new web3.eth.Contract(Elephant.abi, contractAddress);

  console.log("mintNFT functino here",price);
  let e;
  try {
    var correctPrice = web3.utils.toBN(
      web3.utils.toWei(price, "ether").toString()
    );
    console.log("here");
    console.log("correctPrice:", correctPrice);
  } catch (u) {
    console.log("err", u);
  }
  try {
    e = await contract.methods.mint(tokenAmount).estimateGas({
      value: correctPrice * tokenAmount,
      from: address
    });
  } catch (u) {
    return { success: false, type: "estimategas" };
  }
  let d = await web3.eth.getGasPrice();
  let c;

  try {
    c = await contract.methods.mint(tokenAmount).send({
      from: address,
      gas: parseInt(e),
      gasPrice: parseInt(1.2 * d),
      value: correctPrice * tokenAmount,
      maxFeePerGas: null
    });
  } catch (u) {
    return { success: false, type: "mint" };
  }

  if (c) {
    console.log("interact.js file working correctly");
    return { success: c.status, type: "mint" };
  }
};
