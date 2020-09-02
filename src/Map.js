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


class PersonMarkers extends Component {

    constructor(props) {
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onMouseOverHandler = this.onMouseOverHandler.bind(this);
        this.onMouseOutHandler = this.onMouseOutHandler.bind(this);
        this.incrementYear = this.incrementYear.bind(this);
        this.state = {
            year: this.props.earliestBirthYear,
            isOpen: false,
            zIndex: null,
            clicked: false,
            mouseOver: false
        }
    }

    onClickHandler() {
        if (this.state.mouseOver && this.state.isOpen) {
            this.setState({zIndex: Date.now()});
            this.setState({clicked: true})
        } else {
            this.setState({clicked: false})
        }
        if (this.state.mouseOver) {
            this.setState({isOpen: true});
            this.setState({mouseOver: false});
        } else {
            this.setState({isOpen: !this.state.isOpen});
        }
    }

    onMouseOverHandler() {
        if (!this.state.clicked){
            this.setState({isOpen: true});
            this.setState({mouseOver: true});
        }
    }

    onMouseOutHandler() {
        if (!this.state.clicked){
            this.setState({isOpen: false});
            this.setState({mouseOver: true});
        }
    }

    incrementYear() {
        this.setState({year: this.state.year+1});
      }

    componentDidMount() {
        if (this.props.timeSeries) {
            setInterval(this.incrementYear, 200);
        }
    }

    render() {
        let personMarkers;
        if (this.props.birthPins && (this.props.ancestor.BirthLocation !== '') && this.props.deathPins && (this.props.ancestor.DeathLocation !== '') && this.props.lines) {
            personMarkers =
            <>
                <Marker
                    visible={!this.props.timeSeries || (this.props.birthYear < this.state.year) && (this.state.year < this.props.deathYear)}
                    position={{lat: this.props.ancestor.blat, lng: this.props.ancestor.blng}}
                    icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                    onClick={this.onClickHandler}
                    onMouseOver={this.onMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.state.isOpen && <InfoWindow onCloseClick={this.onClickHandler} defaultOptions={{ disableAutoPan: true }}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div>
                    </InfoWindow>}
                </Marker>
                <Marker
                    visible={!this.props.timeSeries || (this.props.birthYear < this.state.year) && (this.state.year < this.props.deathYear)}
                    position={{lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng}}
                    icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                    onClick={this.onClickHandler}
                    onMouseOver={this.onMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.state.isOpen && <InfoWindow onCloseClick={this.onClickHandler} defaultOptions={{ disableAutoPan: true }}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div>
                    </InfoWindow>}
                </Marker>
                <Polyline
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                    onClick={this.onClickHandler}
                    onMouseOver={this.onMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    defaultOptions={{ disableAutoPan: true }, {strokeOpacity: 0.3, strokeWeight: 3}}
                    visible={!this.props.timeSeries || (this.props.birthYear < this.state.year) && (this.state.year < this.props.deathYear)}
                    path={[{ lat: this.props.ancestor.blat, lng: this.props.ancestor.blng },{ lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng }]}
                />
            </>
        }
        return (<>{personMarkers}</>)
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
            ancestors: this.props.location.ancestors,
            timeSeries: false,
            birthPins: true,
            deathPins: true,
            lines: true,
            earliestBirthYear: null
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
        if (this.state.timeSeries) {
            this.findEarliestBirthYear();
        }
    }

    render() {
        let markers;
        if (this.state.coordinatesLoaded) {
            markers = this.state.ancestors.map((ancestor, index) => {
                console.log(ancestor.BirthNamePrivate,ancestor.blat)
                return <PersonMarkers key={index} id={index}
                            ancestor={ancestor}
                            birthYear={Number(ancestor.BirthDate.substring(0,4))}
                            deathYear={Number(ancestor.DeathDate.substring(0,4))}
                            birthPins={this.state.birthPins}
                            deathPins={this.state.deathPins}
                            lines={this.state.lines}
                            timeSeries={this.state.timeSeries}
                            earliestBirthYear={this.state.earliestBirthYear}
                        />
            })
        } else {
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
