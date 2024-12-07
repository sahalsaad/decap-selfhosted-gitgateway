CREATE TABLE `sites` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`gitToken` text NOT NULL,
	`gitRepo` text NOT NULL,
	`gitProvider` text NOT NULL,
	`gitHost` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sites_url_unique` ON `sites` (`url`);--> statement-breakpoint
CREATE TABLE `users_to_sites` (
	`user_id` text NOT NULL,
	`site_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `site_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text,
	`role` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);