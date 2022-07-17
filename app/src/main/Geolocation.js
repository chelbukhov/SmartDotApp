import React from "react";
import './Geolocation.css';

class Geo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Latitude: "",
            Longitude: "",
        }
    }

    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(this.showPosition);
            this.props.updateState('GetGeolocation', true);
} else { 
            alert ("Geolocation is not supported by this browser.");
            this.props.updateState('GetGeolocation', false);
        }
        
    }

    showPosition = (position) => {
        //alert("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
        this.setState({Latitude: position.coords.latitude});
        this.setState({Longitude: position.coords.longitude});
    }


    render() {
        return (
            <div className="geolocation">
                    <h3>Your location.</h3>
                    <button onClick={this.getLocation}>Get my geolocation</button>
                    <h3>Latitude: {this.state.Latitude}</h3>
                    <h3>Longitude: {this.state.Longitude}</h3>
            </div>

        );
    }
}

export default Geo;