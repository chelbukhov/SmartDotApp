import Web3 from 'web3';
let web3;
if (window.ethereum) {
    handleEthereum();
  } else {
    window.addEventListener('ethereum#initialized', handleEthereum, {
      once: true,
    });
  
    // If the event is not dispatched by the end of the timeout,
    // the user probably doesn't have MetaMask installed.
    setTimeout(handleEthereum, 3000); // 3 seconds
  }
  
  function handleEthereum() {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      console.log('Ethereum successfully detected!');
      web3 = new Web3(window.ethereum);
      //web3 = new Web3(window.web3.currentProvider);
      // Access the decentralized web!
    } else {
      alert('Please install MetaMask!');
    }
  }
/*
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    //код выполняется в браузере, определен объект window
    //а также установлено и запущено расширение Metamask (web3)
    web3 = new Web3(window.web3.currentProvider);
    
} else {
    //код выполняется на сервере или пользователь не установил MetaMask
    alert('MetaMask is NOT installed!');

    //const provider = new Web3.providers.HttpProvider(
    //    'https://rinkeby.infura.io/V4TdOxWqFxt4ebK2hBam' 
    //);
    //web3 = new Web3(provider);
}
*/
export default web3;