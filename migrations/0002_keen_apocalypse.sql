PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invite` (
	`id` text NOT NULL,
	`email` text,
	`site_id` text,
	`role` text DEFAULT 'contributor' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_invite`("id", "email", "site_id", "role", "created_at") SELECT "id", "email", "site_id", "role", "created_at" FROM `invite`;--> statement-breakpoint
DROP TABLE `invite`;--> statement-breakpoint
ALTER TABLE `__new_invite` RENAME TO `invite`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `invite_email_site_id_unique` ON `invite` (`email`,`site_id`);