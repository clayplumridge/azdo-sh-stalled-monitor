export interface AzdoList<T> {
    count: number;
    value: T[];
}

// https://docs.microsoft.com/en-us/rest/api/azure/devops/hooks/subscriptions/list?view=azure-devops-rest-6.0#subscription
export interface Subscription {
    id: string;
}

// https://docs.microsoft.com/en-us/rest/api/azure/devops/hooks/notifications/list?view=azure-devops-rest-6.0#notificationresult
export type NotificationResult =
    | "failed"
    | "filtered"
    | "pending"
    | "succeeded";

// https://docs.microsoft.com/en-us/rest/api/azure/devops/hooks/notifications/list?view=azure-devops-rest-6.0#notificationstatus
export type NotificationStatus =
    | "completed"
    | "processing"
    | "queued"
    | "requestInProgress";

// https://docs.microsoft.com/en-us/rest/api/azure/devops/hooks/notifications/list?view=azure-devops-rest-6.0#notification
export interface Notification {
    createdDate: string;
    result: NotificationResult;
    status: NotificationStatus;
}
