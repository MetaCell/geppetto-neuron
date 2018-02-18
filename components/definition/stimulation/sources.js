import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Utils from '../../../Utils';

import NetPyNEField from '../../general/NetPyNEField';
var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
/**
 *   Sources selection
 */
export default class SourcesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modelName: props.modelName,
            source: null
        };
        this.stimSourcesOptions = [{ label: 'Toy Source 1', value: 'Toy source 1' }, { label: 'Toy Source 2', value: 'Toy source 2' }, { label: 'Toy Source 3', value: 'Toy source 3' }];

    }
  
    render() {
        return (
            <div>
                <NetPyNEField id="netParams.stimTargetParams.source" >
                    <SelectField
                        value={this.state.source}
                        onChange={(event, index, value) => this.setState({ source: value })}
                    >
                        {(this.stimSourcesOptions != undefined) ?
                            this.stimSourcesOptions.map(function (stimSourcesOption) {
                                return (<MenuItem key={stimSourcesOption.value} value={stimSourcesOption.value} primaryText={stimSourcesOption.label} />)
                            }) : null}
                    </SelectField>
                </NetPyNEField>
            </div>
        );
    }
}
