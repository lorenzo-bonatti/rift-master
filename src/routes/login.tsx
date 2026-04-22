import { Button, Card, CardBody, CardHeader, Input, Tab, Tabs } from "@heroui/react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "../integration/supabase";

export const Route = createFileRoute("/login")({
    component: LoginPage,
    beforeLoad: ({ context }) => {
        if (context.user) throw redirect({ to: "/" });
    },
});

function LoginPage() {
    const router = useRouter();
    const [tab, setTab] = useState<"login" | "signup">("login");
    const [view, setView] = useState<"auth" | "forgot">("auth");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (tab === "login") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            }
            await router.invalidate();
            router.navigate({ to: "/" });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    async function handleForgotPassword(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            // Supabase may return unexpected_failure even when the email is sent successfully
            if (error && error.code !== "unexpected_failure") throw error;
            setResetSent(true);
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
                    <h1 className="text-2xl font-bold">RiftMaster</h1>
                    <p className="text-default-500 text-sm">Manage your Riftbound collection</p>
                </CardHeader>
                <CardBody className="px-6 py-6">
                    {view === "forgot" ? (
                        <div className="space-y-4">
                            <div>
                                <h2 className="font-semibold text-lg">Reset password</h2>
                                <p className="text-default-500 text-sm">We'll send you a link to reset your password.</p>
                            </div>

                            {resetSent ? (
                                <p className="text-success text-sm">Check your email for the reset link.</p>
                            ) : (
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <Input
                                        type="email"
                                        label="Email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onValueChange={setEmail}
                                        isRequired
                                    />
                                    {error && <p className="text-danger text-sm">{error}</p>}
                                    <Button type="submit" color="primary" fullWidth isLoading={loading}>
                                        Send reset link
                                    </Button>
                                </form>
                            )}

                            <Button variant="light" fullWidth onPress={() => { setView("auth"); setError(null); setResetSent(false); }}>
                                Back to login
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Tabs
                                fullWidth
                                selectedKey={tab}
                                onSelectionChange={(key) => setTab(key as "login" | "signup")}
                                className="mb-6"
                            >
                                <Tab key="login" title="Login" />
                                <Tab key="signup" title="Sign up" />
                            </Tabs>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    type="email"
                                    label="Email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onValueChange={setEmail}
                                    isRequired
                                />
                                <Input
                                    type="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    value={password}
                                    onValueChange={setPassword}
                                    isRequired
                                />

                                {error && <p className="text-danger text-sm">{error}</p>}

                                <Button type="submit" color="primary" fullWidth isLoading={loading}>
                                    {tab === "login" ? "Login" : "Create account"}
                                </Button>
                            </form>

                            {tab === "login" && (
                                <Button variant="light" fullWidth className="mt-2" onPress={() => { setView("forgot"); setError(null); }}>
                                    Forgot password?
                                </Button>
                            )}
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
