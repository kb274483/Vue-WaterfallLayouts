export interface WaterfallItem {
    id: number | string;
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    [key: string]: unknown;
}
export interface WaterfallProps {
    items: WaterfallItem[];
    columns?: number;
    gap?: number;
    minColumnWidth?: number;
    hoverEffect?: boolean;
    fadeInAndOut?: boolean;
    hoverFunction?: (item: WaterfallItem) => void;
    clickFunction?: (item: WaterfallItem) => void;
    hoverLeaveFunction?: (item: WaterfallItem) => void;
}
export interface WaterfallPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}
