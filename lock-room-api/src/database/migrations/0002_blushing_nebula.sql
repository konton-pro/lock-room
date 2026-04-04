CREATE TABLE "recovery_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"cuid" varchar(36) NOT NULL,
	"user_id" integer NOT NULL,
	"encrypted_payload" "bytea" NOT NULL,
	"client_iv" "bytea" NOT NULL,
	"client_tag" "bytea" NOT NULL,
	"server_iv" "bytea" NOT NULL,
	"server_tag" "bytea" NOT NULL,
	"recovery_key_hash" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recovery_keys_cuid_unique" UNIQUE("cuid"),
	CONSTRAINT "recovery_keys_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "recovery_keys" ADD CONSTRAINT "recovery_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;