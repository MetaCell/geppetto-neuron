import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Utils from '../../../Utils';
import Toggle from 'material-ui/Toggle';

import NetPyNEField from '../../general/NetPyNEField';
var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

/**
 *   netStim selection
 */
const styles = {
    block: {maxWidth: 180,},
    toggle: {marginBottom: 16,},
  };
export default class NetStimComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modelName: props.modelName,
            isToggleOn: false,
        }
        this.handleToggle = this.handleToggle.bind(this)
    }
    

  handleToggle() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

    render() {
        return (
            <div>
                <div style={styles.block}>
                    <Toggle 
                        label="enable - NetStim"
                        style={styles.toogle}
                        onToggle={this.handleToggle}
                    />
                </div>
                <NetPyNEField id="netParams.stimTargetParams.Target.synMech" >
                    <PythonControlledTextField
                        disabled={!this.state.isToggleOn}
                        model={"netParams.stimTargetParams['" + this.state.modelName + "']['synMech']"}
                    />
                </NetPyNEField>

                <NetPyNEField id="netParams.stimTargetParams.Target.weight" >
                    <PythonControlledTextField
                        disabled={!this.state.isToggleOn}
                        model={"netParams.stimTargetParams['" + this.state.modelName + "']['weight']"}
                    />
                </NetPyNEField>

                <NetPyNEField id="netParams.stimTargetParams.Target.delay" >
                    <PythonControlledTextField
                        disabled={!this.state.isToggleOn}
                        model={"netParams.stimTargetParams['" + this.state.modelName + "']['delay']"}
                    />
                </NetPyNEField>

                <NetPyNEField id="netParams.stimTargetParams.Target.synsPerConn" >
                    <PythonControlledTextField
                        disabled={!this.state.isToggleOn}
                        model={"netParams.stimTargetParams['" + this.state.modelName + "']['synPerConn']"}
                    />
                </NetPyNEField>

            </div>
        );
    }
}