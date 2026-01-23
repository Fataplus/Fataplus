CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`data` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `store` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`data` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `work` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`data` text,
	`created_at` integer,
	`updated_at` integer
);
