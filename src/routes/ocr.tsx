import { CameraPreview } from "@capacitor-community/camera-preview";
import { Ocr } from "@capacitor-community/image-to-text";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/ocr")({
    component: RouteComponent,
});

function RouteComponent() {
    const timerRef = useRef<number | null>(null);
    const processingRef = useRef(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ text: string }[]>([]);

    const startOcr = useCallback(async () => {
        try {
            // Start camera preview
            await CameraPreview.start({
                position: "rear",
                parent: "cameraPreview",
                className: "cameraPreview",
                toBack: true,
                disableAudio: true,
                enableZoom: true,
            });

            // Capture frame every 600ms and process with MLKit OCR
            timerRef.current = setInterval(async () => {
                // Skip if already processing a frame to avoid overlap
                if (processingRef.current) return;

                processingRef.current = true;
                setIsProcessing(true);

                try {
                    // Capture frame
                    const { value: base64 } = await CameraPreview.captureSample({
                        quality: 60,
                    });

                    // OCR with MLKit
                    const { textDetections } = await Ocr.detectText({
                        base64: base64,
                    });

                    setResult(textDetections.map((d) => ({ text: d.text })));
                } catch (err) {
                    console.warn("OCR frame error:", err);
                } finally {
                    processingRef.current = false;
                    setIsProcessing(false);
                }
            }, 5_000);
        } catch (err) {
            console.log("CameraPreview start error:", err);
        }
    }, []);

    useEffect(() => {
        // Start OCR on mount
        void startOcr();

        return () => {
            // Cleanup on unmount
            if (timerRef.current) clearInterval(timerRef.current);
            // Stop camera preview
            CameraPreview.stop();
        };
    }, [startOcr]);

    return (
        <div id="camera-preview" className="w-screen h-screen bg-transparent">
            {/* Empty content */}
            <div className="absolute bottom-0 inset-x-0 p-2 bg-white">
                <h2 className="text-lg font-bold">OCR Result:</h2>
                {isProcessing && <p className="text-sm text-gray-500">Processing...</p>}
                <ul className="mt-2 max-h-40 overflow-y-auto">
                    {result.map((item, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: This is a simple example, in production consider using a unique ID
                        <li key={index} className="text-sm text-gray-700">
                            {item.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
