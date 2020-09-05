import React, { Component } from 'react';
import {
    Marker,
    Polyline,
    InfoWindow
  } from 'react-google-maps';

class MovingMarker extends Component {

    constructor(props) {
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onMouseOverHandler = this.onMouseOverHandler.bind(this);
        this.onMouseOutHandler = this.onMouseOutHandler.bind(this);
        this.incrementYear = this.incrementYear.bind(this);
        this.state = {
            year: this.props.earliestBirthYear,
            bOpen: false,
            dOpen: false,
            zIndex: null,
            clicked: false,
            mouseOver: false,
            bVisible: (this.props.timeSeries ? false : true),
            dVisible: (this.props.timeSeries ? false : true),
            lVisible: (this.props.timeSeries ? false : true),
            bDot: (this.props.timeSeries ? 'blue-dot' : 'green-dot'),
            dDot: (this.props.timeSeries ? 'blue-dot' : 'red-dot')
        }
    }

    onClickHandler() {
        if (this.state.mouseOver) { //this will be true if click occurs while window is open due to a mouseOver
            this.setState({zIndex: Date.now()});
            this.setState({clicked: true})
            this.setState({mouseOver: false});
        } else { //this will be true if click occurs while window is open due to a click or has been closed due to a click and not reopened with a mouseOver; close window and reactivate mouseOver by setting clicked to false
            if (this.state.bVisible) {
                this.setState({bOpen: !this.state.bOpen});
            }
            if (this.state.dVisible) {
                this.setState({dOpen: !this.state.dOpen});
            }
            this.setState({clicked: false})
        }
    }

    onMouseOverHandler() {
        if (!this.state.clicked){ //mouseOver only operative if the windown isn't open due to a click 
            if (this.state.bVisible) {
                this.setState({bOpen: true});
            }
            if (this.state.dVisible) {
                this.setState({dOpen: true});
            }
            this.setState({mouseOver: true});
        }
    }

    onMouseOutHandler() { //mouseOut only operative if the windown isn't open due to a click
        if (!this.state.clicked){
            this.setState({bOpen: false});
            this.setState({dOpen: false});
            this.setState({mouseOver: true});
        }
    }

    incrementYear() {
        this.setState({year: this.state.year+1});
        //distance between birth and death location/number of years between b and d
        const halfLife = (this.props.deathYear - this.props.birthYear)/2;
        const deathStart = (this.props.birthYear + halfLife)-2;
        const birthEnd = (this.props.birthYear + halfLife)+2;
        if (this.props.birthYear <= this.state.year && birthEnd >= this.state.year) {
            this.setState({bVisible: true});
        } else {
            this.setState({bVisible: false});
        }
        if (deathStart <= this.state.year && birthEnd >= this.state.year) {
            this.setState({lVisible: true});
        } else {
            this.setState({lVisible: false});
        }
        if (deathStart <= this.state.year && this.props.deathYear >= this.state.year) {
            this.setState({dVisible: true});
        } else {
            this.setState({dVisible: false});
        }
        if ((this.props.birthYear + 1) <= this.state.year && (this.props.birthYear + 3) >= this.state.year) {
            this.setState({bOpen: true})
            this.setState({zIndex: Date.now()});
        } else {
            this.setState({bOpen: false})
        }
        if ((this.props.deathYear + 1) >= this.state.year && (this.props.deathYear - 3) <= this.state.year) {
            this.setState({dOpen: true})
            this.setState({zIndex: Date.now()});
        } else {
            this.setState({dOpen: false})
        }
      }

    componentDidMount() {
        if (this.props.timeSeries) {
            setInterval(this.incrementYear, 500);
        }
    }

    render() {
        let personMarkers;
        if (this.props.movingMarkers) {

        } else if (this.props.birthPins && (this.props.ancestor.BirthLocation !== '') && this.props.deathPins && (this.props.ancestor.DeathLocation !== '') && this.props.lines) {
            personMarkers =
            <>
                <Marker
                    visible={this.state.bVisible}
                    position={{lat: this.props.ancestor.blat, lng: this.props.ancestor.blng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/${this.state.bDot}.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                    onClick={this.onClickHandler}
                    onMouseOver={this.onMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.state.bOpen && <InfoWindow onCloseClick={this.onClickHandler} defaultOptions={{ disableAutoPan: true }}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div>
                    </InfoWindow>}
                </Marker>
                <Marker
                    visible={this.state.dVisible}
                    position={{lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/${this.state.dDot}.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                    onClick={this.onClickHandler}
                    onMouseOver={this.onMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.state.dOpen && <InfoWindow onCloseClick={this.onClickHandler} defaultOptions={{ disableAutoPan: true }}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div>
                    </InfoWindow>}
                </Marker>
                <Polyline
                    visible={this.state.lVisible}
                    path={[{ lat: this.props.ancestor.blat, lng: this.props.ancestor.blng },{ lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng }]}
                    defaultOptions={{ disableAutoPan: true }, {strokeOpacity: 0.3, strokeWeight: 3}}
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                />
            </>
        } else if (this.props.birthPins && (this.props.ancestor.BirthLocation !== '') && this.props.deathPins && (this.props.ancestor.DeathLocation !== '')) {
            personMarkers =
            <>
                <Marker
                    visible={this.state.bVisible}
                    position={{lat: this.props.ancestor.blat, lng: this.props.ancestor.blng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/${this.state.bDot}.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                    onClick={this.onClickHandler}
                    onMouseOver={this.onMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.state.bOpen && <InfoWindow onCloseClick={this.onClickHandler} defaultOptions={{ disableAutoPan: true }}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div>
                    </InfoWindow>}
                </Marker>
                <Marker
                    visible={this.state.dVisible}
                    position={{lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/${this.state.dDot}.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                    onClick={this.onClickHandler}
                    onMouseOver={this.onMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.state.dOpen && <InfoWindow onCloseClick={this.onClickHandler} defaultOptions={{ disableAutoPan: true }}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div>
                    </InfoWindow>}
                </Marker>
            </>
        } else if (this.props.birthPins && (this.props.ancestor.BirthLocation !== '')) {
            personMarkers =
            <>
                <Marker
                    visible={this.state.bVisible}
                    position={{lat: this.props.ancestor.blat, lng: this.props.ancestor.blng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/${this.state.bDot}.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                    onClick={this.onClickHandler}
                    onMouseOver={this.onMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.state.bOpen && <InfoWindow onCloseClick={this.onClickHandler} defaultOptions={{ disableAutoPan: true }}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div>
                    </InfoWindow>}
                </Marker>
            </>
        } else if (this.props.deathPins && (this.props.ancestor.DeathLocation !== '')) {
            personMarkers =
            <>
                <Marker
                    visible={this.state.dVisible}
                    position={{lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/${this.state.dDot}.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.zIndex !== null) ? this.state.zIndex : 0}
                    onClick={this.onClickHandler}
                    onMouseOver={this.onMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.state.dOpen && <InfoWindow onCloseClick={this.onClickHandler} defaultOptions={{ disableAutoPan: true }}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div>
                    </InfoWindow>}
                </Marker>
            </>
        }
        return (<>{personMarkers}</>)
    }
}

export default MovingMarker;
