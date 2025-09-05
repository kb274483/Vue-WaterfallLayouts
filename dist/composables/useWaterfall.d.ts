import type { WaterfallItem, WaterfallPosition } from '@/types';
export declare function useWaterfall(items: WaterfallItem[], options: {
    columns?: number;
    gap?: number;
    minColumnWidth?: number;
    hoverEffect?: boolean;
    fadeInAndOut?: boolean;
}): {
    containerRef: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
    itemPositions: import("vue").Ref<Map<string | number, {
        x: number;
        y: number;
        width: number;
        height: number;
    }> & Omit<Map<string | number, WaterfallPosition>, keyof Map<any, any>>, Map<string | number, WaterfallPosition> | (Map<string | number, {
        x: number;
        y: number;
        width: number;
        height: number;
    }> & Omit<Map<string | number, WaterfallPosition>, keyof Map<any, any>>)>;
    containerHeight: import("vue").Ref<number, number>;
    isLoading: import("vue").Ref<boolean, boolean>;
    hoverEffect: boolean;
    calculateLayout: () => Promise<void>;
    renderColumnWidth: import("vue").Ref<number, number>;
    setItemRef: (el: HTMLElement | null, item: WaterfallItem) => void;
    visibleItemIds: import("vue").Ref<Set<string | number> & Omit<Set<string | number>, keyof Set<any>>, Set<string | number> | (Set<string | number> & Omit<Set<string | number>, keyof Set<any>>)>;
};
