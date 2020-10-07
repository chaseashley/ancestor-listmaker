 /* global google */ 
import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Geocode from "react-geocode";
import styles from './mapstyles.module.css';
import MapOverlayItems from './MapOverlayItems';
import MissingCoordinatesOverlay from './MissingCoordinatesOverlay';
import { getCoordinates, postCoordinates } from './locationsDBqueries';
//import OverlappingMarkerSpiderfier from 'overlapping-marker-spiderfier';

const API_KEY='AIzaSyD5VQNhUE4UQlIZbaJo4aHE1pt9zuZFzPw';

class Map extends React.Component {

    constructor(props) {
        super(props);
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
            oms: null,
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
        }
    }

    async onClickCoordinatesSubmit(coordinates) {
        let missingCoordinates = this.addCoordinatesToAncestors(this.state.missingCoordinates[0][0], coordinates);
        if (missingCoordinates.length > 0) {
            const newCoordinates = await this.geocodeLocation(missingCoordinates[0][0]);
            this.setState({markerCoordinates: newCoordinates, missingCoordinates: missingCoordinates});
        } else {
            this.setState({coordinatesLoaded: true});
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
                if (ancestor.DeathLocation !== '' && ancestor.dlat === undefined && this.standardizeAddress(ancestor.DeathLocation) === this.standardizeAddress(location)) {
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

    componentDidMount() {
        this.checkAddressesForCoordinates();
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
                            options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                            defaultZoom={2}
                            defaultCenter={{ lat: 20, lng: 0 }}
                            onLoad={map => {
                                this.centerMap(map);
                                const oms = require(`npm-overlapping-marker-spiderfier/lib/oms.min`)
                                let thisoms = new oms.OverlappingMarkerSpiderfier(map, {
                                    keepSpiderfied: true,
                                    nearbyDistance: 30 //in pixels
                                });
                                this.setState({oms: thisoms});
                            }}
                        >
                            <MapOverlayItems oms={this.state.oms} ancestors={this.state.ancestors}/>
                        </GoogleMap>
                    </LoadScript>
            } else if (this.state.missingCoordinates !== null) {
                MapWithOverlay =
                    <LoadScript googleMapsApiKey={API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '600px'}}
                            options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                            defaultZoom={(this.state.markerCoordinates===undefined) ? 2 : 10}
                            defaultCenter={(this.state.markerCoordinates===undefined) ? { lat: 20, lng: 0 } : this.state.markerCoordinates}
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
