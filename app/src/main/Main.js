import React from 'react';
import FileInput from './FileInput';
import Geo from './Geolocation';
import './Main.css';



class Main extends React.Component {


    render() {
        return (
            <div className='container'>
                <main>

                    <Geo />
                    <FileInput />
                    <p>3. Add file description to IPFS - soon...</p>
                    <p>4. Connect to metamask and select Mumbai TestNet on Polygon blockchain - soon...</p>
                    <p>5. Transfer data to smart contract - soon...</p>

                    
                </main>
            </div>
            );
        
    }
}

  
  export default Main;
