# IDEAS — Future Product & Engineering Backlog

Identitas produk dan repository aktif: Pluits. Belum ada nama alternatif atau domain khusus yang disetujui founder; jangan menyimpulkan nama dari salah dengar/transkripsi.
Terakhir diperbarui: 8 November 2026.
Status: wadah ide dan hipotesis, bukan keputusan produk atau daftar pekerjaan yang disetujui.

## Aturan penggunaan
- Masukan founder yang belum diputuskan disimpan di sini, bukan otomatis dimasukkan ke Business Model Master atau roadmap implementasi.
- Diskusi dan contoh platform lain bukan persetujuan untuk membangun.
- Setiap ide ditinjau dari kebutuhan pengguna, model bisnis aktif, alasan platform besar mengambil keputusan berbeda, biaya, risiko, privasi, keamanan, skalabilitas, dan alternatif.
- Promosi ide ke model bisnis/roadmap memerlukan keputusan eksplisit founder. Catat tanggal, alasan, dampak, dan dokumen yang diperbarui.
- Setelah disetujui, catat nomor keputusan D-XXX di `MASTER/DECISION-LOG.md`; perubahan model bisnis harus diperbarui di Business Model Master sebelum diturunkan ke roadmap sesuai `SOP/PRODUCT-CHANGE-CONTROL.md`.
- Jangan hapus ide lama; tandai PARKED, REJECTED, MERGED, atau PROMOTED dengan alasan.

## Checklist evaluasi ide
- [ ] Masalah pengguna jelas.
- [ ] Hipotesis nilai dan penerima manfaat jelas.
- [ ] Dianalisis mengapa platform besar mungkin tidak melakukan hal yang sama.
- [ ] Alternatif dan konsekuensi jika tidak dibangun dibandingkan.
- [ ] Dampak UX, feed quality, privasi, keamanan, moderasi, biaya, dan skala dinilai.
- [ ] Risiko penyalahgunaan dan mitigasi dinilai.
- [ ] Keputusan founder dicatat: lanjut / tunda / tolak.
- [ ] Jika disetujui: spesifikasi, acceptance criteria, dependency, rollback, dan UAT dibuat.


## Template pencatatan ide/temuan baru
Salin blok ini untuk setiap temuan baru. Satu temuan dapat berasal dari percakapan founder, pengujian aplikasi, screenshot, analisis kompetitor, riset, atau audit.

### IDEA-XXX — [Judul singkat]
- **Tanggal ditemukan:**
- **Sumber/konteks:** chat, UAT, screenshot, kompetitor, audit, riset, atau lainnya.
- **Kategori:** UX/UI | User Journey | Business Model | Pricing/Revenue | Strategy/Growth | Trust/Safety | Technical Architecture | Operations | Legal/Compliance | Research.
- **Jenis:** FACT | OBSERVATION | ASSUMPTION | HYPOTHESIS | OPINION.
- **Status:** PROPOSED | NEEDS RESEARCH | PARKED | APPROVED | REJECTED | PROMOTED | MERGED.
- **Masalah yang ditemukan:**
- **Pengguna/pihak terdampak:**
- **Alur atau kondisi saat ini:**
- **Usulan/hipotesis solusi:**
- **Nilai/manfaat yang diharapkan:**
- **Alternatif dan alasan tidak membangun:**
- **Dampak ke Social / Marketplace / Trip / GeoDirectory:**
- **Dampak backend, data, permission, privasi, keamanan:**
- **Risiko, biaya, kompleksitas, dan dependency:**
- **Pertanyaan riset/validasi:**
- **Keputusan founder dan tanggal:**
- **Jika disetujui, bagian Business Model Master yang diperbarui:**
- **Spesifikasi/PR/checkpoint roadmap:**
- **Bukti UAT/hasil setelah dijalankan:**

Aturan: AI boleh membantu menyusun dan menganalisis ide. AI tidak boleh menandai APPROVED, mengubah Business Model Master, atau memasukkan ide ke roadmap tanpa keputusan eksplisit founder.

## IDEA-001 — Identitas resmi platform dan pengumuman kepada pengguna
Status: PARKED / NEEDS PRODUCT RESEARCH
Sumber: diskusi founder, 8 November 2026.

### Gagasan
Mungkin platform memiliki identitas resmi untuk menerbitkan pembaruan fitur, pengumuman layanan, panduan, kebijakan, dan informasi penting. Distribusi mungkin tidak bergantung pada follower.

### Belum boleh diasumsikan
- Belum diputuskan apakah berupa akun sosial, system notice, inbox, pusat pembaruan, banner, atau kombinasi.
- Belum diputuskan apakah tampil ke semua Beranda, target, frekuensi, atau durasi.
- Belum diputuskan apakah pengguna dapat follow, mute, berkomentar, atau mengatur preferensi.
- Belum diputuskan nama dan identitas visual kanal.

### Pertanyaan riset terbalik
- Mengapa platform sosial besar tidak selalu menempatkan akun resmi platform di semua feed?
- Apakah konten resmi mengganggu relevansi feed, terasa seperti iklan, atau mengurangi rasa kepemilikan komunitas?
- Bagaimana platform besar menyampaikan perubahan produk, insiden, dan pengumuman kebijakan?
- Mana yang perlu masuk feed dan mana yang lebih tepat di notifikasi sistem, inbox, help center, atau changelog?
- Bagaimana mencegah kelelahan notifikasi dan menjaga kepercayaan pengguna?

### Risiko awal
Feed clutter, announcement fatigue, kesan promosi diri, penyalahgunaan kanal, pengumuman tidak relevan lintas wilayah/bahasa, dan kebingungan antara akun sosial dengan pesan sistem.

### Next action
Belum dijadwalkan. Lakukan riset kompetitor dan pola komunikasi produk jika founder meminta.

## IDEA-002 — Modular architecture, safe growth, and compatibility
Status: IDEA / LONG-TERM ENGINEERING PRINCIPLE
- Aplikasi perlu dipisah menjadi modul dengan batas domain, kontrak, dependency, dan tanggung jawab yang jelas.
- Perubahan satu modul tidak boleh merusak modul yang sudah digunakan. Prioritaskan backward compatibility, migration bertahap, automated tests, feature flags bila sesuai, dan rollback.
- Sebelum memilih bahasa/framework baru, bandingkan runtime, biaya hosting, performa, ekosistem, keamanan, pemeliharaan solo, dan workflow Android.
- Pilihan bahasa dan arsitektur belum diputuskan; jangan memilih karena tren atau asumsi skala.
- Rencanakan observability, capacity/load testing, backup/recovery, incident response, abuse protection, dan release controls.

## IDEA-003 — AI-assisted operations and security agents
Status: IDEA / FUTURE RESEARCH — NOT IMPLEMENTED

### Kandidat peran
- Security monitoring dan vulnerability/dependency review.
- Bug/error triage dari logs, stack traces, error IDs, dan laporan pengguna.
- Availability, latency, resource, dan performance monitoring.
- Incident correlation, impact assessment, dan rekomendasi mitigasi.
- Laporan harian, mingguan, bulanan untuk founder.

### Standar laporan
Setiap temuan menyertakan waktu, komponen terdampak, severity, bukti/log/error ID, kemungkinan dampak, langkah reproduksi bila ada, rekomendasi, confidence/ketidakpastian, dan status tindak lanjut. Laporan periodik merangkum tren dan temuan terbuka.

### Batas keamanan agent
- Least privilege dan akses terpisah per tugas.
- Secret tidak boleh dimasukkan ke prompt/log atau dibaca tanpa kebutuhan sah.
- Agent boleh mendeteksi, menganalisis, membuat laporan, dan mengusulkan patch.
- Perubahan production, permission, penghapusan data, rotasi credential, dan tindakan berisiko memerlukan persetujuan manusia serta audit trail.
- Agent tidak boleh mengklaim sistem aman hanya karena tidak menemukan alert.
- Evaluasi false positive/negative, audit log, dan prosedur saat monitoring gagal wajib dirancang.

## IDEA-004 — Domain sendiri dan repository privacy
Status: IDEA / FUTURE DEPLOYMENT & SECURITY PLANNING

### Masukan founder
Founder mempertimbangkan domain milik sendiri pada masa depan dan menginginkan pengguna mengakses alamat produk secara langsung, tanpa mudah menemukan repository GitHub atau akar implementasi. Nama domain belum dipilih.

### Klarifikasi wajib
Nama produk/repository saat ini adalah Pluits. Belum ada domain khusus yang disetujui. Jangan menebak domain, rename repo, brand, app metadata, atau URL sebelum keputusan eksplisit.

### Fakta dan risiko
- Custom domain hanya mengubah alamat yang digunakan pengguna; custom domain tidak menyembunyikan repository, source map, bundle JavaScript, asset, endpoint, metadata, atau riwayat commit yang memang publik.
- Repository public tetap dapat ditelusuri meskipun website memakai domain sendiri.
- Repository private membatasi akses source di GitHub, tetapi tidak membuat kode frontend yang dikirim ke browser menjadi rahasia.
- API keys client-side, endpoint, dan schema yang terekspos harus dianggap dapat ditemukan. Secret server-side harus disimpan di secret manager/environment dan dilindungi policy backend.
- Repository Pluits saat pemeriksaan 8 November 2026 masih PUBLIC. Ini berarti source dan riwayat yang tersimpan di repository dapat dilihat publik.
- Menurut dokumentasi GitHub saat ini, GitHub Pages tersedia untuk repository publik pada GitHub Free; penggunaan repository private untuk Pages memerlukan paket berbayar yang mendukungnya. Pada GitHub Free personal, mengubah repository menjadi private akan membuat site Pages yang dipublikasikan otomatis tidak tersedia. Periksa ulang ketentuan sebelum migrasi.
- Jika repository public diubah menjadi private, public forks yang sudah dibuat tidak otomatis menjadi private dan akan dipisahkan dari jaringan repository asal.
- Hosting produksi dapat dipindah ke layanan yang sesuai sebelum menutup atau memindahkan repository.

### Sebelum migrasi
- Audit visibility, secrets, Actions permissions, logs, source maps, frontend bundles, Supabase RLS, public buckets, API exposure, DNS, TLS, backup, rollback, dan vendor lock-in.
- Pilih hosting berdasarkan biaya, backend/runtime, deploy dari ponsel, observability, dan privasi.
- Siapkan DNS, HTTPS, redirects, email, environment separation, monitoring, dan recovery plan.
- Jangan menjanjikan domain sendiri membuat sistem tidak bisa ditiru atau diganggu; keamanan berasal dari desain, kontrol akses, dan operasi.
- Jangan ubah visibility repository atau deployment tanpa persetujuan founder dan rencana transisi teruji.

## Log keputusan
Belum ada ide dalam dokumen ini yang disetujui sebagai fitur implementasi.


## IDEA-005 — Governance capture for new founder discoveries
Status: IDEA / PROCESS ENHANCEMENT — NOT A PRODUCT FEATURE
- Temuan dari percakapan, UAT, analisis kompetitor, bug report, atau eksplorasi desain dapat dicatat dengan tanggal, konteks, dan sumber.
- Klasifikasikan: UX/UI, user journey, business model, pricing/revenue, strategy/growth, trust/safety, technical architecture, operations, legal/compliance, research.
- Bedakan observasi, asumsi, hipotesis, dan keputusan founder.
- Catat masalah, pengguna terdampak, hipotesis nilai, contoh, alternatif, alasan tidak membangun, risiko, biaya/kompleksitas, dependency, dan pertanyaan terbuka.
- Ide yang disetujui dipromosikan secara eksplisit ke Business Model Master (bila mengubah keputusan bisnis), spesifikasi domain, lalu Project Status & Roadmap. Tandai ide PROMOTED dan tautkan checkpoint/keputusan.
- Ide yang belum cocok tetap PARKED, REJECTED, atau MERGED; jangan hapus jejak pembelajaran.


## IDEA-006 — Production release guard and live cart continuity
Status: NEEDS RESEARCH / PARTLY IMPLEMENTED ENGINEERING CONTROL — NOT A BUSINESS-MODEL CHANGE

### Observation
Pluits is already published and has a registered account. Production code and existing user data must be treated as live, even while features remain incomplete.

### Engineering controls started
- A CI regression guard now checks retired demo procurement modules do not return and confirms the active Marketplace/Trip source still calls backend contracts.
- The Pages workflow runs this guard before building.
- Seller write permissions now require owner status or explicit permission grants at the database policy layer.

### Remaining proposal
- Persist Marketplace carts server-side for signed-in users and merge guest carts safely after login.
- Keep a local guest draft only as an offline/temporary cache; backend cart is canonical for signed-in accounts.
- Re-fetch current price, discount, stock, active status, and store availability before displaying a restored cart and again at checkout.
- Define one-store-per-cart behavior, conflict handling when guest and account carts refer to different stores, expiry/cleanup, and multi-device concurrency.
- Add authenticated API negative tests and a staff permission management surface before any staff invitation.

### Risks and boundaries
- Do not discard or overwrite a guest cart silently.
- Do not trust client-submitted price or stock.
- Do not migrate localStorage values without a documented merge and recovery path.
- Do not enable staff invitations before grant administration and RLS/API tests are complete.
- This idea does not authorize changes to the Business Model Master or a payment gateway.


### IDEA-006 update — Store permissions are now one backend contract
- Two live migrations now align table RLS and privileged Marketplace RPCs to one private permission helper.
- Role presets are owner / manager / catalog / orders / accounting, while staff can receive explicit grants.
- Matrix was verified using rollback-only SQL tests. Real-account API and Storage tests remain outstanding.
- The remaining product/UX question is how an owner should safely invite, suspend, revoke, and audit staff access. Keep staff invitations unavailable until the management flow and two-account tests are ready.


### IDEA-006 update — Starter/demo residue cleanup
- Removed the unused Vite counter and Vite/JavaScript starter artwork.
- Removed an orphaned fake Bagus login page and wrappers pointing at deleted demo modules.
- Added CI assertions so those specific modules/markers cannot silently return.
- This cleanup does not remove legitimate empty-state/form placeholder text and does not relabel unclaimed directory places as verified.


### IDEA-006 update — Legacy category taxonomy preserved safely
- The old static master-data module was not used by active Pluits routes and contained obsolete category, fulfilment, payment, commission, and location assumptions.
- A sanitized plain-text snapshot is retained only as a historical taxonomy reference; the executable module was deleted and CI now blocks its return.
- Any useful category idea must be re-evaluated against the active Pluits Marketplace/GeoDirectory model before implementation.


## IDEA-007 — Licensed audio library and responsible short-video discovery
Status: NEEDS RESEARCH / NOT IMPLEMENTED  
Source: founder's Social Media priority, 8 November 2026.

### User intent
- Users want music/audio on videos, short-video discovery, viral reach and a useful "For You" experience.
- Pluits must not copy or use copyrighted tracks without permission.

### Product direction to validate
- Start with original user-created sounds and a curated catalog of royalty-free/Creative Commons tracks whose terms explicitly permit the intended commercial social-platform use.
- Preserve creator, source, license/version, attribution, permitted use, territory, expiry/revocation and evidence for every track.
- Offer "Following" and "Latest" as deterministic feed choices; treat "For You" as a recommendation system requiring evaluation, not a promise of virality.
- Ranking must balance relevance, freshness, completion/replay, meaningful engagement, creator diversity, negative feedback, safety and spam resistance; do not optimize likes alone.
- Add audio reporting, takedown, rights dispute, mute/remove and track availability controls.

### Research and validation
- Determine whether licenses permit user-generated video sync, platform hosting, public playback, monetization, territory, and sublicensing.
- Assess storage/transcoding/bandwidth costs and rights-holder takedown workflow.
- Benchmark ranking against Following/Latest and measure retention, hides, reports, creator exposure concentration and feedback quality.
- Never seed the library with commercial music or claim a track is copyright-free without documented license proof.

### Release boundary
This idea is part of the Social Media product direction, but it is not approved for implementation as a full music marketplace or an algorithm promising viral reach. Define legal, technical and moderation requirements first.


## IDEA-008 — Local presence, distinct account types, specialist professionals, and transaction-proven social activity
Status: PROPOSED / NEEDS PRODUCT DESIGN — NOT APPROVED FOR IMPLEMENTATION  
Source: founder sharing and strategic discussion, 9 November 2026.

### Founder narrative and context
Founder describes a practical reason people and communities may adopt Pluits: many local community organizations, such as a banjar, do not have their own website or an accessible digital information hub. Pluits could give such a community an online presence with an identity/profile page, an information catalogue, a way to communicate directly, and updates relevant to its local area. The founder sees this as a real utility rather than asking people to download an app without a reason. As more local organizations and businesses become discoverable and useful through Pluits, residents may naturally have a reason to install and use the platform.

This local directory concept is not intended to be merely a static list of businesses. It connects local presence and information with the social layer. For example, a restaurant may become known because people see its content on Pluits, discover its physical location, and visit it in person. The founder is not insisting that every offline purchase must be forced into an online checkout. Someone may visit a restaurant and pay cash. However, that visit and cash purchase do not create the same transaction evidence or transaction-linked publishing capability as a purchase made through Pluits. This difference can become part of the platform's identity: Pluits can distinguish a claimed visit from an activity supported by an in-platform transaction.

### Account and entity distinctions raised by the founder
The founder explicitly corrects the assumption that one account should freely create one store and one service offering interchangeably. The founder's current thinking is that account/entity types should have clear boundaries:
- A **store** is for selling products. A store should remain a store; it should not simply be switched into a service-provider profile.
- A **professional** is not a general-purpose shop. The professional identity should be anchored to one clear specialty, rather than allowing a profile to claim a long, unrestricted list of unrelated skills. Examples raised: a dentist should be represented as a dentist; a massage practitioner as a massage practitioner. The founder dislikes a broad, catch-all skill list because it weakens clarity and may make it easier for spam or unreliable profiles to present themselves as professionals.
- A **personal account** is for an ordinary individual participating socially. It should not have to publish a private home address or exact location merely to exist as a user.

These are conceptual boundaries raised in discussion, not a finalized data model. The distinction between a user account and the entities that the user owns, manages, represents, or works for still needs careful modeling. Do not infer that each person can own only one entity, or that the founder has approved a one-account/one-entity restriction.

### Physical-presence and location expectations
The founder proposes a strict trust requirement for professional service profiles: a professional who offers an in-person service should have a real physical location that customers can visit. This is intended as an anti-spam and trust filter, not just a display preference. The founder contrasts this with an ordinary personal account, which should not be required to expose its private address. A personal account may still provide a broad locality or service-area indication such as Tambora, West Jakarta, or Gianyar, Bali, without displaying a precise address.

The founder also distinguishes store location information from personal privacy. A store's detailed location should be displayed because customers need to know where the business operates. The precise fields, verification evidence, exceptions, and rules for mobile/on-site professionals are not yet defined. Do not silently assume that every professional service can only operate from a fixed clinic or office; this requires further discussion, especially for legitimate mobile or home-visit services.

### Transaction-linked social activity: the Kecak example
The founder gives an example of three people attending a Kecak performance. One person buys the tickets through Pluits. The purchaser has an in-platform transaction record and can publish an activity associated with that transaction. The other two people may be tagged as companions or participants. The founder imagines the post or activity appearing automatically in the tagged friends' feeds, similar to a Facebook-style social distribution effect, subject to the eventual product rules.

The key distinction is evidence and participation:
- The person who paid through Pluits has a transaction record associated with their account.
- Friends tagged by the purchaser may be participants in the shared experience, but tagging must not falsely imply that they personally paid for the tickets.
- A person who only views or likes the post has not thereby proven attendance or purchase.
- A person who paid cash at the venue may still share a normal social post, but that post should not be represented as a Pluits-verified transaction.

The founder describes this as a social "bubble" or network effect previously discussed: one real-world activity can connect the purchaser, their companions, the venue/provider, and the wider social feed. The founder's underlying intention is to create a meaningful difference from generic social platforms: Pluits can connect social content to real places, activities, and transaction evidence, rather than treating every post as an equally verified claim about an experience.

### Potential value and strategic implications
- Local communities gain a useful digital presence and a direct local information channel.
- Local businesses and providers become discoverable through social content and directory profiles.
- People can discover places through the feed and choose to transact online or offline.
- In-platform transactions create a stronger evidence layer for purchase-linked activities.
- Tagging companions may create social distribution and shared memory without falsely assigning payment to every participant.
- Clear store, professional, and personal distinctions may improve directory quality, user understanding, trust, and spam resistance.
- Coarse location for ordinary users can support locality relevance while protecting exact personal addresses.

### Important unresolved design questions
1. Is a banjar or community represented as an Organization, a Place, or an Organization attached to a Place? How are official representatives and administrators verified?
2. What is the formal distinction between a personal account, store entity, professional entity, community/organization, and physical place?
3. Can one personal account own or manage multiple stores, professional practices, or organizations? What memberships and roles are needed?
4. Does a professional specialty map to one canonical primary category, with optional credentials or sub-specialties, rather than a free-form skill list?
5. What counts as a verifiable physical location? How are home-based practices, mobile professionals, and legitimate service-area businesses handled?
6. What evidence is required before a professional may publish a public address or claim a verified professional identity?
7. Can a store have multiple branches or locations while remaining one store identity?
8. How does Pluits represent offline cash purchases and visits without falsely marking them as in-platform transactions?
9. What exact proof is required for transaction-linked posts: paid order, redeemed ticket, check-in, completed service, or another event?
10. How does a purchaser invite/tag companions, and how do companions accept, decline, remove the tag, or control feed distribution?
11. Does tagging automatically publish to another person's feed, or does it create a pending activity invitation requiring consent? This is a privacy and unwanted-content risk that must be resolved.
12. How are refunds, cancellations, ticket transfers, group purchases, and multiple attendees represented?
13. What is shown publicly versus privately about the transaction, purchaser, companions, and exact attendance?
14. How do the Social, GeoDirectory, Marketplace, Trip/Activities, and identity/permission domains share references without duplicating entities or weakening authorization?

### Initial risk and counterpoints
- Requiring a fixed physical address for every professional could exclude legitimate mobile, remote, home-visit, or appointment-only professionals. The founder's intent is physical accountability; the exact rule needs careful exceptions rather than an overly broad assumption.
- A verified transaction proves a particular purchase/payment event, not necessarily that every tagged person attended or used the service.
- Automatic posting to tagged friends' feeds without their consent could create privacy, spam, harassment, and social-pressure problems.
- Offline purchases should not be described as inferior or invalid; they simply lack Pluits transaction evidence unless a legitimate verification flow is later designed.
- Community pages require governance to prevent impersonation, disputed representation, and unauthorized announcements.
- Strict account-type boundaries must not accidentally prevent one person from managing multiple legitimate entities.

### Classification
- Founder statements: account-type distinction, specialist professional identity, physical-location expectation for in-person professionals, privacy distinction for personal accounts, and transaction-linked social example.
- Strategic observations: local communities may adopt Pluits for practical digital-presence needs; social discovery can drive offline visits; transaction evidence can differentiate Pluits.
- Hypotheses requiring validation: organic app adoption through local utility, stronger trust/spam resistance through physical-location requirements, and network effects from transaction-linked companion tagging.
- Decisions: none recorded. Founder has not approved this concept as a final business rule, schema, or implementation scope.

### Next step
Continue founder discussion to clarify entity/account relationships, professional location exceptions, and consent-based transaction activity sharing. Keep this idea in the backlog until the founder explicitly approves any business rule. Do not update the Business Model Master, Decision Log, product specification, or implementation roadmap solely on the basis of this discussion.


### IDEA-008 update — Verified affiliations, organization stewards, and local dispute accountability
Source: continued founder sharing, 9 November 2026. This is an expansion of the same concept, not a new approval or implementation instruction.

#### Founder narrative: professional identity is linked to real organizations
The founder clarifies that a professional should not merely type a workplace name into their profile and have that claim treated as true. A doctor may have their own professional account and specialty, while also practicing at several hospitals or clinics. Each hospital or clinic should have its own organization profile on Pluits, including its company/profile information and the ability to manage its institutional information. The institution can maintain the doctors associated with it, their specialties, and their practice schedules.

A doctor would submit an affiliation request to each institution where they claim to practice. The relevant institution receives a notification and an authorized manager checks whether the person is actually known and affiliated there. If the claim is valid, the institution accepts it and the relationship becomes synchronized: the doctor's profile can show the approved practice locations, and the institution's profile can show its approved doctors and relevant schedules. The founder's example includes a doctor practicing at multiple hospitals; the relationship must support multiple approved affiliations rather than assuming one professional works at only one place.

The same pattern applies to ordinary employment. The founder gives the example of Henky, who has a personal account and says he works at Toko Besi Murah. Henky submits a workplace affiliation request. The store receives a notification identifying the requesting account/username. Its authorized manager can accept if the person is known and the employment claim is valid, or reject if not. The purpose is to prevent an unverified self-declared workplace from appearing as an established fact.

The founder extends the model to religious and community organizations: for example, a pastor may be associated with and manage a church profile, but the church itself is the organization/place and the pastor's authority must be established by the people entitled to represent that institution. Similar representation questions apply to banjar, businesses, hospitals, and other organizations.

#### Organization profile stewardship
The founder wants each organization/place profile to have one clearly accountable primary account or steward responsible for its management. This is intended to prevent arbitrary people from claiming, changing, or controlling an institution's profile. The precise governance model remains open: one accountable primary steward may need to appoint additional authorized administrators, maintain succession/transfer procedures, and operate under auditable permissions. Do not interpret "one account manages it" as a requirement that only one human can ever perform every administrative task.

#### Local Pluits presence and dispute handling
The founder connects this trust model to the idea that Pluits may eventually need a local office or accountable local representatives in different regions. Their purpose would include helping resolve disputes when someone improperly claims an organization, place, business, or institutional identity, and reducing the risk that bad actors take over legitimate profiles. This is a proposed operational footprint, not a confirmed office rollout, staffing plan, or cost commitment.

The founder expresses a strong preference for decisive enforcement when someone falsely claims to be a doctor or employee of a named institution and the institution rejects or reports the claim as fraudulent. The founder imagines the platform detecting the abuse and blocking/removing the account to keep Pluits clean. This is recorded as the founder's proposed enforcement intent, not an approved automatic-deletion rule. Product and safety design must distinguish a clearly malicious impersonation from mistaken selection, stale employment, an honest dispute, compromised organization access, or an institution's mistaken rejection. Evidence, severity, temporary restrictions, human review for severe outcomes, audit trail, notification, and appeal/recovery safeguards need to be designed before permanent deletion is considered.

#### Data and workflow implications to investigate
- Model affiliation as a relationship between a person/account and an organization entity, with status, role/title, specialty or department where relevant, start/end dates if appropriate, evidence, requestor, reviewer, timestamps, and audit history.
- Support multiple simultaneous affiliations for a professional, and potentially multiple employment affiliations for a personal account, subject to clear display and verification rules.
- Separate "claimed", "pending", "verified/accepted", "rejected", "ended", and "disputed" states. Never display a pending or rejected affiliation as verified.
- Organization-side notifications must reach an authorized steward or delegated manager, not an arbitrary user who merely follows or is associated with the organization.
- Provide safe acceptance, rejection, report, revoke, and correction flows. Rejection alone should not automatically prove fraud.
- Organization profile control needs claim verification, primary steward assignment, delegated roles, access revocation, succession/ownership transfer, and a tamper-evident audit trail.
- Public profile presentation should distinguish professional specialty from employer affiliations, and show only institution-approved relationships and schedules.
- Define how an institution verifies professional credentials and scope of practice; an employer confirming affiliation is not automatically proof of a regulated professional license or specialty.
- Define how employees' privacy and safety are protected when employment is disputed, ended, or not intended to be public.
- Establish local dispute escalation and support procedures before promising a Pluits office in every region.

#### Risks and unresolved questions
1. What evidence establishes that a person is a legitimate doctor, pastor, employee, store owner, or institutional representative? Different roles require different verification standards.
2. Is organization acceptance enough to verify workplace affiliation, while professional credentials require a separate authoritative verification?
3. Who is allowed to receive and act on affiliation requests, and how is that authority itself verified?
4. How does Pluits prevent a malicious first claimant from becoming the sole organization steward?
5. How are disputes handled if the current steward is corrupt, unavailable, impersonated, or in conflict with the rightful organization?
6. Can an organization have one primary accountable steward plus several role-limited managers? What happens when the primary steward leaves?
7. Which affiliation details are public, private, or visible only to the organization and the account holder?
8. How does an individual remove an outdated affiliation or challenge a false rejection?
9. What safeguards prevent an institution from using affiliation controls to harass, retaliate against, or expose a worker?
10. What local support model is viable economically and operationally, and which disputes can be resolved remotely with evidence versus requiring local intervention?
11. What enforcement ladder is appropriate for false claims: reject request, warn, limit affiliation requests, suspend, investigate, or permanently remove? What evidence and appeal path apply at each level?

#### Classification and decision boundary
- Founder statements: affiliation must be confirmed by the organization; the organization receives a request notification; the authorized manager accepts or rejects; multiple workplace affiliations may be displayed; each organization needs an accountable manager; local Pluits presence may help with profile/claim disputes; fraudulent impersonation should face decisive action.
- Strategic hypotheses: verified affiliations may improve identity credibility, organization profile accuracy, user accountability, and the value of personal profiles as professional portfolios.
- Open design proposals: relationship schema, role model, verification evidence, organization stewardship, regional dispute operations, and enforcement ladder.
- Decisions: none. No automatic account deletion, local office expansion, verification standard, or affiliation feature is approved for implementation by this discussion alone.
