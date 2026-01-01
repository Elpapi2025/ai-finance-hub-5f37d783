import {
  NavLink as RouterNavLink,
  NavLinkProps,
  useNavigate,
} from "react-router-dom";
import { forwardRef, useTransition, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className" | "onClick"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      to,
      onClick,
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate();
    const [isTransitioning, startTransition] = useTransition();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(event);

      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      
      event.preventDefault();

      startTransition(() => {
        navigate(to);
      });
    };

    return (
      <RouterNavLink
        ref={ref}
        to={to}
        onClick={handleClick}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, (isPending || isTransitioning) && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
