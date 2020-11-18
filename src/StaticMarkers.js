import React, { Component } from 'react';
import { Marker, Polyline, InfoWindow } from '@react-google-maps/api';

class StaticMarkers extends Component {

    constructor(props) {
        super(props);
        this.onBClickHandler = this.onBClickHandler.bind(this);
        this.onDClickHandler = this.onDClickHandler.bind(this);
        this.onBMouseOverHandler = this.onBMouseOverHandler.bind(this);
        this.onDMouseOverHandler = this.onDMouseOverHandler.bind(this);
        this.onMouseOutHandler = this.onMouseOutHandler.bind(this);
        this.onBCloseClickHandler = this.onBCloseClickHandler.bind(this);
        this.onDCloseClickHandler = this.onDCloseClickHandler.bind(this);
        this.onBDblClickHandler = this.onBDblClickHandler.bind(this);
        this.onDDblClickHandler = this.onDDblClickHandler.bind(this);
        this.state = {
            bOpen: false,
            dOpen: false,
            bzIndex: null,
            dzIndex: null,
            bWindowZindex: null,
            dWindowZindex: null,
            bClicked: false,
            dClicked: false,
            mouseOver: false,
            linkedAncestorClick: false,
            linkedAncestorCloseClick: false,
            ancestorOnClick: false,
            searchPerson: false,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.animated && (nextProps.visible === this.props.visible)) {
            return false;
        } else {
            return true;
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.ancestorOnClick && nextProps.linkedAncestorClick && !prevState.linkedAncestorClick) {
            //click on child; simulate click on this parent marker
            if (nextProps.birthPins) {
                return {
                    bOpen: true,
                    bClicked: true,
                    bzIndex: Math.floor(Date.now()/1000)+99,
                    bWindowZindex: Math.floor(Date.now()/1000)+99,
                    mouseOver: true,
                    linkedAncestorClick: true,
                    linkedAncestorCloseClick: false,
                    ancestorOnClick: true
                };
            } else if (nextProps.deathPins) {
                return {
                    dOpen: true,
                    dClicked: true,
                    dzIndex: Math.floor(Date.now()/1000)+99,
                    dWindowZindex: Math.floor(Date.now()/1000)+99,
                    mouseOver: true,
                    linkedAncestorClick: true,
                    linkedAncestorCloseClick: false,
                    ancestorOnClick: true
                };
            }
        }
        if (nextProps.ancestorOnClick && nextProps.linkedAncestorCloseClick && !prevState.linkedAncestorCloseClick) {
            //closeClick on linked ancestor; just record the linked ancestor closeClick and don't change this marker's info window
            return {
                linkedAncestorCloseClick: true,
                linkedAncestorClick: false,
                ancestorOnClick: true
            };
        }
        if (!nextProps.ancestorOnClick && prevState.ancestorOnClick) {
            //ancestor linking option turned off, so null out linked ancestor states
            return {
                /*
                bOpen: true,
                dOpen: true,
                bClicked: true,
                dClicked: true,
                linkedAncestorClick: false,
                linkedAncestorCloseClick: false,
                ancestorOnClick: false*/
            }
        }
        if (nextProps.searchPerson && !prevState.searchPerson) {
            if (nextProps.birthPins && nextProps.deathPins) {
                return {
                    bOpen: true,
                    bClicked: true,
                    bzIndex: Math.floor(Date.now()/1000),
                    bWindowZindex: Math.floor(Date.now()/1000),
                    dOpen: true,
                    dClicked: true,
                    dzIndex: Math.floor(Date.now()/1000),
                    dWindowZindex: Math.floor(Date.now()/1000),
                    mouseOver: true,
                    searchPerson: true,
                }
            } else if (nextProps.birthPins) {
                return {
                    bOpen: true,
                    bClicked: true,
                    bzIndex: Math.floor(Date.now()/1000),
                    bWindowZindex: Math.floor(Date.now()/1000),
                    mouseOver: true,
                    searchPerson: true,
                }
            } else if (nextProps.deathPins) {
                return {
                    dOpen: true,
                    dClicked: true,
                    dzIndex: Math.floor(Date.now()/1000),
                    dWindowZIndex: Math.floor(Date.now()/1000),
                    mouseOver: true,
                    searchPerson: true,
                }
            }
        }
        if (!nextProps.searchPerson && prevState.searchPerson) {
            return { searchPerson: false}
        }
        return prevState;
    }

    onBClickHandler() {
        if (this.props.visible) {
            //if (this.props.ancestorOnClick) {
                this.props.onBClickCallback(this.props.ancestor);
            //}
            if (this.state.mouseOver) { //this will be true if click occurs while window is open due to a mouseOver
                let newZindex = Math.floor(Date.now()/1000);
                this.setState({
                    bzIndex: newZindex,
                    bWindowZindex: newZindex,
                    bClicked: true,
                });
                if (this.props.birthDeathOnClick) {
                    this.setState({
                        dOpen: true,
                        dClicked: true,
                        dzIndex: newZindex+1,
                        dWindowZindex: newZindex+1,
                    });
                }
            } else { //this will be true if click occurs while window is open due to a click or has been closed due to a click and not reopened with a mouseOver; close window and reactivate mouseOver by setting clicked to false
                let newZindex = Math.floor(Date.now()/1000);
                this.setState({
                    bzIndex: newZindex,
                    bWindowZindex: newZindex+1
                });
                if (this.props.birthDeathOnClick) {
                    this.setState({
                        dOpen: true,
                        dClicked: true,
                        dzIndex: newZindex+1,
                        dWindowZindex: newZindex+1,
                    });
                }
            }
        }
    }

    onDClickHandler() {
        if (this.props.visible) {
            //if (this.props.ancestorOnClick) {
                this.props.onDClickCallback(this.props.ancestor);
            //}
            if (this.state.mouseOver) { //this will be true if click occurs while window is open due to a mouseOver
                let newZindex = Math.floor(Date.now()/1000);
                this.setState({
                    dzIndex: newZindex,
                    dWindowZindex: newZindex,
                    dClicked: true,
                });
                if (this.props.birthDeathOnClick) {
                    this.setState({
                        bOpen: true,
                        bClicked: true,
                        bzIndex: newZindex+1,
                        bWindowZindex: newZindex+1,
                    });
                }
            } else { //this will be true if click occurs while window is open due to a click or has been closed due to a click and not reopened with a mouseOver; close window and reactivate mouseOver by setting clicked to false
                let newZindex = Math.floor(Date.now()/1000);
                this.setState({
                    dzIndex: newZindex,
                    dWindowZindex: newZindex
                });
                if (this.props.birthDeathOnClick) {
                    this.setState({
                        bOpen: true,
                        bClicked: true,
                        bzIndex: newZindex+1,
                        bWindowZindex: newZindex+1
                    });
                }
            }
        }
    }

    onBMouseOverHandler() {
        if (this.props.visible) {
            let newZindex = Math.floor(Date.now()/1000);
            this.setState({
                mouseOver: true,
                bOpen: true,
                bzIndex: newZindex+1,
                bWindowZindex: newZindex+1
            });
        }
    }

    onDMouseOverHandler() {
        if (this.props.visible) {
            let newZindex = Math.floor(Date.now()/1000);
            this.setState({
                mouseOver: true,
                dOpen: true,
                dzIndex: newZindex+1,
                dWindowZindex: newZindex+1,
            });
        }
    }

    onMouseOutHandler() { //mouseOut only operative if the window isn't open due to a click
        if (this.props.visible) {
            if (!this.state.bClicked) {
                this.setState({
                    bOpen: false,
                })
            }
            if (!this.state.dClicked) {
                this.setState({
                    dOpen: false,
                })
            }
            this.setState({mouseOver: false});
        }
    }

    onBCloseClickHandler() {
        if (this.props.visible) {
            //if (this.props.ancestorOnClick) {
                this.props.onBCloseClickCallback(this.props.ancestor);
                this.setState({ //if close info window, reset child relationship
                    linkedAncestorClick: false,
                    linkedAncestorCloseClick: false,
                })
            //}
            this.setState({
                bOpen: false,
                bClicked: false,
                mouseOver: false
            });
        }
    }

    onDCloseClickHandler() {
        if (this.props.visible) {
            //if (this.props.ancestorOnClick) {
                this.props.onDCloseClickCallback(this.props.ancestor);
                this.setState({ //if close info window, reset child relationship
                    linkedAncestorClick: false,
                    linkedAncestorCloseClick: false,
                })
            //}
            this.setState({
                dOpen: false,
                dClicked: false,
                mouseOver: false
            });
        }
    }

    onBDblClickHandler() {
        if (this.props.visible && this.state.bOpen && !this.props.ancestorOnClick) {
            this.setState({
                bOpen: false,
                bzIndex: -Math.floor(Date.now()/1000)+1,
                bClicked: false
            })
        }
    }

    onDDblClickHandler() {
        if (this.props.visible && this.state.dOpen && !this.props.ancestorOnClick) {
            this.setState({
                dOpen: false,
                dzIndex: -Math.floor(Date.now()/1000)+1,
                dClicked: false
            })
        }
    }

    render() {
        let personMarkers;
        if (this.props.ancestor.Name === 'Unknown-282952') {
            let x = 1;
        }
        //if (this.props.visible) {
            if (this.props.birthPins && this.props.ancestor.adjustedblat !== undefined && this.props.deathPins && this.props.ancestor.adjusteddlat !== undefined && this.props.birthDeathLines) {
                personMarkers =
                <>
                    <Marker
                        key={this.props.key}
                        visible={this.props.visible}
                        position={{lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng}}
                        icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                        options={{ disableAutoPan: true }}
                        zIndex={(this.state.bzIndex !== null) ? this.state.bzIndex : 0}
                        onClick={this.onBClickHandler}
                        onMouseOver={this.onBMouseOverHandler}
                        onMouseOut={this.onMouseOutHandler}
                        onCloseClck={this.onBCloseClickHandler}
                        onDblClick={this.onBDblClickHandler}
                    >
                        {this.props.visible && this.state.bOpen && <InfoWindow options={{ disableAutoPan: true }} onCloseClick={this.onBCloseClickHandler} zIndex={(this.state.bWindowZindex !== null) ? this.state.bWindowZindex : 0}>
                            <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div><div>{this.props.ancestor.BirthLocation}</div></div>
                        </InfoWindow>}
                    </Marker>
                    <Marker
                        key={this.props.key}
                        visible={this.props.visible}
                        position={{lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng}}
                        icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                        options={{ disableAutoPan: true }}
                        zIndex={(this.state.dzIndex !== null) ? this.state.dzIndex : 0}
                        onClick={this.onDClickHandler}
                        onMouseOver={this.onDMouseOverHandler}
                        onMouseOut={this.onMouseOutHandler}
                        onCloseClck={this.onDCloseClickHandler}
                        onDblClick={this.onDDblClickHandler}
                    >
                        {this.props.visible && this.state.dOpen  && <InfoWindow options={{ disableAutoPan: true }} onCloseClick={this.onDCloseClickHandler} zIndex={(this.state.dWindowZindex !== null) ? this.state.dWindowZindex : 0}>
                        <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div><div>{this.props.ancestor.DeathLocation}</div></div>
                        </InfoWindow>}
                    </Marker>
                    <Polyline
                        visible={this.props.visible}
                        path={[{ lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng },{ lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng }]}
                        options={{ disableAutoPan: true }, {strokeOpacity: 1, strokeWeight: 1}}
                    />
                </>
            } else if (this.props.birthPins && this.props.ancestor.adjustedblat !== undefined && this.props.deathPins && this.props.ancestor.adjusteddlat !== undefined) {
                personMarkers =
                <>
                    <Marker
                        key={this.props.key}
                        visible={this.props.visible}
                        position={{lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng}}
                        icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                        options={{ disableAutoPan: true }}
                        zIndex={(this.state.bzIndex !== null) ? this.state.bzIndex : 0}
                        onClick={this.onBClickHandler}
                        onMouseOver={this.onBMouseOverHandler}
                        onMouseOut={this.onMouseOutHandler}
                        onCloseClck={this.onBCloseClickHandler}
                        onDblClick={this.onBDblClickHandler}
                    >
                        {this.props.visible && this.state.bOpen && <InfoWindow options={{ disableAutoPan: true }} onCloseClick={this.onBCloseClickHandler} zIndex={(this.state.bWindowZindex !== null) ? this.state.bWindowZindex : 0}>
                        <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div><div>{this.props.ancestor.BirthLocation}</div></div>
                        </InfoWindow>}
                    </Marker>
                    <Marker
                        key={this.props.key}
                        visible={this.props.visible}
                        position={{lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng}}
                        icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                        options={{ disableAutoPan: true }}
                        zIndex={(this.state.dzIndex !== null) ? this.state.dzIndex : 0}
                        onClick={this.onDClickHandler}
                        onMouseOver={this.onDMouseOverHandler}
                        onMouseOut={this.onMouseOutHandler}
                        onCloseClck={this.onDCloseClickHandler}
                        onDblClick={this.onDDblClickHandler}
                    >
                        {this.props.visible && this.state.dOpen && <InfoWindow options={{ disableAutoPan: true }} onCloseClick={this.onDCloseClickHandler} zIndex={(this.state.dWindowZindex !== null) ? this.state.dWindowZindex : 0}>
                        <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div><div>{this.props.ancestor.DeathLocation}</div></div>
                        </InfoWindow>}
                    </Marker>
                </>
            } else if (this.props.birthPins && this.props.ancestor.adjustedblat !== undefined) {
                personMarkers =
                <>
                    <Marker
                        key={this.props.key}
                        visible={this.props.visible}
                        position={{lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng}}
                        icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                        options={{ disableAutoPan: true }}
                        zIndex={(this.state.bzIndex !== null) ? this.state.bzIndex : 0}
                        onClick={this.onBClickHandler}
                        onMouseOver={this.onBMouseOverHandler}
                        onMouseOut={this.onMouseOutHandler}
                        onCloseClck={this.onBCloseClickHandler}
                        onDblClick={this.onBDblClickHandler}
                    >
                        {this.props.visible && this.state.bOpen && <InfoWindow options={{ disableAutoPan: true }} onCloseClick={this.onBCloseClickHandler} zIndex={(this.state.bWindowZindex !== null) ? this.state.bWindowZindex : 0}>
                        <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div><div>{this.props.ancestor.BirthLocation}</div></div>
                        </InfoWindow>}
                    </Marker>
                </>
            } else if (this.props.deathPins && this.props.ancestor.adjusteddlat !== undefined) {
                personMarkers =
                <>
                    <Marker
                        key={this.props.key}
                        visible={this.props.visible}
                        position={{lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng}}
                        icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                        options={{ disableAutoPan: true }}
                        zIndex={(this.state.dzIndex !== null) ? this.state.dzIndex : 0}
                        onClick={this.onDClickHandler}
                        onMouseOver={this.onDMouseOverHandler}
                        onMouseOut={this.onMouseOutHandler}
                        onCloseClck={this.onDCloseClickHandler}
                        onDblClick={this.onDDblClickHandler}
                    >
                        {this.props.visible && this.state.dOpen && <InfoWindow options={{ disableAutoPan: true }} onCloseClick={this.onDCloseClickHandler} zIndex={(this.state.dWindowZindex !== null) ? this.state.dWindowZindex : 0}>
                        <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div><div>{this.props.ancestor.DeathLocation}</div></div>
                        </InfoWindow>}
                    </Marker>
                </>

            }
        //} else {
          //personMarkers = <></>;
        //}
        return (<>{personMarkers}</>)
    }
}

export default StaticMarkers;
