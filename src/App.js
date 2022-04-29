import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './App.css'

import axios from "axios";
import Web3 from 'web3';
import { useEffect, useState } from 'react'
import CounterInput from "react-counter-input"
import { mintNft } from "./components/interact"
import swal from "sweetalert"

function App() {
  const [metamaskConnected, setMetamaskConnnected] = useState(false);
  const [account, setAccount] = useState();
  const [amount, setAmount] = useState(1);
  const [networkId, setNetworkId] = useState();
  const [isMetamask, setIsMetamask] = useState(true);
  const [totalMintCount, setTotalMintCount] = useState(0);
  const [nftprice, setNFTPrice] = useState("0.076");
  useEffect(async () => {
    await loadWeb3().then((data) => {
      if (data !== false) {
        loadBlockchainData();
      }
    });

    // getTotalSupply();
  }, []);


  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      setIsMetamask(false);
      return false;
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    setNetworkId(networkId);

    if (accounts.length == 0) {
      setMetamaskConnnected(false);
    } else {
      setMetamaskConnnected(true);
      setAccount(accounts[0]);
    }

    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) setAccount(accounts[0]);
      else setAccount();
    });
    window.ethereum.on("networkChanged", (networkId) => {
      setNetworkId(networkId);
    });
  };

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      setMetamaskConnnected(true);
    }
  };

  function getTotalSupply() {
    axios.get(`http://localhost:3001/api/getTotalMintCount`)
      .then(res => {
        if (res.data.success) {
          setTotalMintCount(Number(res.data.totalCount));
        } else {
          console.log("Cannot connect backend");
        }
      })
      .catch(err => {
        console.log("error", err);
      });
  }

  async function handleMint() {
    // if (Number(totalMintCount) + amount > 100) {
    //   swal("Sorry!", "The sales limit is 100", "warning")
    //   setAmount(100 - Number(totalMintCount));
    // } else {
    //   const checkMintData = {
    //     address: account
    //   };

    //   const getMintData = {
    //     address: account,
    //     count: amount
    //   }
    const result = await mintNft(nftprice, 1, account);
    console.log("result-------", result);
    if (result) {
      console.log("mint-succeed");
      swal("Congratulations!", "You just minted our NFT!", "success")

    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {metamaskConnected && account ? (
          <button type="button" onClick={() => handleConnectWallet}>
            {account &&
              ` ${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`}
          </button>
        ) : (
          <button type="button" className={`btn btn-outline-primary btn-wallet gradient-btn`} onClick={() => handleConnectWallet()}>
            CONNECT WALLET
          </button>
        )}
        <div className="d-flex align-items-center counter-input">
          <CounterInput
            min={1}
            max={3}
            count={amount}
            onCountChange={count => setAmount(count)}
          />
        </div>
        <button type="button" className={`btn btn-warning btn-wallet gradient-btn`} onClick={handleMint}>Mint</button>
        {/* <p>{totalMintCount}/10</p> */}
      </header>
    </div>
  );
}

export default App;