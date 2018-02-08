import React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Utils from '../../Utils';

const TransitionDialog = React.createClass({
    getInitialState() {
        return {
            transitionOpen: false,
            parallelSimulation: false,
            previousTab: "define"
        };
    },

    componentWillReceiveProps: function (nextProps) {
        // switch (nextProps.tab) {
        //TODO: we need to define the rules here
        if (this.props.tab != nextProps.tab){
            this.setState({
                transitionOpen: true,
                previousTav: this.props.tab
            });
        }
    },

    closeTransition() {
        this.setState({ transitionOpen: false });
    },

    instantiate(model) {
        GEPPETTO.CommandController.log("The NetPyNE model is getting instantiated...");
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.INSTANTIATING_MODEL);
        this.closeTransition();
        Utils.sendPythonMessage('netpyne_geppetto.instantiateNetPyNEModelInGeppetto', [])
            .then(response => {
                GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
                GEPPETTO.Manager.loadModel(JSON.parse(response));
                GEPPETTO.CommandController.log("The NetPyNE model instantiation was completed");
                GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner); 
            });
    },

    simulate(model) {
        GEPPETTO.CommandController.log("The NetPyNE model is getting simulated...");
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.RUNNING_SIMULATION);
        this.closeTransition();
        Utils.sendPythonMessage('netpyne_geppetto.simulateNetPyNEModelInGeppetto ', [this.state])
            .then(response => {
                GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
                GEPPETTO.Manager.loadModel(JSON.parse(response));
                GEPPETTO.CommandController.log("The NetPyNE model simulation was completed");
                GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner); 
            });
    },

    render() {
        var confirmActionDialog = this.closeTransition;
        switch (this.props.tab) {
            case "define":
                var children  =  "You are back to network definition, any changes will require to reinstantiate your network."
                break;
            case "explore":
                var children = "We are about to instantiate your network, this could take some time.";
                confirmActionDialog = this.instantiate
                break;
            case "simulate":
                var children = (
                        <div>
                            <div className="netpyneField">
                                We are about to simulate your network, this could take some time.
                            </div>
                            <div className="netpyneField" style={{marginTop:'35px'}}>
                                <Checkbox
                                    label="Run parallel simulation"
                                    checked={this.state.parallelSimulation}
                                    onCheck={() => this.setState((oldState) => {
                                        return {
                                            parallelSimulation: !oldState.parallelSimulation,
                                        };
                                    })}
                                />
                            </div>
                            <div className="netpyneField netpyneRightField">
                                <TextField
                                    floatingLabelText="Number of cores"
                                    type="number"
                                    onChange={(event) => this.setState({ cores: event.target.value })}
                                />
                            </div>
                        </div>
                    )
                    confirmActionDialog = this.simulate
                break;
        }

        return (
            <Dialog
                title="NetPyNE"
                actions={<FlatButton
                    label="Ok"
                    primary={true}
                    keyboardFocused={true}
                    onClick={confirmActionDialog}
                />}
                modal={true}
                open={this.state.transitionOpen}
                onRequestClose={this.closeTransition}
            >
                {children}
            </Dialog>
        );
    },
});

export default TransitionDialog;