export function addGensAndAhnens(ancestors) {
    for (let i=0; i<ancestors.length; i++) {
        ancestors[i]['Ahnen'] = -1;
      }
      ancestors[0]['Ahnen'] = 1;
      ancestors = (assignAhnens(ancestors[0], ancestors));
      ancestors[0]['Generation'] = 0;
      for (let i = 0; i<ancestors.length; i++) {
        ancestors[i]['Generation'] = Math.floor(Math.log2(ancestors[i]['Ahnen']));
      }
    return ancestors;
}

function assignAhnens(child, ancestors) {
    let father = ancestors.find(ancestor => ancestor['Id'] === child['Father']);
    let mother = ancestors.find(ancestor => ancestor['Id'] === child['Mother']);
    let unassignedFather = ancestors.find(ancestor => ancestor['Id'] === child['Father'] && ancestor['Ahnen'] === -1);
    let unassignedMother = ancestors.find(ancestor => ancestor['Id'] === child['Mother'] && ancestor['Ahnen'] === -1);
    if (father) {
        if (unassignedFather) {
            unassignedFather['Ahnen'] = (2 * child['Ahnen']);
            assignAhnens(unassignedFather, ancestors);
        } else {
            const dupeFather = JSON.parse(JSON.stringify(father));
            dupeFather['Ahnen'] = 2 * child['Ahnen'];
            ancestors.push(dupeFather);
            assignAhnens(dupeFather, ancestors);
        }
    }
    if (mother) {
        if (unassignedMother) {
            unassignedMother['Ahnen'] = (2 * child['Ahnen']) + 1;
            assignAhnens(unassignedMother, ancestors);
        } else {
            const dupeMother = JSON.parse(JSON.stringify(mother));
            dupeMother['Ahnen'] = (2 * child['Ahnen']) + 1;
            ancestors.push(dupeMother);
            assignAhnens(dupeMother, ancestors);
        }
    }
    return ancestors
}