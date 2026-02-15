CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('contact','devis','distributeur') NOT NULL,
	`nom` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telephone` varchar(50),
	`entreprise` varchar(255),
	`sujet` varchar(500),
	`message` text,
	`produit` varchar(255),
	`objectif` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
