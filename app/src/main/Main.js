import React from 'react';
import WalletCard from './WalletCard';
import FileInput from './FileInput';
import Geo from './Geolocation';
import './Main.css';



class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            MetamaskIsConnected: false,
            GetGeolocation: false,
        }
        this.updateState = this.updateState.bind(this);
    }
    updateState = (stateName, value) => {
        if (stateName === 'MetamaskIsConnected') {
            this.setState({
                MetamaskIsConnected: value
            });
    
        }
        if (stateName === 'GetGeolocation') {
            this.setState({
                GetGeolocation: value
            });
    
        }
    }


    render() {
        return (
            <div className='container'>
                <main>
                        <div>
                            <WalletCard updateState={this.updateState}/>
                        </div>
                        {this.state.MetamaskIsConnected === true ? (
                            <div>
                                <Geo updateState={this.updateState}/>
                                {this.state.GetGeolocation === true ? (
                                    <div>
                                        <FileInput />
                                        <p>Add file description to IPFS - soon...</p>
                                        <p>Transfer data to smart contract - soon...</p>
                                    </div>
                                ) : (<div></div>)}
                            </div>
                        ) : (<div></div>)}
                </main>
            </div>
            );
        
    }
}

  
  export default Main;
