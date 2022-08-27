import React from "react";
import './AddNewFile.css';
import web3  from "../ethereum/web3";
import Collections from '../ethereum/build/Collections.json';
import { NavLink } from 'react-router-dom';
import Header from "../header/Header";
import Footer from "../footer/Footer";
import FileInput from './FileInput';

let contract;

class AddNewFile extends React.Component {
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleItemChange = this.handleItemChange.bind(this);
//        this.textInput = React.createRef();

        this.state = {
            getGeolocation: false,
            Latitude: "",
            Longitude: "",
            collectionID: null,
            address: null,
            account: null,
            nameItem: "",
            fileDescription: "",
            fileName: "",
            CID: "",
            CIDIsReceived: false
        }
        
    }

    componentDidMount(){
        this.getParamFromURL();
 
        //console.log('contract: ', contract);
        
    }

    getParamFromURL = () => {
        const pathArray = window.location.pathname.split('/');
        const collectionID = pathArray[2].replace('collectionID=','');
        const address = pathArray[3].replace('address=','');
        const account = pathArray[4].replace('account=','');

        this.setState({
            collectionID: collectionID,
            address: address,
            account: account
        })
    }

    getLocation = () => {
        console.log('getLocation');
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(this.showPosition);
            this.setState({getGeolocation: true});
        } else { 
            alert ("Geolocation is not supported by this browser.");
            this.setState({getGeolocation: false});
        }
        
    }

    showPosition = (position) => {
        console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
        this.setState({Latitude: position.coords.latitude});
        this.setState({Longitude: position.coords.longitude});
    }

    updateState = (stateName, value) => {
        switch (stateName) {

            case 'FileDescription':
                this.setState({fileDescription: value});
                break;
            case 'FileName':
                this.setState({fileName: value});
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

    sendTransaction = async() => {
        contract = new web3.eth.Contract(
            Collections.abi,
            this.state.address
          ); 
        const geoMultiplier = await contract.methods.geoMultiplier().call();
        //const geoMultiplier = 10**15;
        console.log('geoMultiplier: ', geoMultiplier);
        const latitude = this.state.Latitude * geoMultiplier;
        const longitude = this.state.Longitude * geoMultiplier;
        await contract.methods.addItem(
            this.state.collectionID, 
            this.state.nameItem, 
            this.state.CID, 
            this.state.fileName,
            this.state.fileDescription,
            web3.utils.toBN(latitude),
            web3.utils.toBN(longitude)
        ).send({
            from: this.state.account
        })
    } 

    handleChange(event) {
        //console.log('width: ', document.body.clientWidth);
        this.setState({fileDescription: event.target.value});
    }
    handleItemChange(event) {
        //console.log('width: ', document.body.clientWidth);
        this.setState({nameItem: event.target.value});
    }


    render() {
        return (
            <div>
                <Header />
                <h3><NavLink to={`/showCollection/collectionID=${this.state.collectionID}/address=${this.state.address}/account=${this.state.account}`}>Back</NavLink></h3>
                <div className="geolocation">
                        <h3>Your location.</h3>
                        <button onClick={this.getLocation}>Get my geolocation</button>
                        <h3>Latitude: {this.state.Latitude}</h3>
                        <h3>Longitude: {this.state.Longitude}</h3>
                        {this.state.getGeolocation === true ? (
                                    <div>
                                        <form onSubmit={this.handleSubmit}>
                                            <h3>
                                                <label>
                                                    Name for your item:
                                                    <p>
                                                        <textarea rows="1" cols={document.body.clientWidth/8-6} placeholder="Enter name of your item. You will see it in your collection. Maximum is 100 signs." maxLength={100} value={this.state.nameItem} onChange={this.handleItemChange}/>
                                                    </p>
                                                </label>
                                                <label>
                                                    Description for your file:
                                                    <p>
                                                        <textarea rows="4" cols={document.body.clientWidth/8-6} placeholder="Enter description of your file. Maximum is 1000 signs." maxLength={1000} value={this.state.fileDescription} onChange={this.handleChange}/>
                                                    </p>
                                                </label>
                                            </h3>
                                        </form>
                                        <FileInput updateState={this.updateState}/>
                                        {this.state.CIDIsReceived === true ? (
                                        <div>
                                            <button onClick={this.sendTransaction}>Sending your data to blockchain.</button>
                                            <br></br>
                                        </div>
                                        ) : (<div></div>)}
                                    </div>
                                ) : (<div></div>)}

                </div>
                <Footer />
            </div>

        );
    }
}

export default AddNewFile;