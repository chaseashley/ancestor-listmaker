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

const API_KEY='AIzaSyD5VQNhUE4UQlIZbaJo4aHE1pt9zuZFzPw';

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.birthPinsCallback = this.birthPinsCallback.bind(this);
        this.deathPinsCallback = this.deathPinsCallback.bind(this);
        this.onClickCoordinatesSkip = this.onClickCoordinatesSkip.bind(this);
        this.addToMissingCoordinates = this.addToMissingCoordinates.bind(this);
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
            map: null,
            mapZoom: null,
            mapCenter: null,
            birthPins: true,
            deathPins: false,
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
                if (ancestor.blat === undefined && this.standardizeAddress(ancestor.BirthLocation) === this.standardizeAddress(location)) {
                    ancestor['blat'] = coordinates.lat;
                    ancestor['blng'] = coordinates.lng;
                } else if (ancestor.blat === undefined) {
                    missingCoordinates = this.addToMissingCoordinates(missingCoordinates, ancestor.BirthLocation, ancestor.BirthNamePrivate, ancestor.Name, 'Birth');
                }
            }
            if (ancestor.DeathLocation !== '' && ancestor.DeathLocation !== null) {
                if (ancestor.dlat === undefined && this.standardizeAddress(ancestor.DeathLocation) === this.standardizeAddress(location)) {
                    ancestor['dlat'] = coordinates.lat;
                    ancestor['dlng'] = coordinates.lng;
                } else if (ancestor.dlat === undefined) {
                    missingCoordinates = this.addToMissingCoordinates(missingCoordinates, ancestor.DeathLocation, ancestor.BirthNamePrivate, ancestor.Name, 'Death');
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

    standardizeAddress(address) {
        address = address.toUpperCase();
        address = address.replace(/  /g,' ');
        address = address.replace(/, /g,',');
        address = address.replace(/,,/g,',');
        address = address.replace(/\./g,'');
        if (address.indexOf('UNITED STATES OF AMERICA') !== -1 && address.indexOf('UNITED STATES OF AMERICA') === address.length-24) {
            address = address.substring(0,address.length-24) + 'USA';
        }
        if (address.indexOf('UNITED STATES') !== -1 && address.indexOf('UNITED STATES') === address.length-13) {
            address = address.substring(0,address.length-13) + 'USA';
        }
        if (address.indexOf(',NEW ENGLAND') !== -1 && address.indexOf(',NEW ENGLAND') === address.length-12) {
            address = address.substring(0,address.length-12);
        }
        if (address.indexOf(',BRITISH COLONIAL AMERICA') !== -1 && address.indexOf(',BRITISH COLONIAL AMERICA') === address.length-25) {
            address = address.substring(0,address.length-25);
        }
        if (address.indexOf(',BRITISH AMERICA') !== -1 && address.indexOf(',BRITISH AMERICA') === address.length-16) {
            address = address.substring(0,address.length-16);
        }
        if (address.indexOf(',AMERICA') !== -1 && address.indexOf(',AMERICA') === address.length-8) {
            address = address.substring(0,address.length-8);
        }
        address = address.replace(',PLYMOUTH COLONY',',MASSACHUSETTS');
        address = address.replace(',MASSACHUSETTS BAY COLONY',',MASSACHUSETTS');
        address = address.replace(',MASSACHUSETTS BAY',',MASSACHUSETTS');
        address = address.replace(',PROVINCE OF MASSACHUSETTS BAY',',MASSACHUSETTS');
        address = address.replace(',PROVINCE OF MASSACHUSETTS',',MASSACHUSETTS');
        address = address.replace(',PROVINCE OF NEW HAMPSHIRE',',NEW HAMPSHIRE');
        address = address.replace(',PROVINCE OF MAINE',',MAINE');
        address = address.replace(',DISTRICT OF MAINE',',MAINE');
        address = address.replace(',PROVINCE OF RHODE ISLAND',',RHODE ISLAND');
        address = address.replace(',COLONY OF RHODE ISLAND',',RHODE ISLAND');
        address = address.replace(',COLONY OF RHODE ISLAND AND PROVIDENCE PLANTATIONS',',RHODE ISLAND');
        address = address.replace(',COLONY OF RHODE ISLAND AND PROVIDENCE PLANTATION',',RHODE ISLAND');
        address = address.replace(',CONNECTICUT COLONY',',CONNECTICUT');
        address = address.replace(',COLONY OF CONNECTICUT',',CONNECTICUT');
        address = address.replace(',PROVINCE OF NEW YORK',',NEW YORK');
        address = address.replace(',PROVINCE OF NEW JERSEY',',NEW JERSEY');
        address = address.replace(',PROVINCE OF PENNSYLVANIA',',PENNSYLVANIA');
        address = address.replace(',PENNSYLVANIA COLONY',',PENNSYLVANIA');
        address = address.replace(',PROVINCE OF MARYLAND',',MARYLAND');
        address = address.replace(',VIRGINIA COLONY',',VIRGINIA');
        address = address.replace(',PROVINCE OF NORTH CAROLINA',',NORTH CAROLINA');
        address = address.replace(',PROVINCE OF SOUTH CAROLINA',',SOUTH CAROLINA');
        if (address.indexOf(' COUNTY,') !== -1) {
            let end = address.indexOf(' COUNTY,');
            let front = address.substring(0,end);
            if (front.indexOf(',') !== -1) {
                address = address.replace(' COUNTY,',',');
            }
        }
        address = address.replace('ENGLAND,UNITED KINGDOM','ENGLAND');
        address = address.replace('SCOTLAND,UNITED KINGDOM','SCOTLAND');
        address = address.replace('WALES,UNITED KINGDOM','WALES');
        address = address.replace('NORTHERN IRELAND,UNITED KINGDOM','IRELAND');
        address = address.replace('REPUBLIC OF IRELAND','IRELAND');
        return address;
    }

    async checkAddressesForCoordinates() {
        let missingCoordinates = [];
        let birthCoordinatesGets = [];
        let birthLocationIndexes = [];
        let deathCoordinatesGets = [];
        let deathLocationIndexes = [];
        for (let i=0; i<this.state.ancestors.length; i++) {
            if (this.state.ancestors[i].BirthLocation !== '' && this.state.ancestors[i].BirthLocation !== null) {
                let birthLocation = this.standardizeAddress(this.state.ancestors[i].BirthLocation);
                birthCoordinatesGets.push(getCoordinates(birthLocation));
                birthLocationIndexes.push(i);
            }
            if (this.state.ancestors[i].DeathLocation !== '' && this.state.ancestors[i].DeathLocation !== null) {
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
                        missingCoordinates = this.addToMissingCoordinates(missingCoordinates, this.state.ancestors[j].BirthLocation, this.state.ancestors[j].BirthNamePrivate, this.state.ancestors[j].Name, 'Birth');
                        console.log(this.state.ancestors[j].BirthLocation);
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
                        missingCoordinates = this.addToMissingCoordinates(missingCoordinates, this.state.ancestors[j].DeathLocation, this.state.ancestors[j].BirthNamePrivate, this.state.ancestors[j].Name, 'Death');
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

    render() {
        let mapOrLoading;
        if (!this.state.coordinatesLoaded && this.state.missingCoordinates === null) {
            mapOrLoading = 
                <div className={styles.loadingDiv}>
                    <div className={styles.statusElipsis}>Retrieving location coordinates</div>
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
                                    this.setState({zoom: this.state.map.getZoom()});
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
