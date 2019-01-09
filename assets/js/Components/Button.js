import React, {Component} from 'react';
import PropTypes from "prop-types";

const Button = (props) => {
    const { className, ...otherProps } = props;

    return (
        <button
            className={`btn ${props.className}`}
            {...otherProps}>
            {props.children}
        </button>
    )
};

Button.propTypes = {
    className: PropTypes.string
};

Button.defaultProps = {
    className: ''
};

export default Button;