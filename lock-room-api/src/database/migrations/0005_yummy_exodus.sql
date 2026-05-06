CREATE TABLE "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"cuid" varchar(36) NOT NULL,
	"user_id" integer NOT NULL,
	"session_id_hash" varchar(64) NOT NULL,
	"ip_subnet" varchar(64) NOT NULL,
	"user_agent_hash" varchar(64) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_sessions_cuid_unique" UNIQUE("cuid"),
	CONSTRAINT "user_sessions_session_id_hash_unique" UNIQUE("session_id_hash")
);
--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_sessions_user_id_idx" ON "user_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_sessions_expires_at_idx" ON "user_sessions" USING btree ("expires_at");