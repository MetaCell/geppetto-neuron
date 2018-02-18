import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import Toggle from 'material-ui/Toggle';
import Slider from '../../general/Slider';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';

import clone from 'lodash.clone';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';

import SourcesComponent from './sources';
import NetStimComponent from './netStims';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);

export default class NetPyNEStimulationTarget extends React.Component {

  constructor(props) {
    super(props);
    var _this = this;
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General"
      };
    }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name, selectedIndex: 0, sectionId: "General" });
  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  getModelParameters = () => {
    var select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId })
    var modelParameters = [];
    modelParameters.push(<BottomNavigationItem key={'General'} label={'General'} icon={<FontIcon className={"fa fa-bars"} />} onClick={() => select(0, 'General')} />);
    modelParameters.push(<BottomNavigationItem key={'NetStim'} label={'NetStim'} icon={<FontIcon className={"fa fa-cube"} />} onClick={() => select(1, 'NetStim')} />);
    return modelParameters;
  }


  shouldComponentUpdate(nextProps, nextState) {
    return this.state.model == undefined ||
      this.state.currentName != nextState.currentName ||
      this.state.cellModelFields != nextState.cellModelFields
  }  

  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.props.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      Utils.renameKey('netParams.netStimTarget', storedValue, newValue, (response, newValue) => {that.renaming=false});
      that.renaming=true;
    });
  }

  


  render() {
    if (this.state.sectionId == "General") {
      var content = 
        <div>
          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            floatingLabelText="The label of your Target Stimulation"
            className={"netpyneField"}
          />
          
          <SourcesComponent modelName={this.props.name}/>
          
          <NetPyNEField id="netParams.stimTargetParams.Target.sec" >
              <PythonControlledTextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['sec']"}
              />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimTargetParams.Target.loc" >
              <PythonControlledTextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['loc']"}
              />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimTargetParams.Target.conds" >
              <PythonControlledTextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['conds']"}
              />
          </NetPyNEField>

        </div>
    } 
    else if (this.state.sectionId == "NetStim"){
      var content = <NetStimComponent modelName={this.props.name} />
    }
    return (
      <div>
        <CardText>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            {this.getModelParameters()}
          </BottomNavigation>
        </CardText>
        <br />
        {content}
      </div>
    );
  }
}
