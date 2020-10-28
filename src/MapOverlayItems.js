import React from 'react';
import StaticMarkers from './StaticMarkers';
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import styles from './mapOverlayItemsStyles.module.css';
import { adjustOverlappingMarkerCoordinates } from './overlappingMarkers';
import GenerationLines from './GenerationLines';

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
        this.linkedAncestorMouseOver = this.linkedAncestorMouseOver.bind(this);
        this.linkedAncestorMouseOut = this.linkedAncestorMouseOut.bind(this);
        this.onClickCallback = this.onClickCallback.bind(this);
        this.onCloseClickCallback = this.onCloseClickCallback.bind(this);
        this.onMouseOverCallback = this.onMouseOverCallback.bind(this);
        this.onMouseOutCallback = this.onMouseOutCallback.bind(this);
        this.onParentWindowsLinkedChange = this.onParentWindowsLinkedChange.bind(this);
        this.onChildWindowLinkedChange = this.onChildWindowLinkedChange.bind(this);
        this.getFather = this.getFather.bind(this);
        this.getMother = this.getMother.bind(this);
        this.getChild = this.getChild.bind(this);
        this.ancestorVisible = this.ancestorVisible.bind(this);
        this.onBirthPinsChange = this.onBirthPinsChange.bind(this);
        this.onDeathPinsChange = this.onDeathPinsChange.bind(this);
        this.onAfterSpeedChangeHandler = this.onAfterSpeedChangeHandler.bind(this);
        this.onAllOrTimeSeriesClick = this.onAllOrTimeSeriesClick.bind(this);
        this.findEarliestBirthYear = this.findEarliestBirthYear.bind(this);
        this.findLatestDeathYear = this.findLatestDeathYear.bind(this);
        this.onOptionsOpenCloseClick = this.onOptionsOpenCloseClick.bind(this);
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
            timeSeries: false,
            animated: false,
            birthPins: true,
            deathPins: false,
            birthDeathLines: false,
            parentChildLines: false,
            birthDeathWindowsLinked: false,
            parentWindowsLinked: false,
            childWindowLinked: false,
            clickedAncestor: null,
            closeClickedAncestor: null,
            mouseOverAncestor: null,
            mouseOutAncestor: null,
            optionsOpen: true,
            sliderMin: null,
            sliderMax: null,
            sliderInterval: null,
            sliderSpeed: 1,
        }
    }

    onOptionsOpenCloseClick() {
        this.setState({optionsOpen: !this.state.optionsOpen});
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

    onAllOrTimeSeriesClick() {
        if (this.state.timeSeries) {
            this.setState({
                timeSeries: false,
                year: this.state.sliderMin
            });
        } else {
            this.setState({timeSeries: true});
        }
    }

    onBirthPinsChange(e) {
        this.props.birthPinsCallback();
        let adjustedAncestors = adjustOverlappingMarkerCoordinates(this.state.ancestors, this.props.zoom, e.target.checked, this.state.deathPins);
        this.setState({
            birthPins: e.target.checked,
            ancestors: adjustedAncestors
        });
    }

    onDeathPinsChange(e) {
        this.props.deathPinsCallback();
        let adjustedAncestors = adjustOverlappingMarkerCoordinates(this.state.ancestors, this.props.zoom, this.state.birthPins, e.target.checked);
        this.setState({
            deathPins: e.target.checked,
            ancestors: adjustedAncestors,
        });
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
        if (this.state.timeSeries === false) {
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
            mouseOverAncestor: null,
            mouseOutAncestor: null
        });
    }

    onMouseOverCallback(ancestor) {
        this.setState({
            mouseOverAncestor: ancestor,
            clickedAncestor: null,
            closeClickedAncestor: null,
            mouseOutAncestor: null
        });
    }

    onMouseOutCallback(ancestor) {
        this.setState({
            mouseOutAncestor: ancestor,
            clickedAncestor: null,
            closeClickedAncestor: null,
            mouseOverAncestor: null,
        });
    }

    onCloseClickCallback(ancestor) {
        this.setState({
            closeClickedAncestor: ancestor,
            clickedAncestor: null,
            mouseOverAncestor: null,
            mouseOutAncestor: null,
        });
    }

    onParentWindowsLinkedChange(e) {
        this.setState({
            parentWindowsLinked: e.target.checked,
            clickedAncestor: null,
            closeClickedAncestor: null,
            mouseOverAncestor: null,
            mouseOutAncestor: null
        });
    }

    onChildWindowLinkedChange(e) {
        this.setState({
            childWindowLinked: e.target.checked,
            clickedAncestor: null,
            closeClickedAncestor: null,
            mouseOverAncestor: null,
            mouseOutAncestor: null
        });
    }

    linkedAncestorClicked(ancestor) {
        if (this.state.clickedAncestor === null) {
            return false;
        }
        if (this.state.parentWindowsLinked) {
            if (this.state.clickedAncestor.Father === ancestor.Id || this.state.clickedAncestor.Mother === ancestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.state.childWindowLinked) {
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
        if (this.state.parentWindowsLinked) {
            if (this.state.closeClickedAncestor.Father === ancestor.Id || this.state.closeClickedAncestor.Mother === ancestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.state.childWindowLinked) {
            if (ancestor.Father === this.state.closeClickedAncestor.Id || ancestor.Mother === this.state.closeClickedAncestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }

    linkedAncestorMouseOver(ancestor) {
        if (this.state.mouseOverAncestor === null) {
            return false;
        }
        if (this.state.parentWindowsLinked) {
            if (this.state.mouseOverAncestor.Father === ancestor.Id || this.state.mouseOverAncestor.Mother === ancestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.state.childWindowLinked) {
            if (ancestor.Father === this.state.mouseOverAncestor.Id || ancestor.Mother === this.state.mouseOverAncestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }

    linkedAncestorMouseOut(ancestor) {
        if (this.state.mouseOutAncestor === null) {
            return false;
        }
        if (this.state.parentWindowsLinked) {
            if (this.state.mouseOutAncestor.Father === ancestor.Id || this.state.mouseOutAncestor.Mother === ancestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.state.childWindowLinked) {
            if (ancestor.Father === this.state.mouseOutAncestor.Id || ancestor.Mother === this.state.mouseOutAncestor.Id) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }

    render() {
        let optionsOpenCloseButton;
        if (this.state.optionsOpen) {
            optionsOpenCloseButton =
                <div className={styles.tooltip}>
                <div className={styles.optionsCloseButton}>
                    <svg className="button" viewBox="0 0 60 60" onClick={this.onOptionsOpenCloseClick}>
                    <polygon points="0,40 30,20 60,40" />
                    </svg>
                    <span className={styles.tooltiptext}>Close panel</span>
                </div></div>
        } else {
            optionsOpenCloseButton =
                <div className={styles.tooltip}>
                <div className={styles.optionsOpenButton}>
                    <svg className="button" viewBox="0 0 60 60" onClick={this.onOptionsOpenCloseClick}>
                        <polygon points="0,20 30,40 60,20" />
                    </svg>
                    <span className={styles.tooltiptext}>Display options</span>
                </div></div>
        }

        const allAncestors = 
            <label className={styles.displayOptions}>
                <input
                    type="radio"
                    name="allOrTimeSeries"
                    checked={!this.state.timeSeries}
                    onChange={this.onAllOrTimeSeriesClick}
                />
                Show all ancestors at once
            </label>

        const timeSeriesAncestors =
            <label className={styles.displayOptions}>
                <input
                    type="radio"
                    name="allOrTimeSeries"
                    checked={this.state.timeSeries}
                    onChange={this.onAllOrTimeSeriesClick}
                />
                Show ancestors living over time
            </label>

        const birthPins = 
            <div className={styles.displayOptions}>
                <input type="checkbox" name="birthPins" checked={this.state.birthPins} onChange={(e) => this.onBirthPinsChange(e)}/>
                <label for="birthPins">Show birth locations</label>
            </div>

        const deathPins = 
            <div className={styles.displayOptions}>
                <input type="checkbox" name="deathPins" checked={this.state.deathPins} onChange={(e) => this.onDeathPinsChange(e)}/>
                <label for="birthPins">Show death locations</label>
            </div>

        const parentChildLines = 
            <div>
                <input type="checkbox" name="parentChildLines" checked={this.state.parentChildLines} onChange={(e) => this.setState({parentChildLines: e.target.checked})} disabled={this.state.birthPins && this.state.deathPins}/>
                <label for="parentChildLines">Show lines connecting parents to children</label>
            </div>

        const parentWindowsLinked = 
            <div>
                <input type="checkbox" name="parentWindowsLinked" checked={this.state.parentWindowsLinked} onChange={(e) => this.onParentWindowsLinkedChange(e)} disabled={(this.state.birthPins && this.state.deathPins) || this.state.childWindowLinked}/>
                <label for="childParewntWindowsLinked">Show parent info windows on child hover or click (e.g., to go up an ancestral line)</label>
            </div>

        const childWindowLinked = 
        <div>
            <input type="checkbox" name="childWindowLinked" checked={this.state.childWindowLinked} onChange={(e) => this.onChildWindowLinkedChange(e)} disabled={(this.state.birthPins && this.state.deathPins) || this.state.parentWindowsLinked}/>
            <label for="childWindowLinked">Show child info window on parent hover or click (e.g., to go down a line of descent)</label>
        </div>

        const birthDeathLines = 
            <div>
                <input type="checkbox" name="birthDeathLines" checked={this.state.birthDeathLines} onChange={(e) => this.setState({birthDeathLines: e.target.checked})} disabled={!this.state.birthPins || !this.state.deathPins}/>
                <label for="birthDeathLines">Show lines connecting birth and death locations</label>
            </div>

        const birthDeathWindowsLinked = 
            <div>
                <input type="checkbox" name="birthDeathWindowsLinked" checked={this.state.birthDeathWindowsLinked} onChange={(e) => this.setState({birthDeathWindowsLinked: e.target.checked})} disabled={!this.state.birthPins || !this.state.deathPins}/>
                <label for="birthDeathWindowsLink">Link opening/closing of birth and death location info windows</label>
            </div>

        let optionsBox;
        if (this.state.optionsOpen) {
            optionsBox = <div className={styles.optionsOpen}>
                <table className={styles.optionsTable}>
                    <tbody>
                    <tr>
                        <td className={styles.bottomBorder}>{allAncestors}</td>
                        <td className={styles.bottomBorder}>{timeSeriesAncestors}</td>
                    </tr>
                    <tr>
                        <td className={styles.birthDeathPinsTD}>{birthPins}</td>
                        <td className={styles.birthDeathPinsTD}>{deathPins}</td>
                    </tr>
                    <tr>
                        <td colSpan='2' className={styles.parentChildLinesTD}>{parentChildLines}</td>
                    </tr>
                    <tr>
                        <td colSpan='2' className={styles.parentWindowsLinkedTD}>{parentWindowsLinked}</td>
                    </tr>
                    <tr>
                        <td colSpan='2' className={styles.childWindowLinkedTD}>{childWindowLinked}</td>
                    </tr>
                    <tr>
                        <td colSpan='2' className={styles.birthDeathLinesTD}>{birthDeathLines}</td>
                    </tr>
                    <tr>
                        <td colSpan='2' className={styles.birthDeathWindowsLinkedTD}>{birthDeathWindowsLinked}</td>
                    </tr>
                    </tbody>
                </table>
                {optionsOpenCloseButton}
            </div>
        } else {
            optionsBox = <div className={styles.optionsClosed}>{optionsOpenCloseButton}
            </div>
        }

        let markers = this.state.ancestors.map((ancestor, index) => {
            return <StaticMarkers key={index} id={index}
                        ancestor={ancestor}
                        birthPins={this.state.birthPins}
                        deathPins={this.state.deathPins}
                        birthDeathLines={this.state.birthDeathLines}
                        animated={this.state.animated}
                        visible={this.ancestorVisible(this.state.year, ancestor)}
                        birthDeathWindowsLinked={this.state.birthDeathWindowsLinked}
                        ancestorWindowsLinked={this.state.parentWindowsLinked || this.state.childWindowLinked}
                        linkedAncestorClick={this.linkedAncestorClicked(ancestor)}
                        linkedAncestorCloseClick={this.linkedAncestorCloseClicked(ancestor)}
                        linkedAncestorMouseOver={this.linkedAncestorMouseOver(ancestor)}
                        linkedAncestorMouseOut={this.linkedAncestorMouseOut(ancestor)}
                        onClickCallback={this.onClickCallback}
                        onMouseOverCallback={this.onMouseOverCallback}
                        onMouseOutCallback={this.onMouseOutCallback}
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
        if (!this.state.timeSeries) {
            pauseplay = <></>;
        } else if (this.state.animated) {
            pauseplay =
                <div style={pauseDivStyle}>
                    <svg className="button" viewBox="0 0 60 60" onClick={this.onPauseClick}>
                        <polygon points="0,0 15,0 15,60 0,60" fill="#404040"/>
                        <polygon points="25,0 40,0 40,60 25,60" fill="#404040"/>
                    </svg>
                </div>
        } else { //not timeSeries and not animated
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
        if (!this.state.timeSeries) {
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
        if (!this.state.timeSeries) {
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
                {optionsBox}
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