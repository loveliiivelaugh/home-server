create table
  public.food (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    name character varying null default '""'::character varying,
    calories integer null default 0,
    date date null default '2024-01-20'::date,
    time time without time zone null default (now() at time zone 'utc'::text),
    nutrients jsonb null,
    user_id uuid,
    meal text null default '"snack"'::text,
    num_servings integer null default 1,
    serving_size integer null default 1,
    constraint foods_pkey primary key (id)
  ) tablespace pg_default;