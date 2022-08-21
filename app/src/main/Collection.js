import React, {useState, useEffect} from "react";
import './Collection.css';
import Header from "../header/Header";
import Footer from '../footer/Footer';
import { NavLink, useParams } from 'react-router-dom';
import web3  from "../ethereum/web3";
import Collections from '../ethereum/build/Collections.json';
//import smartDot from '../ethereum/smartdot';
import timeConverter from "./time";



const Collection =(props) => {

  const param = useParams();
  const defaultAccount = param.account;
  //let contract;
  const  contract = new web3.eth.Contract(
    Collections.abi,
    param.address
  ); 

  const [collectionName, setCollectionName] = useState(null);
  const [item, setItem] = useState(() => {
    const initialState = getItems();
    return initialState;

  });

  const [myArray, setMyArray] = useState([]); //array of items
  



  //console.log('param: ', param);
  //console.log('param id: ', param.id);
  //console.log('param address: ', param.address);
  //console.log('contract: ', contract);
  



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
    //let addRecords = [];
    //console.log('records: ', records);
    //let currentIndex;
    for (let index = 0; index < records; index++) {
      //currentIndex = index;
      const result = await contract.methods.showItem(index).call({
        from: defaultAccount
      });
      //console.log('result:', result);
      //console.log('result.nameItem:', result.nameItem);
      //console.log('result.collectionID:', result.collectionID);

      let item = {
        ownerAddress: result.ownerAddress,
        nameItem: result.nameItem,
        ipfsCID: result.ipfsCID,
        ipfsFileName: result.ipfsFileName,
        description: result.description,
        blockNumber: result.blockNumber,
        createDate: timeConverter(result.createDate),
        latitude: result.latitude,
        longitude: result.longitude,
        img:'https://' + result.ipfsCID +'.ipfs.dweb.link/' + result.ipfsFileName,
        additionalRecords: []
      }

      //console.log('param.collectionID: ', param.collectionID);
      //console.log('result.collectionID: ', result.collectionID);
        if(param.collectionID === result.collectionID){
          //item.additionalRecords = await getAddRecords(index);
          myItems.push(item);
        }      
      }
      
    //console.log ('return from getItems length of array:', myItems.length);
    //console.log ('return from getItems array:', myItems);
    return myItems;
  }
/*
  async function getAddRecords(itemID) {
    const addRecords = [];
    const recordsAmount = await contract.methods.showRecordsAmount().call({
      from: defaultAccount
    });
    console.log('recordsAmount: ', recordsAmount);
  // search additional record for current item in Collecion contract
    if (recordsAmount > 0) {
      const resArray = await contract.methods.findRecords(itemID).call({
        from: defaultAccount
      });
      //console.log('resArray: ', resArray);
      for (let index = 0; index < recordsAmount; index++) {
        const element = resArray[index];
        //console.log('element [', index, ']: ' ,element);
        if (element > 0) {
          const result = await contract.getPastEvents(
            'AddRecord',
            {
              'fromBlock': element,
              'toBlock': element,
            }
          );
          const createDate = await web3.eth.getBlock(element);
          //console.log('createDate: ', timeConverter(createDate.timestamp));

          //console.log('result event: ', result[0].returnValues.description);
          addRecords.push(<li key = {addRecords.length}>{timeConverter(createDate.timestamp)} {result[0].returnValues.description}</li>);

        }
        else {
          break;
        }
      }
    }


  return addRecords;
  }
  */


  async function showItems() {
    const result = await item;
    const listItems = result.map((d) => d);
    //console.log('listitems: ', listItems);
    //console.log('item: ', result);
    setMyArray(listItems);
  }

  useEffect(() => {
    showItems();
  });





  //start point
    getCollectionName();




  
      return (
        <div>
          <Header />
          <h3><NavLink to='/'>Back</NavLink></h3>
          <div className="collection">
            <h2>Collection: {collectionName}</h2>
            <h3>Records in current collections: {myArray.length} </h3>
            <h3>{myArray.map((d, index) =>
              <div className="collection">
                <h3><NavLink to={`/showItem/itemID=${index}/collectionID=${param.collectionID}/address=${param.address}/account=${defaultAccount}`}>{d.nameItem}</NavLink></h3>
                <img className="collection" src={d.img} alt=""/>
                <p>description: {d.description}</p>
                <p>Date of creation: {d.createDate}</p>
              
              </div>
              )}

            </h3>
          </div>
          <Footer />
        </div>
      );
    }
  
export default Collection;