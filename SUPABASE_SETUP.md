# Configurarea Supabase pentru Bot Architect Studio

Acest ghid te va ajuta să configurezi autentificarea reală cu Supabase pentru
aplicația Bot Architect Studio.

## Pași de Configurare

### 1. Crearea Proiectului Supabase

1. Mergi la [supabase.com](https://supabase.com) și creează un cont
2. Creează un nou proiect
3. Alege o parolă sigură pentru baza de date
4. Așteaptă ca proiectul să fie gata (2-3 minute)

### 2. Configurarea Bazei de Date

1. În dashboard-ul Supabase, mergi la **SQL Editor**
2. Copiază conținutul din fișierul `supabase-setup.sql`
3. Rulează script-ul pentru a crea tabelele și politicile necesare

### 3. Configurarea Variabilelor de Mediu

1. În dashboard-ul Supabase, mergi la **Settings** > **API**
2. Copiază **Project URL** și **anon public key**
3. Creează un fișier `.env` în rădăcina proiectului:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Configurarea Autentificării

În dashboard-ul Supabase, mergi la **Authentication** > **Settings**:

#### Email Templates (Opțional)

- Personalizează template-urile pentru email-urile de confirmare
- Adaugă logo-ul și branding-ul aplicației

#### URL Configuration

- **Site URL**: `http://localhost:5173` (pentru development)
- **Redirect URLs**:
  - `http://localhost:5173/**` (pentru development)
  - `https://your-domain.com/**` (pentru production)

#### Providers (Opțional)

Poți activa autentificarea cu:

- Google
- GitHub
- Discord
- Și alții

### 5. Instalarea Dependințelor

```bash
npm install @supabase/supabase-js
```

### 6. Testarea Configurării

1. Pornește aplicația: `npm run dev`
2. Mergi la `/auth` și încearcă să creezi un cont
3. Verifică în dashboard-ul Supabase dacă utilizatorul a fost creat

## Structura Bazei de Date

### Tabele Principale

#### `profiles`

- Informații despre utilizatori (nume, username, avatar, status premium)
- Legată de `auth.users` prin foreign key

#### `workflows`

- Workflow-urile create de utilizatori
- Pot fi publice (template-uri) sau private
- Conțin datele JSON ale workflow-ului

#### `ai_agents`

- Agenții AI creați de utilizatori
- Configurații și setări pentru fiecare agent
- Status activ/inactiv

### Politici de Securitate (RLS)

- Utilizatorii pot vedea doar propriile date
- Workflow-urile publice sunt vizibile pentru toți
- Toate operațiunile sunt protejate prin Row Level Security

## Funcționalități Implementate

### Autentificare

- ✅ Înregistrare cu email/parolă
- ✅ Autentificare cu email/parolă
- ✅ Logout
- ✅ Sesiuni persistente
- ✅ Verificare email (opțional)

### Gestionarea Utilizatorilor

- ✅ Profile utilizatori
- ✅ Status premium
- ✅ Avatar și informații personale

### Workflow-uri

- ✅ Creare workflow-uri
- ✅ Salvare și încărcare
- ✅ Workflow-uri publice (template-uri)
- ✅ Căutare și filtrare

### Agenți AI

- ✅ Creare și gestionare agenți
- ✅ Configurații personalizate
- ✅ Status activ/inactiv
- ✅ Statistici și metrici

## Experiența Post-Autentificare

### Dashboard Personalizat

- Metrici în timp real despre agenții AI
- Workflow-uri active
- Statistici de performanță
- Acces rapid la funcții premium

### Funcții Premium

- Agenți AI avansați
- Workflow-uri complexe
- Analize detaliate
- Suport prioritar
- Template-uri exclusive

### Gestionarea Datelor

- Salvare automată a progresului
- Sincronizare între dispozitive
- Backup și restore
- Export/import workflow-uri

## Securitate și Performanță

### Măsuri de Securitate

- Row Level Security (RLS) activat
- Validare pe server și client
- Sanitizare input-uri
- Rate limiting prin Supabase

### Optimizări

- Indexuri pentru căutări rapide
- Paginare pentru liste mari
- Cache pentru date frecvent accesate
- Lazy loading pentru componente

## Troubleshooting

### Probleme Comune

1. **"Invalid login credentials"**

   - Verifică dacă email-ul și parola sunt corecte
   - Asigură-te că contul a fost confirmat prin email

2. **"User already registered"**

   - Utilizatorul există deja, încearcă să te autentifici

3. **Erori de conexiune**

   - Verifică variabilele de mediu
   - Asigură-te că Supabase project este activ

4. **RLS errors**
   - Verifică politicile de securitate
   - Asigură-te că utilizatorul este autentificat

### Debugging

Pentru debugging, poți activa logging-ul în browser:

```javascript
// În browser console
localStorage.setItem('supabase.auth.debug', 'true');
```

## Deployment în Producție

### Variabile de Mediu

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Configurări Suplimentare

- Actualizează URL-urile de redirect
- Configurează domeniul custom
- Activează SSL
- Configurează backup-uri automate

## Suport și Documentație

- [Documentația Supabase](https://supabase.com/docs)
- [Ghiduri de autentificare](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
