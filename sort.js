

export function sortByName(ancestors, direction) {
    if (direction === 'forward') {
        ancestors.sort((a,b) => {
            if (a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) {
                return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? 1 : -1;
            }
            if (a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase() && a['FirstName'].toUpperCase() !== b['FirstName'].toUpperCase()) {
                return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? 1 : -1;
            }
            if (a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase() && a['FirstName'].toUpperCase() === b['FirstName'].toUpperCase()) {
                return Number(a['BirthDate'].slice(0,4)) > Number(b['BirthDate'].slice(0,4)) ? 1 : -1;
            }
        });
    } else {
        ancestors.sort((a,b) => {
            if (a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) {
                return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? -1 : 1;
            }
            if (a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase() && a['FirstName'].toUpperCase() !== b['FirstName'].toUpperCase()) {
                return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? -1 : 1;
            }
            if (a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase() && a['FirstName'].toUpperCase() === b['FirstName'].toUpperCase()) {
                return Number(a['BirthDate'].slice(0,4)) > Number(b['BirthDate'].slice(0,4)) ? 1 : -1;
            }
        });
    }
    return ancestors;
}

export function sortByPOB(ancestors, ascending) {
    return ancestors.sort((a, b) => {
        if(!a['BirthLocation']) return ascending ? 1 : -1;
        if(!b['BirthLocation']) return ascending ? -1 : 1;
        if (ascending && a['BirthLocation'].toUpperCase() !== b['BirthLocation'].toUpperCase()) return a['BirthLocation'] > b['BirthLocation'] ? 1 : -1;
        if (ascending && a['BirthLocation'].toUpperCase() === b['BirthLocation'].toUpperCase() && a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? 1 : -1;
        if (ascending && a['BirthLocation'].toUpperCase() === b['BirthLocation'].toUpperCase() && a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase()) return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? 1 : -1;
        if (!ascending && a['BirthLocation'].toUpperCase() !== b['BirthLocation'].toUpperCase()) return a['BirthLocation'] > b['BirthLocation'] ? -1 : 1;
        if (!ascending && a['BirthLocation'].toUpperCase() === b['BirthLocation'].toUpperCase() && a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? 1 : -1;
        if (!ascending && a['BirthLocation'].toUpperCase() === b['BirthLocation'].toUpperCase() && a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase()) return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? 1 : -1;
    })
}

export function sortByPOD(ancestors, ascending) {
    return ancestors.sort((a, b) => {
        if(!a['DeathLocation']) return ascending ? 1 : -1;
        if(!b['DeathLocation']) return ascending ? -1 : 1;
        if (ascending && a['DeathLocation'].toUpperCase() !== b['DeathLocation'].toUpperCase()) return a['DeathLocation'] > b['DeathLocation'] ? 1 : -1;
        if (ascending && a['DeathLocation'].toUpperCase() === b['DeathLocation'].toUpperCase() && a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? 1 : -1;
        if (ascending && a['DeathLocation'].toUpperCase() === b['DeathLocation'].toUpperCase() && a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase()) return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? 1 : -1;
        if (!ascending && a['DeathLocation'].toUpperCase() !== b['DeathLocation'].toUpperCase()) return a['DeathLocation'] > b['DeathLocation'] ? -1 : 1;
        if (!ascending && a['DeathLocation'].toUpperCase() === b['DeathLocation'].toUpperCase() && a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? 1 : -1;
        if (!ascending && a['DeathLocation'].toUpperCase() === b['DeathLocation'].toUpperCase() && a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase()) return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? 1 : -1;
    })
}

export function sortByDOB(ancestors, ascending) {
    return ancestors.sort((a, b) => {
        if(!a['BirthDate']) return ascending ? 1 : -1;
        if(!b['BirthDate']) return ascending ? -1 : 1;
        if (ascending && Number(a['BirthDate'].slice(0,4)) !== Number(b['BirthDate'].slice(0,4))) return a['BirthDate'] > b['BirthDate'] ? 1 : -1;
        if (ascending && Number(a['BirthDate'].slice(0,4)) === Number(b['BirthDate'].slice(0,4)) && a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? 1 : -1;
        if (ascending && Number(a['BirthDate'].slice(0,4)) === Number(b['BirthDate'].slice(0,4)) && a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase()) return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? 1 : -1;
        if (!ascending && Number(a['BirthDate'].slice(0,4)) !== Number(b['BirthDate'].slice(0,4))) return a['BirthDate'] > b['BirthDate'] ? -1 : 1;
        if (!ascending && Number(a['BirthDate'].slice(0,4)) === Number(b['BirthDate'].slice(0,4)) && a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? 1 : -1;
        if (!ascending && Number(a['BirthDate'].slice(0,4)) === Number(b['BirthDate'].slice(0,4)) && a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase()) return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? 1 : -1;
    })
}

export function sortByDOD(ancestors, ascending) {
    return ancestors.sort((a, b) => {
        if(!a['DeathDate']) return ascending ? 1 : -1;
        if(!b['DeathDate']) return ascending ? -1 : 1;
        if (ascending && Number(a['DeathDate'].slice(0,4)) !== Number(b['DeathDate'].slice(0,4))) return a['DeathDate'] > b['DeathDate'] ? 1 : -1;
        if (ascending && Number(a['DeathDate'].slice(0,4)) === Number(b['DeathDate'].slice(0,4)) && a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? 1 : -1;
        if (ascending && Number(a['DeathDate'].slice(0,4)) === Number(b['DeathDate'].slice(0,4)) && a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase()) return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? 1 : -1;
        if (!ascending && Number(a['DeathDate'].slice(0,4)) !== Number(b['DeathDate'].slice(0,4))) return a['DeathDate'] > b['DeathDate'] ? -1 : 1;
        if (!ascending && Number(a['DeathDate'].slice(0,4)) === Number(b['DeathDate'].slice(0,4)) && a['LastNameAtBirth'].toUpperCase() !== b['LastNameAtBirth'].toUpperCase()) return a['LastNameAtBirth'].toUpperCase() > b['LastNameAtBirth'].toUpperCase() ? 1 : -1;
        if (!ascending && Number(a['DeathDate'].slice(0,4)) === Number(b['DeathDate'].slice(0,4)) && a['LastNameAtBirth'].toUpperCase() === b['LastNameAtBirth'].toUpperCase()) return a['FirstName'].toUpperCase() > b['FirstName'].toUpperCase() ? 1 : -1;
    })
}

