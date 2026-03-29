CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"cuid" varchar(36) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_cuid_unique" UNIQUE("cuid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vault" (
	"id" serial PRIMARY KEY NOT NULL,
	"cuid" varchar(36) NOT NULL,
	"user_id" integer NOT NULL,
	"encrypted_header" "bytea" NOT NULL,
	"encrypted_body" "bytea" NOT NULL,
	"client_iv" "bytea" NOT NULL,
	"server_header_iv" "bytea" NOT NULL,
	"server_header_tag" "bytea" NOT NULL,
	"server_body_iv" "bytea" NOT NULL,
	"server_body_tag" "bytea" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vault_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
ALTER TABLE "vault" ADD CONSTRAINT "vault_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "vault_user_id_idx" ON "vault" USING btree ("user_id");