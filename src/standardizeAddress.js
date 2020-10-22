export function standardizeAddress(address) {
    //
    address = address.toUpperCase();
    address = address.replace(/  /g,' ');
    address = address.replace(/, /g,',');
    address = address.replace(/,,/g,',');
    address = address.replace(/\./g,'');

    //USA standardizations
    if (address.indexOf('UNITED STATES OF AMERICA') !== -1 && address.indexOf('UNITED STATES OF AMERICA') === address.length-24) {
        address = address.substring(0,address.length-24) + 'USA';
    }
    if (address.indexOf('UNITED STATES') !== -1 && address.indexOf('UNITED STATES') === address.length-13) {
        address = address.substring(0,address.length-13) + 'USA';
    }
    if (address.indexOf(',NEW ENGLAND') !== -1 && address.indexOf(',NEW ENGLAND') === address.length-12) {
        address = address.substring(0,address.length-12);
    }
    if (address.indexOf(',BRITISH COLONIAL AMERICA') !== -1 && address.indexOf(',BRITISH COLONIAL AMERICA') === address.length-25) {
        address = address.substring(0,address.length-25);
    }
    if (address.indexOf(',BRITISH AMERICA') !== -1 && address.indexOf(',BRITISH AMERICA') === address.length-16) {
        address = address.substring(0,address.length-16);
    }
    if (address.indexOf(',AMERICA') !== -1 && address.indexOf(',AMERICA') === address.length-8) {
        address = address.substring(0,address.length-8);
    }
    address = address.replace(',PLYMOUTH COLONY',',MASSACHUSETTS');
    address = address.replace(',MASSACHUSETTS BAY COLONY',',MASSACHUSETTS');
    address = address.replace(',MASSACHUSETTS BAY',',MASSACHUSETTS');
    address = address.replace('PROVINCE OF MASSACHUSETTS BAY','MASSACHUSETTS');
    address = address.replace('PROVINCE OF MASSACHUSETTS','MASSACHUSETTS');
    address = address.replace('PROVINCE OF NEW HAMPSHIRE','NEW HAMPSHIRE');
    address = address.replace('PROVINCE OF MAINE','MAINE');
    address = address.replace('DISTRICT OF MAINE','MAINE');
    address = address.replace('COLONY OF RHODE ISLAND AND PROVIDENCE PLANTATIONS','RHODE ISLAND');
    address = address.replace('COLONY OF RHODE ISLAND AND PROVIDENCE PLANTATION','RHODE ISLAND');
    address = address.replace('PROVINCE OF RHODE ISLAND','RHODE ISLAND');
    address = address.replace('COLONY OF RHODE ISLAND','RHODE ISLAND');
    address = address.replace('CONNECTICUT COLONY','CONNECTICUT');
    address = address.replace('COLONY OF CONNECTICUT','CONNECTICUT');
    address = address.replace('PROVINCE OF NEW YORK','NEW YORK');
    address = address.replace('PROVINCE OF NEW JERSEY','NEW JERSEY');
    address = address.replace('PROVINCE OF PENNSYLVANIA','PENNSYLVANIA');
    address = address.replace('PENNSYLVANIA COLONY','PENNSYLVANIA');
    address = address.replace('PROVINCE OF MARYLAND','MARYLAND');
    address = address.replace('VIRGINIA COLONY','VIRGINIA');
    address = address.replace('PROVINCE OF NORTH CAROLINA','NORTH CAROLINA');
    address = address.replace('PROVINCE OF SOUTH CAROLINA','SOUTH CAROLINA');
    if (address.indexOf(' COUNTY,') !== -1) {
        let end = address.indexOf(' COUNTY,');
        let front = address.substring(0,end);
        if (front.indexOf(',') !== -1) {
            address = address.replace(' COUNTY,',',');
        }
    }
    if (address.indexOf('ALABAMA') !== -1 && address.indexOf('ALABAMA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf('ALASKA') !== -1 && address.indexOf('ALASKA') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf('ARIZONA') !== -1 && address.indexOf('ARIZONA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf('CALIFORNIA') !== -1 && address.indexOf('CALIFORNIA') === address.length-10) {
        address = address + ',USA';
    }
    if (address.indexOf('COLORADO') !== -1 && address.indexOf('COLORADO') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('CONNECTICUT') !== -1 && address.indexOf('CONNECTICUT') === address.length-11) {
        address = address + ',USA';
    }
    if (address.indexOf('DELAWARE') !== -1 && address.indexOf('DELAWARE') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('FLORIDA') !== -1 && address.indexOf('FLORIDA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf('GEORGIA') !== -1 && address.indexOf('GEORGIA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf('HAWAII') !== -1 && address.indexOf('HAWAII') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf('IDAHO') !== -1 && address.indexOf('IDAHO') === address.length-5) {
        address = address + ',USA';
    }
    if (address.indexOf('ILLINOIS') !== -1 && address.indexOf('ILLINOIS') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('INDIANA') !== -1 && address.indexOf('INDIANA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf('IOWA') !== -1 && address.indexOf('IOWA') === address.length-4) {
        address = address + ',USA';
    }
    if (address.indexOf('KANSAS') !== -1 && address.indexOf('KANSAS') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf('KENTUCKY') !== -1 && address.indexOf('KENTUCKY') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('LOUISIANA') !== -1 && address.indexOf('LOUISIANA') === address.length-9) {
        address = address + ',USA';
    }
    if (address.indexOf('MAINE') !== -1 && address.indexOf('MAINE') === address.length-5) {
        address = address + ',USA';
    }
    if (address.indexOf('MARYLAND') !== -1 && address.indexOf('MARYLAND') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('MASSACHUSETTS') !== -1 && address.indexOf('MASSACHUSETTS') === address.length-13) {
        address = address + ',USA';
    }
    if (address.indexOf('MICHIGAN') !== -1 && address.indexOf('MICHIGAN') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('MINNESOTA') !== -1 && address.indexOf('MINNESOTA') === address.length-9) {
        address = address + ',USA';
    }
    if (address.indexOf('MISSISSIPPI') !== -1 && address.indexOf('MISSISSIPPI') === address.length-11) {
        address = address + ',USA';
    }
    if (address.indexOf('MISSOURI') !== -1 && address.indexOf('MISSOURI') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('MONTANA') !== -1 && address.indexOf('MONTANA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf('NEBRASKA') !== -1 && address.indexOf('NEBRASKA') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('NEVADA') !== -1 && address.indexOf('NEVADA') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf('NEW HAMPSHIRE') !== -1 && address.indexOf('NEW HAMPSHIRE') === address.length-13) {
        address = address + ',USA';
    }
    if (address.indexOf('NEW JERSEY') !== -1 && address.indexOf('NEW JERSEY') === address.length-10) {
        address = address + ',USA';
    }
    if (address.indexOf('NEW MEXICO') !== -1 && address.indexOf('NEW MEXICO') === address.length-10) {
        address = address + ',USA';
    }
    if (address.indexOf('NEW YORK') !== -1 && address.indexOf('NEW YORK') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('NORTH CAROLINA') !== -1 && address.indexOf('NORTH CAROLINA') === address.length-14) {
        address = address + ',USA';
    }
    if (address.indexOf('NORTH DAKOTA') !== -1 && address.indexOf('NORTH DAKOTA') === address.length-12) {
        address = address + ',USA';
    }
    if (address.indexOf('OHIO') !== -1 && address.indexOf('OHIO') === address.length-4) {
        address = address + ',USA';
    }
    if (address.indexOf('OKLAHOMA') !== -1 && address.indexOf('OKLAHOMA') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('OREGON') !== -1 && address.indexOf('OREGON') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf('PENNSYLVANIA') !== -1 && address.indexOf('PENNSYLVANIA') === address.length-12) {
        address = address + ',USA';
    }
    if (address.indexOf('RHODE ISLAND') !== -1 && address.indexOf('RHODE ISLAND') === address.length-12) {
        address = address + ',USA';
    }
    if (address.indexOf('SOUTH CAROLINA') !== -1 && address.indexOf('SOUTH CAROLINA') === address.length-14) {
        address = address + ',USA';
    }
    if (address.indexOf('SOUTH DAKOTA') !== -1 && address.indexOf('SOUTH DAKOTA') === address.length-12) {
        address = address + ',USA';
    }
    if (address.indexOf('TENNESSEE') !== -1 && address.indexOf('TENNESSEE') === address.length-9) {
        address = address + ',USA';
    }
    if (address.indexOf('TEXAS') !== -1 && address.indexOf('TEXAS') === address.length-5) {
        address = address + ',USA';
    }
    if (address.indexOf('UTAH') !== -1 && address.indexOf('UTAH') === address.length-4) {
        address = address + ',USA';
    }
    if (address.indexOf('VERMONT') !== -1 && address.indexOf('VERMONT') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf('VIRGINIA') !== -1 && address.indexOf('VIRGINIA') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf('WASHINGTON') !== -1 && address.indexOf('WASHINGTON') === address.length-10) {
        address = address + ',USA';
    }
    if (address.indexOf('WEST VIRGINIA') !== -1 && address.indexOf('WEST VIRGINIA') === address.length-13) {
        address = address + ',USA';
    }
    if (address.indexOf('WISCONSIN') !== -1 && address.indexOf('WISCONSIN') === address.length-9) {
        address = address + ',USA';
    }
    if (address.indexOf('WYOMING') !== -1 && address.indexOf('WYOMING') === address.length-7) {
        address = address + ',USA';
    }

    address = address.replace('ENGLAND,UNITED KINGDOM','ENGLAND');
    address = address.replace('SCOTLAND,UNITED KINGDOM','SCOTLAND');
    address = address.replace('WALES,UNITED KINGDOM','WALES');
    address = address.replace('NORTHERN IRELAND,UNITED KINGDOM','NORTHERN IRELAND');

    if (address.indexOf(',NOUVELLE-FRANCE') !== -1 && address.indexOf(',NOUVELLE-FRANCE') === address.length-16) {
        address = address.substring(0,address.length-16) + ',CANADA';
    }
    if (address.indexOf('NOVA SCOTIA') !== -1 && address.indexOf('NOVA SCOTIA') === address.length-11) {
        address = address + ',CANADA';
    }

    return address;
}
