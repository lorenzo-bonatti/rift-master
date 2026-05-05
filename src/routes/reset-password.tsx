import { Button, Card, CardBody, CardHeader, Input, Spinner } from "@heroui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase";

export const Route = createFileRoute("/reset-password")({
    component: ResetPasswordPage,
});

function ResetPasswordPage() {
    const router = useRouter();
    const [sessionReady, setSessionReady] = useState(false);
    const [linkError, setLinkError] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const hash = new URLSearchParams(window.location.hash.substring(1));
        if (hash.get("error")) {
            setLinkError(hash.get("error_description") ?? "The reset link is invalid or has expired.");
            return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setSessionReady(true);
        });

        async function exchangeToken() {
            const params = new URLSearchParams(window.location.search);
            const tokenHash = params.get("token_hash");
            const code = params.get("code");

            if (tokenHash) {
                const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
                if (error) setLinkError(error.message);
            } else if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) setLinkError(error.message);
            } else {
                // Link already processed (e.g. page refresh) — check existing session
                const { data } = await supabase.auth.getSession();
                if (data.session) setSessionReady(true);
                else setLinkError("The reset link is invalid or has expired.");
            }
        }

        exchangeToken();
        return () => subscription.unsubscribe();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            await router.invalidate();
            router.navigate({ to: "/" });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="flex-col items-start px-6 pt-6 pb-0">
                    <h1 className="text-2xl font-bold">New password</h1>
                    <p className="text-default-500 text-sm">Choose a new password for your account.</p>
                </CardHeader>
                <CardBody className="px-6 py-6">
                    {linkError ? (
                        <div className="space-y-4">
                            <p className="text-danger text-sm">{linkError}</p>
                            <Button as="a" href="/login" color="primary" fullWidth variant="flat">
                                Request a new reset link
                            </Button>
                        </div>
                    ) : !sessionReady ? (
                        <div className="grid place-content-center py-8">
                            <Spinner label="Verifying link..." variant="wave" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="password"
                                label="New password"
                                placeholder="••••••••"
                                value={password}
                                onValueChange={setPassword}
                                isRequired
                            />
                            <Input
                                type="password"
                                label="Confirm password"
                                placeholder="••••••••"
                                value={confirm}
                                onValueChange={setConfirm}
                                isRequired
                            />

                            {error && <p className="text-danger text-sm">{error}</p>}

                            <Button type="submit" color="primary" fullWidth isLoading={loading}>
                                Update password
                            </Button>
                        </form>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
