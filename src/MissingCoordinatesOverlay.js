import React from 'react';
import styles from './missingCoordinatesOverlayStyles.module.css';
import {
    Marker,
} from 'react-google-maps';

class MissingCoordinatesOverlay extends React.Component {

    constructor(props) {
        super(props);
        this.onDragEndHandler = this.onDragEndHandler.bind(this);
        this.state={
            markerCoordinates: this.props.markerCoordinates,
        }
    }

    onDragEndHandler(event) {
        this.setState({markerCoordinates: {lat: Number(event.latLng.lat().toFixed(6)), lng: Number(event.latLng.lng().toFixed(6))}});
    }
    
    render() {

        let missingCoordinatesOverlay, marker;
        if (this.props.markerCoordinates !== null) {
            missingCoordinatesOverlay =
                <div className={styles.coordinatesSearchBox}>
                    <table>
                        <tr><td>{this.props.location}</td><td>{this.props.name}</td><td>{`${this.props.birthdeath} Place`}</td><td>{Number(this.state.markerCoordinates.lat.toFixed(6))}, {Number(this.state.markerCoordinates.lng.toFixed(6))}</td><td><button onClick={() => this.props.onClickCoordinatesSubmit(this.state.markerCoordinates)}>Submit</button></td></tr>
                    </table>
                </div>
            marker =
                <Marker
                    position={{lat: this.state.markerCoordinates.lat, lng: this.state.markerCoordinates.lng}}
                    draggable={true}
                    onDragEnd={this.onDragEndHandler}
                />
        } else {
            missingCoordinatesOverlay =
                <></>
            marker = 
                <></>
        }

        return (
            <div>
                {missingCoordinatesOverlay}
                {marker}
            </div> 
        )

    }

}

export default MissingCoordinatesOverlay;