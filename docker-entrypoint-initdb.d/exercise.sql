create table
  public.exercise (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    name character varying not null,
    reps integer not null default 0,
    sets integer not null default 0,
    date date not null default now(),
    time time without time zone not null default now(),
    muscle text null,
    difficulty text null,
    equipment text null,
    instructions text null,
    type text null,
    user_id uuid,
    weight integer not null default 0,
    calories_burned integer null default 0,
    constraint exercises_pkey primary key (id)
  ) tablespace pg_default;