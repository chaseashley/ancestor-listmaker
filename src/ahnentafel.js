export function addGensAndAhnens(child, ancestors) {
    for (let i=0; i<ancestors.length; i++) {
        ancestors[i]['Ahnen'] = -1;
      }
      child['Ahnen'] = 1;
      ancestors = (assignAhnens(child, ancestors));
      child['Generation'] = 0;
      for (let i = 0; i<ancestors.length; i++) {
        ancestors[i]['Generation'] = Math.floor(Math.log2(ancestors[i]['Ahnen']));
      }
    return ancestors;
}


function assignAhnens(child, ancestors) {

    let father = ancestors.find(ancestor => ancestor['Id'] === child['Father']);
    let mother = ancestors.find(ancestor => ancestor['Id'] === child['Mother']);
    if (father) {
        if (father['Ahnen'] === -1) {
            father['Ahnen'] = (2 * child['Ahnen']);
            assignAhnens(father, ancestors);
        } else {
            const dupeFather = JSON.parse(JSON.stringify(father));
            dupeFather['Ahnen'] = 2 * child['Ahnen'];
            ancestors.push(dupeFather);
            assignAhnens(dupeFather, ancestors);
        }
    }
    if (mother) {
        if (mother['Ahnen'] === -1) {
            mother['Ahnen'] = (2 * child['Ahnen']) + 1;
            assignAhnens(mother, ancestors);
        } else {
            const dupeMother = JSON.parse(JSON.stringify(mother));
            dupeMother['Ahnen'] = (2 * child['Ahnen']) + 1;
            ancestors.push(dupeMother);
            assignAhnens(dupeMother, ancestors);
        }
    }
    return ancestors
}