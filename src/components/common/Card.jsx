import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Card = ({ children, className, title, action }) => {
    return (
        <div className={clsx("bg-card border border-border rounded-lg shadow-sm transition-colors duration-200", className)}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    {title && <h2 className="text-lg font-semibold font-heading text-textPrimary">{title}</h2>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string,
    action: PropTypes.node,
};

export default Card;
