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
  
const activeDotStyle = {
    backgroundColor: "#FFCA3E",
    width: "2px"
};
///////

const pauseplayDivStyle = {
    left: "10px",
    width: "20px",
    height: "20px",
    margin: 0,
    padding: "2em",
    position: "fixed",
    bottom: -5
}
  
class MapOverlayItems extends React.Component {

    constructor(props) {
        super(props);
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
            windowAutoOpen: true,
            birthPins: true,
            deathPins: true,
            lines: true,
            optionsOpen: false,
            sliderMin: null,
            sliderMax: null,
        }
    }

    onOptionsOpenCloseClick() {
        this.setState({optionsOpen: !this.state.optionsOpen});
    }

    componentDidMount () {
        const earliestBirthYear = this.findEarliestBirthYear();
        this.setState({sliderMin: (Math.floor(earliestBirthYear/10))*10});
        const latestDeathYear = this.findLatestDeathYear();
        this.setState({sliderMax: ((Math.floor(latestDeathYear/10))+1)*10});
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
        for (let i = this.state.sliderMin; i <= this.state.sliderMax; i=i+10) {
            marks[i] = i;
        }
        return marks;
    }

    onAfterChangeHandler(value) {
        this.setState({year: Math.floor(value)});
    }

    incrementYear() {
        if (this.state.year >= this.state.sliderMax) {
            clearInterval(this.state.intervalId);
            this.setState({animated: false});
        }
        this.setState({year: this.state.year+0.05})
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
                    <span className={styles.tooltiptext}>Collapse panel</span>
                </div></div>
        } else {
            optionsOpenCloseButton =
                <div className={styles.tooltip}>
                <div className={styles.optionsOpenButton}>
                    <svg className="button" viewBox="0 0 60 60" onClick={this.onOptionsOpenCloseClick}>
                        <polygon points="0,20 30,40 60,20" />
                    </svg>
                    <span className={styles.tooltiptext}>Expand panel</span>
                </div></div>
        }

        const allOrTimeSeries = 
            <div>
                <label>
                    <input
                        type="radio"
                        name="allOrTimeSeries"
                        checked={!this.state.timeSeries}
                        onChange={this.onAllOrTimeSeriesClick}
                    />
                    Show all ancestors at once
                </label>
                <label>
                    <input
                        type="radio"
                        name="allOrTimeSeries"
                        checked={this.state.timeSeries}
                        onChange={this.onAllOrTimeSeriesClick}
                    />
                    Show ancestors by time line
                </label>
            </div>
        
        const windowAutoOpen = 
            <div>
                <input type="checkbox" name="windowAutoOpenCheckbox" checked={this.state.windowAutoOpen} onChange={(e) => this.setState({windowAutoOpen: e.target.checked})} disabled={!this.state.timeSeries}/>
                <label for="windowAutoOpenCheckbox">Automatically show birth/death information when event occurs</label>
            </div>

        const birthPins = 
            <div>
                <input type="checkbox" name="birthPins" checked={this.state.birthPins} onChange={(e) => this.setState({birthPins: e.target.checked})} disabled={this.state.markerType==='Moving'}/>
                <label for="birthPins">Show birth locations</label>
            </div>

        const deathPins = 
            <div>
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
                {allOrTimeSeries}
                {birthPins}
                {deathPins}
                {lines}
                {windowAutoOpen}
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
                            year={this.state.year}
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

        let slider;
        if (!this.state.timeSeries) {
            slider = <></>;
        } else if (this.state.animated) {
            slider = 
                <div className={styles.wrapperStyle}>
                    <Slider
                        min={this.state.sliderMin}
                        max={this.state.sliderMax}
                        step={0.01}
                        defaultValue={this.state.sliderMin}
                        value={this.state.year}
                        marks={this.getMarks()}
                        dotStyle={dotStyle}
                        handleStyle={handleStyle}
                        trackStyle={trackStyle}
                        activeDotStyle={activeDotStyle}
                    />
                </div>
        } else {
            slider = 
                <div className={styles.wrapperStyle}>
                    <Slider
                        min={this.state.sliderMin}
                        max={this.state.sliderMax}
                        step={0.01}
                        defaultValue={this.state.sliderMin}
                        marks={this.getMarks()}
                        dotStyle={dotStyle}
                        handleStyle={handleStyle}
                        trackStyle={trackStyle}
                        activeDotStyle={activeDotStyle}
                        onAfterChange={value => this.onAfterChangeHandler(value)}
                    />
                </div>
        }
 
        return (
            <div>
                {optionsBox}
                {markers}
                {pauseplay}
                {slider}
            </div> 
        )
    }
}

export default MapOverlayItems;