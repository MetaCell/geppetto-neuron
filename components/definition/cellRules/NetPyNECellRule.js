import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';
import clone from 'lodash.clone';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

export default class NetPyNECellRule extends React.Component {

  constructor(props) {
    super(props);
    var model = clone(props.model);
    var _this = this;
    this.state = {
      currentName: model.name,
      model: model,
      page: 'main'
    };
  }

  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.state.model.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      // Rename the population in Python
      Utils.renameKey('netParams.cellParams', storedValue, newValue, (response, newValue) => { });
    });

  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 500);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.model.name, model: nextProps.model });
  }

  render() {
    var that = this;
    var content = (<div>

      <TextField
        onChange={this.handleRenameChange}
        value = {this.state.currentName}
        floatingLabelText="The name of the cell rule"
        className={"netpyneField"}
      />

      <br/>

      <NetPyNEField id="netParams.cellParams.conds.cellModel" >
        <PythonControlledTextField model={"netParams.cellParams['" + this.state.model.name + "']['conds']['cellModel']"} />
      </NetPyNEField>

      <NetPyNEField id="netParams.cellParams.conds.cellType" >
        <PythonControlledTextField model={"netParams.cellParams['" + this.state.model.name + "']['conds']['cellType']"} />
      </NetPyNEField>
      <br /><br />

      <RaisedButton
        label="Sections"
        labelPosition="before"
        primary={true}
        onClick={() => that.props.selectPage("sections")}
      />
    </div>);

    return (
      <div>
        {content}
      </div>
    );
  }
}
