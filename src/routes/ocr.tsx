import { Ocr } from "@capacitor-community/image-to-text";
import { CameraPreview } from "@capgo/camera-preview";
import { supabase } from "@integrations/supabase";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/ocr")({
    component: RouteComponent,
});

function RouteComponent() {
    const processingRef = useRef(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<{ text: string }[]>([]);

    const { data: sets } = useQuery({
        queryKey: ["sets", "riftbound_ids"],
        queryFn: async () => supabase.from("set").select("riftbound_id"),
        select: (res) => res.data ?? [],
    });

    // const {} = useQuery({
    //     queryKey: ["card-search", results],
    // });

    const timerRef = useRef<number | null>(null);
    const startOcr = useCallback(async () => {
        if (!sets) return;

        console.log("Starting OCR with sets:", sets);

        try {
            await CameraPreview.start({
                position: "rear",
                toBack: false,
            });

            timerRef.current = setInterval(async () => {
                if (processingRef.current) return;

                processingRef.current = true;
                setIsProcessing(true);

                try {
                    const { value: base64 } = await CameraPreview.captureSample({
                        quality: 80,
                    });

                    console.log("Captured image, running OCR...");
                    console.log(base64);

                    const { textDetections } = await Ocr.detectText({ base64 });

                    if (textDetections.length > 0) {
                        const filtered = textDetections.filter((d) => {
                            const cleaned = d.text.replace(/\s/g, "").toUpperCase();
                            return sets.some((s) => cleaned.includes(s.riftbound_id));
                        });

                        setResults(filtered.map((d) => ({ text: d.text })));
                    }
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
    }, [sets]);

    useEffect(() => {
        const html = document.documentElement;
        const { body } = document;
        const prevHtmlBg = html.style.background;
        const prevBodyBg = body.style.background;

        console.log("Setting backgrounds to transparent for OCR route");

        html.style.background = "transparent";
        body.style.background = "transparent";

        return () => {
            html.style.background = prevHtmlBg;
            body.style.background = prevBodyBg;
        };
    }, []);

    useEffect(() => {
        console.log("Starting OCR effect");

        void startOcr();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            CameraPreview.stop();
        };
    }, [startOcr]);

    return (
        <div className="relative w-screen h-screen bg-transparent">
            <div className="absolute bottom-0 inset-x-0 p-2 bg-white">
                <h2 className="text-lg font-bold">OCR Result:</h2>
                {isProcessing && <p className="text-sm text-gray-500">Processing...</p>}
                <ul className="mt-2 max-h-40 overflow-y-auto">
                    {results.map((item, index) => (
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
