import { ScriptableContext } from "chart.js";

export function hexToRGBA(hex: string, opacity: number): string {
    const sanitized = hex.replace("#", "");
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}


export function createGradiant(ctx: ScriptableContext<'line'>, lineColor: string, bgGradient: { from: string; to: string }) {
    const chart = ctx.chart;
    const { ctx: canvasCtx, chartArea } = chart;
    if (!chartArea) return lineColor;

    const gradient = canvasCtx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
    );
    gradient.addColorStop(0, bgGradient.from);
    gradient.addColorStop(1, bgGradient.to);
    return gradient;
}