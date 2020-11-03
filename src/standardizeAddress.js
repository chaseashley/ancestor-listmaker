export function standardizeAddress(address) {
    //formatting standardizations
    address = address.toUpperCase();
    address = address.replace(/  /g,' ');
    address = address.replace(/, /g,',');
    address = address.replace(/ ,/g,',');
    address = address.replace(/,,/g,',');
    address = address.replace(/\./g,'');

    //Australian standardizations
    if (address.indexOf('NEW SOUTH WALES') !== -1 && address.indexOf('NEW SOUTH WALES') === address.length-15) {
        address = address + 'AUSTRALIA';
    }
    if (address.indexOf('NWS') !== -1 && address.indexOf('NWS') === address.length-3) {
        address = address.substring(0,address.length-3) + 'NEW SOUTH WALES,AUSTRALIA';
    }
    if (address.indexOf('NWS,AUSTRALIA') !== -1 && address.indexOf('NWS,AUSTRALIA') === address.length-13) {
        address = address.substring(0,address.length-13) + 'NEW SOUTH WALES,AUSTRALIA';
    }
    if (address.indexOf('SOUTH AUSTRALIA') !== -1 && address.indexOf('SOUTH AUTRALIA') === address.length-15) {
        address = address + 'AUSTRALIA';
    }
    if (address.indexOf('VICTORIA') !== -1 && address.indexOf('VICTORIA') === address.length-8) {
        address = address + 'AUSTRALIA';
    }

    //Canada standardizations
    if (address.indexOf('BAS CANADA') !== -1 && address.indexOf('BAS CANADA') === address.length-10) {
        address = address.substring(0,address.length-10) + 'LOWER CANADA';
    }
    if (address.indexOf('BAS-CANADA') !== -1 && address.indexOf('BAS-CANADA') === address.length-10) {
        address = address.substring(0,address.length-10) + 'LOWER CANADA';
    }
    if (address.indexOf('NEW BRUNSWICK') !== -1 && address.indexOf('NEW BRUNSWICK') === address.length-13) {
        address = address + ',CANADA';
    }
    if (address.indexOf('NEWFOUNDLAND') !== -1 && address.indexOf('NEWFOUNDLAND') === address.length-12) {
        address = address + ',CANADA';
    }
    if (address.indexOf('NEWFOUNDLAND COLONY') !== -1 && address.indexOf('NEWFOUNDLAND COLONY') === address.length-19) {
        address = address.substring(0,address.length-19) + 'NEWFOUNDLAND,CANADA';
    }
    if (address.indexOf(',NOUVELLE-FRANCE') !== -1 && address.indexOf(',NOUVELLE-FRANCE') === address.length-16) {
        address = address.substring(0,address.length-16) + ',CANADA';
    }
    if (address.indexOf('NOVA SCOTIA') !== -1 && address.indexOf('NOVA SCOTIA') === address.length-11) {
        address = address + ',CANADA';
    }
    if (address.indexOf('NOVA SCOTIA COLONY') !== -1 && address.indexOf('NOVA SCOTIA COLONY') === address.length-18) {
        address = address.substring(0,address.length-18) + 'NOVA SCOTIA,CANADA';
    }
    if (address.indexOf('ONTARIO') !== -1 && address.indexOf('ONTARIO') === address.length-7) {
        address = address + ',CANADA';
    }
    if (address.indexOf('PROVINCE OF NEW BRUNSWICK') !== -1 && address.indexOf('PROVINCE OF NEW BRUNSWICK') === address.length-25) {
        address = address.substring(0,address.length-25) + 'NEW BRUNSWICK,CANADA';
    }
    if (address.indexOf('QUEBEC') !== -1 && address.indexOf('QUEBEC') === address.length-6) {
        address = address + ',CANADA';
    }
    if (address.indexOf('QUÉBEC') !== -1 && address.indexOf('QUÉBEC') === address.length-6) {
        address = address.substring(0,address.length-6) + 'QUEBEC,CANADA';;
    }
    if (address.indexOf('PROVINCE DE QUÉBEC') !== -1 && address.indexOf('PROVINCE DE QUÉBEC') === address.length-18) {
        address = address.substring(0,address.length-18) + 'QUEBEC,CANADA';;
    }

    //UK standardizations
    address = address.replace('ENGLAND,UNITED KINGDOM','ENGLAND');
    address = address.replace('ENGLAND,UK','ENGLAND');
    address = address.replace('SCOTLAND,UNITED KINGDOM','SCOTLAND');
    address = address.replace('SCOTLAND,UK','SCOTLAND');
    address = address.replace('WALES,UNITED KINGDOM','WALES');
    address = address.replace('WALES,UK','WALES');
    address = address.replace('NORTHERN IRELAND,UNITED KINGDOM','NORTHERN IRELAND');
    address = address.replace('NORTHERN IRELAND,UK','NORTHERN IRELAND');
    if (address.indexOf('ENG') !== -1 && address.indexOf('ENG') === address.length-3) {
        address = address.substring(0,address.length-3) + 'ENGLAND';
    }
    if (address.indexOf('BEDFORDSHIRE') !== -1 && address.indexOf('BEDFORDSHIRE') === address.length-12) {
        address = address + ',ENGLAND';
    }
    if (address.indexOf('BUCKINGHAMSHIRE') !== -1 && address.indexOf('BUCKINGHAMSHIRE') === address.length-15) {
        address = address + ',ENGLAND';
    }
    if (address.indexOf('CAMBRIDGESHIRE') !== -1 && address.indexOf('CAMBRIDGESHIRE') === address.length-14) {
        address = address + ',ENGLAND';
    }
    if (address.indexOf('CUMBERLANDSHIRE') !== -1 && address.indexOf('CUMBERLANDSHIRE') === address.length-15) {
        address = address + ',ENGLAND';
    }
    if (address.indexOf('DEVONSHIRE') !== -1 && address.indexOf('DEVONSHIRE') === address.length-10) {
        address = address + ',ENGLAND';
    }
    if (address.indexOf('DORSETSHIRE') !== -1 && address.indexOf('DORSETSHIRE') === address.length-11) {
        address = address + ',ENGLAND';
    }
    if (address.indexOf('DURHAMSHIRE') !== -1 && address.indexOf('DURHAMSHIRE') === address.length-11) {
        address = address + ',ENGLAND';
    }
    if (address.indexOf('ESSEXSHIRE') !== -1 && address.indexOf('ESSEXSHIRE') === address.length-10){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('GLOUCESTERSHIRE') !== -1 && address.indexOf('GLOUCESTERSHIRE') === address.length-15){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('HEREFORDSHIRE') !== -1 && address.indexOf('HEREFORDSHIRE') === address.length-13){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('HERTFORDSHIRE') !== -1 && address.indexOf('HERTFORDSHIRE') === address.length-13){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('HUNTINDONSHIRE') !== -1 && address.indexOf('HUNTINDONSHIRE') === address.length-14){
        address = address + ',ENGLAND';
    }
    if (address.indexOf(',KENT') !== -1 && address.indexOf(',KENT') === address.length-5){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('LANCASHIRE') !== -1 && address.indexOf('LANCASHIRE') === address.length-10){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('LEICESTERSHIRE') !== -1 && address.indexOf('LEICESTERSHIRE') === address.length-14){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('LINCOLNSHIRE') !== -1 && address.indexOf('LINCOLNSHIRE') === address.length-12){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('NORTHAMPTONSHIRE') !== -1 && address.indexOf('NORTHAMPTONSHIRE') === address.length-16){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('NORTHUMBERLAND') !== -1 && address.indexOf('NORTHUMBERLAND') === address.length-14){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('NOTTINGHAMSHIRE') !== -1 && address.indexOf('NOTTINGHAMSHIRE') === address.length-15){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('OXFORDSHIRE') !== -1 && address.indexOf('OXFORDSHIRE') === address.length-11){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('SHROPSHIRE') !== -1 && address.indexOf('SHROPSHIRE') === address.length-10){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('SOMERSETSHIRE') !== -1 && address.indexOf('SOMERSETSHIRE') === address.length-13){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('STAFFORDSHIRE') !== -1 && address.indexOf('STAFFORDSHIRE') === address.length-13){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('WARWICKSHIRE') !== -1 && address.indexOf('WARWICKSHIRE') === address.length-12){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('WILTSHIRE') !== -1 && address.indexOf('WILTSHIRE') === address.length-9){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('WORCESTERSHIRE') !== -1 && address.indexOf('WORCESTERSHIRE') === address.length-14){
        address = address + ',ENGLAND';
    }
    if (address.indexOf('YORKSHIRE') !== -1 && address.indexOf('YORKSHIRE') === address.length-9){
        address = address + ',ENGLAND';
    }

    if (address.indexOf(',ENGLAND') !== -1 && address.indexOf(',ENGLAND') === address.length-8) {
        address = address.replace('BEDFORDSHIRE COUNTY,','BEDFORDSHIRE,');
        address = address.replace('BEDFORDSHIRE CO,','BEDFORDSHIRE,');
        address = address.replace('BEDFORD COUNTY,','BEDFORDSHIRE,');
        address = address.replace('BEDFORD CO,','BEDFORDSHIRE,');
        address = address.replace('COUNTY BEDFORD,','BEDFORDSHIRE,');
        address = address.replace(',CO BEDFORD,',',BEDFORDSHIRE,');
        address = address.replace(',BEDS,',',BEDFORDSHIRE,');
        address = address.replace('COUNTY BEDS,','BEDFORDSHIRE,');
        address = address.replace(',CO BEDS,',',BEDFORDSHIRE,');
        address = address.replace(',BEDS COUNTY,',',BEDFORDSHIRE,');
        address = address.replace(',BEDS CO,',',BEDFORDSHIRE,');

        address = address.replace('BERKSHIRE COUNTY,','BERKSHIRE,');
        address = address.replace('BERKSHIRE CO,','BERKSHIRE,');
        address = address.replace(',BERKS,',',BERKSHIRE,');
        address = address.replace(',BERKS COUNTY,',',BERKSHIRE,');
        address = address.replace(',BERKS CO,',',BERKSHIRE,');
        address = address.replace('COUNTY BERKS,','BERKSHIRE,');
        address = address.replace(',CO BERKS,',',BERKSHIRE,');

        address = address.replace('BUCKINGHAMSHIRE COUNTY,','BUCKINGHAMSHIRE,');
        address = address.replace('BUCKINGHAMSHIRE CO,','BUCKINGHAMSHIRE,');
        address = address.replace('BUCKINGHAM COUNTY,','BUCKINGHAMSHIRE,');
        address = address.replace('BUCKINGHAM CO,','BUCKINGHAMSHIRE,');
        address = address.replace('COUNTY BUCKINGHAM,','BUCKINGHAMSHIRE,');
        address = address.replace(',CO BUCKINGHAM,',',BUCKINGHAMSHIRE,');
        address = address.replace(',BUCKS,',',BUCKINGHAMSHIRE,');
        address = address.replace(',BUCKS COUNTY,',',BUCKINGHAMSHIRE,');
        address = address.replace(',BUCKS CO,',',BUCKINGHAMSHIRE,');
        address = address.replace('COUNTY BUCKS,','BUCKINGHAMSHIRE,');
        address = address.replace(',CO BUCKS,',',BUCKINGHAMSHIRE,');

        address = address.replace(',CAMBS,',',CAMBRIDGESHIRE,');
        address = address.replace(',CAMBS COUNTY,',',CAMBRIDGESHIRE,');
        address = address.replace(',CAMBS CO,',',CAMBRIDGESHIRE,');
        address = address.replace('COUNTY CAMBS,','CAMBRIDGESHIRE,');
        address = address.replace(',CO CAMBS,',',CAMBRIDGESHIRE,');

        address = address.replace('CHESHIRE COUNTY,','CHESHIRE,');
        address = address.replace('CHESHIRE CO,','CHESHIRE,');
        address = address.replace('COUNTY CHESHIRE,','CHESHIRE,');
        address = address.replace(',CO CHESHIRE,',',CHESHIRE,');

        address = address.replace('CORNWALL COUNTY,','CORNWALL,');
        address = address.replace('CORNWALL CO,','CORNWALL,');
        address = address.replace('COUNTY CORNWALL,','CORNWALL,');
        address = address.replace(',CO CORNWALL,',',CORNWALL,');

        address = address.replace('CUMBERLANDSHIRE,','CUMBERLAND,');
        address = address.replace('CUMBERLAND COUNTY,','CUMBERLAND,');
        address = address.replace('CUMBERLAND CO,','CUMBERLAND,');
        address = address.replace('COUNTY CUMBERLAND,','CUMBERLAND,');
        address = address.replace(',CUMB,',',CUMBERLAND,');
        address = address.replace(',CUMB COUNTY,',',CUMBERLAND,');
        address = address.replace(',CUMB CO,',',CUMBERLAND,');
        address = address.replace(',CO CUMB,',',CUMBERLAND,');

        address = address.replace('DEVONSHIRE,','DEVON,');
        address = address.replace(',DEVON COUNTY,',',DEVON,');
        address = address.replace(',DEVON CO,',',DEVON,');
        address = address.replace('COUNTY DEVON,','DEVON,');
        address = address.replace(',CO DEVON,',',DEVON,');

        address = address.replace('DORSETSHIRE,','DORSET,');
        address = address.replace('DORSET COUNTY,','DORSET,');
        address = address.replace(',DORSET CO,',',DORSET,');
        address = address.replace('COUNTY DORSET,','DORSET,');
        address = address.replace(',CO DORSET,',',DORSET,');

        address = address.replace('DURHAMSHIRE,','DURHAM,');
        address = address.replace('DURHAM COUNTY,','DURHAM,');
        address = address.replace(',DURHAM CO,',',DURHAM,');
        address = address.replace('COUNTY DURHAM,','DURHAM,');
        address = address.replace(',CO DURHAM,',',DURHAM,');

        address = address.replace('ESSEXSHIRE,','ESSEX,');
        address = address.replace(',ESSEX COUNTY,',',ESSEX,');
        address = address.replace(',ESSEX CO,',',ESSEX,');
        address = address.replace('COUNTY ESSEX,','ESSEX,');
        address = address.replace(',CO ESSEX,',',ESSEX,');

        address = address.replace(',GLOUCS,',',GLOUCESTERSHIRE,');
        address = address.replace('GLOUCS COUNTY',',GLOUCESTERSHIRE,');
        address = address.replace(',GLOUCS CO,',',GLOUCESTERSHIRE,');
        address = address.replace('COUNTY GLOUCS,','GLOUCESTERSHIRE,');
        address = address.replace(',CO GLOUCS,',',GLOUCESTERSHIRE,');

        address = address.replace('HAMPSHIRE COUNTY,','HAMPSHIRE,');
        address = address.replace('HAMPSHIRE CO,','HAMPSHIRE,');
        address = address.replace(',CO HAMPSHIRE,',',HAMPSHIRE,');
        address = address.replace(',HANTS,',',HAMPSHIRE,');
        address = address.replace(',HANTS COUNTY,',',HAMPSHIRE,');
        address = address.replace(',HANTS CO,',',HAMPSHIRE,');
        address = address.replace('COUNTY HANTS,','HAMPSHIRE,');
        address = address.replace(',CO HANTS,',',HAMPSHIRE,');

        address = address.replace('HEREFORDSHIRE COUNTY,','HEREFORDSHIRE,');
        address = address.replace('HEREFORDSHIRE CO,','HEREFORDSHIRE,');
        address = address.replace('HEREFORD COUNTY,','HEREFORDSHIRE,');
        address = address.replace('HEREFORD CO,','HEREFORDSHIRE,');
        address = address.replace('COUNTY HEREFORD,','HEREFORDSHIRE,');
        address = address.replace(',CO HEREFORD,',',HEREFORDSHIRE,');
        address = address.replace(',HERE,',',HEREFORDSHIRE,');
        address = address.replace(',HERE COUNTY,',',HEREFORDSHIRE,');
        address = address.replace(',HERE CO,',',HEREFORDSHIRE,');
        address = address.replace(',COUNTY HERE,',',HEREFORDSHIRE,');
        address = address.replace(',CO HERE,',',HEREFORDSHIRE,');

        address = address.replace('HERTFORDSHIRE COUNTY,','HERTFORDSHIRE,');
        address = address.replace('HERTFORDSHIRE CO,','HERTFORDSHIRE,');
        address = address.replace('HERTFORD COUNTY,','HERTFORDSHIRE,');
        address = address.replace('HERTFORD CO,','HERTFORDSHIRE,');
        address = address.replace('COUNTY HERTFORD,','HERTFORDSHIRE,');
        address = address.replace(',CO HERTFORD,',',HERTFORDSHIRE,');
        address = address.replace(',HERTS,',',HERTFORDSHIRE,');
        address = address.replace(',HERTS COUNTY,',',HERTFORDSHIRE,');
        address = address.replace(',HERTS CO,',',HERTFORDSHIRE,');
        address = address.replace('COUNTY HERTS,','HERTFORDSHIRE,');
        address = address.replace(',CO HERTS,',',HERTFORDSHIRE,');

        address = address.replace('HUNTINGDONSHIRE COUNTY,','HUNTINGDONSHIRE,');
        address = address.replace('HUNTINGDONSHIRE CO,','HUNTINGDONSHIRE,');
        address = address.replace('HUNTINGDON COUNTY,','HUNTINGDONSHIRE,');
        address = address.replace('HUNTINGDON CO,','HUNTINGDONSHIRE,');
        address = address.replace('COUNTY HUNTINGDON,','HUNTINGDONSHIRE,');
        address = address.replace(',CO HUNTINGDON,',',HUNTINGDONSHIRE,');
        address = address.replace(',HUNTS,',',HUNTINGDONSHIRE,');
        address = address.replace(',HUNTS COUNTY,',',HUNTINGDONSHIRE,');
        address = address.replace(',HUNTS CO,',',HUNTINGDONSHIRE,');
        address = address.replace('COUNTY HUNTS,','HUNTINGDONSHIRE,');
        address = address.replace(',CO HUNTS,',',HUNTINGDONSHIRE,');


        address = address.replace('KENT COUNTY,','KENT,');
        address = address.replace(',KENT CO,',',KENT,');
        address = address.replace('COUNTY KENT,','KENT,');
        address = address.replace(',CO KENT,',',KENT,');

        address = address.replace('NORFOLKSHIRE,','NORFOLK,');
        address = address.replace('COUNTY NORFOLK,','NORFOLK,');
        address = address.replace(',CO NORFOLK,',',NORFOLK,',);

        address = address.replace(',NOTTS,',',NOTTINGHAMSHIRE,');

        address = address.replace('RUTLANDSHIRE,','RUTLAND,');
        address = address.replace('COUNTY RUTLAND,','RUTLAND,');
        address = address.replace(',CO RUTLAND,',',RUTLAND,');
        address = address.replace('RUTLAND COUNTY,','RUTLAND,');
        address = address.replace('RUTLAND CO,','RUTLAND,');

        address = address.replace('SOMERSETSHIRE,','SOMERSET,');
        address = address.replace('COUNTY SOMERSET,','SOMERSET,');
        address = address.replace(',CO SOMERSET,',',SOMERSET,');
        address = address.replace('SOMERSET COUNTY,','SOMERSET,');
        address = address.replace('SOMERSET CO,','SOMERSET,');

        address = address.replace('SUFFOLKSHIRE,','SUFFOLK,');
        address = address.replace('COUNTY SUFFOLK,','SUFFOLK,');
        address = address.replace(',CO SUFFOLK,',',SUFFOLK,');
        address = address.replace('SUFFOLK COUNTY,','SUFFOLK,');
        address = address.replace('SUFFOLK CO,','SUFFOLK,');

        address = address.replace('WORCESTERSHIRE COUNTY,','WORCESTERSHIRE,');
        address = address.replace('WORCESTERSHIRE CO,','WORCESTERSHIRE,');
        address = address.replace('WORCESTER COUNTY,','WORCESTERSHIRE,');
        address = address.replace('WORCESTER CO,','WORCESTERSHIRE,');
        address = address.replace('COUNTY WORCESTER,','WORCESTERSHIRE,');
        address = address.replace(',CO WORCESTER,',',WORCESTERSHIRE,');
    }
    
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
        address = address.substring(0,address.length-25) + 'USA';
    }
    if (address.indexOf(',BRITISH AMERICA') !== -1 && address.indexOf(',BRITISH AMERICA') === address.length-16) {
        address = address.substring(0,address.length-16) + 'USA';
    }
    if (address.indexOf(',COLONIAL AMERICA') !== -1 && address.indexOf(',COLONIAL AMERICA') === address.length-17) {
        address = address.substring(0,address.length-17) + 'USA';
    }
    if (address.indexOf(',AMERICAN COLONIES') !== -1 && address.indexOf(',AMERICAN COLONIES') === address.length-18) {
        address = address.substring(0,address.length-18) + 'USA';
    }
    if (address.indexOf(',AMERICA') !== -1 && address.indexOf(',AMERICA') === address.length-8) {
        address = address.substring(0,address.length-8);
    }
    address = address.replace(',PLYMOUTH COLONY',',MASSACHUSETTS');
    address = address.replace('MASS BAY COLONY','MASSACHUSETTS BAY COLONY');
    if (address.indexOf('MASSACHUSETTS BAY COLONY') === -1) {
        address = address.replace(',MASSACHUSETTS BAY',',MASSACHUSETTS BAY COLONY');
    }
    address = address.replace('MASSACHUSETTS COLONY','MASSACHUSETTS BAY COLONY');
    address = address.replace('COLONY OF MASSACHUSETTS','MASSACHUSETTS BAY COLONY');
    address = address.replace(',MASSACHUSETTS BAY COLONY',',MASSACHUSETTS');
    address = address.replace('PROVINCE OF MASSACHUSETTS BAY','MASSACHUSETTS');
    address = address.replace('MASSACHUSETTS BAY PROVINCE','MASSACHUSETTS');
    address = address.replace('PROVINCE OF MASSACHUSETTS','MASSACHUSETTS');
    address = address.replace('DOMINION OF NEW ENGLAND','MASSACHUSETTS');
    address = address.replace('PROVINCE OF NEW HAMPSHIRE','NEW HAMPSHIRE');
    address = address.replace('PROVINCE OF MAINE','MAINE');
    address = address.replace('DISTRICT OF MAINE','MAINE');
    address = address.replace('COLONY OF RHODE ISLAND AND PROVIDENCE PLANTATIONS','RHODE ISLAND');
    address = address.replace('COLONY OF RHODE ISLAND AND PROVIDENCE PLANTATION','RHODE ISLAND');
    address = address.replace('PROVINCE OF RHODE ISLAND','RHODE ISLAND');
    address = address.replace('COLONY OF RHODE ISLAND','RHODE ISLAND');
    address = address.replace('NEW HAVEN COLONY','CONNECTICUT');
    address = address.replace('COLONY OF NEW HAVEN','CONNECTICUT');
    address = address.replace('NEW LONDON COLONY','CONNECTICUT');
    address = address.replace('COLONY OF NEW LONDON','CONNECTICUT');
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
    if (address.indexOf('ALABAMA') !== -1 && address.indexOf('ALABAMA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf(',AL') !== -1 && address.indexOf(',AL') === address.length-3) {
        address = address.substring(0,address.length-3) + ',ALABAMA,USA';
    }
    if (address.indexOf(',AL,USA') !== -1 && address.indexOf(',AL,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',ALABAMA,USA';
    }
    if (address.indexOf('ALASKA') !== -1 && address.indexOf('ALASKA') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf(',AK') !== -1 && address.indexOf(',AK') === address.length-3) {
        address = address.substring(0,address.length-3) + ',ALASKA,USA';
    }
    if (address.indexOf(',AK,USA') !== -1 && address.indexOf(',AK,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',ALASKA,USA';
    }
    if (address.indexOf('ARIZONA') !== -1 && address.indexOf('ARIZONA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf(',AZ') !== -1 && address.indexOf(',AZ') === address.length-3) {
        address = address.substring(0,address.length-3) + ',ARIZONA,USA';
    }
    if (address.indexOf(',AZ,USA') !== -1 && address.indexOf(',AZ,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',ARIZONA,USA';
    }
    if (address.indexOf('CALIFORNIA') !== -1 && address.indexOf('CALIFORNIA') === address.length-10) {
        address = address + ',USA';
    }
    if (address.indexOf(',CA') !== -1 && address.indexOf(',CA') === address.length-3) {
        address = address.substring(0,address.length-3) + ',CALIFORNIA,USA';
    }
    if (address.indexOf(',CA,USA') !== -1 && address.indexOf(',CA,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',CALIFORNIA,USA';
    }
    if (address.indexOf('COLORADO') !== -1 && address.indexOf('COLORADO') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',CO') !== -1 && address.indexOf(',CO') === address.length-3) {
        address = address.substring(0,address.length-3) + ',COLORADO,USA';
    }
    if (address.indexOf(',CO,USA') !== -1 && address.indexOf(',CO,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',COLORADO,USA';
    }
    if (address.indexOf('CONNECTICUT') !== -1 && address.indexOf('CONNECTICUT') === address.length-11) {
        address = address + ',USA';
    }
    if (address.indexOf(',CT') !== -1 && address.indexOf(',CT') === address.length-3) {
        address = address.substring(0,address.length-3) + ',CONNECTICUT,USA';
    }
    if (address.indexOf(',CT,USA') !== -1 && address.indexOf(',CT,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',CONNECTICUT,USA';
    }
    if (address.indexOf('DELAWARE') !== -1 && address.indexOf('DELAWARE') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',DE') !== -1 && address.indexOf(',DE') === address.length-3) {
        address = address.substring(0,address.length-3) + ',DELAWARE,USA';
    }
    if (address.indexOf(',DE,USA') !== -1 && address.indexOf(',DE,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',DELAWARE,USA';
    }
    if (address.indexOf('FLORIDA') !== -1 && address.indexOf('FLORIDA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf(',FL') !== -1 && address.indexOf(',FL') === address.length-3) {
        address = address.substring(0,address.length-3) + ',FLORIDA,USA';
    }
    if (address.indexOf(',FL,USA') !== -1 && address.indexOf(',FL,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',FLORIDA,USA';
    }
    if (address.indexOf('GEORGIA') !== -1 && address.indexOf('GEORGIA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf(',GA') !== -1 && address.indexOf(',GA') === address.length-3) {
        address = address.substring(0,address.length-3) + ',GEORGIA,USA';
    }
    if (address.indexOf(',GA,USA') !== -1 && address.indexOf(',GA,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',GEORGIA,USA';
    }
    if (address.indexOf('HAWAII') !== -1 && address.indexOf('HAWAII') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf(',HI') !== -1 && address.indexOf(',HI') === address.length-3) {
        address = address.substring(0,address.length-3) + ',HAWAII,USA';
    }
    if (address.indexOf(',HI,USA') !== -1 && address.indexOf(',HI,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',HAWAII,USA';
    }
    if (address.indexOf('IDAHO') !== -1 && address.indexOf('IDAHO') === address.length-5) {
        address = address + ',USA';
    }
    if (address.indexOf(',ID') !== -1 && address.indexOf(',ID') === address.length-3) {
        address = address.substring(0,address.length-3) + ',IDAHO,USA';
    }
    if (address.indexOf(',ID,USA') !== -1 && address.indexOf(',ID,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',IDAHO,USA';
    }
    if (address.indexOf('ILLINOIS') !== -1 && address.indexOf('ILLINOIS') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',IL') !== -1 && address.indexOf(',IL') === address.length-3) {
        address = address.substring(0,address.length-3) + ',ILLINOIS,USA';
    }
    if (address.indexOf(',IL,USA') !== -1 && address.indexOf(',IL,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',ILLINOIS,USA';
    }
    if (address.indexOf('INDIANA') !== -1 && address.indexOf('INDIANA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf(',IN') !== -1 && address.indexOf(',IN') === address.length-3) {
        address = address.substring(0,address.length-3) + ',INDIANA,USA';
    }
    if (address.indexOf(',IN,USA') !== -1 && address.indexOf(',IN,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',INDIANA,USA';
    }
    if (address.indexOf('IOWA') !== -1 && address.indexOf('IOWA') === address.length-4) {
        address = address + ',USA';
    }
    if (address.indexOf(',IA') !== -1 && address.indexOf(',IA') === address.length-3) {
        address = address.substring(0,address.length-3) + ',IOWA,USA';
    }
    if (address.indexOf(',IA,USA') !== -1 && address.indexOf(',IA,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',IOWA,USA';
    }
    if (address.indexOf('KANSAS') !== -1 && address.indexOf('KANSAS') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf(',KS') !== -1 && address.indexOf(',KS') === address.length-3) {
        address = address.substring(0,address.length-3) + ',KANSAS,USA';
    }
    if (address.indexOf(',KS,USA') !== -1 && address.indexOf(',KS,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',KANSAS,USA';
    }
    if (address.indexOf('KENTUCKY') !== -1 && address.indexOf('KENTUCKY') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',KY') !== -1 && address.indexOf(',KY') === address.length-3) {
        address = address.substring(0,address.length-3) + ',KENTUCKY,USA';
    }
    if (address.indexOf(',KY,USA') !== -1 && address.indexOf(',KY,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',KENTUCKY,USA';
    }
    if (address.indexOf('LOUISIANA') !== -1 && address.indexOf('LOUISIANA') === address.length-9) {
        address = address + ',USA';
    }
    if (address.indexOf(',LA') !== -1 && address.indexOf(',LA') === address.length-3) {
        address = address.substring(0,address.length-3) + ',LOUISIANA,USA';
    }
    if (address.indexOf(',LA,USA') !== -1 && address.indexOf(',LA,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',LOUISIANA,USA';
    }
    if (address.indexOf('MAINE') !== -1 && address.indexOf('MAINE') === address.length-5) {
        address = address + ',USA';
    }
    if (address.indexOf(',ME') !== -1 && address.indexOf(',ME') === address.length-3) {
        address = address.substring(0,address.length-3) + ',MAINE,USA';
    }
    if (address.indexOf(',ME,USA') !== -1 && address.indexOf(',ME,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',MAINE,USA';
    }
    if (address.indexOf('MARYLAND') !== -1 && address.indexOf('MARYLAND') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',MD') !== -1 && address.indexOf(',MD') === address.length-3) {
        address = address.substring(0,address.length-3) + ',MARYLAND,USA';
    }
    if (address.indexOf(',MD,USA') !== -1 && address.indexOf(',MD,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',MARYLAND,USA';
    }
    if (address.indexOf('MASSACHUSETTS') !== -1 && address.indexOf('MASSACHUSETTS') === address.length-13) {
        address = address + ',USA';
    }
    if (address.indexOf(',MA') !== -1 && address.indexOf(',MA') === address.length-3) {
        address = address.substring(0,address.length-3) + ',MASSACHUSETTS,USA';
    }
    if (address.indexOf(',MA,USA') !== -1 && address.indexOf(',MA,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',MASSACHUSETTS,USA';
    }
    if (address.indexOf('MICHIGAN') !== -1 && address.indexOf('MICHIGAN') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',MI') !== -1 && address.indexOf(',MI') === address.length-3) {
        address = address.substring(0,address.length-3) + ',MICHIGAN,USA';
    }
    if (address.indexOf(',MI,USA') !== -1 && address.indexOf(',MI,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',MICHIGAN,USA';
    }
    if (address.indexOf('MINNESOTA') !== -1 && address.indexOf('MINNESOTA') === address.length-9) {
        address = address + ',USA';
    }
    if (address.indexOf(',MN') !== -1 && address.indexOf(',MN') === address.length-3) {
        address = address.substring(0,address.length-3) + ',MINNESOTA,USA';
    }
    if (address.indexOf(',MN,USA') !== -1 && address.indexOf(',MN,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',MINNESOTA,USA';
    }
    if (address.indexOf('MISSISSIPPI') !== -1 && address.indexOf('MISSISSIPPI') === address.length-11) {
        address = address + ',USA';
    }
    if (address.indexOf(',MS') !== -1 && address.indexOf(',MS') === address.length-3) {
        address = address.substring(0,address.length-3) + ',MISSISSIPPI,USA';
    }
    if (address.indexOf(',MS,USA') !== -1 && address.indexOf(',MS,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',MISSISSIPPI,USA';
    }
    if (address.indexOf('MISSOURI') !== -1 && address.indexOf('MISSOURI') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',MO') !== -1 && address.indexOf(',MO') === address.length-3) {
        address = address.substring(0,address.length-3) + ',MISSOURI,USA';
    }
    if (address.indexOf(',MO,USA') !== -1 && address.indexOf(',MO,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',MISSOURI,USA';
    }
    if (address.indexOf('MONTANA') !== -1 && address.indexOf('MONTANA') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf(',MT') !== -1 && address.indexOf(',MT') === address.length-3) {
        address = address.substring(0,address.length-3) + ',MONTANA,USA';
    }
    if (address.indexOf(',MT,USA') !== -1 && address.indexOf(',MT,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',MONTANA,USA';
    }
    if (address.indexOf('NEBRASKA') !== -1 && address.indexOf('NEBRASKA') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',NE') !== -1 && address.indexOf(',NE') === address.length-3) {
        address = address.substring(0,address.length-3) + ',NEBRASKA,USA';
    }
    if (address.indexOf(',NE,USA') !== -1 && address.indexOf(',NE,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',NEBRASKA,USA';
    }
    if (address.indexOf('NEVADA') !== -1 && address.indexOf('NEVADA') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf(',NV') !== -1 && address.indexOf(',NV') === address.length-3) {
        address = address.substring(0,address.length-3) + ',NEVADA,USA';
    }
    if (address.indexOf(',NV,USA') !== -1 && address.indexOf(',NV,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',NEVADA,USA';
    }
    if (address.indexOf('NEW HAMPSHIRE') !== -1 && address.indexOf('NEW HAMPSHIRE') === address.length-13) {
        address = address + ',USA';
    }
    if (address.indexOf(',NH') !== -1 && address.indexOf(',NH') === address.length-3) {
        address = address.substring(0,address.length-3) + ',NEW HAMPSHIRE,USA';
    }
    if (address.indexOf(',NH,USA') !== -1 && address.indexOf(',NH,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',NEW HAMPSHIRE,USA';
    }
    if (address.indexOf('NEW JERSEY') !== -1 && address.indexOf('NEW JERSEY') === address.length-10) {
        address = address + ',USA';
    }
    if (address.indexOf(',NJ') !== -1 && address.indexOf(',NJ') === address.length-3) {
        address = address.substring(0,address.length-3) + ',NEW JERSEY,USA';
    }
    if (address.indexOf(',NJ,USA') !== -1 && address.indexOf(',NJ,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',NEW JERSEY,USA';
    }
    if (address.indexOf('NEW MEXICO') !== -1 && address.indexOf('NEW MEXICO') === address.length-10) {
        address = address + ',USA';
    }
    if (address.indexOf(',NM') !== -1 && address.indexOf(',NM') === address.length-3) {
        address = address.substring(0,address.length-3) + ',NEW MEXICO,USA';
    }
    if (address.indexOf(',NM,USA') !== -1 && address.indexOf(',NM,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',NEW MEXICO,USA';
    }
    if (address.indexOf('NEW YORK') !== -1 && address.indexOf('NEW YORK') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',NY') !== -1 && address.indexOf(',NY') === address.length-3) {
        address = address.substring(0,address.length-3) + ',NEW YORK,USA';
    }
    if (address.indexOf(',NY,USA') !== -1 && address.indexOf(',NY,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',NEW YORK,USA';
    }
    if (address.indexOf('NORTH CAROLINA') !== -1 && address.indexOf('NORTH CAROLINA') === address.length-14) {
        address = address + ',USA';
    }
    if (address.indexOf(',NC') !== -1 && address.indexOf(',NC') === address.length-3) {
        address = address.substring(0,address.length-3) + ',NORTH CAROLINA,USA';
    }
    if (address.indexOf(',NC,USA') !== -1 && address.indexOf(',NC,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',NORTH CAROLINA,USA';
    }
    if (address.indexOf('NORTH DAKOTA') !== -1 && address.indexOf('NORTH DAKOTA') === address.length-12) {
        address = address + ',USA';
    }
    if (address.indexOf(',ND') !== -1 && address.indexOf(',ND') === address.length-3) {
        address = address.substring(0,address.length-3) + ',NORTH DAKOTA,USA';
    }
    if (address.indexOf(',ND,USA') !== -1 && address.indexOf(',ND,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',NORTH DAKOTA,USA';
    }
    if (address.indexOf('OHIO') !== -1 && address.indexOf('OHIO') === address.length-4) {
        address = address + ',USA';
    }
    if (address.indexOf(',OH') !== -1 && address.indexOf(',OH') === address.length-3) {
        address = address.substring(0,address.length-3) + ',OHIO,USA';
    }
    if (address.indexOf(',OH,USA') !== -1 && address.indexOf(',OH,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',OHIO,USA';
    }
    if (address.indexOf('OKLAHOMA') !== -1 && address.indexOf('OKLAHOMA') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',OK') !== -1 && address.indexOf(',OK') === address.length-3) {
        address = address.substring(0,address.length-3) + ',OKLAHOMA,USA';
    }
    if (address.indexOf(',OK,USA') !== -1 && address.indexOf(',OK,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',OKLAHOMA,USA';
    }
    if (address.indexOf('OREGON') !== -1 && address.indexOf('OREGON') === address.length-6) {
        address = address + ',USA';
    }
    if (address.indexOf(',OR') !== -1 && address.indexOf(',OR') === address.length-3) {
        address = address.substring(0,address.length-3) + ',OREGON,USA';
    }
    if (address.indexOf(',OR,USA') !== -1 && address.indexOf(',OR,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',OREGON,USA';
    }
    if (address.indexOf('PENNSYLVANIA') !== -1 && address.indexOf('PENNSYLVANIA') === address.length-12) {
        address = address + ',USA';
    }
    if (address.indexOf(',PA') !== -1 && address.indexOf(',PA') === address.length-3) {
        address = address.substring(0,address.length-3) + ',PENNSYLVANIA,USA';
    }
    if (address.indexOf(',PA,USA') !== -1 && address.indexOf(',PA,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',PENNSYLVANIA,USA';
    }
    if (address.indexOf('RHODE ISLAND') !== -1 && address.indexOf('RHODE ISLAND') === address.length-12) {
        address = address + ',USA';
    }
    if (address.indexOf(',RI') !== -1 && address.indexOf(',RI') === address.length-3) {
        address = address.substring(0,address.length-3) + ',RHODE ISLAND,USA';
    }
    if (address.indexOf(',RI,USA') !== -1 && address.indexOf(',RI,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',RHODE ISLAND,USA';
    }
    if (address.indexOf('SOUTH CAROLINA') !== -1 && address.indexOf('SOUTH CAROLINA') === address.length-14) {
        address = address + ',USA';
    }
    if (address.indexOf(',SC') !== -1 && address.indexOf(',SC') === address.length-3) {
        address = address.substring(0,address.length-3) + ',SOUTH CAROLINA,USA';
    }
    if (address.indexOf(',SC,USA') !== -1 && address.indexOf(',SC,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',SOUTH CAROLINA,USA';
    }
    if (address.indexOf('SOUTH DAKOTA') !== -1 && address.indexOf('SOUTH DAKOTA') === address.length-12) {
        address = address + ',USA';
    }
    if (address.indexOf(',SD') !== -1 && address.indexOf(',SD') === address.length-3) {
        address = address.substring(0,address.length-3) + ',SOUTH DAKOTA,USA';
    }
    if (address.indexOf(',SD,USA') !== -1 && address.indexOf(',SD,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',SOUTH DAKOTA,USA';
    }
    if (address.indexOf('TENNESSEE') !== -1 && address.indexOf('TENNESSEE') === address.length-9) {
        address = address + ',USA';
    }
    if (address.indexOf(',TN') !== -1 && address.indexOf(',TN') === address.length-3) {
        address = address.substring(0,address.length-3) + ',TENNESSEE,USA';
    }
    if (address.indexOf(',TN,USA') !== -1 && address.indexOf(',TN,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',TENNESSEE,USA';
    }
    if (address.indexOf('TEXAS') !== -1 && address.indexOf('TEXAS') === address.length-5) {
        address = address + ',USA';
    }
    if (address.indexOf(',TX') !== -1 && address.indexOf(',TX') === address.length-3) {
        address = address.substring(0,address.length-3) + ',TEXAS,USA';
    }
    if (address.indexOf(',TX,USA') !== -1 && address.indexOf(',TX,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',TEXAS,USA';
    }
    if (address.indexOf('UTAH') !== -1 && address.indexOf('UTAH') === address.length-4) {
        address = address + ',USA';
    }
    if (address.indexOf(',UT') !== -1 && address.indexOf(',UT') === address.length-3) {
        address = address.substring(0,address.length-3) + ',UTAH,USA';
    }
    if (address.indexOf(',UT,USA') !== -1 && address.indexOf(',UT,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',UTAH,USA';
    }
    if (address.indexOf('VERMONT') !== -1 && address.indexOf('VERMONT') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf(',VT') !== -1 && address.indexOf(',VT') === address.length-3) {
        address = address.substring(0,address.length-3) + ',VERMONT,USA';
    }
    if (address.indexOf(',VT,USA') !== -1 && address.indexOf(',VT,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',VERMONT,USA';
    }
    if (address.indexOf('VIRGINIA') !== -1 && address.indexOf('VIRGINIA') === address.length-8) {
        address = address + ',USA';
    }
    if (address.indexOf(',VA') !== -1 && address.indexOf(',VA') === address.length-3) {
        address = address.substring(0,address.length-3) + ',VIRGINIA,USA';
    }
    if (address.indexOf(',VA,USA') !== -1 && address.indexOf(',VA,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',VIRGINIA,USA';
    }
    if (address.indexOf('WASHINGTON') !== -1 && address.indexOf('WASHINGTON') === address.length-10) {
        address = address + ',USA';
    }
    if (address.indexOf(',WA') !== -1 && address.indexOf(',WA') === address.length-3) {
        address = address.substring(0,address.length-3) + ',WASHINGTON,USA';
    }
    if (address.indexOf(',WA,USA') !== -1 && address.indexOf(',WA,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',WASHINGTON,USA';
    }
    if (address.indexOf('WEST VIRGINIA') !== -1 && address.indexOf('WEST VIRGINIA') === address.length-13) {
        address = address + ',USA';
    }
    if (address.indexOf(',WV') !== -1 && address.indexOf(',WV') === address.length-3) {
        address = address.substring(0,address.length-3) + ',WEST VIRGINIA,USA';
    }
    if (address.indexOf(',WV,USA') !== -1 && address.indexOf(',WV,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',WEST VIRGINIA,USA';
    }
    if (address.indexOf('WISCONSIN') !== -1 && address.indexOf('WISCONSIN') === address.length-9) {
        address = address + ',USA';
    }
    if (address.indexOf(',WI') !== -1 && address.indexOf(',WI') === address.length-3) {
        address = address.substring(0,address.length-3) + ',WISCONSIN,USA';
    }
    if (address.indexOf(',WI,USA') !== -1 && address.indexOf(',WI,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',WISCONSIN,USA';
    }
    if (address.indexOf('WYOMING') !== -1 && address.indexOf('WYOMING') === address.length-7) {
        address = address + ',USA';
    }
    if (address.indexOf(',WY') !== -1 && address.indexOf(',WY') === address.length-3) {
        address = address.substring(0,address.length-3) + ',WYOMING,USA';
    }
    if (address.indexOf(',WY,USA') !== -1 && address.indexOf(',WY,USA') === address.length-7) {
        address = address.substring(0,address.length-7) + ',WYOMING,USA';
    }
    if (address.indexOf(',USA') !== -1 && address.indexOf(',USA') === address.length-4) {
        if (address.indexOf(' COUNTY,') !== -1) {
            let end = address.indexOf(' COUNTY,');
            let front = address.substring(0,end);
            if (front.indexOf(',') !== -1) {
                address = address.replace(' COUNTY,',',');
            }
        }
        if (address.indexOf(' CO,') !== -1) {
            let end = address.indexOf(' CO,');
            let front = address.substring(0,end);
            if (front.indexOf(',') !== -1) {
                address = address.replace(' CO,',',');
            }
        }
    }

    return address;
}
