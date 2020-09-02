import React, { Component } from 'react';

class MapPage extends React.Component {

    constructor(props) {
        super(props);
        this.checkAddressesForCoordinates = this.checkAddressesForCoordinates.bind(this);
        this.standardizeAddress = this.standardizeAddress.bind(this);
        this.getCoordinatesFromAddressDBText = this.getCoordinatesFromAddressDBText.bind(this);
        this.state = {
            ancestors: this.props.location.ancestors //should it be this.props.location.ancestors?
        }
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
            let birthLocation = this.standardizeAddress(ancestor.BirthLocation);
            let coordinatesBirthString = this.getCoordinatesFromAddressDBText(addressDBText, birthLocation);
            if (coordinatesBirthString === '') {
                console.log(ancestor.BirthNamePrivate,'birth',ancestor.BirthLocation);
                misssingCoordinates.push([ancestor,'birth', ancestor.BirthLocation]);
            } else {
                let blatString = coordinatesBirthString.substring(0,coordinatesBirthString.indexOf(','));
                ancestor['blat'] = Number(blatString);
                let blngString = coordinatesBirthString.substring(coordinatesBirthString.indexOf(',')+1);
                ancestor['blng'] = Number(blngString);
            }
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
        });
        
    }

    componentDidMount() {
        this.checkAddressesForCoordinates();
    }

    render() {

        return(
            <div></div>
        );

    }

}
export default MapPage;