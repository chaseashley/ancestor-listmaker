 /* global google */ 
import React from 'react';
import { GoogleMap, LoadScript, useGoogleMap } from '@react-google-maps/api';
import Geocode from "react-geocode";
import styles from './mapstyles.module.css';
import MapOverlayItems from './MapOverlayItems';
import MissingCoordinatesOverlay from './MissingCoordinatesOverlay';
import { getCoordinates, postCoordinates } from './locationsDBqueries';
import { adjustOverlappingMarkerCoordinates } from './overlappingMarkers';
import db from './db';
import { standardizeAddress } from './standardizeAddress';
import { Link } from "react-router-dom";

const API_KEY='AIzaSyD5VQNhUE4UQlIZbaJo4aHE1pt9zuZFzPw';

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.onProceedClick = this.onProceedClick.bind(this);
        this.checkAddressesForCoordinates = this.checkAddressesForCoordinates.bind(this);
        this.makeLocationsList = this.makeLocationsList.bind(this);
        this.birthPinsCallback = this.birthPinsCallback.bind(this);
        this.deathPinsCallback = this.deathPinsCallback.bind(this);
        this.onClickCoordinatesSkip = this.onClickCoordinatesSkip.bind(this);
        this.addToMissingCoordinates = this.addToMissingCoordinates.bind(this);
        this.onClickCoordinatesSubmit = this.onClickCoordinatesSubmit.bind(this);
        this.geocodeLocation = this.geocodeLocation.bind(this);
        this.centerMap = this.centerMap.bind(this);
        this.getCoordinatesFromAddressDBText = this.getCoordinatesFromAddressDBText.bind(this);
        this.state = {
            coordinatesLoaded: false,
            ancestors: this.props.location.ancestors,
            missingCoordinates: null,
            markerCoordinates: null,
            initialMarkerCoordinates: null,
            map: null,
            mapZoom: null,
            mapCenter: null,
            birthPins: true,
            deathPins: false,
            proceed: false,
        }
    }

    componentDidMount() {
        db.table('map')
        .toArray()
        .then((storedState) => {
            if (storedState !== null && this.props.location.ancestors === undefined) {
                this.setState(JSON.parse(storedState));
                this.checkAddressesForCoordinates();
            } else {
                db.table('map').put(JSON.stringify(this.state),0)
                    .catch(function(e){alert('Mapping information cannot be stored. Therefore, if you wish to return to this map page, use the Map List button on the ancestors list page rather than the forward return arrow')});
                this.checkAddressesForCoordinates();
            }
        });
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

    async onClickCoordinatesSkip(location) {
        let ancestors = this.state.ancestors;
        ancestors.forEach(ancestor => {
            if (ancestor.BirthLocation === location) {
                ancestor.BirthLocation = '';
            }
            if (ancestor.DeathLocation === location) {
                ancestor.DeathLocation = '';
            }
        })
        this.setState({ancestors: ancestors});
        let missingCoordinates = this.state.missingCoordinates;
        for (let i=0; i<missingCoordinates.length; i++) {
            if (missingCoordinates[i][0] === location) {
                missingCoordinates.splice(i,1);
                break;
            }
        }
        if (missingCoordinates.length > 0) {
            const newCoordinates = await this.geocodeLocation(missingCoordinates[0][0]);
            this.setState({markerCoordinates: newCoordinates, missingCoordinates: missingCoordinates});
        } else {
            this.setState({coordinatesLoaded: true});
            this.centerMap(this.state.map);
        }
    }

    async onClickCoordinatesSubmit(coordinates) {
        let missingCoordinates = this.addCoordinatesToAncestors(this.state.missingCoordinates[0][0], coordinates);
        if (missingCoordinates.length > 0) {
            const newCoordinates = await this.geocodeLocation(missingCoordinates[0][0]);
            await this.setState({markerCoordinates: newCoordinates, missingCoordinates: missingCoordinates});
        } else {
            this.setState({coordinatesLoaded: true});
            this.centerMap(this.state.map);
        }
    }

    addToMissingCoordinates(missingCoordinates, location, ancestorName, id, birthDeath) {
        if (missingCoordinates.length === 0) {
            missingCoordinates.push([location, ancestorName, id, birthDeath]);
        } else {
            let matchFound = false;
            for (let i=0; i<missingCoordinates.length; i++) {
                if (missingCoordinates[i][0] === location) {
                    matchFound = true;
                    break;
                }
            }
            if (matchFound === false) {
                missingCoordinates.push([location, ancestorName, id, birthDeath]);
            }
        }
        return missingCoordinates;
    }

    addCoordinatesToAncestors(location, coordinates) {
        let missingCoordinates = [];
        this.state.ancestors.forEach(ancestor => {
            if (ancestor.BirthLocation !== '' && ancestor.BirthLocation !== null) {
                if (ancestor.blat === undefined && standardizeAddress(ancestor.BirthLocation) === standardizeAddress(location)) {
                    ancestor['blat'] = coordinates.lat;
                    ancestor['blng'] = coordinates.lng;
                } else if (ancestor.blat === undefined) {
                    missingCoordinates = this.addToMissingCoordinates(missingCoordinates, ancestor.BirthLocation, ancestor.BirthNamePrivate, ancestor.Name, 'Birth');
                }
            }
            if (ancestor.DeathLocation !== '' && ancestor.DeathLocation !== null) {
                if (ancestor.dlat === undefined && standardizeAddress(ancestor.DeathLocation) === standardizeAddress(location)) {
                    ancestor['dlat'] = coordinates.lat;
                    ancestor['dlng'] = coordinates.lng;
                } else if (ancestor.dlat === undefined) {
                    missingCoordinates = this.addToMissingCoordinates(missingCoordinates, ancestor.DeathLocation, ancestor.BirthNamePrivate, ancestor.Name, 'Death');
                }
            }
        });
        postCoordinates(standardizeAddress(location), `${coordinates.lat},${coordinates.lng}`)
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
        let adjustedAncestors = adjustOverlappingMarkerCoordinates(this.state.ancestors, map.getZoom(), this.state.birthPins, this.state.deathPins);
        this.setState({
            map: map,
            mapZoom: map.getZoom(),
            mapCenter: map.getCenter(),
            ancestors: adjustedAncestors
        });
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

    makeLocationsList() {
        let locations = [];
        for (let i=0; i<this.state.ancestors.length; i++) {
            if (this.state.ancestors[i].BirthLocation !== '' && this.state.ancestors[i].BirthLocation !== null) {
                let standardizedBirthLocation = standardizeAddress(this.state.ancestors[i].BirthLocation);
                let locationFound = false;
                for (let j=0; j<locations.length; j++) {
                    if (standardizedBirthLocation === locations[j]) {
                        locationFound = true;
                        break;
                    } 
                }
                if (!locationFound) {
                    locations.push(standardizedBirthLocation);
                }
            }
            if (this.state.ancestors[i].DeathLocation !== '' && this.state.ancestors[i].DeathLocation !== null) {
                let standardizedDeathLocation = standardizeAddress(this.state.ancestors[i].DeathLocation);
                let locationFound = false;
                for (let j=0; j<locations.length; j++) {
                    if (standardizedDeathLocation === locations[j]) {
                        locationFound = true;
                        break;
                    }
                }
                if (!locationFound) {
                    locations.push(standardizedDeathLocation);
                }
            }
        }
        return locations;
    }

    async getLocationsCoordinates(locations) {
        let locationsWithCoordinates = {};
        let coordinatesGets = [];
        let missingCoordinates = [];
        for (let i=0; i<locations.length; i++) {
            coordinatesGets.push(getCoordinates(locations[i]));
        }
        await Promise.all(coordinatesGets)
            .then(responses => {
                for (let i=0; i<responses.length; i++) {
                    if (responses[i] === undefined) {
                        console.log(locations[i]);
                    } else {
                        locationsWithCoordinates[locations[i]] = responses[i].data.coordinates;
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
        for (let i=0; i<this.state.ancestors.length; i++) {
            if (this.state.ancestors[i].BirthLocation !== '' && this.state.ancestors[i].BirthLocation !== null) {
                let standardizedBirthLocation = standardizeAddress(this.state.ancestors[i].BirthLocation);
                if (standardizedBirthLocation in locationsWithCoordinates) {
                    let coordinates = locationsWithCoordinates[standardizedBirthLocation];
                    let commaLocation = coordinates.indexOf(',');
                    let blatString = coordinates.substring(0,commaLocation);
                    this.state.ancestors[i]['blat'] = Number(blatString);
                    let blngString = coordinates.substring(commaLocation+1);
                    this.state.ancestors[i]['blng'] = Number(blngString);
                } else {
                    missingCoordinates = this.addToMissingCoordinates(missingCoordinates, this.state.ancestors[i].BirthLocation, this.state.ancestors[i].BirthNamePrivate, this.state.ancestors[i].Name, 'Birth');
                }
            }
            if (this.state.ancestors[i].DeathLocation !== '' && this.state.ancestors[i].DeathLocation !== null) {
                let standardizedDeathLocation = standardizeAddress(this.state.ancestors[i].DeathLocation);
                if (standardizedDeathLocation in locationsWithCoordinates) {
                    let coordinates = locationsWithCoordinates[standardizedDeathLocation];
                    let commaLocation = coordinates.indexOf(',');
                    let dlatString = coordinates.substring(0,commaLocation);
                    this.state.ancestors[i]['dlat'] = Number(dlatString);
                    let dlngString = coordinates.substring(commaLocation+1);
                    this.state.ancestors[i]['dlng'] = Number(dlngString);
                } else {
                    missingCoordinates = this.addToMissingCoordinates(missingCoordinates, this.state.ancestors[i].DeathLocation, this.state.ancestors[i].BirthNamePrivate, this.state.ancestors[i].Name, 'Death');
                }
            }
        }
        return missingCoordinates;
    }

    async checkAddressesForCoordinates() {
        let locations = this.makeLocationsList();
        let missingCoordinates = await this.getLocationsCoordinates(locations);
        if (missingCoordinates.length === 0) {
            this.setState({coordinatesLoaded: true});
        } else {
            const coordinates = await this.geocodeLocation(missingCoordinates[0][0]);
            this.setState({missingCoordinates: missingCoordinates, markerCoordinates: coordinates});
        }
    }

    birthPinsCallback() {
        this.setState({birthPins: !this.state.birthPins});
        //db.table('map').put(JSON.stringify(this.state),0).catch(function(e){console.log('Dixie IndexedDB error:',e)});
    }

    deathPinsCallback() {
        this.setState({deathPins: !this.state.deathPins});
        //db.table('map').put(JSON.stringify(this.state),0).catch(function(e){console.log('Dixie IndexedDB error:',e)});
    }

    onProceedClick() {
        this.setState({proceed: true});
    }

    render() {
        let mapOrLoading;
        if (!this.state.coordinatesLoaded && this.state.missingCoordinates === null) {
            mapOrLoading = 
                <div className={styles.loadingDiv}>
                    <div className={styles.statusElipsis}>Retrieving location coordinates</div>
                </div>
        } else if (!this.state.coordinatesLoaded && this.state.missingCoordinates !== null && !this.state.proceed) {
            mapOrLoading = 
                <div className={styles.reviewWarningDiv}>
                    <div><p>The ancestor list contains {this.state.missingCoordinates.length} locations that are not yet in the 
                    app’s database and that you will need to review and add to the database before a map of the ancestor list 
                    can be generated.</p><p>If you wish to review these locations and add them to the database so that a map of the 
                    ancestor list can be generated, click 'Proceed'. (If you stop partway through, your results will be saved.)</p>
                    <p>If you do not wish to review that many locations, click 'Return to List' or the browser back arrow to return to the 
                    ancestor list page and consider starting with a shorter list (e.g., one with fewer generations) to map.</p>
                    </div>
                    <table className={styles.formTable}><tbody>
                        <tr className={styles.buttonsTr}>
                            <td className={styles.buttonSpacer}></td>
                            <td className={styles.buttonsTd}><button onClick={this.onProceedClick} className={styles.button}>Proceed</button></td>
                            <td className={styles.buttonsTd}><Link to={{ pathname: '/apps/ashley1950/listmaker/'}}><button className={styles.button}>Return to List</button></Link></td>
                            <td></td>
                        </tr></tbody>
                    </table>
                </div>
        } else {
            let MapWithOverlay;
            if (this.state.coordinatesLoaded) {
                MapWithOverlay = 
                    <LoadScript googleMapsApiKey={API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '600px'}}
                            options={{fullscreenControl: false, scaleControl: true, mapTypeControl: false, streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                            zoom={this.state.mapZoom === null ? 2 : this.state.mapZoom}
                            center={this.state.mapCenter == null ? { lat: 20, lng: 0 } : this.state.mapCenter}
                            onLoad={map => {
                                this.centerMap(map);
                            }}
                            onZoomChanged={() => {
                                if (this.state.map!==null) {
                                    this.setState({mapZoom: this.state.map.getZoom()});
                                    let adjustedAncestors = adjustOverlappingMarkerCoordinates(this.state.ancestors, this.state.map.getZoom(), this.state.birthPins, this.state.deathPins);
                                    this.setState({ancestors: adjustedAncestors});
                                }
                            }}
                        >
                            <MapOverlayItems ancestors={this.state.ancestors} birthPinsCallback={this.birthPinsCallback} deathPinsCallback={this.deathPinsCallback} zoom={this.state.mapZoom}/>
                        </GoogleMap>
                    </LoadScript>
            } else if (this.state.missingCoordinates !== null) {
                MapWithOverlay =
                    <LoadScript googleMapsApiKey={API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '600px'}}
                            options={{fullscreenControl: false, scaleControl: true, mapTypeControl: false, streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                            zoom={(this.state.markerCoordinates===undefined) ? 2 : 9}
                            center={(this.state.markerCoordinates===undefined) ? { lat: 20, lng: 0 } : this.state.markerCoordinates}
                            onLoad={map => {
                                this.setState({map: map})
                            }}
                        >
                            <MissingCoordinatesOverlay location={this.state.missingCoordinates[0][0]} ancestorName={this.state.missingCoordinates[0][1]} id={this.state.missingCoordinates[0][2]} birthDeath={this.state.missingCoordinates[0][3]} markerCoordinates={this.state.markerCoordinates} numberMissing={this.state.missingCoordinates.length} onClickCoordinatesSubmit={this.onClickCoordinatesSubmit} onClickCoordinatesSkip={this.onClickCoordinatesSkip}/>
                        </GoogleMap>
                    </LoadScript>
            }
            mapOrLoading =
                <div className={styles.mapDiv}>
                    {MapWithOverlay}
                </div>
        }

        return(
            <div className={styles.page}>
                <div className={styles.topBox}>
                    <h1 className={styles.h1}>
                        Ancestor Listmaker
                    </h1>
                </div>
                {mapOrLoading}
            </div>
        );

    }

};
export default Map;
