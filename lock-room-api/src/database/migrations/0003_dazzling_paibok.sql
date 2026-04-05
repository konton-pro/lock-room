ALTER TABLE "users" ADD COLUMN "encrypted_master_key" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "master_key_iv" varchar(64);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "master_key_tag" varchar(64);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "master_key_salt" varchar(64);