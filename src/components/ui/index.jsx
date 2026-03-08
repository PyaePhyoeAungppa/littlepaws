import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'bg-transparent text-text-muted hover:bg-white/50',
  };

  return (
    <button
      className={twMerge('btn', variants[variant], className)}
      {...props}
    />
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div className={twMerge('card', className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ children, className }) {
  return (
    <span className={twMerge('px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider', className)}>
      {children}
    </span>
  );
}
