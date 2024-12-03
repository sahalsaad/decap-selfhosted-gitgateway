CREATE TABLE `sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`githubToken` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sites_url_unique` ON `sites` (`url`);--> statement-breakpoint
CREATE TABLE `users_to_sites` (
	`user_id` integer NOT NULL,
	`site_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `site_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text,
	`role` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);