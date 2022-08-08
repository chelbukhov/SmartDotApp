import React from "react";
import './SaveData.css';
import smartDot from '../ethereum/smartdot';


class SaveData extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        result: false,
      }

    }
  
    showOwner = async function () {
      const resOwner = await smartDot.methods.owner().call();
      alert(resOwner);
    }

    render() {
      return (
        <div className="saveData">
            Transfer your data to smart contract - soon......
            <button onClick={this.showOwner}>Click me</button>

        </div>
      );
    }
  }
  
export default SaveData;