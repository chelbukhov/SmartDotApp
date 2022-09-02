import React, {useState} from 'react'
import {ethers} from 'ethers'
import './WalletCard.css'

const WalletCard = (props) => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [networkText, setNetworkText] = useState(null);

	const connectWalletHandler = () => {
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

/*
		  if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');
            //определяю сеть
            console.log("Your network: ", window.ethereum.networkVersion);
            if(window.ethereum.networkVersion ==='97' ){
                //Network is Mumbai polygon
                //props.updateState('MetamaskIsConnected', true);
                setNetworkText('Greate! Your network is BSC TestNet! Now waiting while account detect');
            } else {
                props.updateState('MetamaskIsConnected', false);
                setNetworkText('Your network is not BSC TestNet. Please change network and reconnect to metamask.');
            }
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);

				setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	*/
	}


	  
	  function handleEthereum() {
		const { ethereum } = window;
		if (ethereum && ethereum.isMetaMask) {
		  console.log('Ethereum successfully detected!');
		  // Access the decentralized web!
		  if(window.ethereum.networkVersion ==='97' ){
			//Network is Mumbai polygon
			//props.updateState('MetamaskIsConnected', true);
			setNetworkText('Greate! Your network is BSC TestNet! Now waiting while account detect');
		} else {
			props.updateState('MetamaskIsConnected', false);
			setNetworkText('Your network is not BSC TestNet. Please change network and reconnect to metamask.');
		}
		window.ethereum.request({ method: 'eth_requestAccounts'})
		.then(result => {
			accountChangedHandler(result[0]);

			setConnButtonText('Wallet Connected');
			getAccountBalance(result[0]);
		})
		.catch(error => {
			setErrorMessage('error: ' + error.message);
		
		});

		} else {
		  alert('Please install MetaMask!');
		}
	  }


	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
		if(window.ethereum.networkVersion ==='97' ){
			setNetworkText('OK. account defined');
			props.updateState('MetamaskIsConnected', true);
		}

		

	}


	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);
	
	return (
		<div className='walletCard'>
		<h4> {"Connection to MetaMask"} </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div className='networkDisplay'>
                {window.ethereum.networkVersion ==='97' ? (
                    <div>
                        <h3>Network: {networkText}</h3>
                    </div>
                ) : (
                    <div>
                        <h3>Network: {networkText}</h3>
                    </div>

                )}
			</div>
			<div className='accountDisplay'>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<div className='balanceDisplay'>
				<h3>Balance: {userBalance}</h3>
			</div>
			{errorMessage}
		</div>
	);
}

export default WalletCard;