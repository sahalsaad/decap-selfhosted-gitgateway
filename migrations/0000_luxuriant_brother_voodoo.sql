CREATE TABLE `invite` (
	`id` text NOT NULL,
	`email` text,
	`site_id` text,
	`role` text DEFAULT 'contributor' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invite_email_site_id_unique` ON `invite` (`email`,`site_id`);--> statement-breakpoint
CREATE TABLE `sites` (
	`id` text PRIMARY KEY NOT NULL,
	`cms_url` text NOT NULL,
	`git_token` text NOT NULL,
	`git_repo` text NOT NULL,
	`git_provider` text DEFAULT 'github' NOT NULL,
	`git_host` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `index_id` ON `sites` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sites_cms_url_unique` ON `sites` (`cms_url`);--> statement-breakpoint
CREATE TABLE `users_to_sites` (
	`user_id` text NOT NULL,
	`site_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	PRIMARY KEY(`user_id`, `site_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text,
	`role` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `index_id` ON `users` (`id`);--> statement-breakpoint
CREATE INDEX `index_email` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);