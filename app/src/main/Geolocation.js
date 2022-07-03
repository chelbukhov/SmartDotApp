import React from "react";

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
          } else { 
            alert ("Geolocation is not supported by this browser.");
          }
        
    }

    showPosition = (position) => {
        //alert("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
        this.setState({Latitude: position.coords.latitude});
        this.setState({Longitude: position.coords.longitude})
    }


    render() {
        return (
            <div>
                    <button onClick={this.getLocation}>1. Get my geolocation</button>
                    <p>Your location.</p>
                    <p>Latitude: {this.state.Latitude}</p>
                    <p>Longitude: {this.state.Longitude}</p>
            </div>

        );
    }
}

export default Geo;