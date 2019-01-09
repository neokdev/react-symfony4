import React, {Component} from 'react';
import RepLogs from './RepLogs';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { getRepLogs, deleteRepLog, createRepLog } from "../api/rep_log_api";

class RepLogApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlightedRowId: null,
            repLogs: [],
            numberOfHearts: 1,
            isLoaded: false,
            isSavingNewRepLog: false,
            successMessage: '',
            newRepLogValidationErrorMessage: ''
        };

        this.setSuccesMessageTimeoutHandle = 0;

        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleAddRepLog = this.handleAddRepLog.bind(this);
        this.handleHeartChange = this.handleHeartChange.bind(this);
        this.handleDeleteRepLog = this.handleDeleteRepLog.bind(this);
    }

    componentDidMount() {
        getRepLogs()
            .then(data => this.setState({
                repLogs: data,
                isLoaded: true
            }));
    }

    componentWillUnmount() {
        clearTimeout(this.setSuccesMessageTimeoutHandle);
    }

    handleRowClick = repLogId => this.setState({highlightedRowId: repLogId});

    handleAddRepLog = (item, reps) => {
        const newRep = {
            reps: reps,
            item: item
        };

        this.setState({
            isSavingNewRepLog: true
        });

        const newState = {
            isSavingNewRepLog: false,
        };

        createRepLog(newRep)
            .then(repLog => {
                this.setState(prevState => {
                    const newRepLogs = [...prevState.repLogs, repLog];

                    return {
                        ...newState,
                        repLogs: newRepLogs,
                        newRepLogValidationErrorMessage: ''
                    };
                });

                this.setSuccesMessage('Rep Log Saved!');
            })
            .catch(err => err.response.json()
                .then(errData => {
                    const errors = errData.errors;
                    const firstError = errors[Object.keys(errors)[0]];

                    this.setState({
                        ...newState,
                        newRepLogValidationErrorMessage: firstError
                    })
            }))
    };

    setSuccesMessage = message => {
        this.setState({
            successMessage: message
        });

        clearTimeout(this.setSuccesMessageTimeoutHandle);
        this.setSuccesMessageTimeoutHandle = setTimeout(() => {
            this.setState({
                successMessage: ''
            });

            this.setSuccesMessageTimeoutHandle = 0;
        }, 3000);
    };

    handleDeleteRepLog = id => {
        this.setState(prevState => {
            return {
                repLogs: prevState.repLogs.map(repLog => {
                    if (repLog.id !== id) {
                        return repLog;
                    }

                    return {...repLog, isDeleting: true};
                })
            }
        });

        deleteRepLog(id)
            .then(() => {
                this.setState(prevState => {
                    return {
                        repLogs: prevState.repLogs.filter(repLog => repLog.id !== id)
                    }
                });

                this.setSuccesMessage('Item was Un-lifted!')
            });
    };

    handleHeartChange = (heartCount) =>
        this.setState({
            numberOfHearts: heartCount
        });

    render() {
        return (
            <RepLogs
                {...this.props}
                {...this.state}
                onRowClick={this.handleRowClick}
                onAddRepLog={this.handleAddRepLog}
                onHeartChange={this.handleHeartChange}
                onDeleteRepLog={this.handleDeleteRepLog}
            />
        );
    }
}

RepLogApp.propTypes = {
    withHeart: PropTypes.bool,
    itemOptions: PropTypes.array,
};

RepLogApp.defaultProps = {
    itemOptions: []
};

export default RepLogApp;
