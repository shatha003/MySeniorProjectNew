import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Download, Copy, Check, Loader2 } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { cn } from '../lib/utils';

interface MermaidProps {
    chart: string;
    isStreaming?: boolean;
}

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'Inter, system-ui, sans-serif',
    suppressErrorRendering: true,
    flowchart: { useMaxWidth: true },
    sequence: { useMaxWidth: true },
    er: { useMaxWidth: true },
    class: { useMaxWidth: true },
});

const Mermaid: React.FC<MermaidProps> = ({ chart, isStreaming = false }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [hasError, setHasError] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [debouncedChart, setDebouncedChart] = useState(chart);
    const [isTyping, setIsTyping] = useState(isStreaming);
    const [hasRenderedBefore, setHasRenderedBefore] = useState(false);

    // Maintain a local typing state so we know when the AI finishes this _specific_ 
    // code block, rather than waiting for the entire message to finish streaming.
    useEffect(() => {
        if (!isStreaming) {
            setDebouncedChart(chart);
            setIsTyping(false);
            return;
        }

        setIsTyping(true);
        const timer = setTimeout(() => {
            setDebouncedChart(chart);
            setIsTyping(false); // If no new characters for 500ms, assume block is done
        }, 500);
        return () => clearTimeout(timer);
    }, [chart, isStreaming]);

    useEffect(() => {
        if (!mermaidRef.current || !debouncedChart) return;

        // If it's incomplete and actively streaming, don't clear or show errors yet,
        // just let it build up or show what we have.
        if (isStreaming && debouncedChart.length < 10) return;

        let cancelled = false;

        const renderDiagram = async () => {
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, debouncedChart);
                if (cancelled) return;

                if (mermaidRef.current) {
                    mermaidRef.current.innerHTML = svg;
                    setHasRenderedBefore(true);
                    setHasError(false);
                }
            } catch (error) {
                if (cancelled) return;

                // Ignore parsing errors while typing. We DO NOT clear the old valid
                // SVG during streaming, letting the user see the progress!
                if (isStreaming || isTyping) return;

                setHasError(true);
                console.error('Mermaid rendering failed:', error);
                if (mermaidRef.current) {
                    const escapedChart = debouncedChart
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                    mermaidRef.current.innerHTML = `
                        <div class="flex flex-col gap-2 w-full text-left">
                            <pre class="text-destructive p-4 bg-destructive/10 rounded text-xs whitespace-pre-wrap">Syntax Error: Failed to render diagram. This usually happens when labels aren\'t properly quoted.</pre>
                            <details class="text-[10px] text-muted-foreground cursor-pointer">
                                <summary>Show raw code</summary>
                                <pre class="mt-2 p-2 bg-muted rounded border border-border overflow-x-auto max-w-full">${escapedChart}</pre>
                            </details>
                        </div>
                    `;
                }
            }
        };

        renderDiagram();
        return () => { cancelled = true; };
    }, [debouncedChart, isStreaming, isTyping]);

    /**
     * Gets the raw SVG string from the rendered diagram.
     * Patches it to be a self-contained, standalone SVG with explicit dimensions.
     */
    const getSvgString = (): string | null => {
        const svgNode = mermaidRef.current?.querySelector('svg');
        if (!svgNode) return null;

        const cloned = svgNode.cloneNode(true) as SVGSVGElement;

        // Ensure proper standalone SVG namespace and dimensions
        cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        cloned.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

        const rect = svgNode.getBoundingClientRect();
        const w = svgNode.viewBox?.baseVal?.width || rect.width || 960;
        const h = svgNode.viewBox?.baseVal?.height || rect.height || 720;
        if (!cloned.hasAttribute('viewBox')) {
            cloned.setAttribute('viewBox', `0 0 ${w} ${h}`);
        }

        // Embed a white background and the dark theme as a <style> block
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
            * { font-family: Inter, system-ui, sans-serif; }
        `;
        defs.appendChild(style);
        cloned.insertBefore(defs, cloned.firstChild);

        // Add explicit dark background rect
        const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bgRect.setAttribute('width', '100%');
        bgRect.setAttribute('height', '100%');
        bgRect.setAttribute('fill', '#020817');
        cloned.insertBefore(bgRect, cloned.firstChild);

        return new XMLSerializer().serializeToString(cloned);
    };

    /**
     * Saves the diagram as an SVG file using Tauri's native Save As dialog.
     * SVG is a vector format — infinitely scalable, perfect text quality.
     */
    const handleDownload = async () => {
        try {
            const svgStr = getSvgString();
            if (!svgStr) {
                alert('No diagram found to save. Please wait for the diagram to finish rendering.');
                return;
            }

            // Encode SVG to base64 for transfer to Rust
            const base64Content = btoa(unescape(encodeURIComponent(svgStr)));

            const saved = await invoke<boolean>('save_diagram', {
                fileName: `hypertool-diagram.svg`,
                contentBase64: base64Content,
            });

            if (!saved) {
                // User cancelled — no message needed
                console.log('Save cancelled by user.');
            }
        } catch (err: any) {
            console.error('Download error:', err);
            alert('Download failed: ' + (err?.message ?? String(err)));
        }
    };

    /**
     * Copies the diagram as a PNG image to the clipboard.
     * Uses a canvas to rasterize the SVG, but with careful foreignObject removal 
     * to prevent tainted canvas errors.
     */
    const handleCopy = async () => {
        try {
            const svgStr = getSvgString();
            if (!svgStr) {
                alert('No diagram found. Please wait for the diagram to finish rendering.');
                return;
            }

            const svgNode = mermaidRef.current?.querySelector('svg');
            if (!svgNode) return;

            const rect = svgNode.getBoundingClientRect();
            const w = svgNode.viewBox?.baseVal?.width || rect.width || 960;
            const h = svgNode.viewBox?.baseVal?.height || rect.height || 720;
            const scale = 3;
            const scaledW = Math.round(w * scale);
            const scaledH = Math.round(h * scale);

            // Patch SVG to scaled size for high-res output
            const scaledSvgStr = svgStr
                .replace(/(<svg[^>]*)\swidth="[^"]*"/, `$1 width="${scaledW}"`)
                .replace(/(<svg[^>]*)\sheight="[^"]*"/, `$1 height="${scaledH}"`)
                || svgStr.replace('<svg', `<svg width="${scaledW}" height="${scaledH}"`);

            const dataUri = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(scaledSvgStr)));

            await new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = scaledW;
                    canvas.height = scaledH;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) { reject(new Error('No canvas context')); return; }
                    ctx.fillStyle = '#020817';
                    ctx.fillRect(0, 0, scaledW, scaledH);
                    ctx.drawImage(img, 0, 0, scaledW, scaledH);

                    canvas.toBlob(async (blob) => {
                        if (!blob) { reject(new Error('Canvas blob failed')); return; }
                        try {
                            await navigator.clipboard.write([
                                new ClipboardItem({ 'image/png': blob }),
                            ]);
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    }, 'image/png');
                };
                img.onerror = (e) => reject(new Error('Image load failed: ' + e));
                img.src = dataUri;
            });
        } catch (err: any) {
            console.error('Copy error:', err);
            // For tainted canvas errors in Tauri, suggest using Download instead
            if (String(err).includes('Tainted') || String(err).includes('tainted')) {
                alert('Cannot copy complex diagrams with HTML content. Please use the Download button instead — it saves a perfect quality SVG file that you can open and paste anywhere.');
            } else {
                alert('Copy failed: ' + (err?.message ?? String(err)));
            }
        }
    };

    return (
        <div className="relative group/mermaid w-full overflow-x-auto my-4 bg-background/50 p-4 rounded-xl border border-border shadow-sm flex justify-center min-h-[100px]">
            {/* Action Bar — visible on hover, hidden when diagram has an error or is typing */}
            {!hasError && !isTyping && hasRenderedBefore && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover/mermaid:opacity-100 transition-opacity z-10 bg-background/80 backdrop-blur-sm p-1 rounded-lg border border-border">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2 py-1.5 hover:bg-muted rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy as Picture"
                    >
                        {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <div className="w-px h-4 bg-border mx-0.5" />
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1 px-2 py-1.5 hover:bg-muted rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
                        title="Download SVG (high quality, infinite resolution)"
                    >
                        <Download size={14} />
                        <span>Download</span>
                    </button>
                </div>
            )}

            {/* Small updating indicator for when the AI is currently adding nodes to the diagram */}
            {hasRenderedBefore && isTyping && (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-1 bg-background/80 backdrop-blur-[2px] shadow-sm border border-border rounded-lg text-[10px] font-medium text-muted-foreground opacity-70">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Updating Diagram...
                </div>
            )}

            {/* Initial loading state before ANY diagram has successfully rendered */}
            {!hasRenderedBefore && isTyping && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary/70" />
                    <span className="text-sm font-medium animate-pulse">Building diagram structure...</span>
                </div>
            )}

            <div
                ref={mermaidRef}
                className={cn(
                    "w-full flex flex-col items-center justify-center [&>svg]:max-w-full transition-opacity duration-300",
                    !hasRenderedBefore && isTyping && "opacity-0"
                )}
            />
        </div>
    );
};

export default Mermaid;
