-- Fotos extra y enlaces por ejercicio (además de la foto principal y el video).
alter table exercises_custom add column if not exists extra_images jsonb not null default '[]'::jsonb;
alter table exercises_custom add column if not exists links jsonb not null default '[]'::jsonb;
