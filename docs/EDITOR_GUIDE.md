# Editor guide · មគ្គុទ្ទេសក៍សម្រាប់អ្នកកែសម្រួល

How to add and update books, stores, events and other listings on Book in Cambodia, from your browser. No coding or installation needed.

[ខ្មែរ ↓](#ខ្មែរ)

---

## English

### Before you start

- You need a free [GitHub](https://github.com/signup) account, and a maintainer must give you access to the project. Ask on our contact channel or email hello@bookincambodia.org.
- Only add information you have checked yourself (visited the store, called them, or saw it on their official page).

### 1. Sign in

1. Open **`/keystatic`** on the website (for now: `https://book-in-cambodia.horngfu.workers.dev/keystatic`).
2. Click **Sign in with GitHub** and approve the request the first time.

### 2. Start a branch

Your changes are saved on your own **branch** (a working copy) and only go live after a maintainer reviews them.

1. Click the branch name at the top left and choose **New branch**.
2. Name it after what you're doing, e.g. `content/add-riverside-books`.

### 3. Make your changes

| To… | Go to… | Tips |
|---|---|---|
| Add a book | **Books → Add** | Fill in title, author(s), language and category. Add the Khmer title if it has one. |
| Say where to buy a book | open the book → **Where to get it in Cambodia → Add** | Pick the store, format, price (USD), stock, and set **Last verified** to the day you checked. |
| Add a store or library | **Stores and libraries → Add** | Telegram username without `@`. Paste the Google Maps share link. |
| Add an author | **Authors → Add** | Add the Khmer name for Khmer authors. |
| Fix wrong information | open the entry, edit, update **Last verified** | |

Uploading a cover? Use a photo you took yourself or the publisher's official cover. After merging, a maintainer runs `npm run images` to shrink it.

Leave **Sample data** unticked for real entries.

### 4. Save and ask for review

1. Click **Save**. Repeat for every change on the same branch.
2. Click the branch menu → **Create pull request**, write one line about what you changed, and submit.
3. A preview link appears on the pull request after a few minutes, so you and the reviewer can check the result.
4. When a maintainer merges it, the live site updates within about 5 minutes.

### What "Last verified" means

The date someone last confirmed the price, stock or contact details. Listings older than 6 months show "may be outdated" on the site, so please update the date whenever you re-check.

---

## ខ្មែរ

### មុនពេលចាប់ផ្តើម

- អ្នកត្រូវការគណនី [GitHub](https://github.com/signup) ឥតគិតថ្លៃ ហើយអ្នកថែទាំគម្រោងត្រូវផ្តល់សិទ្ធិឱ្យអ្នក។ សូមសួរតាមបណ្តាញទំនាក់ទំនងរបស់យើង ឬផ្ញើអ៊ីមែលមក hello@bookincambodia.org។
- សូមបន្ថែមតែព័ត៌មានដែលអ្នកបានពិនិត្យដោយខ្លួនឯង (បានទៅហាង ហៅទូរស័ព្ទ ឬឃើញនៅលើទំព័រផ្លូវការរបស់ពួកគេ)។

### ១. ចូលគណនី

1. បើក **`/keystatic`** នៅលើគេហទំព័រ (បច្ចុប្បន្ន៖ `https://book-in-cambodia.horngfu.workers.dev/keystatic`)។
2. ចុច **Sign in with GitHub** ហើយអនុញ្ញាតនៅលើកដំបូង។

### ២. បង្កើត branch

ការផ្លាស់ប្តូររបស់អ្នកត្រូវបានរក្សាទុកនៅលើ **branch** (ច្បាប់ចម្លងសម្រាប់ធ្វើការ) របស់អ្នកផ្ទាល់ ហើយនឹងបង្ហាញនៅលើគេហទំព័រតែបន្ទាប់ពីអ្នកថែទាំបានពិនិត្យ។

1. ចុចឈ្មោះ branch នៅខាងលើផ្នែកខាងឆ្វេង ហើយជ្រើស **New branch**។
2. ដាក់ឈ្មោះតាមអ្វីដែលអ្នកកំពុងធ្វើ ឧ. `content/add-riverside-books`។

### ៣. ធ្វើការផ្លាស់ប្តូរ

| ដើម្បី… | ទៅកាន់… | គន្លឹះ |
|---|---|---|
| បន្ថែមសៀវភៅ | **Books → Add** | បំពេញចំណងជើង អ្នកនិពន្ធ ភាសា និងប្រភេទ។ បន្ថែមចំណងជើងខ្មែរ ប្រសិនបើមាន។ |
| ប្រាប់កន្លែងទិញសៀវភៅ | បើកសៀវភៅ → **Where to get it in Cambodia → Add** | ជ្រើសហាង ទម្រង់ តម្លៃ (ដុល្លារ) ស្តុក ហើយកំណត់ **Last verified** ជាថ្ងៃដែលអ្នកបានពិនិត្យ។ |
| បន្ថែមហាង ឬបណ្ណាល័យ | **Stores and libraries → Add** | ឈ្មោះ Telegram ដោយគ្មាន `@`។ បិទភ្ជាប់តំណ Google Maps។ |
| បន្ថែមអ្នកនិពន្ធ | **Authors → Add** | បន្ថែមឈ្មោះជាអក្សរខ្មែរសម្រាប់អ្នកនិពន្ធខ្មែរ។ |
| កែព័ត៌មានខុស | បើកព័ត៌មាននោះ កែ ហើយធ្វើបច្ចុប្បន្នភាព **Last verified** | |

សូមកុំធីក **Sample data** សម្រាប់ព័ត៌មានពិត។

### ៤. រក្សាទុក ហើយស្នើសុំការពិនិត្យ

1. ចុច **Save**។ ធ្វើដូចគ្នាសម្រាប់ការផ្លាស់ប្តូរនីមួយៗនៅលើ branch តែមួយ។
2. ចុចម៉ឺនុយ branch → **Create pull request** សរសេរមួយបន្ទាត់អំពីអ្វីដែលអ្នកបានផ្លាស់ប្តូរ ហើយបញ្ជូន។
3. តំណមើលជាមុននឹងបង្ហាញនៅលើ pull request ក្នុងរយៈពេលប៉ុន្មាននាទី។
4. នៅពេលអ្នកថែទាំបញ្ចូល (merge) គេហទំព័រនឹងធ្វើបច្ចុប្បន្នភាពក្នុងរយៈពេលប្រហែល ៥ នាទី។

### "Last verified" មានន័យថាអ្វី

កាលបរិច្ឆេទដែលនរណាម្នាក់បានបញ្ជាក់តម្លៃ ស្តុក ឬព័ត៌មានទំនាក់ទំនងចុងក្រោយ។ ព័ត៌មានដែលចាស់ជាង ៦ ខែ នឹងបង្ហាញថា "អាចហួសសម័យ" ដូច្នេះសូមធ្វើបច្ចុប្បន្នភាពកាលបរិច្ឆេទរាល់ពេលដែលអ្នកពិនិត្យម្តងទៀត។

---

## For maintainers: switching on online editing

Online editing needs a GitHub App that lets Keystatic commit to this repository. One-time setup:

1. **Create the GitHub App** (on your computer):
   ```bash
   NEXT_PUBLIC_KEYSTATIC_STORAGE=github npm run dev
   ```
   Open <http://localhost:3000/keystatic> and follow Keystatic's setup screen. It creates a GitHub App and writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` to a local `.env` file (git-ignored; never commit it).
2. **Install the app** on the `Book-in-Cambodia` repository when GitHub asks.
3. **Allow the live site to sign in:** in the GitHub App's settings, add this callback URL (and later the same path on bookincambodia.org):
   `https://book-in-cambodia.horngfu.workers.dev/api/keystatic/github/oauth/callback`
4. **Give the Worker the app's credentials** (each command asks you to paste the value from `.env`):
   ```bash
   npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_ID
   npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_SECRET
   npx wrangler secret put KEYSTATIC_SECRET
   ```
5. **Turn on GitHub mode for production builds:** add two repository *variables* (Settings → Secrets and variables → Actions → Variables): `KEYSTATIC_STORAGE` = `github` and `KEYSTATIC_GITHUB_APP_SLUG` = the slug from `.env`. Then re-run the Deploy workflow.
6. **Add editors** as collaborators (Settings → Collaborators) with *Write* access.

**Reviewing:** content pull requests come from `content/…` branches and get a preview link automatically. Merge when the preview looks right.

**Protecting `main`:** once the repository is public (or on a paid GitHub plan), add a branch rule for `main` that requires a pull request and the **CI** check, so every change is reviewed.
