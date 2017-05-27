import React from 'react';
import PropTypes from 'react-proptypes';


export default class CanvasPane extends React.Component {

    render() {
        const canvasLayerStyle = {
            position: 'absolute',
            width: this.props.width,
            height: this.props.height,
            background: this.props.style.backgroundColor,
        };

        return (
            <div style={canvasLayerStyle}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                     width={this.props.width} height={this.props.height}>
                    {this.drawWhiteboardCanvas()}
                </svg>
            </div>
        );
    }

    drawWhiteboardCanvas() {
        return this.props.dataHolder.dataset
            .reduce((prev, element) => {
                if (!element.point) {
                    prev.push({
                        strokeWidth: null,
                        strokeColor: null,
                        values: [],
                    });
                    return prev;
                }

                if (prev.length === 0) {
                    prev.push({
                        strokeWidth: element.strokeWidth,
                        strokeColor: element.strokeColor,
                        values: [element.point],
                    });
                    return prev;

                } else {
                    let last = prev[prev.length - 1];
                    if (last.strokeWidth === element.strokeWidth && last.strokeColor === element.strokeColor) {
                        last.strokeWidth = element.strokeWidth;
                        last.strokeColor = element.strokeColor;
                        last.values.push(element.point);
                        return prev;

                    } else {
                        prev.push({
                            strokeWidth: element.strokeWidth,
                            strokeColor: element.strokeColor,
                            values: [element.point],
                        });
                        return prev;
                    }
                }
            }, [])
            .filter((element) => {
                return element.values.length > 1;
            })
            .map((element, index) => {
                const k = index;
                const d = element.values.map((point, index) => {
                    if (index === 0) {
                        return 'M ' + point.x + ' ' + point.y;
                    } else {
                        return 'L ' + point.x + ' ' + point.y;
                    }
                });

                return (
                    <path key={k} d={d.join(' ')} fill="none" stroke={element.strokeColor} strokeWidth={element.strokeWidth}></path>
                );
            });
    }
}

CanvasPane.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    dataHolder: PropTypes.object,
    style: PropTypes.shape({
        backgroundColor: PropTypes.string,
    }),
};
