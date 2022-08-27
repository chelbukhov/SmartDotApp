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
  const [item] = useState(() => {
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
        itemID: index,
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
                <h3><NavLink to={`/showItem/itemID=${d.itemID}/collectionID=${param.collectionID}/address=${param.address}/account=${defaultAccount}`}>{d.nameItem}</NavLink></h3>
                <img className="collection" src={d.img} alt=""/>
                <p>description: {d.description}</p>
                <p>Date of creation: {d.createDate}</p>
              
              </div>
              )}

            </h3>
          </div>
          <div>
          <h3><NavLink to={`/addNewFile/collectionID=${param.collectionID}/address=${param.address}/account=${defaultAccount}`}>add new file</NavLink></h3>
          </div>
          <Footer />
        </div>
      );
    }
  
export default Collection;