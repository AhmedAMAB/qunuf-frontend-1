'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Document, Page, pdfjs } from 'react-pdf';
import Popup from '@/components/shared/Popup';
import { PiDownloadBold, PiCaretLeftBold, PiCaretRightBold, PiSpinnerGapBold } from 'react-icons/pi';
import { resolveUrl } from '@/utils/upload';

// Import CSS for react-pdf (Required for proper rendering)
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure Worker using Local Path (No CDN)
pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';

interface ContractPdfViewerProps {
    pdfPath: string;
    contractNumber?: string | null;
    onClose: () => void;
}

export default function ContractPdfViewer({ pdfPath, contractNumber, onClose }: ContractPdfViewerProps) {
    const t = useTranslations('dashboard.contracts');
    const [numPages, setNumPages] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState(1.2);

    const pdfUrl = resolveUrl(pdfPath);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `contract-${contractNumber || 'document'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Popup show={true} onClose={onClose}>
            <div className="w-[95vw] md:w-[90vw] max-w-6xl mx-auto flex flex-col h-[85vh]">

                {/* Header (Kept your style) */}
                <header className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800">
                            {t('pdfViewer.title')}
                        </h2>
                        {contractNumber && (
                            <span className="text-sm text-gray-500">#{contractNumber}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
                            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="px-2 text-gray-600 hover:text-black">-</button>
                            <span className="px-2 text-xs font-mono">{Math.round(scale * 100)}%</span>
                            <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))} className="px-2 text-gray-600 hover:text-black">+</button>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <PiDownloadBold size={18} />
                            <span className="hidden sm:inline">{t('pdfViewer.download')}</span>
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden bg-gray-50 rounded-lg border border-gray-200 relative">

                    {/* Page Thumbnails Sidebar */}
                    {numPages > 1 && (
                        <div className="hidden md:flex flex-col w-32 lg:w-40 border-r border-gray-200 bg-white overflow-y-auto p-3 gap-3 shrink-0">
                            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPageNumber(pageNum)}
                                    className={`w-full py-2 px-3 text-sm rounded-md transition-all border ${pageNum === pageNumber
                                        ? 'bg-secondary text-white border-secondary shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {t('pdfViewer.page')} {pageNum}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* PDF Document Container */}
                    <div className="flex-1 overflow-auto flex justify-center p-4 md:p-8 bg-gray-100/50">
                        <div className="relative shadow-xl">
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="flex flex-col items-center p-20 bg-white">
                                        <PiSpinnerGapBold className="animate-spin text-primary text-4xl mb-2" />
                                        <span className="text-gray-500">{t('pdfViewer.loading')}</span>
                                    </div>
                                }
                                error={
                                    <div className="text-red-500 p-10">{t('pdfViewer.loadError')}</div>
                                }
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                />
                            </Document>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                {numPages > 1 && (
                    <div className="mt-4 pt-2 shrink-0 flex justify-center items-center gap-4">
                        <button
                            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                            disabled={pageNumber === 1}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <PiCaretLeftBold size={24} />
                        </button>

                        <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
                            {pageNumber} / {numPages}
                        </span>

                        <button
                            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                            disabled={pageNumber === numPages}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <PiCaretRightBold size={24} />
                        </button>
                    </div>
                )}
            </div>
        </Popup>
    );
}