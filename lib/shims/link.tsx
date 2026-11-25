import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface NextLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  [key: string]: any;
}

export default function Link({ href, children, ...props }: NextLinkProps) {
  // If it is an external link or anchor, use standard <a> tag
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
}
