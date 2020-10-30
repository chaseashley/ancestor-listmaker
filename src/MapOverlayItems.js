import React from 'react';
import StaticMarkers from './StaticMarkers';
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import styles from './mapOverlayItemsStyles.module.css';
import { adjustOverlappingMarkerCoordinates } from './overlappingMarkers';
import GenerationLines from './GenerationLines';
import ToggleButton from './ToggleButton';

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
        this.linkedAncestorClicked = this.linkedAncestorClicked.bind(this);
        this.linkedAncestorCloseClicked = this.linkedAncestorCloseClicked.bind(this);
        this.onClickCallback = this.onClickCallback.bind(this);
        this.onCloseClickCallback = this.onCloseClickCallback.bind(this);
        this.getFather = this.getFather.bind(this);
        this.getMother = this.getMother.bind(this);
        this.getChild = this.getChild.bind(this);
        this.ancestorVisible = this.ancestorVisible.bind(this);
        this.onBirthClick = this.onBirthClick.bind(this);
        this.onDeathClick = this.onDeathClick.bind(this);
        this.onTimelineClick = this.onTimelineClick.bind(this);
        this.onParentChildLinesClick = this.onParentChildLinesClick.bind(this);
        this.onBirthDeathLinesClick = this.onBirthDeathLinesClick.bind(this);
        this.onBirthDeathOnClick = this.onBirthDeathOnClick.bind(this);
        this.onParentsOnClick = this.onParentsOnClick.bind(this);
        this.onChildOnClick = this.onChildOnClick.bind(this);
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
            parentChildLines: false,
            birthDeathOnClick: false,
            parentsOnClick: false,
            childOnClick: false,
            clickedAncestor: null,
            closeClickedAncestor: null,
            sliderMin: null,
            sliderMax: null,
            sliderInterval: null,
            sliderSpeed: 1,
        }
    }

    componentDidMount () {
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
        this.setState({year: sliderMin, sliderMin: sliderMin, sliderMax: sliderMax, sliderInterval: sliderInterval});
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
                childOnClick: false,
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
                childOnClick: false,
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
                childOnClick: false,
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
                childOnClick: false,
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
                year: this.state.sliderMin
            });
        } else {
            this.setState({timeline: true});
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
        this.setState({
            birthDeathOnClick: !this.state.birthDeathOnClick
        })
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
                childOnClick: false,
                clickedAncestor: null,
                closeClickedAncestor: null,
            });
        }
    }

    onChildOnClick() {
        if (this.state.childOnClick) {
            this.setState({
                childOnClick: false,
                clickedAncestor: null,
                closeClickedAncestor: null,
            });
        } else {
            this.setState({
                childOnClick: true,
                parentsOnClick: false,
                clickedAncestor: null,
                closeClickedAncestor: null,
            });
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

    ancestorVisible(year, ancestor) {
        let birthdateString;
        let deathdateString;
        if (ancestor === null) {
            return false;
        } else {
            birthdateString = ancestor.BirthDate;
            deathdateString = ancestor.DeathDate;
        }
        if (this.state.timeline === false) {
            return true;
        }
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

    getChild(ancestor) {
        for (let i=0; i<this.state.ancestors.length; i++) {
            if (this.state.ancestors[i].Father === ancestor.Id || this.state.ancestors[i].Mother === ancestor.Id) {
                return this.state.ancestors[i];
            }
        }
        return null;
    }

    onClickCallback(ancestor) {
        this.setState({
            clickedAncestor: ancestor,
            closeClickedAncestor: null,
        });
    }

    onCloseClickCallback(ancestor) {
        this.setState({
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
        if (this.state.childOnClick) {
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
        if (this.state.childOnClick) {
            if (ancestor.Father === this.state.closeClickedAncestor.Id || ancestor.Mother === this.state.closeClickedAncestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }

    render() {

        let buttonbar = 
            <div className={styles.buttonbarDiv}>
                <ToggleButton label={'Births'} active={this.state.birthPins} onClick={this.onBirthClick} disabled={false}/>
                <div className={styles.buttonbarspacer}/>
                <ToggleButton label={'Deaths'} active={this.state.deathPins} onClick={this.onDeathClick} disabled={false}/>
                <div className={styles.buttonbarspacer}/>
                <ToggleButton label={'Timeline'} active={this.state.timeline} onClick={this.onTimelineClick} disabled={false}/>
                <div className={styles.buttonbarspacer}/>
                <ToggleButton label={'Parent-Child Lines'} active={this.state.parentChildLines} onClick={this.onParentChildLinesClick} disabled={(this.state.birthPins && this.state.deathPins)}/>
                <div className={styles.buttonbarspacer}/>
                <ToggleButton label={'Birth-Death Lines'} active={this.state.birthDeathLines} onClick={this.onBirthDeathLinesClick} disabled={(!this.state.birthPins || !this.state.deathPins)}/>
                <div className={styles.buttonbarspacer}/>
                <ToggleButton label={'Hide Unopened'}disabled={false}/>
                <div className={styles.buttonbarspacer}/>
                <ToggleButton label={'Birth-Death on Click'} active={this.state.birthDeathOnClick} onClick={this.onBirthDeathOnClick} disabled={(!this.state.birthPins || !this.state.deathPins)}/>
                <div className={styles.buttonbarspacer}/>
                <ToggleButton label={'Parents on Click'} active={this.state.parentsOnClick} onClick={this.onParentsOnClick} disabled={(this.state.birthPins && this.state.deathPins)}/>
                <div className={styles.buttonbarspacer}/>
                <ToggleButton label={'Child on Click'} active={this.state.childOnClick} onClick={this.onChildOnClick} disabled={(this.state.birthPins && this.state.deathPins)}/>
                <div className={styles.buttonbarspacer}/>
                <ToggleButton label={'Spouse on Click'} disabled={false}/>
            </div>
                

        let markers = this.state.ancestors.map((ancestor, index) => {
            return <StaticMarkers key={index} id={index}
                        ancestor={ancestor}
                        birthPins={this.state.birthPins}
                        deathPins={this.state.deathPins}
                        birthDeathLines={this.state.birthDeathLines}
                        animated={this.state.animated}
                        visible={this.ancestorVisible(this.state.year, ancestor)}
                        birthDeathOnClick={this.state.birthDeathOnClick}
                        ancestorOnClick={this.state.parentsOnClick || this.state.childOnClick}
                        linkedAncestorClick={this.linkedAncestorClicked(ancestor)}
                        linkedAncestorCloseClick={this.linkedAncestorCloseClicked(ancestor)}
                        onClickCallback={this.onClickCallback}
                        onCloseClickCallback={this.onCloseClickCallback}
                    />
        })

        let generationLines;
        if (!this.state.parentChildLines || (this.state.birthPins && this.state.deathPins)) {
            generationLines = <></>
        } else {
            generationLines = this.state.ancestors.map((ancestor, index) => {
                let father = this.getFather(ancestor);
                let mother = this.getMother(ancestor);
                return <GenerationLines key={index} id={index}
                    ancestor={ancestor}
                    father={father}
                    mother={mother}
                    birthPins={this.state.birthPins}
                    deathPins={this.state.deathPins}
                    animated={this.state.animated}
                    visible={this.ancestorVisible(this.state.year, ancestor)}
                    fatherVisible={this.ancestorVisible(this.state.year, father)}
                    motherVisible={this.ancestorVisible(this.state.year, mother)}
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
 
        return (
            <div>
                {buttonbar}
                {markers}
                {generationLines}
                {pauseplay}
                {speedSlider}
                {slider}
            </div> 
        )
    }
}

export default MapOverlayItems;