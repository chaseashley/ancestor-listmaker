import React, { Component } from 'react';
import styles from './togglebuttonstyles.module.css';

class ToggleButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let togglebutton;
        if (this.props.active) {
            togglebutton = <button onClick={this.props.onClick} disabled={this.props.disabled} className={styles.activeButton}>{this.props.label}</button>
        } else {
            togglebutton = <button onClick={this.props.onClick} disabled={this.props.disabled}>{this.props.label}</button>
        
        }
        return (<>{togglebutton}</>);
    }
}

export default ToggleButton;
