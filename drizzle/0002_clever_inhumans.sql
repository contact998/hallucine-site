ALTER TABLE `contact_submissions` ADD `userId` int;--> statement-breakpoint
ALTER TABLE `contact_submissions` ADD `status` enum('en_attente','en_cours','traite','annule') DEFAULT 'en_attente' NOT NULL;--> statement-breakpoint
ALTER TABLE `contact_submissions` ADD `adminNote` text;--> statement-breakpoint
ALTER TABLE `contact_submissions` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;