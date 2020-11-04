import React from 'react';
import styles from './missingCoordinatesOverlayStyles.module.css';
import { Marker } from '@react-google-maps/api';

class MissingCoordinatesOverlay extends React.Component {

    constructor(props) {
        super(props);
        this.onDragEndHandler = this.onDragEndHandler.bind(this);
        this.state={
            finalCoordinates: null,
            markerCoordinates: (this.props.markerCoordinates === undefined) ? { lat: 20, lng: 0 } : this.props.markerCoordinates
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

        let missingCoordinatesOverlay, marker;
        if (this.props.markerCoordinates !== null && this.props.markerCoordinates !== undefined) {
            missingCoordinatesOverlay =
                <div className={styles.coordinatesSearchBox}>
                    <table className={styles.coordinatesSearchTable}>
                        <tbody>
                            <tr><td colSpan='5'>The location below is one of {this.props.numberMissing} locations in the ancestor list not in the app’s database. The marker is where Google Maps suggests the location is. If the placement is incorrect, drag and drop the marker at the correct place. Zoom in/out as necessary. Click 'Submit' when
                            you are confident the marker is in the correct place. Click 'Skip" if the location field is incorrect or you are not sure where the marker should be placed. Click 'Skip All' to skip adding any remaining locations to the datebase at this time and just map locations that 
                            are already in the database.</td></tr>
                            <tr><td className={styles.locationCell}>{this.props.location}</td><td className={styles.nameCell}>Found in {this.props.birthDeath} Location field for <a href={`https://www.wikitree.com/wiki/${this.props.id}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestorName}</a></td>
                            <td className={styles.submitCell}><button onClick={() => this.props.onClickCoordinatesSubmit(this.state.finalCoordinates === null ? {lat: this.state.markerCoordinates.lat, lng: this.state.markerCoordinates.lng} : {lat: this.state.finalCoordinates.lat, lng: this.state.finalCoordinates.lng})}>Submit</button></td>
                            <td className={styles.skipCell}><button onClick={() => this.props.onClickCoordinatesSkip(this.props.location)}>Skip</button></td>
                            <td className={styles.skipCell}><button onClick={() => this.props.onSkipAllClick()}>Skip All</button></td></tr>
                        </tbody>
                    </table>
                </div>
            marker =
                <Marker
                    icon={`http://maps.google.com/mapfiles/ms/icons/blue-dot.png`}
                    position={this.state.finalCoordinates === null ? {lat: this.state.markerCoordinates.lat, lng: this.state.markerCoordinates.lng} : {lat: this.state.finalCoordinates.lat, lng: this.state.finalCoordinates.lng}}
                    draggable={true}
                    onDragEnd={this.onDragEndHandler}
                />
        } else if (this.props.markerCoordinates === undefined) {
            missingCoordinatesOverlay =
            <div className={styles.coordinatesSearchBox}>
                <table className={styles.coordinatesSearchTable}>
                    <tbody>
                        <tr><td colSpan='4'>The location below is one of {this.props.numberMissing} locations in the ancestor list not in the app’s database. Google Maps could not find the location. Drag and drop the marker at the correct place for the location. Zoom in/out as necessary. Click 'Submit' when you are confident the marker is in the correct place to add it to the app's database. If the location field is incorrect, correct it in the profile and click 'Skip'.</td></tr>
                        <tr><td className={styles.locationCell}>{this.props.location}</td><td className={styles.nameCell}>Found in {this.props.birthDeath} Location field for <a href={`https://www.wikitree.com/wiki/${this.props.id}`} target='_blank' rel='noopener noreferrer'>{this.props.ancestorName}</a></td>
                        <td className={styles.submitCell}><button onClick={() => this.props.onClickCoordinatesSubmit(this.state.finalCoordinates === null ? {lat: this.state.markerCoordinates.lat, lng: this.state.markerCoordinates.lng} : {lat: this.state.finalCoordinates.lat, lng: this.state.finalCoordinates.lng})}>Submit</button></td>
                        <td className={styles.skipCell}><button onClick={() => this.props.onClickCoordinatesSkip(this.props.location)}>Skip</button></td></tr>
                    </tbody>
                </table>
            </div>
            marker =
                <Marker
                    icon={`http://maps.google.com/mapfiles/ms/icons/blue-dot.png`}
                    position={this.state.finalCoordinates === null ? { lat: 20, lng: 0 } : {lat: this.state.finalCoordinates.lat, lng: this.state.finalCoordinates.lng}}
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