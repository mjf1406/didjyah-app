CREATE TABLE `didjyah_records` (
	`id` text NOT NULL,
	`user_id` text NOT NULL,
	`didjyah_id` text NOT NULL,
	`inputs` text,
	`test` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`end_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `didjyah_records_user_id_idx` ON `didjyah_records` (`user_id`);--> statement-breakpoint
CREATE INDEX `didjyah_records_didjyah_id_idx` ON `didjyah_records` (`didjyah_id`);--> statement-breakpoint
CREATE TABLE `didjyahs` (
	`id` text NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text,
	`icon` text,
	`color` text,
	`icon_color` text,
	`description` text,
	`unit` text,
	`quantity` integer,
	`daily_goal` integer,
	`timer` integer,
	`stopwatch` integer,
	`since_last` integer,
	`inputs` text,
	`records` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `didjyahs` (`user_id`);