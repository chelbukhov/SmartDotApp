import React from "react";
import './FileDescription.css';


class FileDescription extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.textInput = React.createRef();

      this.state = {
        cid: ""
      }

    }
    async handleSubmit(event) {
      event.preventDefault();
      const descriptionData = document.getElementById("fileDescriptionInput").value;
      this.props.updateState('FileDescription', descriptionData)
      //alert(descriptionData);      
    }
  
    render() {
      return (
        <div className="fileDescription">
          <form onSubmit={this.handleSubmit}>
          <h3>
          <label>
              Description for your file:
              <input id="fileDescriptionInput" type="text" ref={this.textInput}/>
            </label>
            <br />
            <button type="submit">Upload</button>

          </h3>
          </form>
        </div>
      );
    }
  }
  
export default FileDescription;