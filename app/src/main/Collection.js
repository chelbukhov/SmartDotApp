import React, {useState, useEffect} from "react";
import './Collection.css';
import Header from "../header/Header";
import Footer from '../footer/Footer';
import { NavLink, useParams } from 'react-router-dom';
import web3  from "../ethereum/web3";
import Collections from '../ethereum/build/Collections.json';




const Collection =(props) => {

  const param = useParams();
  const defaultAccount = param.account;
  //let contract;
  const  contract = new web3.eth.Contract(
    Collections.abi,
    param.address
  ); 

  //const [defaultAccount, setDefaultAccount] = useState(null);
  const [collectionName, setCollectionName] = useState(null);
  //const [records, setRecords] = useState(null);
  const [item, setItem] = useState(() => {
    const initialState = getItems();
    return initialState;

  });
  //const [myTestArray, setMyTestArray] = useState(() => {
  //  const initialState = addTestData();
  //  return initialState;
    
  //}); //test

  const [myArray, setMyArray] = useState([]); //array of items
  //let resultItems;
  //let myItems = [];
  



  //console.log('param: ', param);
  //console.log('param id: ', param.id);
  //console.log('param address: ', param.address);
  //console.log('contract: ', contract);
  

/*
  async function getAccount() {
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //console.log('account[0]: ', accounts[0]);
    setDefaultAccount(accounts[0]);
    return accounts[0];
  }
*/

  async function getCollectionName() {
    //console.log('default account: ', defaultAccount);
    //console.log('test address from: ', web3.utils.toChecksumAddress(defaultAccount) );
    await contract.methods.showCollectionName(param.collectionID).call({
      from: defaultAccount
    }).then(result =>{
//      console.log('result:', result);
      setCollectionName(result);

    })
    
  }

/*
  async function findRecords() {
    //console.log('defAcc: ', defaultAccount);
    await contract.methods.showItemsAmount().call({
      from: defaultAccount
    }).then(result =>{
        console.log('showItemsAmount:', result);
        setRecords(result);
    })

  }
*/
   async function getItems() {
    const records = await contract.methods.showItemsAmount().call({
      from: defaultAccount
    });
  

    const myItems = [];
    console.log('records: ', records);
    for (let index = 0; index < records; index++) {
      const result = await contract.methods.showItem(index).call({
        from: defaultAccount
      });
      console.log('result.nameItem:', result.nameItem);
      console.log('result.collectionID:', result.collectionID);

      let item = {
        ownerAddress: result.ownerAddress,
        nameItem: result.nameItem,
        ipfsCID: result.ipfsCID,
        ipfsFileName: result.ipfsFileName,
        description: result.description,
        blockNumber: result.blockNumber,
        dateTime: timeConverter(result.dateTime),
        latitude: result.latitude,
        longitude: result.longitude,
        img:'https://' + result.ipfsCID +'.ipfs.dweb.link/' + result.ipfsFileName
      }

      if(param.collectionID ===result.collectionID){
        myItems.push(item);
      }
    }
    console.log ('return from getItems length of array:', myItems.length);
    console.log ('return from getItems array:', myItems);
    return myItems;
  }

  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  

  async function showItems() {


      const result = await item;
//        const listItems = result.map((d) =><li key={d.ipfsCID}>{d.nameItem}</li>);
        const listItems = result.map((d) => d);
        console.log('listitems: ', listItems);
        console.log('item: ', result);
        setMyArray(listItems);
        //return listItems;
      
  }

  useEffect(() => {
    //setMyArray([]);
    showItems();
  }, []);

/*  
  function addTestData() {
    //console.log('start addTestData');
    //setMyTestArray([]);
    const tempArray = [];
    for (let index = 0; index < 10; index++) {
      //console.log('add element: ', index);
      tempArray.push(index);
    }
    //setMyTestArray(tempArray);
    //console.log('return od addTestData: ', myTestArray.map((d) =><li key={d}>{d}</li>));
    return tempArray;
  }
*/
//function ReturnHello() {
//  return <li>Hello!</li>
//}


  //start point
    getCollectionName();
//    findRecords();




  
      return (
        <div>
          <Header />
          <li><NavLink to='/'>Back</NavLink></li>
          <div className="collection">
            <h2>Collection: {collectionName}</h2>
            <h3>Records in current collections: {myArray.length} </h3>
            <h3>{myArray.map((d) =>
              <div className="collection">
              
                <h3> name: {d.nameItem}</h3>
                <p>description: {d.description}</p>
                <p>dateTime: {d.dateTime}</p>
                <img src={d.img} alt="image of item"/>
              
              </div>
              )}

            </h3>
          </div>
          <Footer />
        </div>
      );
    }
  
export default Collection;