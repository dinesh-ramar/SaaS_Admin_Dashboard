import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Input = ({
    label,
    error,
    className,
    id,
    type = "text",
    ...props
}) => {
    return (
        <div className={clsx("w-full transition-colors duration-200", className)}>
            {label && (
                <label htmlFor={id} className="block mb-1 text-sm font-medium text-textPrimary">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={clsx(
                    "w-full px-3 py-2 border rounded-md shadow-sm placeholder-textMuted bg-card text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                    error
                        ? "border-error focus:border-error"
                        : "border-border focus:border-primary"
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
};

export default Input;
