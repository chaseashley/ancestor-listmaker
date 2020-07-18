export function getAllAncestralLines(endAncestor, ancestors) {
    const ancestralLines = [];
    const endAncestors = getAllEndAncestors(endAncestor, ancestors);
    for (let i=0; i<endAncestors.length; i++) {
        let ancestralLine = [endAncestors[i]];
        ancestralLine = getAncestralLine(endAncestors[i], ancestors, ancestralLine);
        ancestralLines.push(ancestralLine);
    }
    return ancestralLines;
}

function getAllEndAncestors(endAncestor, ancestors) {
    const endAncestors = [];
    for (let i=0; i<ancestors.length; i++) {
        if (ancestors[i]['Id'] === endAncestor['Id']) {
            endAncestors.push(ancestors[i]);
        }
    }
    return endAncestors;
}


function getAncestralLine(endAncestor, ancestors, ancestralLine) {
    let nextAncestor = getNextAncestor(endAncestor, ancestors);
    ancestralLine.push(nextAncestor);
    if (nextAncestor['Id'] !== ancestors[0]['Id']) {
        getAncestralLine(nextAncestor,ancestors, ancestralLine);
    }
    return ancestralLine;
}

function getNextAncestor(ancestor, ancestors) {
    for (let i=0; i<ancestors.length; i++) {
        if (ancestors[i]['Ahnen'] === Math.floor(ancestor['Ahnen']/2)) {
            return ancestors[i];
        }
    }console.log(ancestor['Name'], ancestor['Ahnen'], ancestors[0]['Name'], ancestors[0]['Ahnen']);
}