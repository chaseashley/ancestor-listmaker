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

    let father = ancestors.find(ancestor => (ancestor['Id'] === child['Father'] && ancestor['Ahnen'] === -1));
    let mother = ancestors.find(ancestor => (ancestor['Id'] === child['Mother'] && ancestor['Ahnen'] === -1));
    if (father) {
        father['Ahnen'] = (2 * child['Ahnen']);
        assignAhnens(father, ancestors);
    }
    if (mother) {
        mother['Ahnen'] = (2 * child['Ahnen']) + 1;
        assignAhnens(mother, ancestors);
    }
    return ancestors
}