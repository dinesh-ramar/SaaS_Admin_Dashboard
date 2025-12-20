import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    className,
    disabled,
    type = 'button',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm",
        secondary: "bg-white dark:bg-slate-800 text-textPrimary dark:text-slate-100 border border-border dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 focus:ring-primary shadow-sm",
        danger: "bg-error text-white hover:bg-error/90 focus:ring-error shadow-sm",
        ghost: "text-textMuted dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-textPrimary dark:hover:text-slate-100"
    };

    return (
        <button
            type={type}
            className={clsx(baseStyles, variants[variant], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
    isLoading: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
