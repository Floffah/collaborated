export interface ServiceConfig {
    github: {
        appId: string;
        clientId: string;
        clientSecret: string;
        webhookSecret: string;
        privateKey: string; // path
        repo: string;
        installationId: string;
    };
}
