import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.riftmaster.app",
    appName: "RiftMaster",
    webDir: "dist",

    plugins: {
        EdgeToEdge: {
            backgroundColor: "#FFFFFF",
            navigationBarColor: "#000000",
            statusBarColor: "#FFFFFF",
        },
    },
};

export default config;
