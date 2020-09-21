import React, { Component } from 'react';
import {
    Marker,
    Polyline,
    InfoWindow
} from 'react-google-maps';

class StaticMarkers extends Component {

    constructor(props) {
        super(props);
        this.onBClickHandler = this.onBClickHandler.bind(this);
        this.onDClickHandler = this.onDClickHandler.bind(this);
        this.onBMouseOverHandler = this.onBMouseOverHandler.bind(this);
        this.onDMouseOverHandler = this.onDMouseOverHandler.bind(this);
        this.onMouseOutHandler = this.onMouseOutHandler.bind(this);
        this.onCloseClickHandler = this.onCloseClickHandler.bind(this);
        //this.incrementYear = this.incrementYear.bind(this);
        this.state = {
            bOpen: false,
            dOpen: false,
            bzIndex: null,
            dzIndex: null,
            bWindowZIndex: null,
            dWindowZIndex: null,
            clicked: false,
            mouseOver: false,
            lastMouseMove: 0
        }
    }

    onBClickHandler() {
        if (this.state.mouseOver) { //this will be true if click occurs while window is open due to a mouseOver
            this.setState({dzIndex: Math.floor(Date.now()/1000)});
            this.setState({dWindowZindex: Math.floor(Date.now()/1000)})
            this.setState({bzIndex: Math.floor(Date.now()/1000)+100});
            this.setState({bWindowZindex: Math.floor(Date.now()/1000)+100})
            this.setState({clicked: true})
            this.setState({mouseOver: false});
        } else { //this will be true if click occurs while window is open due to a click or has been closed due to a click and not reopened with a mouseOver; close window and reactivate mouseOver by setting clicked to false
            if (this.props.visible) {
                let dOpen;
                if (this.state.dOpen) {
                    dOpen = true;
                } else {
                    dOpen = false;
                }
                this.setState({dOpen: !this.state.dOpen});
                if (!dOpen) {
                    this.setState({dWindowZindex: Math.floor(Date.now()/1000)})
                }
            }
            if (this.props.visible) {
                let bOpen;
                if (this.state.bOpen) {
                    bOpen = true;
                } else {
                    bOpen = false;
                }
                this.setState({bOpen: !this.state.bOpen});
                if (!bOpen) {
                    this.setState({bWindowZindex: Math.floor(Date.now()/1000)+1})
                }
            }
            this.setState({clicked: false})
        }
    }

    onDClickHandler() {
        if (this.state.mouseOver) { //this will be true if click occurs while window is open due to a mouseOver
            this.setState({bzIndex: Math.floor(Date.now()/1000)});
            this.setState({bWindowZindex: Math.floor(Date.now()/1000)})
            this.setState({dzIndex: Math.floor(Date.now()/1000)+1});
            this.setState({dWindowZindex: Math.floor(Date.now()/1000)+1})
            this.setState({clicked: true})
            this.setState({mouseOver: false});
        } else { //this will be true if click occurs while window is open due to a click or has been closed due to a click and not reopened with a mouseOver; close window and reactivate mouseOver by setting clicked to false
            if (this.props.visible) {
                let bOpen;
                if (this.state.bOpen) {
                    bOpen = true;
                } else {
                    bOpen = false;
                }
                this.setState({bOpen: !this.state.bOpen});
                if (!bOpen) {
                    this.setState({bWindowZindex: Math.floor(Date.now()/1000)})
                }
            }
            if (this.props.visible) {
                let dOpen;
                if (this.state.dOpen) {
                    dOpen = true;
                } else {
                    dOpen = false;
                }
                this.setState({dOpen: !this.state.dOpen});
                if (!dOpen) {
                    this.setState({dWindowZindex: Math.floor(Date.now()/1000)+1})
                }
            }
            this.setState({clicked: false})
        }
    }

    onBMouseOverHandler() {
        if (!this.state.clicked){ //mouseOver only operative if the windown isn't open due to a click
            if (this.props.visible) {
                this.setState({dOpen: true});
                this.setState({dzIndex: Math.floor(Date.now()/1000)});
                this.setState({dWindowZindex: Math.floor(Date.now()/1000)})
            } 
            if (this.props.visible) {
                this.setState({bOpen: true});
                this.setState({bzIndex: Math.floor(Date.now()/1000)+1});
                this.setState({bWindowZindex: Math.floor(Date.now()/1000)+1})
            }
            this.setState({mouseOver: true});
        }
    }

    onDMouseOverHandler() {
        if (!this.state.clicked){ //mouseOver only operative if the windown isn't open due to a click
            if (this.props.visible) {
                this.setState({bOpen: true});
                this.setState({bzIndex: Math.floor(Date.now()/1000)});
                this.setState({bWindowZindex: Math.floor(Date.now()/1000)})
            }
            if (this.props.visible) {
                this.setState({dOpen: true});
                this.setState({dzIndex: Math.floor(Date.now()/1000)+1});
                this.setState({dWindowZindex: Math.floor(Date.now()/1000)+1})
            } 
            this.setState({mouseOver: true});
        }
    }

    onCloseClickHandler() {
        this.setState({bOpen: false});
        this.setState({dOpen: false});
        this.setState({clicked: false});
    }

    onMouseOutHandler() { //mouseOut only operative if the windown isn't open due to a click
        if (!this.state.clicked) {
            this.setState({bOpen: false});
            this.setState({dOpen: false});
            this.setState({mouseOver: true});
        }
    }

    render() {
        const bWindowAutoOpen = this.props.windowAutoOpen && ((this.props.birthYear-5) <= this.props.year && (this.props.birthYear + 5) >= this.props.year) ? true : false;
        const dWindowAutoOpen = this.props.windowAutoOpen && ((this.props.deathYear-5) <= this.props.year && (this.props.deathYear + 5) >= this.props.year) ? true : false;
        
        let personMarkers;
        if (this.props.birthPins && (this.props.ancestor.BirthLocation !== '') && this.props.deathPins && (this.props.ancestor.DeathLocation !== '') && this.props.lines) {
            personMarkers =
            <>
                <Marker
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.blat, lng: this.props.ancestor.blng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.bzIndex !== null) ? this.state.bzIndex : 0}
                    onClick={this.onBClickHandler}
                    onMouseOver={this.onBMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.props.visible && (this.state.bOpen || bWindowAutoOpen) && <InfoWindow onCloseClick={this.onCloseClickHandler} defaultOptions={{ disableAutoPan: true }} zIndex={(this.state.bWindowZIndex !== null) ? this.state.bWindowZIndex : 0}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div>
                    </InfoWindow>}
                </Marker>
                <Marker
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.dzIndex !== null) ? this.state.dzIndex : 0}
                    onClick={this.onDClickHandler}
                    onMouseOver={this.onDMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    onCloseClck={this.onCloseClickHandler}
                >
                    {this.props.visible && (this.state.dOpen || dWindowAutoOpen)  && <InfoWindow onCloseClick={this.onCloseClickHandler} defaultOptions={{ disableAutoPan: true }} zIndex={(this.state.dWindowZIndex !== null) ? this.state.dWindowZIndex : 0}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div>
                    </InfoWindow>}
                </Marker>
                <Polyline
                    visible={this.props.visible}
                    path={[{ lat: this.props.ancestor.blat, lng: this.props.ancestor.blng },{ lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng }]}
                    defaultOptions={{ disableAutoPan: true }, {strokeOpacity: 0.3, strokeWeight: 2}}
                />
            </>
        } else if (this.props.birthPins && (this.props.ancestor.BirthLocation !== '') && this.props.deathPins && (this.props.ancestor.DeathLocation !== '')) {
            personMarkers =
            <>
                <Marker
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.blat, lng: this.props.ancestor.blng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.bzIndex !== null) ? this.state.bzIndex : 0}
                    onClick={this.onBClickHandler}
                    onMouseOver={this.onBMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.props.visible && (this.state.bOpen || bWindowAutoOpen) && <InfoWindow onCloseClick={this.onCloseClickHandler} defaultOptions={{ disableAutoPan: true }} zIndex={(this.state.bWindowZIndex !== null) ? this.state.bWindowZIndex : 0}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div>
                    </InfoWindow>}
                </Marker>
                <Marker
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.dzIndex !== null) ? this.state.dzIndex : 0}
                    onClick={this.onDClickHandler}
                    onMouseOver={this.onDMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    onCloseClck={this.onCloseClickHandler}
                >
                    {this.props.visible && (this.state.dOpen || dWindowAutoOpen)  && <InfoWindow onCloseClick={this.onCloseClickHandler} defaultOptions={{ disableAutoPan: true }} zIndex={(this.state.dWindowZIndex !== null) ? this.state.dWindowZIndex : 0}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div>
                    </InfoWindow>}
                </Marker>
            </>
        } else if (this.props.birthPins && (this.props.ancestor.BirthLocation !== '')) {
            personMarkers =
            <>
                <Marker
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.blat, lng: this.props.ancestor.blng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.bzIndex !== null) ? this.state.bzIndex : 0}
                    onClick={this.onBClickHandler}
                    onMouseOver={this.onBMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                >
                    {this.props.visible && (this.state.bOpen || bWindowAutoOpen) && <InfoWindow onCloseClick={this.onCloseClickHandler} defaultOptions={{ disableAutoPan: true }} zIndex={(this.state.bWindowZIndex !== null) ? this.state.bWindowZIndex : 0}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div>
                    </InfoWindow>}
                </Marker>
            </>
        } else if (this.props.deathPins && (this.props.ancestor.DeathLocation !== '')) {
            personMarkers =
            <>
                <Marker
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.dlat, lng: this.props.ancestor.dlng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                    defaultOptions={{ disableAutoPan: true }}
                    zIndex={(this.state.dzIndex !== null) ? this.state.dzIndex : 0}
                    onClick={this.onDClickHandler}
                    onMouseOver={this.onDMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    onCloseClck={this.onCloseClickHandler}
                >
                    {this.props.visible && (this.state.dOpen || dWindowAutoOpen)  && <InfoWindow onCloseClick={this.onCloseClickHandler} defaultOptions={{ disableAutoPan: true }} zIndex={(this.state.dWindowZIndex !== null) ? this.state.dWindowZIndex : 0}>
                        <div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div>
                    </InfoWindow>}
                </Marker>
            </>
        }
        return (<>{personMarkers}</>)
    }
}

export default StaticMarkers;
