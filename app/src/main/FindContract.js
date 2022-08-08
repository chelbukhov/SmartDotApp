import React from "react";
import './FindContract.css';
import smartDot from '../ethereum/smartdot';
import ShowCollections from './ShowCollections';

class FindContract extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        result: false,
        usercontract: '',
      }

      this.refreshData = this.refreshData.bind(this);
      this.createContract = this.createContract.bind(this);
    }


    getAccount = async() => {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    }

    refreshData = async function () {

      //  await window.ethereum.enable();
      //  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      //  const account = accounts[0];
      //const account = this.state.account;
      const account = await this.getAccount();
      const res = await smartDot.methods.showContract().call({
            from: account
        });
        //alert(res);
        this.setState({
            usercontract: res
        });
    }

    createContract = async () => {
        //await window.ethereum.enable();
        //const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //const account = accounts[0];
        const account = await this.getAccount();

        //console.log(account);

        await smartDot.methods.newUser().send({
            from: account
        });

        //alert("Create!");
    }
    
    componentDidMount(){
        this.refreshData();
    }
  
    render() {
      return (
        <div className="findcontract">
            {this.state.usercontract === 0x0 ? (
                <div>
                    <h3>You are have not collection contract. Create this now...</h3>
                    <button onClick={this.createContract}>Create collection contract</button>
                    <button onClick={this.refreshData}>Refresh data</button>
                </div>
                ):(
                <div>
                    <h3>Find collection contract! Your contract adrress is {this.state.usercontract}</h3>
                    <ShowCollections address = {this.state.usercontract}/>
                </div>
                )}

        </div>
      );
    }
  }
  
export default FindContract;