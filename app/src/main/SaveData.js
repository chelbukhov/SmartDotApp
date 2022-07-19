import React from "react";
import './SaveData.css';


class SaveData extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        result: false,
      }

    }
  
    render() {
      return (
        <div className="saveData">
            Transfer your data to smart contract - soon...
        </div>
      );
    }
  }
  
export default SaveData;