import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Badge = ({ children, variant = 'neutral', className }) => {
    const variants = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-success/10 text-success border-success/20',
        warning: 'bg-warning/10 text-warning border-warning/20',
        error: 'bg-error/10 text-error border-error/20',
        neutral: 'bg-textMuted/5 text-textMuted border-border',
    };

    return (
        <span className={clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'success', 'warning', 'error', 'neutral']),
    className: PropTypes.string,
};

export default Badge;
