ALTER TABLE `users_to_sites` RENAME TO `sites_users`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sites_users` (
	`user_id` text NOT NULL,
	`site_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	PRIMARY KEY(`user_id`, `site_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sites_users`("user_id", "site_id", "created_at") SELECT "user_id", "site_id", "created_at" FROM `sites_users`;--> statement-breakpoint
DROP TABLE `sites_users`;--> statement-breakpoint
ALTER TABLE `__new_sites_users` RENAME TO `sites_users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;