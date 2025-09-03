import React from "react";
import { useNavigate } from "react-router-dom";

export interface SmoothLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

const SmoothLink = React.forwardRef<HTMLAnchorElement, SmoothLinkProps>(
  ({ to, replace = false, onClick, children, ...rest }, ref) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.altKey ||
        e.ctrlKey ||
        e.shiftKey ||
        rest.target === "_blank"
      ) {
        return;
      }

      e.preventDefault();

      const go = () => navigate(to, { replace });
      // Use View Transitions API when available for a native crossfade
      const anyDoc = document as any;
      if (typeof anyDoc.startViewTransition === "function") {
        try {
          anyDoc.startViewTransition(() => {
            go();
          });
          return;
        } catch {
          // fallthrough to immediate navigation
        }
      }
      go();
    };

    const rel = rest.target === "_blank" ? (rest.rel ? `${rest.rel} noopener noreferrer` : "noopener noreferrer") : rest.rel;
    return (
      <a href={to} ref={ref} onClick={handleClick} {...rest} rel={rel}>
        {children}
      </a>
    );
  }
);

SmoothLink.displayName = "SmoothLink";

export default SmoothLink;
