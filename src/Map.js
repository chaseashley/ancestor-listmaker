 /* global google */ 
import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from 'react-google-maps';
import Geocode from "react-geocode";
import styles from './mapstyles.module.css';
import MapOverlayItems from './MapOverlayItems';
import MissingCoordinatesOverlay from './MissingCoordinatesOverlay';
import { getCoordinates, postCoordinates } from './locationsDBqueries';

const API_KEY='AIzaSyD5VQNhUE4UQlIZbaJo4aHE1pt9zuZFzPw';

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.onClickCoordinatesSubmit = this.onClickCoordinatesSubmit.bind(this);
        this.geocodeLocation = this.geocodeLocation.bind(this);
        this.centerMap = this.centerMap.bind(this);
        this.standardizeAddress = this.standardizeAddress.bind(this);
        this.getCoordinatesFromAddressDBText = this.getCoordinatesFromAddressDBText.bind(this);
        this.state = {
            coordinatesLoaded: false,
            ancestors: this.props.location.ancestors,
            missingCoordinates: null,
            markerCoordinates: null,
            initialMarkerCoordinates: null,
        }
    }

    async geocodeLocation(location) {
        let coordinates;
        Geocode.setApiKey(API_KEY);
        await Geocode.fromAddress(location).then(
            response => {
                coordinates = response.results[0].geometry.location;
            },
            error => {
                console.error(error);
            }
        );
        return coordinates;
    }

    async onClickCoordinatesSubmit(coordinates) {
        let missingCoordinates = this.addCoordinatesToAncestors(this.state.missingCoordinates[0][2], coordinates);
        if (missingCoordinates.length > 0) {
            const newCoordinates = await this.geocodeLocation(missingCoordinates[0][2]);
            this.setState({markerCoordinates: newCoordinates, missingCoordinates: missingCoordinates});
        } else {
            this.setState({coordinatesLoaded: true});
        }
    }

    addCoordinatesToAncestors(location, coordinates) {
        let missingCoordinates = [];
        this.state.ancestors.forEach(ancestor => {
            if (ancestor.BirthLocation !== '') {
                if (ancestor.blat === undefined && this.standardizeAddress(ancestor.BirthLocation) === this.standardizeAddress(location)) {
                    ancestor['blat'] = coordinates.lat;
                    ancestor['blng'] = coordinates.lng;
                } else if (ancestor.blat === undefined) {
                    missingCoordinates.push([ancestor,'Birth', ancestor.BirthLocation]);
                }
            }
            if (ancestor.DeathLocation !== '') {
                if (ancestor.DeathLocation !== '' && ancestor.dlat === undefined && this.standardizeAddress(ancestor.DeathLocation) === this.standardizeAddress(location)) {
                    ancestor['dlat'] = coordinates.lat;
                    ancestor['dlng'] = coordinates.lng;
                } else if (ancestor.dlat === undefined) {
                    missingCoordinates.push([ancestor,'Death', ancestor.DeathLocation]);
                }
            }
        });
        postCoordinates(this.standardizeAddress(location), `${coordinates.lat},${coordinates.lng}`)
        return missingCoordinates;
    }

    centerMap(map) {
        let bounds = new google.maps.LatLngBounds();
        this.state.ancestors.forEach(ancestor => {
            if (ancestor.blat !== undefined) {
                bounds.extend(new google.maps.LatLng(ancestor.blat, ancestor.blng));
            }
            if (ancestor.dlat !== undefined) {
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
        let missingCoordinates = [];
        let birthCoordinatesGets = [];
        let birthLocationIndexes = [];
        let deathCoordinatesGets = [];
        let deathLocationIndexes = [];
        for (let i=0; i<this.state.ancestors.length; i++) {
            if (this.state.ancestors[i].BirthLocation !== '') {
                let birthLocation = this.standardizeAddress(this.state.ancestors[i].BirthLocation);
                birthCoordinatesGets.push(getCoordinates(birthLocation));
                birthLocationIndexes.push(i);
            }
            if (this.state.ancestors[i].DeathLocation !== '') {
                let deathLocation = this.standardizeAddress(this.state.ancestors[i].DeathLocation);
                deathCoordinatesGets.push(getCoordinates(deathLocation));
                deathLocationIndexes.push(i);
            }
        }

        await Promise.all(birthCoordinatesGets)
            .then(responses => {
                for (let i=0; i<responses.length; i++) {
                    let j = birthLocationIndexes[i];
                    if (responses[i] === undefined) {
                        missingCoordinates.push([this.state.ancestors[j],'Birth',this.state.ancestors[j].BirthLocation]);
                    } else {
                        let birthCoordinates = responses[i].data.coordinates;
                        let blatString = birthCoordinates.substring(0,birthCoordinates.indexOf(','));
                        this.state.ancestors[j]['blat'] = Number(blatString);
                        let blngString = birthCoordinates.substring(birthCoordinates.indexOf(',')+1);
                        this.state.ancestors[j]['blng'] = Number(blngString);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });

        await Promise.all(deathCoordinatesGets)
                .then(responses => {
                for (let i=0; i<responses.length; i++) {
                    let j = deathLocationIndexes[i];
                    if (responses[i] === undefined) {
                        missingCoordinates.push([this.state.ancestors[j],'Death',this.state.ancestors[j].DeathLocation]);
                    } else {
                        let deathCoordinates = responses[i].data.coordinates;
                        let dlatString = deathCoordinates.substring(0,deathCoordinates.indexOf(','));
                        this.state.ancestors[j]['dlat'] = Number(dlatString);
                        let dlngString = deathCoordinates.substring(deathCoordinates.indexOf(',')+1);
                        this.state.ancestors[j]['dlng'] = Number(dlngString);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
        if (missingCoordinates.length === 0) {
            this.setState({coordinatesLoaded: true});
        } else {
            const coordinates = await this.geocodeLocation(missingCoordinates[0][2]);
            this.setState({missingCoordinates: missingCoordinates, markerCoordinates: coordinates});
        }
    }

    /*
    async checkAddressesForCoordinates() {
        let missingCoordinates = [];
        const addressDBText = await(fetch('/coordinates.txt').then(x => x.text()));
        this.state.ancestors.forEach(ancestor => {
            if (ancestor.BirthLocation !== '') {
                let birthLocation = this.standardizeAddress(ancestor.BirthLocation);
                let coordinatesBirthString = this.getCoordinatesFromAddressDBText(addressDBText, birthLocation);
                if (coordinatesBirthString === '') {
                    missingCoordinates.push([ancestor,'Birth', ancestor.BirthLocation]);
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
                    missingCoordinates.push([ancestor,'Death',ancestor.DeathLocation]);
                } else {
                    let dlatString = coordinatesDeathString.substring(0,coordinatesDeathString.indexOf(','));
                    ancestor['dlat'] = Number(dlatString);
                    let dlngString = coordinatesDeathString.substring(coordinatesDeathString.indexOf(',')+1);
                    ancestor['dlng'] = Number(dlngString);
                }
            }
        });
        if (missingCoordinates.length === 0) {
            this.setState({coordinatesLoaded: true});
        } else {
            const coordinates = await this.geocodeLocation(missingCoordinates[0][2]);
            this.setState({missingCoordinates: missingCoordinates, markerCoordinates: coordinates});
        }
    }
    */

    async componentDidMount() {
        this.checkAddressesForCoordinates();
    }

    render() {

        let MapWithOverlay;
        if (this.state.coordinatesLoaded) {
            MapWithOverlay = withScriptjs(withGoogleMap(props =>
                <GoogleMap
                    options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                    defaultZoom={2}
                    defaultCenter={{ lat: 20, lng: 0 }}
                    ref={map => map && this.centerMap(map)}
                >
                    <MapOverlayItems ancestors={this.state.ancestors}/>
                </GoogleMap>
            ));
        } else if (this.state.missingCoordinates !== null) {
            MapWithOverlay = withScriptjs(withGoogleMap(props =>
                <GoogleMap
                    options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                    defaultZoom={12}
                    defaultCenter={this.state.markerCoordinates}
                >
                    <MissingCoordinatesOverlay location={this.state.missingCoordinates[0][2]} name={this.state.missingCoordinates[0][0].BirthNamePrivate} birthdeath={this.state.missingCoordinates[0][1]} markerCoordinates={this.state.markerCoordinates} numberMissing={this.state.missingCoordinates.length} onClickCoordinatesSubmit={this.onClickCoordinatesSubmit}/>
                </GoogleMap>
            ));
        } else {
            MapWithOverlay = withScriptjs(withGoogleMap(props =>
                <GoogleMap
                    options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                    defaultZoom={2}
                    defaultCenter={{ lat: 20, lng: 0 }}
                />
            ));
        }

        return(
            <div className={styles.page}>
                <div className={styles.topBox}>
                    <h1 className={styles.h1}>
                        Ancestor Listmaker
                    </h1>
                </div>
                <div className={styles.mapDiv}>
                    <MapWithOverlay
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
