
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import NetPyNEPopulationThumbnail from './NetPyNEPopulationThumbnail';
import NetPyNEPopulation from './NetPyNEPopulation';
import NetPyNENewPopulation from './NetPyNENewPopulation';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import Utils from '../../Utils';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },

  tabContainer: {
    padding: 10,
    height: 500,
    overflow: 'auto'
  },
  card: {
    clear: 'both'
  },
  thumbnails: {
    width: '60%',
    height: 420,
    overflow: 'auto',
    float: 'left'
  },
  details: {
    float: 'left',
    marginLeft: 50
  }
};

export default class NetPyNEPopulations extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      model: props.model,
      selectedPopulation: undefined
    };

    this.handleNewPopulation = this.handleNewPopulation.bind(this);
    this.selectPopulation = this.selectPopulation.bind(this);
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  handleNewPopulation(defaultPopulationValues) {
    // Get Key and Value
    var key = Object.keys(defaultPopulationValues)[0];
    var value = defaultPopulationValues[key];
    var model = this.state.model;

    // Get New Available ID
    var populationId = Utils.getAvailableKey(model, key);

    // Create Population Object
    var newPopulation = Object.assign({name: populationId}, value);

    // Create Population Client side
    Utils.execPythonCommand('netpyne_geppetto.netParams.popParams["' + populationId + '"] = ' + JSON.stringify(value))

    // Update state
    model[populationId] = newPopulation;
    this.setState({
      model: model,
      selectedPopulation: newPopulation
    });

  }

  selectPopulation(population) {
    this.setState({ model: this.state.model, selectedPopulation: population });
  }

  render() {

    var populations = [];
    for (var key in this.state.model) {
      populations.push(<NetPyNEPopulationThumbnail selected={this.state.selectedPopulation && key == this.state.selectedPopulation.name} model={this.state.model[key]} path={key} handleClick={this.selectPopulation} />);
    }
    var selectedPopulation = undefined;
    if (this.state.selectedPopulation) {
      selectedPopulation = <NetPyNEPopulation requirement={this.props.requirement} model={this.state.selectedPopulation} path={this.state.selectedPopulation.name} />;
    }

    return (
      <Card style={styles.card}>
        <CardHeader
          title="Populations"
          subtitle="Define here the populations of your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <Paper style={styles.tabContainer} expandable={true}>
          <IconMenu style={{ float: 'left' }}
            iconButtonElement={
              <NetPyNENewPopulation handleClick={this.handleNewPopulation} />
            }
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
          </IconMenu>
          <div style={{ clear: 'both' }} />
          <div style={styles.thumbnails}>
            {populations}
          </div>
          <div style={styles.details}>
            {selectedPopulation}
          </div>
        </Paper>
      </Card>

    );
  }
}
