import React from "react";
import './ShowCollections.css';
import web3  from "../ethereum/web3";
import Collections from '../ethereum/build/Collections.json';
import smartDot from '../ethereum/smartdot';
import { NavLink } from "react-router-dom";
let contract;


class ShowCollections extends React.Component {


  constructor(props) {
      super(props);
      this.state = {
        result: false,
        collectionsAmount: 0,
        collectionName: '',
        refresh: false,
        colRows: [],
        currentAccount:'',
      }
      contract = this.props.contract;




      this.addCollection = this.addCollection.bind(this);
      this.showCollectionsNames = this.showCollectionsNames.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }




    getCollectionContractAddress = async() => {
      const account = await this.getAccount();
      const collectionContractAddress = await smartDot.methods.showContract().call({
            from: account
        });
      return collectionContractAddress;
    }

    
    getCollectionContract = () => {
      const address = this.props.address;
      this.setState({refresh: true});      

      console.log('addres contract', address);
      //  const address = '0x5cE7Cbd9Ed22E596d219fB76f6A69824aaE90A1E';
        contract = new web3.eth.Contract(
          Collections.abi,
          address
        );  
      //console.log('contract colName: ', contract);
    }

    getAccount = async() => {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.setState({
        currentAccount: accounts[0]
      })
      return accounts[0];
    }

    handleChange(event) {
      this.setState({collectionName: event.target.value});
    }

    handleSubmit(event) {
      //alert('A name was submitted: ' + this.state.collectionName);
      event.preventDefault();
      this.addCollection();
    }

    addCollection = async function () {
      //await window.ethereum.enable();
      //const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      //const account = accounts[0]; 
      if(this.state.collectionName.length < 4 ){
        alert('Mimimum length of collection name is 4 signs.')
      }
      else
      {
        const account = await this.getAccount();
        //console.log('this.state.collectionName: ', this.state.collectionName);
        await contract.methods.addCollection(this.state.collectionName).send({
          from: account
        }); 
        // refresh data
        this.collections();
  
      }


    }

    collections = async function () {
      const account = await this.getAccount();
      this.getCollectionContract();
      //console.log('collections contract: ', contract);
      const res = await contract.methods.showCollectionsAmount().call({
        from: account
      });
      this.setState({
        collectionsAmount: res
      });
        //console.log('collectionsAmount: ', res);
        //this.showCollectionsNames();
    }

    showCollectionsNames = async function () {
      //await window.ethereum.enable();
      //const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      //const account = accounts[0];
      const account = await this.getAccount();
      //console.log('showCollectionsNames - account: ', account);
      //console.log('this.state.collectionsAmount', await this.state.collectionsAmount)

      this.setState({
        colRows: []
      })
        for (let index = 0; index < this.state.collectionsAmount; index++) {
          const element = await contract.methods.showCollectionName(index).call({
            from: account
          });;
          const newRow = this.state.colRows.slice();
          //console.log('newRow: ', newRow);
          newRow.push({index, element});
          this.setState({
            colRows: newRow
          })
          //console.log('element: ', element);

      }
      //console.log('arrayRes: ', arrayRes);

    }

    renderRows () {
      //console.log('this.state.colRows', this.state.colRows);

    
    return (
        <div>
          {this.state.colRows.map((mapping) => (
              <div>
                <li key={mapping.index}>
                  <NavLink to={`/showCollection/collectionID=${mapping.index}/address=${this.props.address}/account=${this.state.currentAccount}`}>{mapping.element}</NavLink>
                </li>
              </div>
          ))}
        </div>
      );
    }


    render() {
  if (this.props.address.length !==0 & this.state.refresh === false){
    //console.log('refresh info');
    //console.log('address length:', this.props.address.length)
    //console.log('state: ', this.state.refresh)
    this.collections();

  }

      return (
        <div className="showCollections">
            <h3>Your collections in smart contract..{this.state.collectionsAmount}</h3>
            <h3>{this.renderRows()}</h3>
            <button onClick={this.showCollectionsNames}>show collections...</button>

            <form onSubmit={this.handleSubmit}>
              <label>
                Add collection:
                <input type="text" value={this.state.collectionName} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Send transaction" />
            </form>
            
        </div>
      );
    }
  }
  
export default ShowCollections;