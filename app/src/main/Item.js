import React, {useState, useEffect} from "react";
import './Item.css';
import Header from "../header/Header";
import Footer from '../footer/Footer';
import { NavLink, useParams } from 'react-router-dom';
import web3  from "../ethereum/web3";
import Collections from '../ethereum/build/Collections.json';
import timeConverter from "./time";



const Item =(props) => {
    const param = useParams();
    const defaultAccount = param.account;

    const  contract = new web3.eth.Contract(
      Collections.abi,
      param.address
    ); 

    const [item, setItem] = useState(() => {
      const initialState = getItem();
      return initialState;
  
    });
    const [addRecord, setRecord] = useState('');
    const [dateForRecord, setDateForRecord] = useState(new Date().getTime() / 1000);

    function setDate (event) {
      //console.log('dateForRecord: ', event);
      const unixformat = Math.floor(new Date(event).getTime() / 1000);
      //console.log('unixformat: ', unixformat);
      setDateForRecord(unixformat);
    }

    function setAddRecord (event) {
      //console.log('event:', event);
      setRecord(event);
    }

    async function getItem() {
        const geoMultiplier = await contract.methods.geoMultiplier().call();
        const result = await contract.methods.showItem(param.itemID).call({
          from: defaultAccount
        });
        //console.log('result:', result);
        //console.log('result.nameItem:', result.nameItem);
        //console.log('result.collectionID:', result.collectionID);
  
      let item = {
        nameItem: result.nameItem,
        ipfsCID: result.ipfsCID,
        ipfsFileName: result.ipfsFileName,
        description: result.description,
        blockNumber: result.blockNumber,
        createDate: timeConverter(result.createDate),
        latitude: result.latitude / geoMultiplier,
        longitude: result.longitude / geoMultiplier,
        img:'https://' + result.ipfsCID +'.ipfs.dweb.link/' + result.ipfsFileName,
        additionalRecords: []
      }
      item.additionalRecords = await getAddRecords(param.itemID);

      //console.log ('return from getItem :', item);
      return item;
    }
  

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
            //const createDate = await web3.eth.getBlock(element);
            //console.log('createDate: ', timeConverter(createDate.timestamp));
  
//            console.log('result event dateCreation: ', timeConverter(result[0].returnValues.dateCreation));
//            addRecords.push(<li key = {addRecords.length}>{timeConverter(createDate.timestamp)} {result[0].returnValues.description}</li>);
//                <td> {timeConverter(createDate.timestamp)}</td>
            addRecords.push(
              <tr key = {addRecords.length}>
                <td> {timeConverter(result[0].returnValues.dateCreation)}</td>
                <td> {result[0].returnValues.description}</td>
              </tr>
            );
  
          }
          else {
            break;
          }
        }
      }
   
      return addRecords;
    }
    
  
    async function showItem() {
      const result = await item;
      setItem(result);
      //console.log("showItem result: ", result);
    }
  
    useEffect(() => {
      showItem();
    });
  
    function formSubmit (event){
      //console.log(event);
      event.preventDefault();
      sendTransaction();
    }

    async function sendTransaction() {
      if(addRecord.length < 5 ){
        alert('Mimimum length of record is 5 signs.')
      }
        else
      {
        await contract.methods.addRecord(param.itemID, dateForRecord, addRecord).send({
          from: defaultAccount
        }); 
        // refresh data
        setItem(getItem());
        setRecord('');
      }
    }
  
  
    //start point
   
    return (
        <div>
          <Header />
          <h3><NavLink to={`/showCollection/collectionID=${param.collectionID}/address=${param.address}/account=${param.account}`}>Back</NavLink></h3>
          <div className="item">
            <h2>{item.nameItem}</h2>
            <div>
              <div>
                <img className="item" src={item.img} alt='' />
              </div>
              <div className="itemtext">
                <h3>{item.description}</h3>
                <h4>Date of creation: {item.createDate}</h4>
                <h4>Additional records in blockchain:</h4>
                <table className="item">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Record</th>
                    </tr>
                  </thead>
                  <tbody>
                      {item.additionalRecords}
                  </tbody>
                </table>
                <form className="item" onSubmit={formSubmit}>
                    <textarea className="item"
                      rows="2"
                      placeholder="Enter additional information. Minimum is 5 signs. Maximum is 1000 signs for one record." 
                      maxLength={1000}
                      onChange={(e) => setAddRecord(e.target.value)}
                    />
                    <p>
                      <input type='date' onChange={(e) => setDate(e.target.value)}/>enter the date of record
                    </p>
                    <input type="submit" value="Send transaction" />
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
  
export default Item;