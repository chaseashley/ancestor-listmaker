import React from 'react';
import StaticMarkers from './StaticMarkers';
import MovingMarker from './MovingMarker';
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const wrapperStyle = {
    left: "60px",
    width: "85%",
    margin: 0,
    padding: "2em",
    position: "fixed",
    bottom: 0
};

const pauseplayDivStyle = {
    left: "10px",
    width: "20px",
    height: "20px",
    margin: 0,
    padding: "2em",
    position: "fixed",
    bottom: -5
}
  
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
  
class MarkersWithSlider extends React.Component {

    constructor(props) {
        super(props);
        this.getMarks = this.getMarks.bind(this);
        this.onAfterChangeHandler = this.onAfterChangeHandler.bind(this);
        this.onPausePlayClick = this.onPausePlayClick.bind(this);
        this.incrementYear = this.incrementYear.bind(this);
        this.state={
            year: this.props.sliderMin,
            intervalId: null,
            animated: false
        }
    }

    getMarks() {
        let marks = {};
        for (let i = this.props.sliderMin; i <= this.props.sliderMax; i=i+10) {
            marks[i] = i;
        }
        return marks;
    }

    onAfterChangeHandler(value) {
        this.setState({year: Math.floor(value)});
    }

    incrementYear() {
        if (this.state.year >= this.props.sliderMax) {
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
        if (this.state.year < this.props.sliderMax) {
            this.setState({animated: !this.state.animated})
        }
    }

    render() {

        let markers;
        if (this.props.markerType === 'static') {
            markers = this.props.ancestors.map((ancestor, index) => {
                return <StaticMarkers key={index} id={index}
                            year={this.state.year}
                            ancestor={ancestor}
                            birthYear={Number(ancestor.BirthDate.substring(0,4))}
                            deathYear={Number(ancestor.DeathDate.substring(0,4))}
                            birthPins={this.props.birthPins}
                            deathPins={this.props.deathPins}
                            lines={this.props.lines}
                            animated={this.state.animated}
                            windowAutoOpen={this.props.windowAutoOpen}
                            visible={(this.state.year === null) ? true : (Number(ancestor.BirthDate.substring(0,4)) <= this.state.year && Number(ancestor.DeathDate.substring(0,4)) >= this.state.year) ? true : false}
                        />
            })
        } else {
            markers = this.props.ancestors.map((ancestor, index) => {
                return <MovingMarker key={index} id={index}
                            ancestor={ancestor}
                            birthYear={Number(ancestor.BirthDate.substring(0,4))}
                            deathYear={Number(ancestor.DeathDate.substring(0,4))}
                            birthPins={this.props.birthPins}
                            deathPins={this.props.deathPins}
                            lines={this.props.lines}
                            animated={this.state.animated}
                            year={this.state.year}
                        />
            })
        }

        let pauseplay;
        if (this.state.animated) {
            pauseplay =
                <div style={pauseplayDivStyle}>
                    <svg className="button" viewBox="0 0 60 60" onClick={this.onPausePlayClick}>
                    <polygon points="0,0 15,0 15,60 0,60" />
                    <polygon points="25,0 40,0 40,60 25,60" />
                    </svg>
                </div>
        } else {
            pauseplay =
                <div style={pauseplayDivStyle}>
                    <svg className="button" viewBox="0 0 60 60" onClick={this.onPausePlayClick}>
                        <polygon points="0,0 50,30 0,60" />
                    </svg>
                </div>
        }

        let slider;
        if (this.state.animated) {
            slider = 
                <div style={wrapperStyle}>
                <Slider
                    min={this.props.sliderMin}
                    max={this.props.sliderMax}
                    step={0.01}
                    defaultValue={this.props.sliderMin}
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
                <div style={wrapperStyle}>
                <Slider
                    min={this.props.sliderMin}
                    max={this.props.sliderMax}
                    step={0.01}
                    defaultValue={this.props.sliderMin}
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
                    {markers}
                    {pauseplay}
                    {slider}
                </div> 
        )
    }
}

export default MarkersWithSlider;