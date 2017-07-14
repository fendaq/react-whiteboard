import React from 'react';
import PropTypes from 'react-proptypes';

import * as Constants from './Constants';
import EventStream from './EventStream';
import EventStore from './EventStore';
import CursorPane from './CursorPane';
import CanvasPane from './CanvasPane';


export default class Whiteboard extends React.Component {

    constructor(props) {
        super(props);

        this.events = props.events || new EventStream();
        this.state = {
            eventStore: props.eventStore || new EventStore(),
            mode: Constants.MODE.HAND,
            strokeWidth: 5,
            strokeColor: 'black',
        };
    }

    getChildContext() {
        return {
            events: this.events,
        };
    }

    componentDidMount() {
        this.setupEventHandler();
    }

    setupEventHandler() {
        this.events.on('start', point => {
            this.startDrawing(point);
        });
        this.events.on('stop', () => {
            this.stopDrawing();
        });

        this.events.on('set', event => {
            if (event.key === 'strokeWidth') {
                this.changeStrokeWidth(event.value);
            }
            if (event.key === 'strokeColor') {
                this.changeStrokeColor(event.value);
            }
        });

        this.events.on('selectLayer', layer => {
            this.selectLayer(layer);
        });
        this.events.on('addLayer', () => {
            this.addLayer();
        });

        this.events.on('paste', image => {
            this.pasteImage(image);
        });
        this.events.on('push', point => {
            this.pushPoint(point);
        });

        this.events.on('undo', () => {
            this.undo();
        });
        this.events.on('redo', () => {
            this.redo();
        });
        this.events.on('clear', () => {
            this.clear();
        });
    }

    startDrawing(point) {
        this.state.eventStore.startDrawing(this.state.strokeWidth, this.state.strokeColor, point);
        this.setState({
            mode: Constants.MODE.LINE,
            eventStore: this.state.eventStore,
        });
    }

    stopDrawing() {
        this.state.eventStore.stopDrawing();
        this.setState({
            mode: Constants.MODE.HAND,
            eventStore: this.state.eventStore,
        });
    }

    changeStrokeWidth(width) {
        this.state.eventStore.stopDrawing();
        this.setState({
            strokeWidth: width,
            eventStore: this.state.eventStore,
        });
    }

    changeStrokeColor(color) {
        this.state.eventStore.stopDrawing();
        this.setState({
            strokeColor: color,
            eventStore: this.state.eventStore,
        });
    }

    selectLayer(layer) {
        this.state.eventStore.selectLayer(layer);
        this.setState({
            layer: layer,
            eventStore: this.state.eventStore,
        });
    }

    addLayer() {
        this.state.eventStore.addLayer();
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    pasteImage(image) {
        this.state.eventStore.pasteImage(image);
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    pushPoint(point) {
        this.state.eventStore.pushPoint(this.state.strokeWidth, this.state.strokeColor, point);
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    undo() {
        this.state.eventStore.undo();
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    redo() {
        this.state.eventStore.redo();
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    clear() {
        this.state.eventStore.clear();
        this.setState({
            eventStore: this.state.eventStore,
        });
    }

    render() {
        const wrapperStyle = {
            position: 'relative',
            width: this.props.width,
            height: this.props.height,
        };

        return (
            <div style={wrapperStyle}>
                <CursorPane {...this.props} {...this.state}></CursorPane>
                <CanvasPane {...this.props} {...this.state}></CanvasPane>
            </div>
        );
    }
}

Whiteboard.propTypes = {
    events: PropTypes.object,
    eventStore: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.shape({
        backgroundColor: PropTypes.string,
    }),
};

Whiteboard.childContextTypes = {
    events: PropTypes.object,
};
