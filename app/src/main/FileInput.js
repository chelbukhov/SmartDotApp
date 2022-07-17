import React from "react";
import { Web3Storage } from 'web3.storage'
import API_token from './token';
import './FileInput.css';


class FileInput extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.fileInput = React.createRef();

      this.state = {
        cid: ""
      }

    }
    async handleSubmit(event) {
      event.preventDefault();
      const files = [];
      files.push(document.getElementById("file").files[0]);
      const storage = new Web3Storage({ token: API_token})
      console.log("files_name: ", files[0].name);
      console.log("files_stream: ", files[0].stream);
      console.log(`Uploading files`);
      const cid = await storage.put(files);
      this.setState({cid: "https://" + cid + ".ipfs.dweb.link/"});
      console.log('Content added with CID:', cid);
      //const URLcid = "https://" + cid + ".ipfs.dweb.link/";
    }
  
    render() {
      return (
        <div className="fileInput">
          <form onSubmit={this.handleSubmit}>
          <h3>
          <label>
              File for load into IPFS:
              <input id="file" type="file" ref={this.fileInput} />
            </label>
            <br />
            <button type="submit">Upload</button>Press and wait some seconds...
            <p>Link to file in IPFS</p>
            <a href={this.state.cid} target="_blank" rel="noopener noreferrer">{this.state.cid}</a>

          </h3>
          </form>
        </div>
      );
    }
  }
  
export default FileInput;