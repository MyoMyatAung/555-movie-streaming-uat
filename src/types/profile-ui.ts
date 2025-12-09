/**
 * Type definitions for Profile UI components
 * These types ensure type safety and improve code maintainability
 */

import { FC, SVGProps } from "react";

/**
 * Type for SVG React components imported from .svg?react files
 */
export type SvgComponent = FC<SVGProps<SVGSVGElement>>;

/**
 * Type for Lucide React icon components
 */
export type IconComponent = FC<{ className?: string; size?: number }>;

/**
 * Configuration for a quick action button
 */
export interface QuickAction {
  /** Display label (translation key) */
  label: string;
  /** Icon component to display */
  icon: SvgComponent | IconComponent;
  /** CSS gradient classes for background */
  gradient: string;
  /** Optional navigation path */
  to?: string;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Configuration for a list item in watchlist or support sections
 */
export interface ListItemConfig {
  /** Display label (translation key) */
  label: string;
  /** Icon component to display */
  icon: SvgComponent | IconComponent;
  /** Optional value to display (e.g., invitation code) */
  value?: string;
  /** Optional navigation path */
  to?: string;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Props for ListSection component
 */
export interface ListSectionProps {
  /** Array of list items to display */
  items: ListItemConfig[];
  /** Optional CSS classes */
  className?: string;
}

/**
 * Props for QuickActionGrid component
 */
export interface QuickActionGridProps {
  /** Array of quick actions to display */
  actions: QuickAction[];
  /** Optional CSS classes */
  className?: string;
}

/**
 * Modal state management
 */
export interface ModalState {
  language: boolean;
  share: boolean;
  login: boolean;
  signup: boolean;
}

/**
 * Type for modal keys
 */
export type ModalKey = keyof ModalState;

