import React from 'react';
import styles from './fixCoordinatesOverlayStyles.module.css';
import { Marker } from '@react-google-maps/api';

class FixCoordinatesOverlay extends React.Component {

    constructor(props) {
        super(props);
        this.onDragEndHandler = this.onDragEndHandler.bind(this);
        this.state={
            finalCoordinates: null,
            markerCoordinates: this.props.markerCoordinates
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.markerCoordinates !== prevProps.markerCoordinates) {
            this.setState({
                finalCoordinates: null,
                markerCoordinates: this.props.markerCoordinates,
            })
        }
    }

    onDragEndHandler(event) {
        this.setState({finalCoordinates: {lat: Number(event.latLng.lat().toFixed(6)), lng: Number(event.latLng.lng().toFixed(6))}});
    }
    
    render() {

        let fixCoordinatesPanel, fixCoordinatesMarker;
        fixCoordinatesPanel =
            <div className={styles.coordinatesSearchBox}>
                <table className={styles.coordinatesSearchTable}>
                    <tbody>
                        <tr><td colSpan='2'>The marker is at the coordinates currently in the app's database for the location name/description below. If the marker placement is incorrect, drag and drop it at the correct place. Zoom in/out as necessary. Click 'Submit' when you are confident the marker is in the correct place to add it to the app's database. If the location name/description is incorrect, correct it in the profile and do not change the marker position.</td></tr>
                        <tr><td className={styles.locationCell}>{this.props.location}</td><td className={styles.nameCell}>Found in {this.props.birthDeath} Location field for <a href={`https://www.wikitree.com/wiki/${this.props.id}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestorName}</a></td>
                        <td className={styles.skipCell}><button onClick={() => this.props.onCancelClick()}>Cancel</button></td></tr>
                    </tbody>
                </table>
            </div>
        fixCoordinatesMarker =
            <Marker
                icon={`http://maps.google.com/mapfiles/ms/icons/blue-dot.png`}
                position={this.state.finalCoordinates === null ? {lat: this.state.markerCoordinates.lat, lng: this.state.markerCoordinates.lng} : {lat: this.state.finalCoordinates.lat, lng: this.state.finalCoordinates.lng}}
                draggable={true}
                onDragEnd={this.onDragEndHandler}
            />
        return (
            <div>
                {fixCoordinatesPanel}
                {fixCoordinatesMarker}
            </div> 
        )

    }

}

export default FixCoordinatesOverlay;