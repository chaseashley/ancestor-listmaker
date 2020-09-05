import React from 'react';
import { Slider, Handles, Ticks } from 'react-compound-slider'


const sliderStyle = {  // Give the slider some width
    position: 'relative',
    width: '100%',
    height: 80,
    border: '1px solid steelblue',
}

const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 10,
    marginTop: 35,
    borderRadius: 5,
    backgroundColor: '#8B9CB6',
}

render() {
    if (this.state.markerType === 'static') {
        markers = this.state.ancestors.map((ancestor, index) => {
            return <StaticMarkers key={index} id={index}
                        ancestor={ancestor}
                        birthYear={Number(ancestor.BirthDate.substring(0,4))}
                        deathYear={Number(ancestor.DeathDate.substring(0,4))}
                        birthPins={this.state.birthPins}
                        deathPins={this.state.deathPins}
                        lines={this.state.lines}
                        timeSeries={this.state.timeSeries}
                        year={(this.state.timeSeries) ? this.state.earliestBirthYear-2 : this.state.year}
                    />
        })
    } else {
        markers = this.state.ancestors.map((ancestor, index) => {
            return <MovingMarker key={index} id={index}
                        ancestor={ancestor}
                        birthYear={Number(ancestor.BirthDate.substring(0,4))}
                        deathYear={Number(ancestor.DeathDate.substring(0,4))}
                        birthPins={this.state.birthPins}
                        deathPins={this.state.deathPins}
                        lines={this.state.lines}
                        timeSeries={this.state.timeSeries}
                        year={(this.state.timeSeries) ? this.state.earliestBirthYear-2 : this.state.year}
                    />
        })
    }

    const slider =  <Slider
                        rootStyle={sliderStyle} /* inline styles for the outer div. Can also use className prop. */
                        domain={[0, 100]}
                        values={[10]}
                    >
                        <div style={railStyle}/> /* Add a rail as a child.  Later we'll make it interactive. */
                    </Slider>
    
    return (
            <>
                {markers}
                {slider}
            </> 
    )
}