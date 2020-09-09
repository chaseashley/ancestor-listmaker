 /* global google */ 
import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap
  } from 'react-google-maps';
import styles from './mapstyles.module.css';
import MarkersWithSlider from './MarkersWithSlider';
import Geocode from "react-geocode";

const API_KEY='AIzaSyD5VQNhUE4UQlIZbaJo4aHE1pt9zuZFzPw';

/*
Geocode.setApiKey(API_KEY);
Geocode.fromAddress("Eiffel Tower").then(
    response => {
      const { lat, lng } = response.results[0].geometry.location;
      console.log(lat, lng);
    },
    error => {
      console.error(error);
    }
);
*/

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.centerMap = this.centerMap.bind(this);
        this.standardizeAddress = this.standardizeAddress.bind(this);
        this.findEarliestBirthYear = this.findEarliestBirthYear.bind(this);
        this.findLatestDeathYear = this.findLatestDeathYear.bind(this);
        this.getCoordinatesFromAddressDBText = this.getCoordinatesFromAddressDBText.bind(this);
        this.state = {
            coordinatesLoaded: false,
            ancestors: this.props.location.ancestors,
            markerType: 'static',
            timeSeries: true,
            animated: true,
            windowAutoOpen: false,
            birthPins: true,
            deathPins: true,
            lines: true,
            earliestBirthYear: null,
            latestDeathYear: null
        }
    }

    centerMap(map) {
        let bounds = new google.maps.LatLngBounds();
        this.state.ancestors.forEach(ancestor => {
            if (this.state.birthPins && ancestor.blat !== undefined) {
                bounds.extend(new google.maps.LatLng(ancestor.blat, ancestor.blng));
            }
            if (this.state.deathPins && ancestor.dlat !== undefined) {
                bounds.extend(new google.maps.LatLng(ancestor.dlat, ancestor.dlng));
            }
        })
        map.fitBounds(bounds);
    }

    getCoordinatesFromAddressDBText(addressDBText, address) {
        let matchStart = addressDBText.indexOf(address);
        if (matchStart !== -1) {
            let coordinatesStart = addressDBText.indexOf('*',matchStart+1);
            let coordinatesEnd = addressDBText.indexOf('*',coordinatesStart+1);
            return addressDBText.substring(coordinatesStart+1,coordinatesEnd)
        } else {
            return ''
        }
    }

    standardizeAddress(address) {
        address = address.toUpperCase();
        address = address.replace(/,,/g,',');
        address = address.replace(/  /g,' ');
        address = address.replace(/, /g,',');
        address = address.replace(/\./g,'');
        return address;
    }

    async checkAddressesForCoordinates() {
        let misssingCoordinates = [];
        const addressDBText = await(fetch('/coordinates.txt').then(x => x.text()));
        this.state.ancestors.forEach(ancestor => {
            if (ancestor.BirthLocation !== '') {
                let birthLocation = this.standardizeAddress(ancestor.BirthLocation);
                let coordinatesBirthString = this.getCoordinatesFromAddressDBText(addressDBText, birthLocation);
                if (coordinatesBirthString === '') {
                    misssingCoordinates.push([ancestor,'birth', ancestor.BirthLocation]);
                } else {
                    let blatString = coordinatesBirthString.substring(0,coordinatesBirthString.indexOf(','));
                    ancestor['blat'] = Number(blatString);
                    let blngString = coordinatesBirthString.substring(coordinatesBirthString.indexOf(',')+1);
                    ancestor['blng'] = Number(blngString);
                }
            }
            if (ancestor.DeathLocation !== '') {
                let deathLocation = this.standardizeAddress(ancestor.DeathLocation)
                let coordinatesDeathString = this.getCoordinatesFromAddressDBText(addressDBText, deathLocation);
                if (coordinatesDeathString === '') {
                    console.log(ancestor.BirthNamePrivate,'death',ancestor.BirthLocation);
                    misssingCoordinates.push([ancestor,'death',ancestor.DeathLocation]);
                } else {
                    let dlatString = coordinatesDeathString.substring(0,coordinatesDeathString.indexOf(','));
                    ancestor['dlat'] = Number(dlatString);
                    let dlngString = coordinatesDeathString.substring(coordinatesDeathString.indexOf(',')+1);
                    ancestor['dlng'] = Number(dlngString);
                }
            }
        });
        this.setState({coordinatesLoaded: true});
    }

    findEarliestBirthYear() {
        let earliestBirthYear = 3000;
        let birthYear;
        this.state.ancestors.forEach(ancestor => {
            if (ancestor.BirthDate !=='') {
                birthYear = Number(ancestor.BirthDate.substring(0,4));
                if (birthYear < earliestBirthYear) {
                    earliestBirthYear = birthYear;
                }
            }
        })
        this.setState({earliestBirthYear: earliestBirthYear});
    }

    findLatestDeathYear() {
        let latestDeathYear = 0;
        let deathYear;
        this.state.ancestors.forEach(ancestor => {
            if (ancestor.DeathDate !=='') {
                deathYear = Number(ancestor.DeathDate.substring(0,4));
                if (deathYear > latestDeathYear) {
                    latestDeathYear = deathYear;
                }
            }
        })
        this.setState({latestDeathYear: latestDeathYear});
    }

    componentDidMount() {
        this.checkAddressesForCoordinates();
        //if (this.state.timeSeries) {
            this.findEarliestBirthYear();
            this.findLatestDeathYear();
        //}
    }

    render() {
        let markers;
        if (this.state.coordinatesLoaded) {
            markers =   <MarkersWithSlider
                            ancestors={this.state.ancestors}
                            birthPins={this.state.birthPins}
                            deathPins={this.state.deathPins}
                            lines={this.state.lines}
                            markerType={this.state.markerType}
                            timeSeries={this.state.timeSeries}
                            animated={this.state.animated}
                            windowAutoOpen={this.state.windowAutoOpen}
                            sliderMin={Math.floor(this.state.earliestBirthYear/10)*10}
                            sliderMax={(Math.floor(this.state.latestDeathYear/10)+1)*10}
                        />
        }   else {
            markers = <div></div>
        }

        const MapWithMarkers = withScriptjs(withGoogleMap(props =>
            <GoogleMap
                options={{streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                defaultZoom={7}
                defaultCenter={{ lat: 0, lng: 0 }}
                ref={map => map && this.centerMap(map)}
            >
                {markers}
            </GoogleMap>
        ));

        return(
            <div className={styles.page}>
                <div className={styles.topBox}>
                    <h1 className={styles.h1}>
                        Ancestor Listmaker
                    </h1>
                </div>
                <div>
                    <MapWithMarkers
                        //googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"`}
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places"`}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `600px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </div>
            </div>
        );

    }

};
export default Map;
