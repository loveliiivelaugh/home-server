create table
  public.models (
    id bigint generated by default as identity,
    name text null,
    value text null,
    description text null,
    notes text null
  ) tablespace pg_default;