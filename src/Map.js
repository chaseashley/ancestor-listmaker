 /* global google */ 
import React, { Component } from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    Polyline,
    InfoWindow
  } from 'react-google-maps';
import styles from './linesstyles.module.css';
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


class MarkerWithInfoWindow extends Component {

    constructor(props) {
        super(props);
        this.onToggleOpen = this.onToggleOpen.bind(this);
        this.incrementYear = this.incrementYear.bind(this);
        this.state = {
            isOpen: false,
            year: this.props.earliestBirthYear
        }
    }

    onToggleOpen() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    incrementYear() {
        this.setState({year: this.state.year+1});
      }

    componentDidMount() {
        setInterval(this.incrementYear, 200);
    }

    render() {
        return (<Marker
            visible={this.props.pinTypeVisible && (this.props.birthYear < this.state.year) && (this.state.year < this.props.deathYear)}
            position={this.props.position}
            icon={this.props.icon}
            onClick={this.onToggleOpen}>
            {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpen}>
                <div>{this.props.content}</div>
            </InfoWindow>}
        </Marker>)
    }
}

class MigrationLine extends Component {

    constructor(props) {
        super(props);
        this.incrementYear = this.incrementYear.bind(this);
        this.state = {
            year: this.props.earliestBirthYear
        }
    }

    incrementYear() {
        this.setState({year: this.state.year+1});
      }

    componentDidMount() {
        setInterval(this.incrementYear, 200);
    }

    render() {
        return (<Polyline
            visible={this.props.linesVisible && (this.props.birthYear < this.state.year) && (this.state.year < this.props.deathYear)}
            path={this.props.path}
            options={{strokeOpacity: 0.3, strokeWeight: 3}}
            />)
    }
}

class Map extends Component {

    constructor(props) {
        super(props);
        this.centerMap = this.centerMap.bind(this);
        this.standardizeAddress = this.standardizeAddress.bind(this);
        this.findEarliestBirthYear = this.findEarliestBirthYear.bind(this);
        this.getCoordinatesFromAddressDBText = this.getCoordinatesFromAddressDBText.bind(this);
        this.state = {
            coordinatesLoaded: false,
            ancestors: this.props.location.ancestors, //should it be this.props.location.ancestors?
            birthPins: true,
            deathPins: false,
            lines: false,
            earliestBirthYear: null
        }
    }

    centerMap(map) {
        let bounds = new google.maps.LatLngBounds();
        this.state.ancestors.forEach(ancestor => {
            if (this.state.birthPins) {
                bounds.extend(new google.maps.LatLng(ancestor.blat, ancestor.blng));
            }
            if (this.state.deathPins) {
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
            let birthLocation = this.standardizeAddress(ancestor.BirthLocation);
            let coordinatesBirthString = this.getCoordinatesFromAddressDBText(addressDBText, birthLocation);
            if (coordinatesBirthString === '') {
                console.log(ancestor.BirthNamePrivate,'birth',ancestor.BirthLocation);
                misssingCoordinates.push([ancestor,'birth', ancestor.BirthLocation]);
            } else {
                let blatString = coordinatesBirthString.substring(0,coordinatesBirthString.indexOf(','));
                ancestor['blat'] = Number(blatString);
                let blngString = coordinatesBirthString.substring(coordinatesBirthString.indexOf(',')+1);
                ancestor['blng'] = Number(blngString);
            }
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
        });
        this.setState({coordinatesLoaded: true});
    }

    findEarliestBirthYear() {
        let earliestBirthYear = 3000;
        let birthYear;
        this.state.ancestors.forEach(ancestor => {
            if (ancestor.BirthDate !=='') {
                birthYear = Number(ancestor.BirthDate.substring(0,4));
                console.log(ancestor.Name, ancestor.BirthDate, birthYear);
                if (birthYear < earliestBirthYear) {
                    earliestBirthYear = birthYear;
                }
            }
        })
        this.setState({earliestBirthYear: earliestBirthYear});
    }

    componentDidMount() {
        this.checkAddressesForCoordinates();
        this.findEarliestBirthYear();
    }

    render() {
        let birthmarkers, deathmarkers, migrationLines;
        if (this.state.coordinatesLoaded) {
            const ancestorsWithBirthLocs = this.state.ancestors.filter(ancestor => ancestor.blat !== undefined);
            birthmarkers = ancestorsWithBirthLocs.map((ancestor, index) => {
                return <MarkerWithInfoWindow key={index} id={index}
                            pinTypeVisible={this.state.birthPins}
                            birthYear={Number(ancestor.BirthDate.substring(0,4))}
                            deathYear={Number(ancestor.DeathDate.substring(0,4))}
                            earliestBirthYear={this.state.earliestBirthYear}
                            position={{lat: ancestor.blat, lng: ancestor.blng}}
                            icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
                            content={<div><a href={`https://www.wikitree.com/wiki/${ancestor.Name}`} target='_blank'>{ancestor.BirthNamePrivate}</a>, b. {ancestor.BirthDate}</div>}
                        />
            })
            const ancestorsWithDeathLocs = this.state.ancestors.filter(ancestor => ancestor.dlat !== undefined);
            deathmarkers = ancestorsWithDeathLocs.map((ancestor, index) => {
                return <MarkerWithInfoWindow key={index} id={index}
                            pinTypeVisible={this.state.deathPins}
                            birthYear={Number(ancestor.BirthDate.substring(0,4))}
                            deathYear={Number(ancestor.DeathDate.substring(0,4))}
                            earliestBirthYear={this.state.earliestBirthYear}
                            position={{lat: ancestor.dlat, lng: ancestor.dlng}}
                            icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                            content={<div><a href={`https://www.wikitree.com/wiki/${ancestor.Name}`} target='_blank'>{ancestor.BirthNamePrivate}</a>, d. {ancestor.DeathDate}</div>}
                        />
             })
             const ancestorsWithBirthAndDeathLocs = this.state.ancestors.filter(ancestor => (ancestor.BirthLocation !== undefined && ancestor.DeathLocation !== undefined));
             migrationLines = ancestorsWithBirthAndDeathLocs.map((ancestor, index) => {
                 return <MigrationLine key={index}
                            linesVisible={this.state.lines}
                            birthYear={Number(ancestor.BirthDate.substring(0,4))}
                            deathYear={Number(ancestor.DeathDate.substring(0,4))}
                            earliestBirthYear={this.state.earliestBirthYear}
                            path={[{ lat: ancestor.blat, lng: ancestor.blng },{ lat: ancestor.dlat, lng: ancestor.dlng }]}
                        />
            })
        } else {
            birthmarkers = <div></div>
            deathmarkers = <div></div>
            migrationLines = <div></div>
        }

        const MapWithMarkers = withScriptjs(withGoogleMap(props =>
            <GoogleMap
                options={{streetViewControl: false, styles: [ { featureType: 'poi', stylers: [{ visibility: 'off' }] } ] }}
                defaultZoom={7}
                defaultCenter={{ lat: 0, lng: 0 }}
                ref={map => map && this.centerMap(map)}
            >
                {birthmarkers}
                {deathmarkers}
                {migrationLines}
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
