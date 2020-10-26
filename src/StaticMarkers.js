import React, { Component } from 'react';
import { Marker, Polyline, InfoWindow } from '@react-google-maps/api';

class StaticMarkers extends Component {

    constructor(props) {
        super(props);
        this.onBDblClickHandler = this.onBDblClickHandler.bind(this);
        this.onDDblClickHandler = this.onDDblClickHandler.bind(this);
        this.onBClickHandler = this.onBClickHandler.bind(this);
        this.onDClickHandler = this.onDClickHandler.bind(this);
        this.onBMouseOverHandler = this.onBMouseOverHandler.bind(this);
        this.onDMouseOverHandler = this.onDMouseOverHandler.bind(this);
        this.onMouseOutHandler = this.onMouseOutHandler.bind(this);
        this.onCloseClickHandler = this.onCloseClickHandler.bind(this);
        this.state = {
            bOpen: false,
            dOpen: false,
            bzIndex: null,
            dzIndex: null,
            bWindowZindex: null,
            dWindowZindex: null,
            clicked: false,
            mouseOver: false,
            childMouseOver: false,
            childMouseOut: false,
            childClick: false,
            childCloseClick: false,
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
        if (nextProps.childParentWindowsLinked && nextProps.childMouseOver && !prevState.childMouseOver) {
            return {
                bOpen: true,
                childMouseOVer: true,
                childMouseOut: false
            };
        }
        if (nextProps.childParentWindowsLinked && nextProps.childMouseOut && !prevState.childMouseOut && !prevState.clicked) {
            return {
                bOpen: false,
                childMouseOut: true,
                childMouseOver: false
            };
        }
        if (nextProps.childParentWindowsLinked && nextProps.childMouseOut && !prevState.childMouseOut && prevState.clicked) {
            return {
                childMouseOut: true,
                childMouseOver: false
            };
        }
        if (nextProps.childParentWindowsLinked && nextProps.childClick && !prevState.childClick) {
            return {
                bOpen: true,
                clicked: true,
                childClick: true,
                childCloseClick: false,
            };
        }
        if (nextProps.childParentWindowsLinked && nextProps.childCloseClick && !prevState.childCloseClick) {
            return {
                childCloseClick: true,
                childClick: false,
            };
        }
    }

    onBClickHandler() {
        if (this.props.childParentWindowsLinked) {
            this.props.onClickCallback(this.props.ancestor);
        }
        if (this.state.mouseOver) { //this will be true if click occurs while window is open due to a mouseOver
            let newZindex = Math.floor(Date.now()/1000);
            if (this.props.birthDeathWindowsLinked) {
                this.setState({
                    dzIndex: newZindex,
                    dWindowZindex: newZindex,
                });
            }
            this.setState({
                bzIndex: newZindex+1,
                bWindowZindex: newZindex+1,
                clicked: true,
                mouseOver: false
            });
        } else { //this will be true if click occurs while window is open due to a click or has been closed due to a click and not reopened with a mouseOver; close window and reactivate mouseOver by setting clicked to false
            if (this.props.visible) {
                let newZindex = Math.floor(Date.now()/1000);
                if (this.props.birthDeathWindowsLinked) {
                    this.setState({
                        dzIndex: newZindex,
                        dWindowZindex: newZindex,
                    });
                }
                this.setState({
                    bzIndex: newZindex+1,
                    bWindowZindex: newZindex+1
                });
                /* COMMENTED OUT CODE PROVIDES FOR CLOSING WINDOW WITH A CLICK
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
            */
            }
        }
    }

    onDClickHandler() {
        if (this.props.childParentWindowsLinked) {
            this.props.onClickCallback(this.props.ancestor);
        }
        if (this.state.mouseOver) { //this will be true if click occurs while window is open due to a mouseOver
            let newZindex = Math.floor(Date.now()/1000);
            if (this.props.birthDeathWindowsLinked) {
                this.setState({
                    bzIndex: newZindex,
                    bWindowZindex: newZindex
                });
            }
            this.setState({
                dzIndex: newZindex+1,
                dWindowZindex: newZindex+1,
                clicked: true,
                mouseOver: false
            });
        } else { //this will be true if click occurs while window is open due to a click or has been closed due to a click and not reopened with a mouseOver; close window and reactivate mouseOver by setting clicked to false
            if (this.props.visible) {
                let newZindex = Math.floor(Date.now()/1000);
                if (this.props.birthDeathWindowsLinked) {
                    this.setState({
                        bzIndex: newZindex,
                        bWindowZindex: newZindex
                    });
                }
                this.setState({
                    dzIndex: newZindex+1,
                    dWindowZindex: newZindex+1
                });
                /* COMMENTED OUT CODE PROVIDES FOR CLOSING WINDOW WITH A CLICK
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
            this.setState({clicked: false})*/
            }
        }
    }

    onBMouseOverHandler() {
        if (this.props.childParentWindowsLinked) {
            this.props.onMouseOverCallback(this.props.ancestor);
        }
        if (this.props.visible) {
            let newZindex = Math.floor(Date.now()/1000);
            if (this.props.birthDeathWindowsLinked) {
                this.setState({
                    dOpen: true,
                    dzIndex: newZindex,
                    dWindowZindex: newZindex,
                });
            }
            this.setState({
                bOpen: true,
                bzIndex: newZindex+1,
                bWindowZindex: newZindex+1
            });
        }
        if (!this.state.clicked){ //mouseOver only operative if the windown isn't open due to a click
            this.setState({mouseOver: true});
        }
    }

    onDMouseOverHandler() {
        if (this.props.childParentWindowsLinked) {
            this.props.onMouseOverCallback(this.props.ancestor);
        }
        if (this.props.visible) {
            let newZindex = Math.floor(Date.now()/1000);
            if (this.props.birthDeathWindowsLinked) {
                this.setState({
                    bOpen: true,
                    bzIndex: newZindex,
                    bWindowZindex: newZindex,
                });
            }
            this.setState({
                dOpen: true,
                dzIndex: newZindex+1,
                dWindowZindex: newZindex+1
            });
        } 
        if (!this.state.clicked){ //mouseOver only operative if the windown isn't open due to a click
            this.setState({mouseOver: true});
        }
    }

    onCloseClickHandler() {
        if (this.props.childParentWindowsLinked) {
            this.props.onCloseClickCallback(this.props.ancestor);
        }
        this.setState({
            bOpen: false,
            dOpen: false,
            clicked: false
        });
    }

    onMouseOutHandler() { //mouseOut only operative if the window isn't open due to a click
        if (!this.state.clicked) {
            if (this.props.childParentWindowsLinked) {
                this.props.onMouseOutCallback(this.props.ancestor);
            }
            this.setState({
                bOpen: false,
                dOpen: false,
                mouseOver: false
            })
        }
    }

    onBDblClickHandler() {
        this.setState({
            bOpen: false,
            dOpen: false,
            bzIndex: -Math.floor(Date.now()/1000)+1,
            clicked: false
        })
    }

    onDDblClickHandler() {
        this.setState({
            bOpen: false,
            dOpen: false,
            dzIndex: -Math.floor(Date.now()/1000)+1,
            clicked: false
        })
    }

    render() {
        let personMarkers;
        if (this.props.birthPins && this.props.ancestor.adjustedblat !== undefined && this.props.deathPins && this.props.ancestor.adjusteddlat !== undefined && this.props.birthDeathLines) {
            personMarkers =
            <>
                <Marker
                    //key={this.props.ancestor.Id + this.props.ancestor.blat}
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                    options={{ disableAutoPan: true }}
                    zIndex={(this.state.bzIndex !== null) ? this.state.bzIndex : 0}
                    onClick={this.onBClickHandler}
                    onMouseOver={this.onBMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    onDblClick={this.onBDblClickHandler}
                >
                    {this.props.visible && this.state.bOpen && <InfoWindow onCloseClick={this.onCloseClickHandler} options={{ disableAutoPan: true }} zIndex={(this.state.bWindowZindex !== null) ? this.state.bWindowZindex : 0}>
                        <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div><div>{this.props.ancestor.BirthLocation}</div></div>
                    </InfoWindow>}
                </Marker>
                <Marker
                    //key={this.props.ancestor.Id + this.props.ancestor.dlat}
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                    options={{ disableAutoPan: true }}
                    zIndex={(this.state.dzIndex !== null) ? this.state.dzIndex : 0}
                    onClick={this.onDClickHandler}
                    onMouseOver={this.onDMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    onCloseClck={this.onCloseClickHandler}
                    onDblClick={this.onDDblClickHandler}
                >
                    {this.props.visible && this.state.dOpen  && <InfoWindow onCloseClick={this.onCloseClickHandler} options={{ disableAutoPan: true }} zIndex={(this.state.dWindowZindex !== null) ? this.state.dWindowZindex : 0}>
                    <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div><div>{this.props.ancestor.DeathLocation}</div></div>
                    </InfoWindow>}
                </Marker>
                <Polyline
                    //key={this.props.ancestor.Id + this.props.ancestor.blat + this.props.ancestor.dlat}
                    visible={this.props.visible}
                    path={[{ lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng },{ lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng }]}
                    options={{ disableAutoPan: true }, {strokeOpacity: 1, strokeWeight: 1}}
                />
            </>
        } else if (this.props.birthPins && this.props.ancestor.adjustedblat !== undefined && this.props.deathPins && this.props.ancestor.adjusteddlat !== undefined) {
            personMarkers =
            <>
                <Marker
                    //key={this.props.ancestor.Id + this.props.ancestor.blat}
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                    options={{ disableAutoPan: true }}
                    zIndex={(this.state.bzIndex !== null) ? this.state.bzIndex : 0}
                    onClick={this.onBClickHandler}
                    onMouseOver={this.onBMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    onDblClick={this.onBDblClickHandler}
                >
                    {this.props.visible && this.state.bOpen && <InfoWindow onCloseClick={this.onCloseClickHandler} options={{ disableAutoPan: true }} zIndex={(this.state.bWindowZindex !== null) ? this.state.bWindowZindex : 0}>
                    <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div><div>{this.props.ancestor.BirthLocation}</div></div>
                    </InfoWindow>}
                </Marker>
                <Marker
                    //key={this.props.ancestor.Id + this.props.ancestor.dlat}
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                    options={{ disableAutoPan: true }}
                    zIndex={(this.state.dzIndex !== null) ? this.state.dzIndex : 0}
                    onClick={this.onDClickHandler}
                    onMouseOver={this.onDMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    onCloseClck={this.onCloseClickHandler}
                    onDblClick={this.onDDblClickHandler}
                >
                    {this.props.visible && this.state.dOpen && <InfoWindow onCloseClick={this.onCloseClickHandler} options={{ disableAutoPan: true }} zIndex={(this.state.dWindowZindex !== null) ? this.state.dWindowZindex : 0}>
                    <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div><div>{this.props.ancestor.DeathLocation}</div></div>
                    </InfoWindow>}
                </Marker>
            </>
        } else if (this.props.birthPins && this.props.ancestor.adjustedblat !== undefined) {
            personMarkers =
            <>
                <Marker
                    //key={this.props.ancestor.Id + this.props.ancestor.blat}
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/green-dot.png`}
                    options={{ disableAutoPan: true }}
                    zIndex={(this.state.bzIndex !== null) ? this.state.bzIndex : 0}
                    onClick={this.onBClickHandler}
                    onMouseOver={this.onBMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    onDblClick={this.onBDblClickHandler}
                >
                    {this.props.visible && this.state.bOpen && <InfoWindow onCloseClick={this.onCloseClickHandler} options={{ disableAutoPan: true }} zIndex={(this.state.bWindowZindex !== null) ? this.state.bWindowZindex : 0}>
                    <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, b. {this.props.ancestor.BirthDate}</div><div>{this.props.ancestor.BirthLocation}</div></div>
                    </InfoWindow>}
                </Marker>
            </>
        } else if (this.props.deathPins && this.props.ancestor.adjusteddlat !== undefined) {
            personMarkers =
            <>
                <Marker
                    //key={this.props.ancestor.Id + this.props.ancestor.dlat}
                    visible={this.props.visible}
                    position={{lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng}}
                    icon={`http://maps.google.com/mapfiles/ms/icons/red-dot.png`}
                    options={{ disableAutoPan: true }}
                    zIndex={(this.state.dzIndex !== null) ? this.state.dzIndex : 0}
                    onClick={this.onDClickHandler}
                    onMouseOver={this.onDMouseOverHandler}
                    onMouseOut={this.onMouseOutHandler}
                    onCloseClck={this.onCloseClickHandler}
                    onDblClick={this.onDDblClickHandler}
                >
                    {this.props.visible && this.state.dOpen && <InfoWindow onCloseClick={this.onCloseClickHandler} options={{ disableAutoPan: true }} zIndex={(this.state.dWindowZindex !== null) ? this.state.dWindowZindex : 0}>
                    <div><div><a href={`https://www.wikitree.com/wiki/${this.props.ancestor.Name}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestor.BirthNamePrivate}</a>, d. {this.props.ancestor.DeathDate}</div><div>{this.props.ancestor.DeathLocation}</div></div>
                    </InfoWindow>}
                </Marker>
            </>
        }
        return (<>{personMarkers}</>)
    }
}

export default StaticMarkers;
