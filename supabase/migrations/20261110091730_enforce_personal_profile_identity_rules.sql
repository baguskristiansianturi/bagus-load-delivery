create or replace function private.enforce_user_profile_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_username text := lower(trim(new.username));
  v_first_word text;
begin
  if v_username !~ '^[a-z0-9]([a-z0-9._-]{1,28}[a-z0-9])$'
     or position('..' in v_username) > 0 then
    raise exception using errcode = '23514',
      message = 'Username harus 3–30 karakter, hanya huruf kecil, angka, titik, garis bawah, atau tanda hubung; tidak boleh diawali/diakhiri tanda baca.';
  end if;

  if v_username ~ '\.(com|co\.id|co|id|net|org|biz|info|xyz|app|dev|io|me|asia|site|online|store|shop)$' then
    raise exception using errcode = '23514',
      message = 'Username tidak boleh menyerupai nama domain internet.';
  end if;

  v_first_word := lower(split_part(trim(new.display_name), ' ', 1));
  if v_first_word = any(array[
    'toko','warung','restoran','restaurant','hotel','cafe','kafe','shop','store',
    'market','service','jasa','layanan','tour','travel','transport','clinic','klinik',
    'salon','barbershop','company','perusahaan','official','group','foundation',
    'yayasan','community','komunitas','supplier','distributor','contractor','bengkel','laundry'
  ]) then
    raise exception using errcode = '23514',
      message = 'Nama akun personal tidak boleh diawali nama jenis toko, organisasi, atau layanan. Buat identitas usaha melalui menu Toko/Organisasi.';
  end if;

  new.username := v_username;
  new.display_name := trim(new.display_name);
  return new;
end;
$$;

drop trigger if exists user_profiles_enforce_personal_identity on public.user_profiles;
create trigger user_profiles_enforce_personal_identity
before insert or update of username, display_name on public.user_profiles
for each row execute function private.enforce_user_profile_identity();

revoke all on function private.enforce_user_profile_identity() from public, anon, authenticated;
