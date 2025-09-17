/**
 * CSS Anchor Positioning API type extensions for React
 *
 * Extends React CSSProperties to support modern CSS Anchor Positioning properties.
 * These properties are supported in modern browsers (Chrome, Edge, Safari 18+).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
 */
declare module 'react' {
  interface CSSProperties {
    /**
     * Sets the anchor name for an element that can be referenced by positioned elements.
     * @example anchorName: '--my-anchor'
     */
    anchorName?: string;

    /**
     * Associates a positioned element with an anchor element.
     * @example positionAnchor: '--my-anchor'
     */
    positionAnchor?: string;

    /**
     * Controls how a positioned element aligns relative to its anchor.
     * @example justifySelf: 'anchor-center' | 'anchor-start' | 'anchor-end'
     */
    justifySelf?: string;

    /**
     * Defines fallback positions when the element would be clipped or overflow.
     * @example positionTry: 'flip-inline' | 'flip-block' | 'flip-start'
     */
    positionTry?: string;

    /**
     * Specifies a list of alternative position try options.
     * Modern property name for position-try-fallbacks.
     * @example positionTryFallbacks: '--fallback-left, --fallback-right'
     */
    positionTryFallbacks?: string;
  }
}

export {};
