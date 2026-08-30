CREATE TABLE `endpoints` (
	`id` text PRIMARY KEY,
	`method` text NOT NULL,
	`path` text NOT NULL,
	`response_schema` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `method_path_idx` ON `endpoints` (`method`,`path`);