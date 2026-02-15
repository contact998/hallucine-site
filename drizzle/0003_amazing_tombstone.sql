CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`eventData` text,
	`path` varchar(500),
	`sessionId` varchar(64),
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`path` varchar(500) NOT NULL,
	`pageTitle` varchar(500),
	`referrer` varchar(1000),
	`trafficSource` varchar(50),
	`userAgent` varchar(1000),
	`deviceType` varchar(20),
	`country` varchar(100),
	`sessionId` varchar(64),
	`userId` int,
	`duration` int,
	`utmSource` varchar(255),
	`utmMedium` varchar(255),
	`utmCampaign` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_views_id` PRIMARY KEY(`id`)
);
