import { Button, Divider, Input } from "@heroui/react";
import { supabase } from "@integrations/supabase";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_menu/_auth/profile")({
    component: ProfilePage,
    beforeLoad: ({ context }) => {
        if (!context.user) throw redirect({ to: "/login" });
    },
    loader: async () => {
        const { data } = await supabase.auth.getUser();
        return { user: data.user };
    },
});

function ProfilePage() {
    const { user } = Route.useLoaderData();
    const router = useRouter();

    const [firstName, setFirstName] = useState(user?.user_metadata?.first_name ?? "");
    const [lastName, setLastName] = useState(user?.user_metadata?.last_name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const [infoMsg, setInfoMsg] = useState<string | null>(null);
    const [emailMsg, setEmailMsg] = useState<string | null>(null);
    const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

    async function handleUpdateInfo() {
        setLoadingInfo(true);
        setInfoMsg(null);
        const { error } = await supabase.auth.updateUser({
            data: { first_name: firstName, last_name: lastName },
        });
        setInfoMsg(error ? error.message : "Updated successfully");
        setLoadingInfo(false);
        if (!error) router.invalidate();
    }

    async function handleUpdateEmail() {
        setLoadingEmail(true);
        setEmailMsg(null);
        const { error } = await supabase.auth.updateUser({ email });
        setEmailMsg(error ? error.message : "Confirmation email sent");
        setLoadingEmail(false);
    }

    async function handleUpdatePassword() {
        setPasswordMsg(null);
        if (newPassword !== confirmPassword) {
            setPasswordMsg("Passwords do not match");
            return;
        }
        setLoadingPassword(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setPasswordMsg(error ? error.message : "Password updated");
        if (!error) {
            setNewPassword("");
            setConfirmPassword("");
        }
        setLoadingPassword(false);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div className="page">
            <div className="py-2 px-4">
                <h1 className="text-2xl font-bold">Profile</h1>
            </div>

            <div className="page-content space-y-6 py-4">
                {/* Personal info */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-default-500 uppercase tracking-wide">Personal info</h2>
                    <Input label="First name" value={firstName} onValueChange={setFirstName} />
                    <Input label="Last name" value={lastName} onValueChange={setLastName} />
                    {infoMsg && (
                        <p className={`text-sm ${infoMsg.includes("success") ? "text-success" : "text-danger"}`}>
                            {infoMsg}
                        </p>
                    )}
                    <Button color="primary" fullWidth isLoading={loadingInfo} onPress={handleUpdateInfo}>
                        Save
                    </Button>
                </section>

                <Divider />

                {/* Email */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-default-500 uppercase tracking-wide">Email</h2>
                    <Input type="email" label="Email" value={email} onValueChange={setEmail} />
                    {emailMsg && (
                        <p className={`text-sm ${emailMsg.includes("sent") ? "text-success" : "text-danger"}`}>
                            {emailMsg}
                        </p>
                    )}
                    <Button color="primary" fullWidth isLoading={loadingEmail} onPress={handleUpdateEmail}>
                        Update email
                    </Button>
                </section>

                <Divider />

                {/* Password */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-default-500 uppercase tracking-wide">Password</h2>
                    <Input
                        type="password"
                        label="New password"
                        placeholder="••••••••"
                        value={newPassword}
                        onValueChange={setNewPassword}
                    />
                    <Input
                        type="password"
                        label="Confirm password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onValueChange={setConfirmPassword}
                    />
                    {passwordMsg && (
                        <p className={`text-sm ${passwordMsg.includes("updated") ? "text-success" : "text-danger"}`}>
                            {passwordMsg}
                        </p>
                    )}
                    <Button color="primary" fullWidth isLoading={loadingPassword} onPress={handleUpdatePassword}>
                        Change password
                    </Button>
                </section>

                <Divider />

                {/* Logout */}
                <section>
                    <Button color="danger" variant="flat" fullWidth onPress={handleLogout}>
                        Logout
                    </Button>
                </section>
            </div>
        </div>
    );
}
