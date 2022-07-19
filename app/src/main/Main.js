import React from 'react';
import WalletCard from './WalletCard';
import FileInput from './FileInput';
import Geo from './Geolocation';
import FileDescription from './FileDescription';
import SaveData from './SaveData';
import './Main.css';



class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            MetamaskIsConnected: false,
            GetGeolocation: false,
            FileName: '',
            CID: '',
            CIDIsReceived: false,
            FileDescription: '',
        }
        this.updateState = this.updateState.bind(this);
    }
    updateState = (stateName, value) => {
        switch (stateName) {
            case 'MetamaskIsConnected':
                this.setState({MetamaskIsConnected: value});
                break;
            case 'GetGeolocation':
                this.setState({GetGeolocation: value});
                break;
            case 'FileName':
                this.setState({FileDescription: value});
                break;
            case 'FileDescription':
                this.setState({FileDescription: value});
                break;
            case 'CID':
                this.setState({CID: value});  
                break;
            case 'CIDIsReceived':
                this.setState({CIDIsReceived: value});  
                break;  

            default:
                break;
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
                                        <FileInput updateState={this.updateState}/>
                                        {this.state.CIDIsReceived === true ? (
                                            <div>
                                            <FileDescription updateState={this.updateState}/>
                                            <SaveData />
                                        </div>
                                        ) : (<div></div>)}
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
