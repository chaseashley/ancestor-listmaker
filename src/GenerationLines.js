import React, { Component } from 'react';
import { Polyline } from '@react-google-maps/api';

class GenerationLines extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        let generationLines;

        //if birthpins and ancestor has blat, find father and mother; if they have blat, draw a line
        //same if deathpins

        if (this.props.birthPins && this.props.ancestor.adjustedblat !== undefined) {
            if (this.props.father !== null && this.props.father.adjustedblat !== undefined && this.props.mother !== null && this.props.mother.adjustedblat !== undefined) {
                generationLines =
                    <>
                        <Polyline
                            visible={this.props.visible && this.props.fatherVisible}
                            path={[{ lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng },{ lat: this.props.father.adjustedblat, lng: this.props.father.adjustedblng }]}
                            options={{ disableAutoPan: true }, {strokeColor: '#1e2eb8', strokeOpacity: 1.0, strokeWeight: 1.0}}
                        />
                        <Polyline
                            visible={this.props.visible && this.props.motherVisible}
                            path={[{ lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng },{ lat: this.props.mother.adjustedblat, lng: this.props.mother.adjustedblng }]}
                            options={{ disableAutoPan: true }, {strokeColor: '#e20147', strokeOpacity: 1.0, strokeWeight: 1.0}}
                        />
                    </>
            } else if (this.props.father !== null && this.props.father.adjustedblat !== undefined) {
                generationLines =
                    <>
                        <Polyline
                            visible={this.props.visible && this.props.fatherVisible}
                            path={[{ lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng },{ lat: this.props.father.adjustedblat, lng: this.props.father.adjustedblng }]}
                            options={{ disableAutoPan: true }, {strokeColor: '#1e2eb8', strokeOpacity: 1.0, strokeWeight: 1.0}}
                        />
                    </>
            } else if (this.props.mother !== null && this.props.mother.adjustedblat !== undefined) {
                generationLines =
                    <>
                        <Polyline
                            visible={this.props.visible && this.props.motherVisible}
                            path={[{ lat: this.props.ancestor.adjustedblat, lng: this.props.ancestor.adjustedblng },{ lat: this.props.mother.adjustedblat, lng: this.props.mother.adjustedblng }]}
                            options={{ disableAutoPan: true }, {strokeColor: '#e20147', strokeOpacity: 1.0, strokeWeight: 1.0}}
                        />
                    </>
            }
        } else if (this.props.deathPins && this.props.ancestor.adjusteddlat !== undefined) {
            if (this.props.father !== null && this.props.father.adjusteddlat !== undefined && this.props.mother !== null && this.props.mother.adjusteddlat !== undefined) {
                generationLines =
                    <>
                        <Polyline
                            visible={this.props.visible && this.props.fatherVisible}
                            path={[{ lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng },{ lat: this.props.father.adjusteddlat, lng: this.props.father.adjusteddlng }]}
                            options={{ disableAutoPan: true }, {strokeColor: '#1e2eb8', strokeOpacity: 1.0, strokeWeight: 1.0}}
                        />
                        <Polyline
                            visible={this.props.visible && this.props.motherVisible}
                            path={[{ lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng },{ lat: this.props.mother.adjusteddlat, lng: this.props.mother.adjusteddlng }]}
                            options={{ disableAutoPan: true }, {strokeColor: '#e20147', strokeOpacity: 1.0, strokeWeight: 1.0}}
                        />
                    </>
            } else if (this.props.father !== null && this.props.father.adjusteddlat !== undefined) {
                generationLines =
                    <>
                        <Polyline
                            visible={this.props.visible && this.props.fatherVisible}
                            path={[{ lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng },{ lat: this.props.father.adjusteddlat, lng: this.props.father.adjusteddlng }]}
                            options={{ disableAutoPan: true }, {strokeColor: '#1e2eb8', strokeOpacity: 1.0, strokeWeight: 1.0}}
                        />
                    </>
            } else if (this.props.mother !== null && this.props.mother.adjusteddlat !== undefined) {
                generationLines =
                    <>
                        <Polyline
                            visible={this.props.visible && this.props.motherVisible}
                            path={[{ lat: this.props.ancestor.adjusteddlat, lng: this.props.ancestor.adjusteddlng },{ lat: this.props.mother.adjusteddlat, lng: this.props.mother.adjusteddlng }]}
                            options={{ disableAutoPan: true }, {strokeColor: '#e20147', strokeOpacity: 1.0, strokeWeight: 1.0}}
                        />
                    </>
            }
        }
        return (<>{generationLines}</>)
    }   
}
        
export default GenerationLines;
        
