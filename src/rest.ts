import axios, { AxiosInstance } from "axios";
import {
    Subscription,
    Notification,
    AzdoList,
    NotificationStatus
} from "./rest.types";

export interface RestClientConfig {
    accessToken: string;
    organization: string;
    username: string;
}

export class RestClient {
    private readonly axiosClient: AxiosInstance;

    constructor(config: RestClientConfig) {
        const { organization, accessToken, username } = config;
        const base64AccessToken = Buffer.from(
            `${username}:${accessToken}`
        ).toString("base64");

        this.axiosClient = axios.create({
            baseURL: `https://dev.azure.com/${organization}`,
            headers: { Authorization: `Basic ${base64AccessToken}` }
        });
    }

    public async ListSubscriptions() {
        return await this.axiosClient.get<AzdoList<Subscription>>(
            "/_apis/hooks/subscriptions?api-version=6.0"
        );
    }

    public async ListNotifications(
        subscriptionId: string,
        status?: NotificationStatus
    ) {
        return await this.axiosClient.get<AzdoList<Notification>>(
            `/_apis/hooks/subscriptions/${subscriptionId}/notifications?api-version=6.0`,
            { params: { status } }
        );
    }
}
