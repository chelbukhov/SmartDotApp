import React, {useState} from "react";

class MetamaskConnect extends React.Component {
    onSubmit = async (event) => {
        event.preventDefault();
    }
    
    constructor(props){
        super(props);
        this.state = {
            MetamaskIsInstalled: false,
            Network: 0,
        }
    }

    async testMetamask() {
        const provider = await detectEthereumProvider();
        if (provider) {
            this.setState({MetamaskIsInstalled: true});
            this.setState ({Network: window.ethereum.networkVersion})
            console.log('MetaMask is installed!');
            console.log("Your network: ", window.ethereum.networkVersion);
        }
            else {
            console.log('MetaMask is NOT installed!');
        }
    }
    
    componentDidMount(){
       this.testMetamask();
    }

 

    render() {


      return (
        <div>
        { this.state.MetamaskIsInstalled ? (
            <div>
                <p>Metamask is finding!  Connect to Metamask...</p>
                {this.state.Network === "80001" ? (
                    <div>
                        {this.props.updateState(true)}
                        <p>Your Network is correct. I finding Mumbai TestNet.</p>
                    </div>
                    ) : (
                    <div>
                        <p>Your Network is incorrect. Switch your network to Mumbai TestNet.</p>
                    </div>
                    )}

            </div>
        ) : (
            <div>
                <p>For using apllication you must installed Metamask</p>
            </div>
        )}



        </div>
      );
    }
  }
  
export default MetamaskConnect;