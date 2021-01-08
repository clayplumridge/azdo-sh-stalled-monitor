import { getLogger } from "./logger";
import { RestClient } from "./rest";
import { Subscription } from "./rest.types";

const { accessToken, organization, username } = process.env;
const subscriptionInterval = 60000 * 10; // 10 mins
const notificationInterval = 5000; // 30s

const restClient = new RestClient({ accessToken, organization, username });
const logger = getLogger("monitor-main");

let subscriptions: Subscription[] = [];

const startRefreshSubscriptionIds = () => {
    return restClient
        .ListSubscriptions()
        .then(result => {
            subscriptions = result.data.value;
            logger.info(
                `Successfully fetched ${result.data.count} subscriptions - next fetch in ${subscriptionInterval}ms`,
                "subscriptionPolling"
            );
        })
        .catch(err => {
            logger.error(err);
        });
};

// Polls for all subscriptions and stashes results
startRefreshSubscriptionIds().then(() => startPollingNotifications());
setInterval(startRefreshSubscriptionIds, subscriptionInterval);

function startPollingNotifications() {
    Promise.all(pollQueuedNotifications()).then(() => {
        logger.info(
            `Polling completed for ${subscriptions.length} subscriptions - next polling in ${notificationInterval}ms`
        );
        setTimeout(startPollingNotifications, notificationInterval);
    });
}

function pollQueuedNotifications() {
    return subscriptions.map(subscription => {
        restClient
            .ListNotifications(subscription.id, "queued")
            .then(response => {
                const notifications = response.data;
                const problems = notifications.value.filter(
                    x =>
                        x.status == "queued" &&
                        new Date(x.createdDate) > ago(30 * 60 * 1000)
                );

                if (problems.length > 0) {
                    logger.warn(
                        `Detected ${problems.length} potentially hung notifications in subscription ${subscription.id}`
                    );
                } else {
                    logger.info(
                        `No issues detected for subscription ${subscription.id}`
                    );
                }
            });
    });
}

function ago(ms: number) {
    return new Date(new Date().getTime() - ms);
}
