// Canvas.js
'use strict';

import React from 'react';
import d3 from 'd3';

const line = d3.svg.line()
    .x(d => d[0])
    .y(d => d[1]);

const layerAdjust = 20;

export default class Canvas extends React.Component {

    static get propTypes() {
        return {
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            dataset: React.PropTypes.array,
            style: React.PropTypes.object
        };
    }

    static get contextTypes() {
        return {
            emitter: React.PropTypes.object
        };
    }

    componentDidMount() {
        d3.select(this.refs.canvas).append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        let that = this;
        d3.select(this.refs.layer).on('mousemove.canvas', function() {
            const point = [d3.event.offsetX, d3.event.offsetY + 24 - layerAdjust];
            that.context.emitter.emit('mousemove.canvas', point);
        });

        this.renderCanvas();
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    render() {
        let wrapperStyle = {
            position: 'relative',
            width: this.props.width,
            height: this.props.height
        };
        let cursorLayerStyle = {
            position: 'absolute',
            top: -layerAdjust,
            zIndex: 9999,
            width: this.props.width,
            height: this.props.height,
            cursor: 'url(css/ic_edit_' + this.props.strokeColor + '_24px.svg), default'
        };
        let canvasStyle = Object.assign({}, {
            position: 'absolute',
            top: 0,
            width: this.props.width,
            height: this.props.height,
            border: 'solid 2px #333',
            backgroundColor: '#f6f6f6'
        }, this.props.style);
        return (
            <div style={wrapperStyle}>
                <div ref="layer" style={cursorLayerStyle}></div>
                <div ref="canvas" style={canvasStyle}></div>
            </div>
        );
    }

    renderCanvas() {
        let svg = d3.select('svg');
        svg.selectAll('path').remove();
        for (var i = 0; i < this.props.dataset.length; i++) {
            var d = this.props.dataset[i];
            if (d.values.length <= 1) {
                continue;
            }
            svg.append('path')
                .datum(d.values)
                .classed('line', true)
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', d.strokeColor)
                .attr('stroke-width', d.strokeWidth);
        }
    }

}