 /* global google */ 
import React from 'react';
import { GoogleMap, LoadScript, useGoogleMap } from '@react-google-maps/api';
import Geocode from "react-geocode";
import styles from './mapstyles.module.css';
import MapOverlayItems from './MapOverlayItems';
import MissingCoordinatesOverlay from './MissingCoordinatesOverlay';
import FixCoordinatesOverlay from './FixCoordinatesOverlay';
import { getCoordinates, postCoordinates } from './locationsDBqueries';
import { adjustOverlappingMarkerCoordinates } from './overlappingMarkers';
import db from './db';
import { standardizeAddress } from './standardizeAddress';
import { Link } from "react-router-dom";
import Draggable from 'react-draggable';

const API_KEY='AIzaSyD5VQNhUE4UQlIZbaJo4aHE1pt9zuZFzPw';

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.fixCoordinatesCancelCallback = this.fixCoordinatesCancelCallback.bind(this);
        this.fixCoordinatesClick = this.fixCoordinatesClick.bind(this);
        this.hideBClosedAncestorsCallBack = this.hideBClosedAncestorsCallBack.bind(this);
        this.hideDClosedAncestorsCallBack = this.hideDClosedAncestorsCallBack.bind(this);
        this.closeFixCoordinatesDialog = this.closeFixCoordinatesDialog.bind(this);
        this.openFixCoordinatesDialog = this.openFixCoordinatesDialog.bind(this);
        this.onSkipAllClick = this.onSkipAllClick.bind(this);
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
            listLines: this.props.location.listLines, //whether came from List or Lines
            missingCoordinates: null,
            markerCoordinates: null,
            initialMarkerCoordinates: null,
            map: null,
            mapZoom: null,
            mapCenter: null,
            birthPins: true,
            deathPins: false,
            proceed: false,
            fixCoordinates: false,
            hideBClosedAncestors: [],
            hideDClosedAncestors: [],
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
        /*
        ancestors.forEach(ancestor => {
            if (ancestor.BirthLocation === location) {
                ancestor.BirthLocation = '';
            }
            if (ancestor.DeathLocation === location) {
                ancestor.DeathLocation = '';
            }
        })*/
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
        //let adjustedAncestors = adjustOverlappingMarkerCoordinates(this.state.ancestors, map.getZoom(), this.state.birthPins, this.state.deathPins);
        this.setState({
            map: map,
            mapZoom: map.getZoom(),
            mapCenter: map.getCenter(),
            //ancestors: adjustedAncestors
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
                //console.log(this.state.ancestors[i].BirthLocation, standardizedBirthLocation);
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
                //console.log(this.state.ancestors[i].DeathLocation, standardizedDeathLocation);
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

    hideBClosedAncestorsCallBack(hideBClosedAncestors) {
        this.setState({hideBClosedAncestors: hideBClosedAncestors});
    }
    hideDClosedAncestorsCallBack(hideDClosedAncestors) {
        this.setState({hideDClosedAncestors: hideDClosedAncestors});
    }

    onProceedClick() {
        this.setState({proceed: true});
    }

    onSkipAllClick() {
        this.setState({coordinatesLoaded: true});
        this.centerMap(this.state.map);
    }

    fixCoordinatesClick() {
        this.setState({
            fixCoordinates: true,
            openFixCoordinatesDialog: false
        });
    }

    fixCoordinatesCancelCallback() {
        this.setState({fixCoordinates: false})
    }

    openFixCoordinatesDialog() {
        this.setState({openFixCoordinatesDialog: true});
    }

    closeFixCoordinatesDialog() {
        this.setState({openFixCoordinatesDialog: false});
    }

    render() {
        let fixCoordinatesLink;
        if (this.state.coordinatesLoaded && !this.state.fixCoordinates) {
            fixCoordinatesLink =
                <div className={styles.fixcoordinatesLinkDiv}>
                    <button className={styles.fixcoordinatesLink} onClick={this.openFixCoordinatesDialog}>Fix Coordinates</button>
                </div>
        } else {
            fixCoordinatesLink = <></>
        }

        let topBox =
            <div className={styles.topBox}>
                <h1 className={styles.h1}>
                    Ancestor Explorer
                </h1>
                {fixCoordinatesLink}
            </div>

        let fixCoordinatesDialogBox;
        if (this.state.openFixCoordinatesDialog) {
            const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
            fixCoordinatesDialogBox =
                <Draggable defaultPosition={{x: 325, y: 100}} bounds='body' handle='handle' {...dragHandlers}>
                    <div className={styles.fixCoordinatesDialogBox}>
                        <handle><div name='.dragBox' className={styles.dragBox}></div></handle>
                        <div className={styles.fixCoordinatesDialogInnerDiv}>
                            To access the functionality that will allow you to correct the coordinates of a location:
                            <ol>
                            <li>Open the info window for a single marker at that location and close all other info 
                            windows.</li>
                            <li>Click ‘Hide Closed’ 
                            to hide all markers other than the marker with the open info window.</li>
                            <li>Check the location of the 
                            marker when it is the only visible marker to see if it is in the correct place. (When 
                            multiple markers are shown, they may not appear at their exact correct places due to 
                            “clustering” of markers at or near the same location. You should not attempt to change this. Only 
                            change the location of a marker when it is in an incorrect location when it is the only 
                            visible marker.)</li>
                            <li>If the marker is in the correct location when it is the only visible marker, click 'Cancel'. If 
                                the marker is in an incorrect location when it is the only visible marker, click ‘Proceed’.</li>
                            </ol>
                            <button className={styles.cancelButton} onClick={this.closeFixCoordinatesDialog}>Cancel</button>
                            <button className={styles.fixcoordinatesButton} onClick={this.fixCoordinatesClick} disabled={!((this.state.hideBClosedAncestors.length === 1 && this.state.hideDClosedAncestors.length === 0) || (this.state.hideBClosedAncestors.length === 0 && this.state.hideDClosedAncestors.length === 1))}>Proceed</button>
                        </div>
                    </div>
                </Draggable>
        } else {
            fixCoordinatesDialogBox = <></>
        }

        let mapOrLoading;
        if (!this.state.coordinatesLoaded && this.state.missingCoordinates === null) {
            mapOrLoading = 
                <div className={styles.loadingDiv}>
                    <div className={styles.statusElipsis}>Retrieving location coordinates</div>
                </div>
        } else if (!this.state.coordinatesLoaded && this.state.missingCoordinates !== null && !this.state.proceed) {
            mapOrLoading = 
                <div className={styles.reviewWarningDiv}>
                    <div><p>The ancestor list contains {this.state.missingCoordinates.length} location names that are not yet in the 
                    app’s database. Births and deaths with these location names will not be mapped until you or another user confirms the 
                    proper placement of these locations names on the map so they can be added to the database.</p>
                    <p>Click 'Proceed' if you 
                    wish to review the placement of these locations. (For each location, the app will suggest its placement for you to confirm or change. 
                    If you stop partway through, your results will be saved.)</p>
                    <p>Click 'Skip All' if you don't wish to review the placement 
                    of the locations. (Birth and deaths with these location names will not be included on the map.)</p> 
                    <p>Click 'Return to List' if you want to return to the ancestor list page. (For example, to generate a shorter list (e.g., with fewer generations
                    and fewer locations whose placement will need to be confirmed.)</p>
                    </div>
                    <table className={styles.formTable}><tbody>
                        <tr className={styles.buttonsTr}>
                            <td className={styles.buttonSpacer}></td>
                            <td className={styles.buttonsTd}><button onClick={this.onProceedClick} className={styles.button}>Proceed</button></td>
                            <td className={styles.buttonsTd}><button onClick={this.onSkipAllClick} className={styles.button}>Skip All</button></td>
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
                                    //let adjustedAncestors = adjustOverlappingMarkerCoordinates(this.state.ancestors, this.state.map.getZoom(), this.state.birthPins, this.state.deathPins);
                                    //this.setState({ancestors: adjustedAncestors});
                                }
                            }}
                        >
                            <MapOverlayItems ancestors={this.state.ancestors} birthPinsCallback={this.birthPinsCallback} deathPinsCallback={this.deathPinsCallback} hideBClosedAncestorsCallBack={this.hideBClosedAncestorsCallBack} hideDClosedAncestorsCallBack={this.hideDClosedAncestorsCallBack} zoom={this.state.mapZoom} fixCoordinates={this.state.fixCoordinates} fixCoordinatesCancelCallback={this.fixCoordinatesCancelCallback} listLines={this.state.listLines}/>
                            {fixCoordinatesDialogBox}
                        </GoogleMap>
                    </LoadScript>
            /*
            } else if (this.state.coordinatesLoaded && this.state.fixCoordinates) {
                let markerCoordinates, ancestor, location, birthDeath;
                if (this.state.hideBClosedAncestors.length !== 0) {
                    markerCoordinates = { lat: this.state.hideBClosedAncestors[0].blat, lng: this.state.hideBClosedAncestors[0].blng };
                    ancestor = this.state.hideBClosedAncestors[0];
                    location = ancestor.BirthLocation;
                    birthDeath = 'Birth';
                } else {
                    markerCoordinates = { lat: this.state.hideDClosedAncestors[0].dlat, lng: this.state.hideDClosedAncestors[0].dlng };
                    ancestor = this.state.hideDClosedAncestors[0];
                    location = ancestor.DeathLocation;
                    birthDeath = 'Death';
                }
                MapWithOverlay =
                    <LoadScript googleMapsApiKey={API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '600px'}}
                            options={{fullscreenControl: false, scaleControl: true, mapTypeControl: false, streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                            zoom={this.state.zoom}
                            center={this.state.mapCenter}
                            onLoad={map => {
                                this.setState({map: map})
                            }}
                        >
                            <FixCoordinatesOverlay location={location} ancestorName={ancestor.BirthNamePrivate} id={ancestor.Id} birthDeath={birthDeath} markerCoordinates={markerCoordinates} onCancelClick={this.fixCancelClick}/>
                        </GoogleMap>
                    </LoadScript>
            */
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
                            <MissingCoordinatesOverlay location={this.state.missingCoordinates[0][0]} ancestorName={this.state.missingCoordinates[0][1]} id={this.state.missingCoordinates[0][2]} birthDeath={this.state.missingCoordinates[0][3]} markerCoordinates={this.state.markerCoordinates} numberMissing={this.state.missingCoordinates.length} onClickCoordinatesSubmit={this.onClickCoordinatesSubmit} onClickCoordinatesSkip={this.onClickCoordinatesSkip} onSkipAllClick={this.onSkipAllClick}/>
                        </GoogleMap>
                    </LoadScript>
            }
            mapOrLoading =
                <div className={styles.mapDiv}>
                    {MapWithOverlay}
                </div>
        }

        return(
            <div>
                {topBox}
                {mapOrLoading}
            </div>
        );

    }

};
export default Map;
