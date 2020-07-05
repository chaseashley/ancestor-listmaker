export function addGensAndAhnens(ancestors) {
    for (let i=0; i<ancestors.length; i++) {
        ancestors[i]['Ahnen'] = -1;
    }
    ancestors[0]['Ahnen'] = 1;
    ancestors = (assignAhnens(ancestors[0], ancestors));
    if (ancestors.some(ancestor => ancestor['Id'] === -666)) {
        return null;
    }
    ancestors[0]['Generation'] = 0;
    for (let i = 0; i<ancestors.length; i++) {
        ancestors[i]['Generation'] = Math.floor(Math.log2(ancestors[i]['Ahnen']));
    }
    return ancestors;
}

function assignAhnens(child, ancestors) {
    if (ancestors.some(ancestor => ancestor['Id'] === -666)) {
        return null;
    } else {
        let father = ancestors.find(ancestor => ancestor['Id'] === child['Father']);
        if (father) {
            let unassignedFather = ancestors.find(ancestor => ancestor['Id'] === child['Father'] && ancestor['Ahnen'] === -1);
            if (unassignedFather) {
                unassignedFather['Ahnen'] = (2 * child['Ahnen']);
                assignAhnens(unassignedFather, ancestors);
            } else {
                const dupeFather = JSON.parse(JSON.stringify(father));
                dupeFather['Ahnen'] = 2 * child['Ahnen'];
                ancestors.push(dupeFather);
                console.log(dupeFather['Name']);
                if (infiniteLoopCheck(ancestors)) {
                    const infiniteDummy = JSON.parse(JSON.stringify(father));
                    infiniteDummy['Id'] = -666;
                    ancestors.push(infiniteDummy);
                    return null;
                }
                assignAhnens(dupeFather, ancestors);
            }
        }
        let mother = ancestors.find(ancestor => ancestor['Id'] === child['Mother']);
        if (mother) {
            let unassignedMother = ancestors.find(ancestor => ancestor['Id'] === child['Mother'] && ancestor['Ahnen'] === -1);
            if (unassignedMother) {
                unassignedMother['Ahnen'] = (2 * child['Ahnen']) + 1;
                assignAhnens(unassignedMother, ancestors);
            } else {
                const dupeMother = JSON.parse(JSON.stringify(mother));
                dupeMother['Ahnen'] = (2 * child['Ahnen']) + 1;
                ancestors.push(dupeMother);
                console.log(dupeMother['Name']);
                if (infiniteLoopCheck(ancestors)) {
                    const infiniteDummy = JSON.parse(JSON.stringify(mother));
                    infiniteDummy['Id'] = -666;
                    ancestors.push(infiniteDummy);
                    return null;
                }
                assignAhnens(dupeMother, ancestors);
            }
        }
        return ancestors;
    }
}

function infiniteLoopCheck(ancestors) {
    const len = ancestors.length;
    let errMessage = '';
    if (len >= 6 && ((ancestors[len-1]['Name'] + ancestors[len-2]['Name']) === (ancestors[len-3]['Name'] + ancestors[len-4]['Name'])) && ((ancestors[len-1]['Name'] + ancestors[len-2]['Name']) === (ancestors[len-5]['Name'] + ancestors[len-6]['Name']))) {
        errMessage = `${ancestors[len-1]['Name']} and ${ancestors[len-2]['Name']} are creating an infinite loop. Check to make sure that ${ancestors[len-2]['Name']} is not connected as both the parent and child of ${ancestors[len-1]['Name']}`;
    } else if (len >= 6 && ((ancestors[len-1]['Name'] + ancestors[len-2]['Name'] + ancestors[len-3]['Name']) === (ancestors[len-4]['Name'] + ancestors[len-5]['Name'] + ancestors[len-6]['Name']))) {
        errMessage = `${ancestors[len-1]['Name']}, ${ancestors[len-2]['Name']} and ${ancestors[len-3]['Name']} are creating an infinite loop. Check to make sure that ${ancestors[len-3]['Name']} is not connected as both a grandparent and child of ${ancestors[len-1]['Name']}`;
    } else if (len >= 8 && ((ancestors[len-1]['Name'] + ancestors[len-2]['Name'] + ancestors[len-3]['Name'] + ancestors[len-4]['Name']) === (ancestors[len-5]['Name'] + ancestors[len-6]['Name'] + ancestors[len-7]['Name'] + ancestors[len-8]['Name']))) {
        errMessage = `${ancestors[len-1]['Name']}, ${ancestors[len-2]['Name']}, ${ancestors[len-3]['Name']} and ${ancestors[len-4]['Name']} are creating an infinite loop. Check to make sure that ${ancestors[len-4]['Name']} is not connected as both a great grandparent and child of ${ancestors[len-1]['Name']}`;
    } else if (len >=10 && ((ancestors[len-1]['Name'] + ancestors[len-2]['Name'] + ancestors[len-3]['Name'] + ancestors[len-4]['Name'] + ancestors[len-5]['Name']) === (ancestors[len-6]['Name'] + ancestors[len-7]['Name'] + ancestors[len-8]['Name'] + ancestors[len-9]['Name']))) {
        errMessage = `${ancestors[len-1]['Name']}, ${ancestors[len-2]['Name']}, ${ancestors[len-3]['Name']}, ${ancestors[len-4]['Name']} and ${ancestors[len-5]['Name']} are creating an infinite loop. Check to make sure that ${ancestors[len-5]['Name']} is not connected as both a great, great grandparent and child of ${ancestors[len-1]['Name']}`;
    }
    if (errMessage !== '') {
        alert(errMessage);
        return true;
    } else {
        return false;
    }
}