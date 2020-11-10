import React from 'react';
import StaticMarkers from './StaticMarkers';
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import styles from './mapOverlayItemsStyles.module.css';
import { adjustOverlappingMarkerCoordinates } from './overlappingMarkers';
import GenerationLines from './GenerationLines';
import ToggleButton from './ToggleButton';
import { removeDuplicates} from './filters';
import Dropdown from 'react-dropdown';
import { sortByName } from './sort';
import { Link } from "react-router-dom";
import { Marker } from '@react-google-maps/api';

///// slider constants ///////
const dotStyle = {
    width: "2px",
    height: "1.5em",
    border: 0,
    backgroundColor: "#848484",
    bottom: "-11px"
};
  
const handleStyle = {
    border: "solid 3px #FFCA3E",
    height: "1.5em",
    width: "1.5em",
    marginTop: "-9px"
};
  
const trackStyle = [{
    backgroundColor: "#FFCA3E",
    borderRadius: 0,
    height: "0.5em"
}];
  
///////

const pauseDivStyle = {
    left: "35px",
    width: "20px",
    height: "20px",
    margin: 0,
    position: "fixed",
    bottom: "25px"
}

const reverseDivStyle = {
    left: "20px",
    width: "20px",
    height: "20px",
    margin: 0,
    position: "fixed",
    bottom: "25px"
}

const playDivStyle = {
    left: "45px",
    width: "20px",
    height: "20px",
    margin: 0,
    position: "fixed",
    bottom: "25px"
}

const speedWrapperStyle = {
    left: "72px",
    width: "10px",
    height: "40px",
    margin: 0,
    position: "fixed",
    bottom: "15px"
}

const speedTrackStyle = [{
    backgroundColor: "#6d6ed1",
    borderRadius: 0,
    height: "0.5em"
}];

const speedHandleStyle = {
    border: "solid 5px #4f4f4f",
    height: "0.2em",
    left: "2px",
    width: "1.25em",
    marginTop: "-9px"
};
  
class MapOverlayItems extends React.Component {

    constructor(props) {
        super(props);
        this.fixCancelClick = this.fixCancelClick.bind(this);
        this.onDragEndHandler = this.onDragEndHandler.bind(this);
        this.linkedAncestorClicked = this.linkedAncestorClicked.bind(this);
        this.linkedAncestorCloseClicked = this.linkedAncestorCloseClicked.bind(this);
        this.onBClickCallback = this.onBClickCallback.bind(this);
        this.onBCloseClickCallback = this.onBCloseClickCallback.bind(this);
        this.onDClickCallback = this.onDClickCallback.bind(this);
        this.onDCloseClickCallback = this.onDCloseClickCallback.bind(this);
        this.getFather = this.getFather.bind(this);
        this.getMother = this.getMother.bind(this);
        this.ancestorVisible = this.ancestorVisible.bind(this);
        this.onBirthClick = this.onBirthClick.bind(this);
        this.onDeathClick = this.onDeathClick.bind(this);
        this.onTimelineClick = this.onTimelineClick.bind(this);
        this.onParentChildLinesClick = this.onParentChildLinesClick.bind(this);
        this.onBirthDeathLinesClick = this.onBirthDeathLinesClick.bind(this);
        this.onBirthDeathOnClick = this.onBirthDeathOnClick.bind(this);
        this.onParentsOnClick = this.onParentsOnClick.bind(this);
        this.onChildrenOnClick = this.onChildrenOnClick.bind(this);
        this.onHideClosedClick = this.onHideClosedClick.bind(this);
        this.onFindClick = this.onFindClick.bind(this);
        this.onFindSelect = this.onFindSelect.bind(this);
        this.onAfterSpeedChangeHandler = this.onAfterSpeedChangeHandler.bind(this);
        this.findEarliestBirthYear = this.findEarliestBirthYear.bind(this);
        this.findLatestDeathYear = this.findLatestDeathYear.bind(this);
        this.getMarks = this.getMarks.bind(this);
        this.onAfterSliderChangeHandler = this.onAfterSliderChangeHandler.bind(this);
        this.onPlayClick = this.onPlayClick.bind(this);
        this.onReverseClick = this.onReverseClick.bind(this);
        this.onPauseClick = this.onPauseClick.bind(this);
        this.incrementYear = this.incrementYear.bind(this);
        this.decrementYear = this.decrementYear.bind(this);
        this.state={
            ancestors: this.props.ancestors,
            year: null,
            incrementIntervalId: null,
            decrementIntervalId:null,
            timeline: false,
            animated: false,
            birthPins: true,
            deathPins: false,
            birthDeathLines: false,
            parentChildLines: true,
            birthDeathOnClick: false,
            parentsOnClick: false,
            childrenOnClick: false,
            clickedAncestor: null,
            closeClickedAncestor: null,
            sliderMin: null,
            sliderMax: null,
            sliderInterval: null,
            sliderSpeed: 1,
            openBAncestors: [],
            openDAncestors: [],
            hideClosed: false,
            hideBClosedAncestors: [],
            hideDClosedAncestors: [],
            searchPerson: null,
            zoom: null,
            fixCoordinates: null,
            finalFixCoordinates: null,
        }
    }

    componentDidUpdate() {
        if (this.props.zoom !== this.state.zoom) {
            if (this.hideClosed) {
                this.setState({
                    ancestors: adjustOverlappingMarkerCoordinates(this.state.ancestors, this.props.zoom, this.state.birthPins, this.state.deathPins),
                    hideBClosedAncestors: adjustOverlappingMarkerCoordinates(this.statehideBClosedAncestors, this.props.zoom, this.state.birthPins, this.state.deathPins),
                    hideDClosedAncestors: adjustOverlappingMarkerCoordinates(this.statehideDClosedAncestors, this.props.zoom, this.state.birthPins, this.state.deathPins),
                    zoom: this.props.zoom
                });
            } else {
                this.setState({
                    ancestors: adjustOverlappingMarkerCoordinates(this.state.ancestors, this.props.zoom, this.state.birthPins, this.state.deathPins),
                    zoom: this.props.zoom
                })
            }
        }
    }

    findEarliestBirthYear() {
        let earliestBirthYear = 3000;
        let birthYear;
        this.props.ancestors.forEach(ancestor => {
            if (ancestor.BirthDate !=='' && ancestor.BirthDate !== '0000-00-00') {
                birthYear = Number(ancestor.BirthDate.substring(0,4));
                if (birthYear < earliestBirthYear) {
                    earliestBirthYear = birthYear;
                }
            }
        })
        return earliestBirthYear;
    }

    findLatestDeathYear() {
        let latestDeathYear = 0;
        let deathYear;
        this.props.ancestors.forEach(ancestor => {
            if (ancestor.DeathDate !=='') {
                deathYear = Number(ancestor.DeathDate.substring(0,4));
                if (deathYear > latestDeathYear) {
                    latestDeathYear = deathYear;
                }
            }
        })
        return latestDeathYear;
    }

    
    onBirthClick() {
        this.props.birthPinsCallback();
        let adjustedAncestors = adjustOverlappingMarkerCoordinates(this.state.ancestors, this.props.zoom, !this.state.birthPins, this.state.deathPins);
        if (this.state.deathPins && !this.state.birthPins) {
            this.setState({
                birthPins: true,
                parentChildLines: false, //no parent-child lines if both birth and death pins showing
                parentsOnClick: false,
                childrenOnClick: false,
                ancestors: adjustedAncestors
            })
        } else if (this.state.deathPins && this.state.birthPins) {
            this.setState({
                birthPins: false,
                birthDeathLines: false, //no bd lines unless both birth and death pins showing
                birthDeathOnClick: false,
                ancestors: adjustedAncestors
            })
        } else if (!this.state.deathPins && this.state.birthPins) {
            this.setState({
                birthPins: false,
                parentChildLines: false, //no pc lines unless either birth or death pins showing
                parentsOnClick: false,
                childrenOnClick: false,
                ancestors: adjustedAncestors
            })
        } else {
            this.setState({
                birthPins: !this.state.birthPins,
                ancestors: adjustedAncestors
            })
        }
    }

    onDeathClick() {
        this.props.deathPinsCallback();
        let adjustedAncestors = adjustOverlappingMarkerCoordinates(this.state.ancestors, this.props.zoom, this.state.birthPins, !this.state.deathPins);
        if (this.state.birthPins && !this.state.deathPins) {
            this.setState({
                deathPins: true,
                parentChildLines: false, //no parent-child lines if both birth and death pins showing
                parentsOnClick: false,
                childrenOnClick: false,
                ancestors: adjustedAncestors
            })
        } else if (this.state.birthPins && this.state.deathPins) {
            this.setState({
                deathPins: false,
                birthDeathLines: false, //no bd lines unless both birth and death pins showing
                birthDeathOnClick: false,
                ancestors: adjustedAncestors
            })
        } else if (!this.state.birthPins && this.state.deathPins) {
            this.setState({
                deathPins: false,
                parentChildLines: false, //no pc lines unless either birth or death pins showing
                parentsOnClick: false,
                childrenOnClick: false,
                ancestors: adjustedAncestors
            })
        } else {
            this.setState({
                deathPins: !this.state.deathPins,
                ancestors: adjustedAncestors
            })
        }
    }

    onTimelineClick() {
        if (this.state.timeline) {
            this.setState({
                timeline: false,
            });
        } else {
            const earliestBirthYear = this.findEarliestBirthYear();
            const latestDeathYear = this.findLatestDeathYear();
            let sliderInterval = 10;
            if ((latestDeathYear - earliestBirthYear) > 1000) {
                sliderInterval = 100;
            } else if ((latestDeathYear - earliestBirthYear) > 250) {
                sliderInterval = 25;
            }
            let sliderMin = (Math.floor(earliestBirthYear/sliderInterval))*sliderInterval;
            let sliderMax = ((Math.floor(latestDeathYear/sliderInterval))+1)*sliderInterval;
            this.setState({
                timeline: true,
                year: sliderMin,
                sliderMin: sliderMin,
                sliderMax: sliderMax,
                sliderInterval: sliderInterval
            });
        }
    }

    onParentChildLinesClick() {
        this.setState({
            parentChildLines: !this.state.parentChildLines
        })
    }

    onBirthDeathLinesClick() {
        this.setState({
            birthDeathLines: !this.state.birthDeathLines
        })
    }

    onBirthDeathOnClick() {
        if (this.state.birthDeathOnClick) {
            this.setState({
                birthDeathOnClick: false,
            });
        } else {
            this.setState({
                birthDeathOnClick: true,
                parentsOnClick: false,
                childrenOnClick: false,
            });
        }
    }

    onFindClick() {
        if (this.state.find) {
            this.setState({
                find: false,
                searchPerson: null,
            })
        } else {
            this.setState({find: true})
        }
    }

    onFindSelect(optionValue) {
        if (this.state.birthPins) {
            let openBAncestors = this.state.openBAncestors;
            openBAncestors.push(optionValue[0]);
            this.setState({
                searchPerson: optionValue,
                openBAncestors: openBAncestors,
            })
        }
        if (this.state.deathPins) {
            let openDAncestors = this.state.openDAncestors;
            openDAncestors.push(optionValue[0]);
            this.setState({
                searchPerson: optionValue,
                openDAncestors: openDAncestors,
            })
        }
    }

    onParentsOnClick() {
        if (this.state.parentsOnClick) {
            this.setState({
                parentsOnClick: false,
                clickedAncestor: null,
                closeClickedAncestor: null,
            });
        } else {
            this.setState({
                parentsOnClick: true,
                childrenOnClick: false,
                birthDeathOnClick: false,
                clickedAncestor: null,
                closeClickedAncestor: null,
            });
        }
    }

    onChildrenOnClick() {
        if (this.state.childrenOnClick) {
            this.setState({
                childrenOnClick: false,
                clickedAncestor: null,
                closeClickedAncestor: null,
            });
        } else {
            this.setState({
                childrenOnClick: true,
                parentsOnClick: false,
                birthDeathOnClick: false,
                clickedAncestor: null,
                closeClickedAncestor: null,
            });
        }
    }

    onHideClosedClick() {
        if (this.state.hideClosed) {
            this.setState({
                hideClosed: false,
                hideClosedBAncestors: [],
                hideClosedDAncestors: [],
            })
            this.props.hideBClosedAncestorsCallBack([]);
            this.props.hideDClosedAncestorsCallBack([]);
        } else {
            if (this.state.birthPins) {
                this.setState({
                    hideClosed: true,
                    hideBClosedAncestors: this.state.openBAncestors.slice(),
                })
                this.props.hideBClosedAncestorsCallBack(this.state.openBAncestors.slice());
            } else {
                this.setState({
                    hideClosed: true,
                    hideDClosedAncestors: this.state.openDAncestors.slice(),
                })
                this.props.hideDClosedAncestorsCallBack(this.state.openDAncestors.slice());
            }
        }
    }

    // Timeline related functions
    getMarks() {
        let marks = {};
        for (let i = this.state.sliderMin; i <= this.state.sliderMax; i=i+this.state.sliderInterval) {
            marks[i] = i;
        }
        return marks;
    }

    onAfterSliderChangeHandler(value) {
        let newYear = Math.floor(value);
        this.setState({year: newYear});
    }

    onAfterSpeedChangeHandler(value) {
        if (value >= 5) {
            this.setState({sliderSpeed: (value-5) + 1});
        } else {
            this.setState({sliderSpeed: value/4});
        }
    }

    incrementYear() {
        if (this.state.year >= this.state.sliderMax) {
            clearInterval(this.state.incrementIntervalId);
            this.setState({animated: false});
        }
        this.setState({
            year: this.state.year+(this.state.sliderSpeed * 0.1),
        });
    }

    decrementYear() {
        if (this.state.year <= this.state.sliderMin) {
            clearInterval(this.state.decrementIntervalId);
            this.setState({animated: false});
        }
        this.setState({
            year: this.state.year-(this.state.sliderSpeed * 0.1),
        });
    }

    onPlayClick() {
        if (this.state.year < this.state.sliderMax) {
            let incrementIntervalId = setInterval(this.incrementYear, 10);
            this.setState({
                incrementIntervalId: incrementIntervalId,
                animated: true,
            });
        }
    }

    onReverseClick() {
        if (this.state.year > this.state.sliderMin) {
            let decrementIntervalId = setInterval(this.decrementYear, 10);
            this.setState({
                decrementIntervalId: decrementIntervalId,
                animated: true,
            });
        }
    }

    onPauseClick() {
        clearInterval(this.state.incrementIntervalId);
        clearInterval(this.state.decrementIntervalId);
        this.setState({animated: false});
    }

    /*
    getVisibleAncestors() {
        if (this.state.hideClosed) {
            return this.state.hideClosedAncestors;
        }
        let visibleAncestors = [];
        let year = this.state.year;
        for (let i=0; i<this.state.ancestors.length; i++) {
            let ancestor = this.state.ancestors[i];
            let visible = false;
            if (ancestor !== null) {
                if (!this.state.timeline) {
                    visible = true;
                } else {
                    const birthdateString = ancestor.BirthDate;
                    const deathdateString = ancestor.DeathDate;
                    if ((birthdateString === '0000-00-00' || birthdateString === '') && (deathdateString === '0000-00-00'  || deathdateString === '')) {
                        visible = false;
                    }
                    let birthdate = Number(birthdateString.substring(0,4));
                    let deathdate = Number(deathdateString.substring(0,4));
                    if (birthdateString !== '0000-00-00' && deathdateString !== '0000-00-00') {
                        if (birthdate <= year && deathdate >= year) {
                            visible = true;
                        } else {
                            visible = false;
                        }
                    }
                    if (birthdateString !== '0000-00-00' && deathdateString === '0000-00-00') {
                        if (birthdate <= year && (birthdate+60) >= year) {
                            visible = true;
                        } else {
                            visible = false;
                        }
                    }
                    if (birthdateString === '0000-00-00' && deathdateString !== '0000-00-00') {
                        if ((deathdate-60) <= year && deathdate >= year) {
                            visible = true;
                        } else {
                            visible = false;
                        }
                    }
                }
            }
            if (visible) {
                visibleAncestors.push(ancestor);
            }
        }
        return visibleAncestors;
    }*/

    ancestorVisible(ancestor) {
        let year = this.state.year;
        if (ancestor === null) {
            return false;
        }
        if (!this.state.timeline && !this.state.hideClosed) {
            return true;
        } else if (this.state.timeline) {
            const birthdateString = ancestor.BirthDate;
            const deathdateString = ancestor.DeathDate;
            if ((birthdateString === '0000-00-00' || birthdateString === '') && (deathdateString === '0000-00-00'  || deathdateString === '')) {
                return false;
            }
            let birthdate = Number(birthdateString.substring(0,4));
            let deathdate = Number(deathdateString.substring(0,4));
            if (birthdateString !== '0000-00-00' && deathdateString !== '0000-00-00') {
                if (birthdate <= year && deathdate >= year) {
                    return true;
                } else {
                    return false;
                }
            }
            if (birthdateString !== '0000-00-00' && deathdateString === '0000-00-00') {
                if (birthdate <= year && (birthdate+60) >= year) {
                    return true;
                } else {
                    return false;
                }
            }
            if (birthdateString === '0000-00-00' && deathdateString !== '0000-00-00') {
                if ((deathdate-60) <= year && deathdate >= year) {
                    return true;
                } else {
                    return false;
                }
            };
        } else if (this.state.hideClosed) {
            if (this.state.birthPins) {
                for (let i=0; i<this.state.hideBClosedAncestors.length; i++) {
                    if (this.state.hideBClosedAncestors[i].Id === ancestor.Id) {
                        return true;
                    }
                }
                return false;
            } else {
                for (let i=0; i<this.state.hideDClosedAncestors.length; i++) {
                    if (this.state.hideDClosedAncestors[i].Id === ancestor.Id) {
                        return true;
                    }
                }
                return false;
            }
            
        }
    }

    getFather(ancestor) {
        if (ancestor.Father === 0) {
            return null;
        } else {
            for (let i=0; i<this.state.ancestors.length; i++) {
                if (this.state.ancestors[i].Id === ancestor.Father) {
                    return this.state.ancestors[i];
                }
            }
            return null;
        }
    }

    getMother(ancestor) {
        if (ancestor.Mother === 0) {
            return null;
        } else {
            for (let i=0; i<this.state.ancestors.length; i++) {
                if (this.state.ancestors[i].Id === ancestor.Mother) {
                    return this.state.ancestors[i];
                }
            }
            return null;
        }
    }

    onBClickCallback(ancestor) {
        if (!this.state.hideClosed) {
            let openBAncestors = this.state.openBAncestors;
            openBAncestors.push(ancestor);
            if (this.state.parentsOnClick) {
                let father = this.getFather(ancestor);
                if (father !== null) {
                    openBAncestors.push(father);
                }
                let mother = this.getMother(ancestor);
                if (mother !== null) {
                    openBAncestors.push(mother);
                }
            } else if (this.state.childrenOnClick) {
                for (let i=0; i<this.state.ancestors.length; i++) {
                    if (this.state.ancestors[i].Father === ancestor.Id || this.state.ancestors[i].Mother === ancestor.Id) {
                        openBAncestors.push(this.state.ancestors[i]);
                    }
                }
            }
            if (this.state.birthDeathOnClick){
                let openDAncestors = this.state.openDAncestors;
                openDAncestors.push(ancestor);
                openBAncestors = removeDuplicates(openBAncestors);
                openDAncestors = removeDuplicates(openDAncestors);
                this.setState({
                    openBAncestors: openBAncestors,
                    openDAncestors: openDAncestors,
                    clickedAncestor: ancestor,
                    closeClickedAncestor: null,
                });
            } else {
                openBAncestors = removeDuplicates(openBAncestors);
                this.setState({
                    openBAncestors: openBAncestors,
                    clickedAncestor: ancestor,
                    closeClickedAncestor: null,
                });
            }
        } else if (this.state.hideClosed) {
            let openBAncestors = this.state.openBAncestors;
            let hideBClosedAncestors = this.state.hideBClosedAncestors;
            openBAncestors.push(ancestor);
            hideBClosedAncestors.push(ancestor);
            if (this.state.parentsOnClick) {
                let father = this.getFather(ancestor);
                if (father !== null) {
                    openBAncestors.push(father);
                    hideBClosedAncestors.push(father);
                }
                let mother = this.getMother(ancestor);
                if (mother !== null) {
                    openBAncestors.push(mother);
                    hideBClosedAncestors.push(mother);
                }
            } else if (this.state.childrenOnClick) {
                for (let i=0; i<this.state.ancestors.length; i++) {
                    if (this.state.ancestors[i].Father === ancestor.Id || this.state.ancestors[i].Mother === ancestor.Id) {
                        openBAncestors.push(this.state.ancestors[i]);
                        hideBClosedAncestors.push(this.state.ancestors[i]);
                    }
                }
            }
            openBAncestors = removeDuplicates(openBAncestors);
            hideBClosedAncestors = removeDuplicates(hideBClosedAncestors);
            hideBClosedAncestors = adjustOverlappingMarkerCoordinates(hideBClosedAncestors, this.props.zoom, this.state.birthPins, this.state.deathPins);
            this.setState({
                openBAncestors: openBAncestors,
                hideBClosedAncestors: hideBClosedAncestors,
                clickedAncestor: ancestor,
                closeClickedAncestor: null,
            });
            this.props.hideBClosedAncestorsCallBack(hideBClosedAncestors);
        }
    }

    onDClickCallback(ancestor) {
        if (!this.state.hideClosed) {
            let openDAncestors = this.state.openDAncestors;
            openDAncestors.push(ancestor);
            if (this.state.parentsOnClick) {
                let father = this.getFather(ancestor);
                if (father !== null) {
                    openDAncestors.push(father);
                }
                let mother = this.getMother(ancestor);
                if (mother !== null) {
                    openDAncestors.push(mother);
                }
            } else if (this.state.childrenOnClick) {
                for (let i=0; i<this.state.ancestors.length; i++) {
                    if (this.state.ancestors[i].Father === ancestor.Id || this.state.ancestors[i].Mother === ancestor.Id) {
                        openDAncestors.push(this.state.ancestors[i]);
                    }
                }
            }
            if (this.state.birthDeathOnClick){
                let openBAncestors = this.state.openDAncestors;
                openBAncestors.push(ancestor);
                openDAncestors = removeDuplicates(openDAncestors);
                openBAncestors = removeDuplicates(openBAncestors);
                this.setState({
                    openBAncestors: openBAncestors,
                    openDAncestors: openDAncestors,
                    clickedAncestor: ancestor,
                    closeClickedAncestor: null,
                });
            } else {
                openDAncestors = removeDuplicates(openDAncestors);
                this.setState({
                    openDAncestors: openDAncestors,
                    clickedAncestor: ancestor,
                    closeClickedAncestor: null,
                });
            }
        } else if (this.state.hideClosed) {
            let openDAncestors = this.state.openDAncestors;
            let hideDClosedAncestors = this.state.hideDClosedAncestors;
            openDAncestors.push(ancestor);
            hideDClosedAncestors.push(ancestor);
            if (this.state.parentsOnClick) {
                let father = this.getFather(ancestor);
                if (father !== null) {
                    openDAncestors.push(father);
                    hideDClosedAncestors.push(father);
                }
                let mother = this.getMother(ancestor);
                if (mother !== null) {
                    openDAncestors.push(mother);
                    hideDClosedAncestors.push(mother);
                }
            } else if (this.state.childrenOnClick) {
                for (let i=0; i<this.state.ancestors.length; i++) {
                    if (this.state.ancestors[i].Father === ancestor.Id || this.state.ancestors[i].Mother === ancestor.Id) {
                        openDAncestors.push(this.state.ancestors[i]);
                        hideDClosedAncestors.push(this.state.ancestors[i]);
                    }
                }
            }
            openDAncestors = removeDuplicates(openDAncestors);
            hideDClosedAncestors = removeDuplicates(hideDClosedAncestors);
            hideDClosedAncestors = adjustOverlappingMarkerCoordinates(hideDClosedAncestors, this.props.zoom, this.state.birthPins, this.state.deathPins);
            this.setState({
                openDAncestors: openDAncestors,
                hideDClosedAncestors: hideDClosedAncestors,
                clickedAncestor: ancestor,
                closeClickedAncestor: null,
            });
            this.props.hideDClosedAncestorsCallBack(hideDClosedAncestors);
        }
    }

    onBCloseClickCallback(ancestor) {
        let openBAncestors = this.state.openBAncestors;
        for (let i=0; i<openBAncestors.length; i++) {
            if (openBAncestors[i].Id === ancestor.Id) {
                openBAncestors.splice(i,1);
                break;
            }
        }
        this.setState({
            openBAncestors: openBAncestors,
            closeClickedAncestor: ancestor,
            clickedAncestor: null,
        });
    }

    onDCloseClickCallback(ancestor) {
        let openDAncestors = this.state.openDAncestors;
        for (let i=0; i<openDAncestors.length; i++) {
            if (openDAncestors[i].Id === ancestor.Id) {
                openDAncestors.splice(i,1);
                break;
            }
        }
        this.setState({
            openDAncestors: openDAncestors,
            closeClickedAncestor: ancestor,
            clickedAncestor: null,
        });
    }

    linkedAncestorClicked(ancestor) {
        if (this.state.clickedAncestor === null) {
            return false;
        }
        if (this.state.parentsOnClick) {
            if (this.state.clickedAncestor.Father === ancestor.Id || this.state.clickedAncestor.Mother === ancestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.state.childrenOnClick) {
            if (ancestor.Father === this.state.clickedAncestor.Id || ancestor.Mother === this.state.clickedAncestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }

    linkedAncestorCloseClicked(ancestor) {
        if (this.state.closeClickedAncestor === null) {
            return false;
        }
        if (this.state.parentsOnClick) {
            if (this.state.closeClickedAncestor.Father === ancestor.Id || this.state.closeClickedAncestor.Mother === ancestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.state.childrenOnClick) {
            if (ancestor.Father === this.state.closeClickedAncestor.Id || ancestor.Mother === this.state.closeClickedAncestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }

    onDragEndHandler(event) {
        this.setState({finalFixCoordinates: {lat: Number(event.latLng.lat().toFixed(6)), lng: Number(event.latLng.lng().toFixed(6))}});
    }

    fixCancelClick() {
        this.setState({fixCoordinates: false});
        this.props.fixCoordinatesCancelCallback();
    }

    render() {
        let mapOverlay;
        if (this.props.fixCoordinates === false || this.state.fixCoordinates === false) {
            let ancestors;
            if (this.state.hideClose) {
                if (this.state.birthPins) {
                    ancestors = this.state.hideBClosedAncestors;
                } else {
                    ancestors = this.state.hideDClosedAncestors;
                }
            } else {
                ancestors = this.state.ancestors;
            }

            let buttonbar = 
                <div className={styles.buttonbarDiv}>
                    <ToggleButton label={'Births'} active={this.state.birthPins} onClick={this.onBirthClick} disabled={((this.state.deathPins && this.state.hideClosed) || this.state.animated)}/>
                    <div className={styles.buttonbarspacer}/>
                    <ToggleButton label={'Deaths'} active={this.state.deathPins} onClick={this.onDeathClick} disabled={((this.state.birthPins && this.state.hideClosed) || this.state.animated)}/>
                    <div className={styles.buttonbarspacer}/>
                    <ToggleButton label={'Timeline'} active={this.state.timeline} onClick={this.onTimelineClick} disabled={this.state.hideClosed || this.state.animated}/>
                    <div className={styles.buttonbarspacer}/>
                    <ToggleButton label={'Parent-Child Lines'} active={this.state.parentChildLines} onClick={this.onParentChildLinesClick} disabled={((this.state.birthPins && this.state.deathPins) || this.state.animated)}/>
                    <div className={styles.buttonbarspacer}/>
                    <ToggleButton label={'Birth-Death Lines'} active={this.state.birthDeathLines} onClick={this.onBirthDeathLinesClick} disabled={((!this.state.birthPins || !this.state.deathPins) || this.state.animated)}/>
                    <div className={styles.buttonbarspacer}/>
                    <ToggleButton label={'Birth-Death on Click'} active={this.state.birthDeathOnClick} onClick={this.onBirthDeathOnClick} disabled={((!this.state.birthPins || !this.state.deathPins) || this.state.animated)}/>
                    <div className={styles.buttonbarspacer}/>
                    <ToggleButton label={'Find'} active={this.state.find} onClick={this.onFindClick} disabled={this.state.animated}/>
                    <div className={styles.buttonbarspacer}/>
                    <ToggleButton label={'Hide Closed'} active={this.state.hideClosed} onClick={this.onHideClosedClick} disabled={this.state.timeline || (this.state.birthPins && this.state.deathPins)}/>
                    <div className={styles.buttonbarspacer}/>
                    <ToggleButton label={'Parents on Click'} active={this.state.parentsOnClick} onClick={this.onParentsOnClick} disabled={((this.state.birthPins && this.state.deathPins) || this.state.animated)}/>
                    <div className={styles.buttonbarspacer}/>
                    <ToggleButton label={'Children on Click'} active={this.state.childrenOnClick} onClick={this.onChildrenOnClick} disabled={((this.state.birthPins && this.state.deathPins) || this.state.animated)}/>
                    <div className={styles.buttonbarspacer}/>
                    <Link to={{ pathname: '/apps/ashley1950/listmaker/'}}><ToggleButton label={'Return to List'} active={false} disabled={this.state.animated}/></Link>
                    </div>

            let searchBox;
            if (!this.state.find) {
                searchBox = <></>
            } else {
                let searchList = [];
                ancestors = sortByName(ancestors, 'forward');
                for (let i=0; i<ancestors.length; i++) {
                    if (this.ancestorVisible(ancestors[i]) && ((this.state.birthPins && ancestors[i].adjustedblat !== undefined) || (this.state.deathPins && ancestors[i].adjusteddlat !== undefined))) {
                        let labelString;
                        if (this.state.birthPins && ancestors[i].adjustedblat !== undefined) {
                            labelString = `${ancestors[i].BirthNamePrivate} b. ${ancestors[i].BirthDate} ${ancestors[i].BirthLocation}`;
                        } else if (this.state.deathPins && ancestors[i].adjusteddlat !== undefined) {
                            labelString = `${ancestors[i].BirthNamePrivate} d. ${ancestors[i].DeathDate} ${ancestors[i].DeathLocation}`;
                        }
                        searchList.push({value: [ancestors[i], labelString], label: labelString});
                    }
                }
                searchBox =
                    <div><Dropdown className={styles.searchBox} value={(this.state.searchPerson===null) ? null : this.state.searchPerson[1]} options={searchList} onChange={(option) => this.onFindSelect(option.value)} placeholder="Select ancestor to find"/></div>
                }        

            let markers = ancestors.map((ancestor, index) => {
                return <StaticMarkers key={index} id={index}
                            ancestor={ancestor}
                            birthPins={this.state.birthPins}
                            deathPins={this.state.deathPins}
                            birthDeathLines={this.state.birthDeathLines}
                            timeline={this.state.timeline}
                            animated={this.state.animated}
                            visible={this.ancestorVisible(ancestor)}
                            birthDeathOnClick={this.state.birthDeathOnClick}
                            ancestorOnClick={this.state.parentsOnClick || this.state.childrenOnClick}
                            linkedAncestorClick={this.linkedAncestorClicked(ancestor)}
                            linkedAncestorCloseClick={this.linkedAncestorCloseClicked(ancestor)}
                            onBClickCallback={this.onBClickCallback}
                            onBCloseClickCallback={this.onBCloseClickCallback}
                            onDClickCallback={this.onDClickCallback}
                            onDCloseClickCallback={this.onDCloseClickCallback}
                            searchPerson={this.state.searchPerson && (ancestor.Id === this.state.searchPerson[0].Id)}
                        />
            })

            let generationLines;
            if (!this.state.parentChildLines || (this.state.birthPins && this.state.deathPins)) {
                generationLines = <></>
            } else {
                generationLines = ancestors.map((ancestor, index) => {
                    let father = this.getFather(ancestor);
                    let mother = this.getMother(ancestor);
                    return <GenerationLines key={index} id={index}
                        ancestor={ancestor}
                        father={father}
                        mother={mother}
                        birthPins={this.state.birthPins}
                        deathPins={this.state.deathPins}
                        animated={this.state.animated}
                        visible={this.ancestorVisible(ancestor)}
                        fatherVisible={this.ancestorVisible(father)}
                        motherVisible={this.ancestorVisible(mother)}
                    />
                })
            }

            let pauseplay;
            if (!this.state.timeline) {
                pauseplay = <></>;
            } else if (this.state.animated) {
                pauseplay =
                    <div style={pauseDivStyle}>
                        <svg className="button" viewBox="0 0 60 60" onClick={this.onPauseClick}>
                            <polygon points="0,0 15,0 15,60 0,60" fill="#404040"/>
                            <polygon points="25,0 40,0 40,60 25,60" fill="#404040"/>
                        </svg>
                    </div>
            } else { //not timeline and not animated
                pauseplay =
                    <>
                    <div style={reverseDivStyle}>
                        <svg className="button" viewBox="0 0 60 60" onClick={this.onReverseClick}>
                            <polygon points="60,0 10,30 60,60" fill="#404040"/>
                        </svg>
                    </div>
                    <div style={playDivStyle}>
                        <svg className="button" viewBox="0 0 60 60" onClick={this.onPlayClick}>
                            <polygon points="0,0 50,30 0,60" fill="#404040"/>
                        </svg>
                    </div>
                    </>
            }

            let speedSlider;
            if (!this.state.timeline) {
                speedSlider = <></>;
            } else {
                speedSlider =
                    <div style={speedWrapperStyle}>
                        <Slider
                            range={false}
                            vertical={true}
                            min={1}
                            max={9}
                            defaultValue={5}
                            step={0.01}
                            handleStyle={speedHandleStyle}
                            railStyle={{backgroundColor: "#6d6ed1"}}
                            trackStyle={speedTrackStyle}
                            onAfterChange={value => this.onAfterSpeedChangeHandler(value)}
                        />
                    </div>
            }

            let slider;
            if (!this.state.timeline) {
                slider = <></>;
            } else if (this.state.animated) {
                slider = 
                    <div className={styles.wrapperStyle}>
                        <Slider
                            range={false}
                            min={this.state.sliderMin}
                            max={this.state.sliderMax}
                            step={0.01}
                            defaultValue={this.state.sliderMin}
                            value={this.state.year}
                            marks={this.getMarks()}
                            dotStyle={dotStyle}
                            handleStyle={handleStyle}
                            trackStyle={trackStyle}
                        />
                    </div>
            } else {
                slider = 
                    <div className={styles.wrapperStyle}>
                        <Slider
                            range={false}
                            min={this.state.sliderMin}
                            max={this.state.sliderMax}
                            step={0.01}
                            defaultValue={this.state.sliderMin}
                            marks={this.getMarks()}
                            dotStyle={dotStyle}
                            handleStyle={handleStyle}
                            trackStyle={trackStyle}
                            onAfterChange={value => this.onAfterSliderChangeHandler(value)}
                        />
                    </div>
            }
            mapOverlay =
                <div>
                    {buttonbar}
                    {searchBox}
                    {markers}
                    {generationLines}
                    {pauseplay}
                    {speedSlider}
                    {slider}
                </div>
        } else {
            let markerCoordinates, ancestor, location, birthDeath;
            if (this.state.hideBClosedAncestors.length !== 0) {
                markerCoordinates = { lat: this.state.hideBClosedAncestors[0].blat, lng: this.state.hideBClosedAncestors[0].blng };
                ancestor = this.state.hideBClosedAncestors[0];
                location = ancestor.BirthLocation;
                birthDeath = 'Birth';
            } else {
                markerCoordinates = { lat: this.state.hideDClosedAncestors[0].dlat, lng: this.state.hideDClosedAncestors[0].dlng };
                ancestor = this.state.hideDClosedAncestors[0];
                location = ancestor.DeathLocation;
                birthDeath = 'Death';
            }
            let fixCoordinatesPanel, fixCoordinatesMarker;
            fixCoordinatesPanel =
                <div className={styles.coordinatesSearchBox}>
                    <table className={styles.coordinatesSearchTable}>
                        <tbody>
                            <tr><td colSpan='2'>The marker is at the coordinates currently in the app's database for the location name/description below. If the marker placement is incorrect, drag and drop it at the correct place. Zoom in/out as necessary. Click 'Submit' when you are confident the marker is in the correct place to add it to the app's database. If the location name/description is incorrect, correct it in the profile and do not change the marker position.</td></tr>
                            <tr><td className={styles.locationCell}>{location}</td><td className={styles.nameCell}>Found in {birthDeath} Location field for <a href={`https://www.wikitree.com/wiki/${this.props.id}`} target='_blank' rel='noopener noreferrer'>{ancestor.BirthNamePrivate}</a></td>
                            <td className={styles.cancelCell}><button onClick={() => this.fixCancelClick()}>Cancel</button></td></tr>
                        </tbody>
                    </table>
                </div>
            fixCoordinatesMarker =
                <Marker
                    icon={`http://maps.google.com/mapfiles/ms/icons/blue-dot.png`}
                    position={this.state.finalFixCoordinates === null ? {lat: markerCoordinates.lat, lng: markerCoordinates.lng} : {lat: this.state.finalFixCoordinates.lat, lng: this.state.finalFixCoordinates.lng}}
                    draggable={true}
                    onDragEnd={this.onDragEndHandler}
                />
            mapOverlay = 
                <div>
                    {fixCoordinatesPanel}
                    {fixCoordinatesMarker}
                </div>
        }
 
        return (
            <>
            {mapOverlay}
            </>
        )
    }
}

export default MapOverlayItems;