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
            markerCoordinates: (this.props.markerCoordinates === undefined) ? { lat: 20, lng: 0 } : this.props.markerCoordinates
        }
    }

    onDragEndHandler(event) {
        this.setState({markerCoordinates: {lat: Number(event.latLng.lat().toFixed(6)), lng: Number(event.latLng.lng().toFixed(6))}});
    }
    
    render() {

        let missingCoordinatesOverlay, marker;
        if (this.props.markerCoordinates !== null && this.props.markerCoordinates !== undefined) {
            missingCoordinatesOverlay =
                <div className={styles.coordinatesSearchBox}>
                    <table className={styles.coordinatesSearchTable}>
                        <tr><td colspan='4'>There are {this.props.numberMissing} locations in the ancestor list that do not have confirmed coordinates in the app's database, including the location listed below. The marker on the map is where Google Maps suggests may be the correct coordinates for the location listed below. Please confirm that the marker is in the correct place for the location. Using +- to zoom in or out, may help you confirm the correctness of the marker placement. If the marker is not at the correct place, drag and drop it to the correct place. Use care in confirming the marker placement before clicking the Submit button, as this placement will become part of the database for all users. If you are not confident of the correct place of the location listed below, please click the Skip button.</td></tr>
                        <tr><td className={styles.locationRowCell}>{this.props.location}</td><td className={styles.locationRowCell}>Found in {this.props.birthDeath} Location field for <a href={`https://www.wikitree.com/wiki/${this.props.id}`} target='_blank'>{this.props.ancestorName}</a></td><td className={styles.locationRowCell}><button onClick={() => this.props.onClickCoordinatesSubmit(this.state.markerCoordinates)}>Submit</button></td>
                        <td className={styles.locationRowCell}><button onClick={() => this.props.onClickCoordinatesSkip(this.props.location)}>Skip</button></td></tr>
                    </table>
                </div>
            marker =
                <Marker
                    position={{lat: this.state.markerCoordinates.lat, lng: this.state.markerCoordinates.lng}}
                    draggable={true}
                    onDragEnd={this.onDragEndHandler}
                />
        } else if (this.props.markerCoordinates === undefined) {
            missingCoordinatesOverlay =
            <div className={styles.coordinatesSearchBox}>
                <table className={styles.coordinatesSearchTable}>
                    <tr><td colspan='4'>There are {this.props.numberMissing} locations in the ancestor list that do not have confirmed coordinates in the app's database, including the location listed below. Google maps could not find the location listed below. Please drag and drop the marker on the correct place for the location. Use +- to zoom in or out, as necessary, to place the marker in the correction place. Use care in confirming the marker placement before clicking the Submit button , as this placement will become part of the database for all users. If you are not confident of the correct place of the location listed below, please click the Skip button.</td></tr>
                    <tr><td className={styles.locationRowCell}>{this.props.location}</td><td className={styles.locationRowCell}>Found in {this.props.birthDeath} Location field for <a href={`https://www.wikitree.com/wiki/${this.props.id}`} target='_blank'>{this.props.ancestorName}</a></td><td className={styles.locationRowCell}><button onClick={() => this.props.onClickCoordinatesSubmit(this.state.markerCoordinates)}>Submit</button></td>
                    <td className={styles.locationRowCell}><button onClick={() => this.props.onClickCoordinatesSkip(this.props.location)}>Skip</button></td></tr>
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