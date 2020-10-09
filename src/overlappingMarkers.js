
function getUniqueCoordinatesArray(ancestors,zoom,birthPins,deathPins) {
    let uniqueCoordinates = [];
    for (let i=0; i<ancestors.length; i++){
        if (uniqueCoordinates.length===0){
            if (birthPins && ancestors[i].blat!==undefined) {
                uniqueCoordinates.push([{lat: ancestors[i].blat, lng: ancestors[i].blng},[['birth',i]]]);
            } else if (deathPins && ancestors[i].dlat!==undefined) {
                uniqueCoordinates.push([{lat: ancestors[i].dlat, lng: ancestors[i].dlng},[['death',i]]]);
            }
        }
        //check birth marker coordinates
        let boffset = true;
        if (birthPins && ancestors[i].blat !== undefined) {
            for (let j=0; j<uniqueCoordinates.length; j++) {
                let bjoffset = false;
                if (j!==0 || 'birth' !== uniqueCoordinates[0][1][0][0] || i !== uniqueCoordinates[0][1][0][1]) {
                    let bPixelLatOffset = latDegreesToPixels(ancestors[i].blat-uniqueCoordinates[j][0].lat, zoom);
                    if (Math.abs(bPixelLatOffset) >= 1) {
                        bjoffset = true;
                    } else {
                        let bPixelLngOffset = lngDegreesToPixels(ancestors[i].blng-uniqueCoordinates[j][0].lng, ancestors[i].blng, zoom);
                        if (Math.abs(bPixelLngOffset) >= 1) {
                            bjoffset = true;
                        }
                    }
                    if (bjoffset === false) {
                        uniqueCoordinates[j][1].push(['birth',i]);
                        boffset = false;
                        break;
                    }
                }
            }
            if (boffset && ('birth' !== uniqueCoordinates[0][1][0][0] || i !== uniqueCoordinates[0][1][0][1])) {
                uniqueCoordinates.push([{lat: ancestors[i].blat, lng: ancestors[i].blng}, [['birth', i]]]);
            }
        }
        //check death marker coordinates
        let doffset = true;
        if (deathPins && ancestors[i].dlat !== undefined) {
            for (let j=0; j<uniqueCoordinates.length; j++) {
                let djoffset = false;
                if (j!==0 || 'death' !== uniqueCoordinates[0][1][0][0] || i !== uniqueCoordinates[0][1][0][1]) {
                    let dPixelLatOffset = latDegreesToPixels(ancestors[i].dlat-uniqueCoordinates[j][0].lat, zoom);
                    if (Math.abs(dPixelLatOffset) >= 1) {
                        djoffset = true;
                    } else {
                        let dPixelLngOffset = lngDegreesToPixels(ancestors[i].dlng-uniqueCoordinates[j][0].lng, ancestors[i].dlng, zoom);
                        if (Math.abs(dPixelLngOffset) >= 1) {
                            djoffset = true;
                        }
                    }
                    if (djoffset === false) {
                        uniqueCoordinates[j][1].push(['death',i]);
                        doffset = false;
                        break;
                    }
                }
            }
            if (doffset && ('death' !== uniqueCoordinates[0][1][0][0] || i !== uniqueCoordinates[0][1][0][1])) {
                uniqueCoordinates.push([{lat: ancestors[i].dlat, lng: ancestors[i].dlng}, [['death', i]]]);
            }
        }
    }
    return uniqueCoordinates
}

export function adjustOverlappingMarkerCoordinates(ancestors, zoom, birthPins, deathPins) {
    let uniqueCoordinates = getUniqueCoordinatesArray(ancestors, zoom, birthPins, deathPins);
    for (let i=0; i<uniqueCoordinates.length; i++) {
        for (let j=0; j<uniqueCoordinates[i][1].length; j++) {//for each ancestor in the array for those coordinates
            let ancestorIndex = uniqueCoordinates[i][1][j][1];
            let birthDeath = uniqueCoordinates[i][1][j][0];
            if (j===0) {
                if (birthDeath==='birth') {
                    ancestors[ancestorIndex].adjustedblat = uniqueCoordinates[i][0].lat;
                    ancestors[ancestorIndex].adjustedblng = uniqueCoordinates[i][0].lng
                } else if (birthDeath==='death') {
                    ancestors[ancestorIndex].adjusteddlat = uniqueCoordinates[i][0].lat;
                    ancestors[ancestorIndex].adjusteddlng = uniqueCoordinates[i][0].lng
                }
            } else {
                const plusMinusMultiplier = Math.floor((j+1)/2) * Math.pow(-1,(j+1)%2); // for j=1,2,3,4 => 1,-1,2,-2, so offsets are centered around original
                if (birthDeath==='birth') {
                    ancestors[ancestorIndex].adjustedblat = uniqueCoordinates[i][0].lat;
                    ancestors[ancestorIndex].adjustedblng = uniqueCoordinates[i][0].lng + (plusMinusMultiplier * (zoom*zoom/10) * pixelToLngDegrees(zoom));
                } else if (birthDeath==='death') {
                    ancestors[ancestorIndex].adjusteddlat = uniqueCoordinates[i][0].lat;
                    ancestors[ancestorIndex].adjusteddlng = uniqueCoordinates[i][0].lng + (plusMinusMultiplier * (zoom*zoom/10) * pixelToLngDegrees(zoom));
                }
            }
        }

    }
    return ancestors;
}

function latDegreesToPixels(lat, zoom) {
    let degreesPerPixelX = 360 / Math.pow(2, zoom + 8);
    return lat/degreesPerPixelX;
}

function lngDegreesToPixels(lng, lat, zoom) {
    let parallelMultiplier = Math.cos(lat * Math.PI / 180);
    let degreesPerPixelY = 360 / Math.pow(2, zoom + 8) * parallelMultiplier;
    return lng/degreesPerPixelY;
}

function pixelToLngDegrees(zoom) {
    return 360 / Math.pow(2, zoom + 8);
}