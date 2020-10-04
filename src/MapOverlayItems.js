import React from 'react';
import StaticMarkers from './StaticMarkers';
import MovingMarker from './MovingMarker';
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import styles from './mapOverlayItemsStyles.module.css';

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

const pauseplayDivStyle = {
    left: "20px",
    width: "20px",
    height: "20px",
    margin: 0,
    position: "fixed",
    bottom: "25px"
}

const speedWrapperStyle = {
    left: "52px",
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
        this.onAfterSpeedChangeHandler = this.onAfterSpeedChangeHandler.bind(this);
        this.onAllOrTimeSeriesClick = this.onAllOrTimeSeriesClick.bind(this);
        this.findEarliestBirthYear = this.findEarliestBirthYear.bind(this);
        this.findLatestDeathYear = this.findLatestDeathYear.bind(this);
        this.onOptionsOpenCloseClick = this.onOptionsOpenCloseClick.bind(this);
        this.getMarks = this.getMarks.bind(this);
        this.onAfterChangeHandler = this.onAfterChangeHandler.bind(this);
        this.onPausePlayClick = this.onPausePlayClick.bind(this);
        this.incrementYear = this.incrementYear.bind(this);
        this.state={
            year: null,
            intervalId: null,
            timeSeries: false,
            animated: false,
            markerType: 'static',
            windowAutoOpen: false,
            birthPins: true,
            deathPins: false,
            lines: false,
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
        this.setState({sliderMin: sliderMin, sliderMax: sliderMax, sliderInterval: sliderInterval});
    }

    findEarliestBirthYear() {
        let earliestBirthYear = 3000;
        let birthYear;
        this.props.ancestors.forEach(ancestor => {
            if (ancestor.BirthDate !=='') {
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

    onAfterChangeHandler(value) {
        this.setState({year: Math.floor(value)});
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
            clearInterval(this.state.intervalId);
            this.setState({animated: false});
        }
        this.setState({year: this.state.year+(this.state.sliderSpeed * 0.1)})
    }

    onPausePlayClick() {
        if (!this.state.animated) {
            let intervalId = setInterval(this.incrementYear, 10);
            this.setState({intervalId: intervalId});
        } else {
            clearInterval(this.state.intervalId);
        }
        if (this.state.year < this.state.sliderMax) {
            this.setState({animated: !this.state.animated})
        }
    }

    onAllOrTimeSeriesClick() {
        if (this.state.timeSeries) {
            this.setState({year: null});
        } else {
            this.setState({year: this.state.sliderMin});
        }
        this.setState({timeSeries: !this.state.timeSeries})
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
        
        const windowAutoOpen = 
            <div className={styles.displayOptions}>
                <input type="checkbox" name="windowAutoOpenCheckbox" checked={this.state.windowAutoOpen} onChange={(e) => this.setState({windowAutoOpen: e.target.checked})} disabled={!this.state.timeSeries}/>
                <label for="windowAutoOpenCheckbox">Show birth/death information when event occurs</label>
            </div>

        const birthPins = 
            <div className={styles.displayOptions}>
                <input type="checkbox" name="birthPins" checked={this.state.birthPins} onChange={(e) => this.setState({birthPins: e.target.checked})} disabled={this.state.markerType==='Moving'}/>
                <label for="birthPins">Show birth locations</label>
            </div>

        const deathPins = 
            <div className={styles.displayOptions}>
                <input type="checkbox" name="deathPins" checked={this.state.deathPins} onChange={(e) => this.setState({deathPins: e.target.checked})} disabled={this.state.markerType==='Moving'}/>
                <label for="birthPins">Show death locations</label>
            </div>

        const lines = 
            <div>
                <input type="checkbox" name="lines" checked={this.state.lines} onChange={(e) => this.setState({lines: e.target.checked})} disabled={this.state.markerType==='Moving' || !this.state.birthPins || !this.state.deathPins}/>
                <label for="lines">Show migration lines between birth and death locations</label>
            </div>

        let optionsBox;
        if (this.state.optionsOpen) {
            optionsBox = <div className={styles.optionsOpen}>
                <table className={styles.optionsTable}>
                    <tr>
                        <td className={styles.bottomBorder}>{allAncestors}</td>
                        <td className={styles.bottomBorder}>{timeSeriesAncestors}</td>
                    </tr>
                    <tr>
                        <td>{birthPins}</td>
                        <td>{deathPins}</td>
                    </tr>
                    <tr>
                        <td colSpan='2' className={styles.bottomBorder}>{lines}</td>
                    </tr>
                    <tr>
                        <td colSpan='2'>{windowAutoOpen}</td>
                    </tr>
                </table>
                {optionsOpenCloseButton}
            </div>
        } else {
            optionsBox = <div className={styles.optionsClosed}>{optionsOpenCloseButton}
            </div>
        }

        let markers;
        if (this.state.markerType === 'static') {
            markers = this.props.ancestors.map((ancestor, index) => {
                return <StaticMarkers key={index} id={index}
                            //year={this.state.year}
                            ancestor={ancestor}
                            birthYear={Number(ancestor.BirthDate.substring(0,4))}
                            deathYear={Number(ancestor.DeathDate.substring(0,4))}
                            birthPins={this.state.birthPins}
                            deathPins={this.state.deathPins}
                            lines={this.state.lines}
                            animated={this.state.animated}
                            windowAutoOpen={this.state.windowAutoOpen}
                            visible={(this.state.year === null) ? true : (Number(ancestor.BirthDate.substring(0,4)) <= this.state.year && Number(ancestor.DeathDate.substring(0,4)) >= this.state.year) ? true : false}
                        />
            })
        } else {
            markers = this.props.ancestors.map((ancestor, index) => {
                return <MovingMarker key={index} id={index}
                            ancestor={ancestor}
                            birthYear={Number(ancestor.BirthDate.substring(0,4))}
                            deathYear={Number(ancestor.DeathDate.substring(0,4))}
                            birthPins={this.state.birthPins}
                            deathPins={this.state.deathPins}
                            lines={this.state.lines}
                            animated={this.state.animated}
                            year={this.state.year}
                        />
            })
        }

        let pauseplay;
        if (!this.state.timeSeries) {
            pauseplay = <></>;
        } else if (this.state.animated) {
            pauseplay =
                <div style={pauseplayDivStyle}>
                    <svg className="button" viewBox="0 0 60 60" onClick={this.onPausePlayClick}>
                        <polygon points="0,0 15,0 15,60 0,60" fill="#404040"/>
                        <polygon points="25,0 40,0 40,60 25,60" fill="#404040"/>
                    </svg>
                </div>
        } else { //not timeSeries and not animated
            pauseplay =
                <div style={pauseplayDivStyle}>
                    <svg className="button" viewBox="0 0 60 60" onClick={this.onPausePlayClick}>
                        <polygon points="0,0 50,30 0,60" fill="#404040"/>
                    </svg>
                </div>
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
                        onAfterChange={value => this.onAfterChangeHandler(value)}
                    />
                </div>
        }
 
        return (
            <div>
                {optionsBox}
                {markers}
                {pauseplay}
                {speedSlider}
                {slider}
            </div> 
        )
    }
}

export default MapOverlayItems;