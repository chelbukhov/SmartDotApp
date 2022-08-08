import React, {useState} from "react";
import './Collection.css';
import Header from "../header/Header";
import Footer from '../footer/Footer';
import { NavLink, useParams } from 'react-router-dom';
import web3  from "../ethereum/web3";
import Collections from '../ethereum/build/Collections.json';




const Collection =(props) => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [collectionName, setCollectionName] = useState(null);
  const [records, setRecords] = useState(null);
  const [item, setItem] = useState([]);

  const param = useParams();
  //let contract;
  const  contract = new web3.eth.Contract(
    Collections.abi,
    param.address
  ); 


  //console.log('param: ', param);
  //console.log('param id: ', param.id);
  //console.log('param address: ', param.address);
  //console.log('contract: ', contract);
  


  async function getAccount() {
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //console.log('account[0]: ', accounts[0]);
    setDefaultAccount(accounts[0]);
    return accounts[0];
  }

  async function getCollectionName() {
    //console.log('default account: ', defaultAccount);
    //console.log('test address from: ', web3.utils.toChecksumAddress(defaultAccount) );
    await contract.methods.showCollectionName(param.id).call({
      from: defaultAccount
    }).then(result =>{
//      console.log('result:', result);
      setCollectionName(result);
      findRecords();

    })
    
  }


  async function findRecords() {
    console.log('defAcc: ', defaultAccount);
    await contract.methods.showItemsAmount().call({
      from: defaultAccount
    }).then(result =>{
        console.log('showItemsAmount:', result);
        setRecords(result);
        getItems(result);
        //return result;
    })

  }

  async function getItems(amount) {

    // cleare array of items
    setItem([]);
      console.log("Items...");
      console.log("amount: ", amount);
      for (let index = 0; index < amount; index++) {
        await contract.methods.showItem(index).call({
          from: defaultAccount
        }).then(result =>{
            console.log('ItemID:', index);
            console.log('ItemDetail:', result);
            //setItem(result);
        })
        //console.log("record:", index);
        
      }
      console.log('Array of items: ', item);
  }


  //start point
  //getCollectionContract();
  getAccount().then(resultAccount => {
    //console.log('web3.utils.toChecksumAddress(address): ',web3.utils.toChecksumAddress(resultAccount));
    //console.log('resultAccount: ', resultAccount);
    getCollectionName();
    
  });

  
      return (
        <div>
          <Header />
          <li><NavLink to='/'>Back</NavLink></li>
          <div className="collection">
            <h2>Collection: {collectionName}</h2>
            <h3>Find records: {records} </h3>
          </div>
          <Footer />
        </div>
      );
    }
  
export default Collection;