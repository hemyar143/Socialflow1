create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  scheduled_at timestamp,
  created_at timestamp default now()
);