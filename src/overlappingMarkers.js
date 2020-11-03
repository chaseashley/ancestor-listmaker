
function getUniqueCoordinatesArray(ancestors,zoom,birthPins,deathPins) {
    let uniqueCoordinates = [];
    for (let i=0; i<ancestors.length; i++){
        if (uniqueCoordinates.length===0){
            if (birthPins && ancestors[i].blat!==undefined) {
                uniqueCoordinates.push([{lat: ancestors[i].blat, lng: ancestors[i].blng},[['birth',i,{lat: ancestors[i].blat, lng: ancestors[i].blng}]]]);
            } else if (deathPins && ancestors[i].dlat!==undefined) {
                uniqueCoordinates.push([{lat: ancestors[i].dlat, lng: ancestors[i].dlng},[['death',i,{lat: ancestors[i].dlat, lng: ancestors[i].dlng}]]]);
            }
        }
        //check birth marker coordinates
        let boffset = true;
        if (birthPins && ancestors[i].blat !== undefined) {
            for (let j=0; j<uniqueCoordinates.length; j++) {
                if ('birth' !== uniqueCoordinates[0][1][0][0] || i !== uniqueCoordinates[0][1][0][1]) {
                    let bjoffset = false;
                    let bPixelLatOffset = latDegreesToPixels(ancestors[i].blat-uniqueCoordinates[j][0].lat, zoom);
                    if (Math.abs(bPixelLatOffset) >= 16) {
                        bjoffset = true;
                    } else {
                        let bPixelLngOffset = lngDegreesToPixels(ancestors[i].blng-uniqueCoordinates[j][0].lng, zoom);
                        if (Math.abs(bPixelLngOffset) >= 24) {
                            bjoffset = true;
                        }
                    }
                    if (bjoffset === false) {
                        uniqueCoordinates[j][1].push(['birth',i,{lat: ancestors[i].blat, lng: ancestors[i].blng}]);
                        boffset = false;
                        break;
                    }
                }
            }
            if (boffset && ('birth' !== uniqueCoordinates[0][1][0][0] || i !== uniqueCoordinates[0][1][0][1])) {
                uniqueCoordinates.push([{lat: ancestors[i].blat, lng: ancestors[i].blng}, [['birth', i,{lat: ancestors[i].blat, lng: ancestors[i].blng}]]]);
            }
        }
        //check death marker coordinates
        let doffset = true;
        if (deathPins && ancestors[i].dlat !== undefined) {
            for (let j=0; j<uniqueCoordinates.length; j++) {
                if ('death' !== uniqueCoordinates[0][1][0][0] || i !== uniqueCoordinates[0][1][0][1]) {
                    let djoffset = false;
                    let dPixelLatOffset = latDegreesToPixels(ancestors[i].dlat-uniqueCoordinates[j][0].lat, zoom);
                    if (Math.abs(dPixelLatOffset) >= 19) {
                        djoffset = true;
                    } else {
                        let dPixelLngOffset = lngDegreesToPixels(ancestors[i].dlng-uniqueCoordinates[j][0].lng, zoom);
                        if (Math.abs(dPixelLngOffset) >= 30) {    
                            djoffset = true; 
                        }
                    }
                    if (djoffset === false) {
                        uniqueCoordinates[j][1].push(['death',i,{lat: ancestors[i].dlat, lng: ancestors[i].dlng}]);
                        doffset = false;
                        break;
                    }
                }
            }
            if (doffset && ('death' !== uniqueCoordinates[0][1][0][0] || i !== uniqueCoordinates[0][1][0][1])) {
                uniqueCoordinates.push([{lat: ancestors[i].dlat, lng: ancestors[i].dlng}, [['death', i,{lat: ancestors[i].dlat, lng: ancestors[i].dlng}]]]);
            }
        }
    }
    return uniqueCoordinates
}

export function adjustOverlappingMarkerCoordinates(ancestors, zoom, birthPins, deathPins) {
    let uniqueCoordinates = getUniqueCoordinatesArray(ancestors, zoom, birthPins, deathPins);
    for (let i=0; i<uniqueCoordinates.length; i++) {
        let latSum = 0;
        let lngSum = 0;
        for (let j=0; j<uniqueCoordinates[i][1].length; j++) {
            latSum = latSum + uniqueCoordinates[i][1][j][2].lat;
            lngSum = lngSum + uniqueCoordinates[i][1][j][2].lng;
        }
        let meanLat = latSum/uniqueCoordinates[i][1].length;
        let meanLng = lngSum/uniqueCoordinates[i][1].length;
        const variableLngOffset = (Math.pow(2,(zoom-Math.log1p(uniqueCoordinates[i][1].length))) + 1)/12 * pixelToLngDegrees(zoom);
        const maxLngOffset = 19 * pixelToLngDegrees(zoom);
        let lngOffset;
        if (variableLngOffset > maxLngOffset) {
            lngOffset = maxLngOffset;
        } else {
            lngOffset = variableLngOffset;
        }
        const variableLatOffset = (Math.pow(2,zoom-(Math.log1p(uniqueCoordinates[i][1].length))) + 1)/12 * pixelToLatDegrees(uniqueCoordinates[i][0].lat, zoom);
        const maxLatOffset = 30 * pixelToLatDegrees(uniqueCoordinates[i][0].lat, zoom);
        let latOffset;
        if (variableLatOffset > maxLatOffset) {
            latOffset = maxLatOffset;
        } else {
            latOffset = variableLatOffset;
        }
        const rowLength = Math.round((maxLatOffset/maxLngOffset) * Math.ceil(Math.sqrt(uniqueCoordinates[i][1].length)));
        const topLeftLat = meanLat + (latOffset * Math.floor((rowLength-1)/2));
        const topLeftLng = meanLng - (lngOffset * Math.floor((rowLength-1)/2));
        let rowIndex = 0;
        let columnIndex = 0;
        for (let j=0; j<uniqueCoordinates[i][1].length; j++) {//for each ancestor in the array for those coordinates
            let ancestorIndex = uniqueCoordinates[i][1][j][1];
            let birthDeath = uniqueCoordinates[i][1][j][0];
            if (birthDeath==='birth') {
                ancestors[ancestorIndex].adjustedblat = topLeftLat - (rowIndex * latOffset);
                ancestors[ancestorIndex].adjustedblng = topLeftLng + (columnIndex * lngOffset);
            } else if (birthDeath==='death') {
                ancestors[ancestorIndex].adjusteddlat = topLeftLat - (rowIndex * latOffset);
                ancestors[ancestorIndex].adjusteddlng = topLeftLng + (columnIndex * lngOffset);
            }
            if (columnIndex + 1 < rowLength) {
                columnIndex = columnIndex + 1;
            } else {
                rowIndex = rowIndex + 1;
                columnIndex = 0;
            }
        }
    }
    return ancestors;
}

function lngDegreesToPixels(lng, zoom) {
    let lngDegreesPerPixelX = 360 / Math.pow(2, zoom + 8);
    let pixelsXPerLongDegrees = 1/lngDegreesPerPixelX;
    return lng * pixelsXPerLongDegrees;
}

function latDegreesToPixels(lat, zoom) {
    let parallelMultiplier = Math.cos(lat * Math.PI / 180);
    let latDegreesPerPixelY = 360 / Math.pow(2, zoom + 8) * parallelMultiplier;
    let pixelsYPerLatDegree = 1/latDegreesPerPixelY;
    return lat * pixelsYPerLatDegree;
}

function pixelToLngDegrees(zoom) {
    let lngDegreesPerPixelX = 360 / Math.pow(2, zoom + 8);
    return lngDegreesPerPixelX;
}

function pixelToLatDegrees(lat, zoom) {
    let parallelMultiplier = Math.cos(lat * Math.PI / 180);
    let latDegreesPerPixelY = 360 / Math.pow(2, zoom + 8) * parallelMultiplier;
    return latDegreesPerPixelY;
}