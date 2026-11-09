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

## IDEA-009 — Social Experience Commerce: transaksi sebagai bukti pengalaman, Feed sebagai nilai sosial, dan insentif akuisisi bisnis
- **Tanggal ditemukan:** 9 November 2026.
- **Sumber/konteks:** sharing founder tentang perilaku sosial pengguna, contoh Ibu Nia menginap di hotel premium di Bali, transaksi kamar dan layanan tambahan, pengalaman yang dibagikan terlambat, Trip sebagai riwayat perjalanan, serta alasan hotel dan bisnis lokal bergabung.
- **Kategori:** Business Model | User Journey | Pricing/Revenue | Strategy/Growth | UX/UI | Trust/Safety | Operations.
- **Jenis:** OBSERVATION | HYPOTHESIS | PROPOSAL.
- **Status:** PROPOSED — belum menjadi keputusan final atau izin implementasi.
- **Ruang lingkup:** pengembangan hipotesis model bisnis lintas Social, Trip, Marketplace/commerce, dan profil/alat operasional bisnis; bukan vertical baru yang berdiri sendiri.

### 1. Gagasan inti founder
Pluits dibangun dengan menerima perilaku sosial manusia yang sudah umum: orang senang membagikan pengalaman, menunjukkan tempat yang dikunjungi, barang yang dibeli, hotel tempat menginap, makanan yang dinikmati, aktivitas yang dilakukan, pencapaian, dan momen yang ingin diketahui orang lain. Sebagian orang menikmati validasi sosial atau ingin memperlihatkan gaya hidup; sebagian lain senang menonton, mengikuti, membandingkan, mencari inspirasi, dan menemukan tempat melalui pengalaman orang lain. Perilaku ini tidak dianggap salah atau wajib dilakukan. Berbagi pengalaman dan menautkannya ke transaksi harus tetap opsional.

Hipotesis pembeda Pluits bukan melarang unggahan biasa atau mengganti kebiasaan sosial pengguna, melainkan memberi pilihan agar sebuah unggahan dapat memiliki hubungan yang lebih kuat dengan aktivitas nyata: penyedia yang benar, produk/layanan yang dipilih, harga, tanggal kejadian, durasi, dan transaksi yang sah. Foto, caption, geotag, atau klaim lokasi saja tidak membuktikan pembelian, pembayaran, menginap, atau kehadiran. Konten biasa tetap boleh, tetapi tidak boleh diberi label seolah-olah transaksi terverifikasi.

Pluits perlu terasa akrab bagi orang yang telah terbiasa dengan Instagram: pengalaman visual, feed, foto/video, Story, interaksi, dan pola konsumsi konten harus mudah dipahami. Tujuannya bukan menyalin Instagram, melainkan mengurangi hambatan perpindahan kebiasaan. Alasan untuk mencoba Pluits adalah nilai tambahan yang tidak diberikan oleh unggahan sosial biasa: pengalaman dapat terhubung dengan transaksi dan katalog penyedia, menjadi bagian dari Trip, serta memberi manfaat komersial yang nyata kepada penyedia.

### 2. Cerita pengguna: Ibu Nia menginap di hotel
Ibu Nia datang berlibur ke Bali dan memesan kamar di sebuah hotel premium, misalnya Grand Hyatt. Nilai kamar dapat mencapai beberapa juta rupiah per malam dan masa menginapnya beberapa hari. Pemesanan kamar merupakan satu transaksi tersendiri: produk/layanan yang dibeli adalah kamar atau tipe kamar tertentu, dengan harga, tanggal menginap, jumlah malam, dan detail reservasi yang relevan.

Ibu Nia mungkin tidak langsung membuat review pada hari check-in atau check-out. Ia dapat menyimpan pengalaman dan foto, lalu baru membagikannya beberapa minggu kemudian. Saat review itu akhirnya dipublikasikan:
- Postingan masuk ke Feed menurut waktu publikasi sekarang dan tidak mundur atau menyela postingan lama.
- Konten tetap menampilkan tanggal pengalaman/transaksi yang sebenarnya, terpisah jelas dari tanggal posting.
- Jika ada transaksi yang sah di Pluits, tanggal transaksi, detail produk/layanan, dan bukti statusnya bersumber dari backend; pengguna tidak dapat mengubahnya menjadi tanggal lain melalui caption.
- Pengalaman yang terlambat dibagikan tetap ditempatkan dalam urutan kronologis Trip berdasarkan waktu kejadian, bukan waktu review diterbitkan.
- Feed menjawab “kapan cerita ini dibagikan”; Trip menjawab “kapan pengalaman ini benar-benar terjadi”.

Ibu Nia tidak harus selalu memotret ulang setiap sudut kamar. Dengan izin penggunaan yang sesuai, ia dapat memilih foto resmi dari katalog hotel—misalnya kamar, kamar mandi, balkon, fasilitas, atau pemandangan—sebagai representasi tipe kamar/fasilitas yang ia pilih. Hubungan dengan transaksi menunjukkan pengalaman yang diklaimnya terkait dengan produk/akomodasi tersebut; foto katalog sendiri bukan bukti bahwa ia berada di kamar atau menikmati seluruh fasilitas. Konten resmi harus memiliki hak penggunaan/provenance yang jelas dan tidak boleh membuat orang salah mengira foto katalog sebagai foto pribadi yang diambil tamu.

### 3. Satu kunjungan dapat menghasilkan beberapa transaksi dan pengalaman
Selama tinggal di hotel, Ibu Nia dapat melakukan transaksi lain yang terpisah dari pemesanan kamar, misalnya:
- makan siang atau makan malam di restoran hotel;
- makan atau bersantai di tepi pantai/private beach;
- spa atau treatment;
- aktivitas, fasilitas, atau layanan tambahan lain yang dijual hotel.

Contoh founder menyebut spa dengan harga sekitar Rp6 juta sebagai ilustrasi pengalaman premium yang mungkin ingin dibagikan seseorang. Jangan menyimpulkan bahwa setiap pelanggan membeli layanan tersebut semata-mata untuk pamer atau bahwa mereka tidak menikmati layanannya; motivasi pengguna beragam dan tidak boleh diprofilkan secara merendahkan.

Transaksi kamar, makanan, spa, dan aktivitas merupakan item/lifecycle transaksi masing-masing, walaupun semuanya terjadi di properti dan kunjungan yang sama. Jika layanan tambahan dibayar langsung di lokasi melalui Pluits, transaksi itu dapat terhubung ke profil hotel, layanan/katalog yang tepat, harga, waktu transaksi, dan Trip. Pembayaran tunai atau kartu di luar Pluits tidak otomatis menjadi transaksi Pluits yang terverifikasi. Integrasi POS atau mekanisme pembuktian transaksi offline, bila kelak dipertimbangkan, memerlukan rancangan dan keputusan tersendiri; jangan memalsukan status transaksi hanya berdasarkan unggahan atau pengakuan merchant.

Dengan demikian satu masa menginap dapat menghasilkan rangkaian pengalaman dan transaksi: kamar, restoran, spa, fasilitas, dan tempat lain. Setiap aktivitas tetap dapat memiliki waktu dan bukti masing-masing, sementara Trip menyusunnya menjadi perjalanan yang utuh.

### 4. Dua waktu, Feed, dan Trip
Pengalaman yang baru direview belakangan harus mempertahankan dua timestamp yang berbeda dan tidak saling menggantikan:
1. **Occurred/transaction time:** waktu yang bersumber dari event transaksi/layanan yang sah, seperti pembayaran, reservasi, check-in, redeem, atau penyelesaian layanan sesuai bukti yang benar-benar tersedia.
2. **Published time:** waktu ketika pengguna benar-benar menerbitkan konten ke Feed/Story.

Feed mengurutkan posting berdasarkan aturan publikasi yang berlaku; posting lama yang baru dibagikan tidak boleh diam-diam mengubah urutan Feed. Trip mengurutkan pengalaman menurut waktu kejadian yang dapat dibuktikan. UI harus menjelaskan perbedaan kedua tanggal tersebut agar penonton tidak mengira unggahan baru berarti aktivitas sedang berlangsung sekarang.

Trip dapat menjadi catatan perjalanan personal seperti **My Bali**, **My Jogja**, dan seterusnya. Nama “My” menunjukkan bahwa ini adalah perjalanan/riwayat milik pengguna. Jika seseorang mengunjungi Bali beberapa kali pada tahun atau periode berbeda, kunjungan tersebut tercatat sebagai perjalanan/episode berbeda; kunjungan berikutnya tidak menimpa riwayat sebelumnya. Pengguna dapat melihat bahwa ia pernah ke Bali beberapa kali dan bagaimana perjalanan-perjalanan itu tersusun. Riwayat dapat berisi aktivitas yang dibagikan belakangan, serta aktivitas yang tidak pernah dibuat menjadi review publik.

Trip bukan sekadar itinerary masa depan. Ia berpotensi menjadi rekam kronologis pengalaman yang benar-benar terjadi dan, dengan pilihan pengguna, menjadi sumber inspirasi bagi orang lain untuk menyusun perjalanan mereka sendiri. Rencana masa depan tetap harus dibedakan dari perjalanan aktual. Mekanisme pembuktian timestamp/kehadiran belum diputuskan; pembayaran saja tidak selalu membuktikan layanan telah dinikmati, dan GPS/foto/geotag sendiri tidak cukup menjadi bukti transaksi.

### 5. Nilai sosial dan motivasi dua sisi
Ada dua kelompok motivasi yang saling melengkapi:
- **Penerbit/pengunggah:** ingin menyimpan momen, menunjukkan pengalaman, berbagi pencapaian atau gaya hidup, mendapat respons, validasi, pengakuan, atau sekadar membuat catatan pribadi. Ada pengguna yang aktif memamerkan pengalaman, ada yang sesekali berbagi, dan ada yang memilih menyimpan semuanya secara privat.
- **Penonton/pencari inspirasi:** ingin melihat pengalaman orang lain, menemukan hotel/restoran/toko/aktivitas, memahami pilihan nyata, membandingkan produk/harga/lokasi, mencari referensi, dan merencanakan pengalaman mereka sendiri.

Pengalaman yang terhubung dengan transaksi dapat memberi konteks lebih berguna daripada sekadar foto di depan hotel dengan tag lokasi. Namun transaksi tidak boleh menjadi syarat untuk semua bentuk ekspresi sosial, dan status “verified” harus spesifik terhadap hal yang benar-benar dibuktikan. Pembeli yang membayar tidak otomatis membuktikan semua teman yang ditandai ikut membayar atau hadir. Privasi tetap pilihan pengguna; transaksi tidak boleh otomatis mempublikasikan nominal, detail reservasi, identitas peserta, atau lokasi privat tanpa persetujuan yang jelas.

### 6. Alasan bisnis bergabung: hotel dan penyedia menjadi pihak yang berkepentingan
Hotel seperti Grand Hyatt memiliki alasan bisnis untuk hadir bukan hanya agar tercantum dalam direktori. Hotel memahami bahwa media sosial dapat memengaruhi minat, aspirasi, pertimbangan, dan keputusan calon tamu. Pelanggan yang ingin membagikan pengalaman menginap dapat menjadi sumber distribusi konten dan promosi berbasis pengalaman pelanggan. Hotel mendapat peluang agar kamar, fasilitas, restoran, spa, dan aktivitasnya ditemukan melalui cerita tamu yang benar-benar memiliki hubungan dengan layanan tersebut.

Jika hotel bergabung dan mengelola entitas/profil resminya, hotel dapat:
- menampilkan informasi properti, tipe kamar, foto resmi, fasilitas, restoran, spa, aktivitas, harga, dan ketentuan;
- menyediakan katalog produk/layanan yang sesuai dengan kategori bisnis;
- mengelola ketersediaan kamar/unit, kalender, jadwal layanan, kapasitas, stok bila relevan, dan pemesanan;
- mengelola transaksi/pesanan, status pemenuhan, dan komunikasi pelanggan sesuai lifecycle;
- memperoleh halaman/landing page dan alat pengelolaan bisnis yang disediakan Pluits sesuai kategori;
- merespons review atau unggahan pelanggan secara tepat, misalnya mengucapkan terima kasih atau menindaklanjuti keluhan;
- mendapatkan discovery dan promosi dari aktivitas sosial pelanggan, tanpa menganggap setiap konten sebagai endorsement berbayar.

Pola ini tidak terbatas pada hotel premium. Restoran, beach club, spa, toko besi, toko kebutuhan sehari-hari, penyedia aktivitas, dan bisnis lokal lain dapat memiliki katalog, harga, ketersediaan, jadwal, stok, dan alat pengelolaan yang disesuaikan dengan jenis usaha. Contoh toko besi: pengguna mencari “besi ulir”, melihat banyak pilihan, lalu memilih satu toko karena alasan tertentu—harga, jarak, stok, mutu, penawaran, atau pengiriman lokal. Konten transaksi/produk dapat menunjukkan pilihan yang dibuat dan informasi pembanding yang benar-benar tersedia. Sistem tidak boleh mengarang alasan pilihan jika pengguna tidak menyatakannya atau data objektif tidak membuktikannya.

### 7. Keselarasan insentif dan kemungkinan pendapatan Pluits
Hipotesis model ini menyelaraskan kepentingan:
- pelanggan memperoleh pengalaman transaksi yang dapat terhubung ke Feed/Trip dan catatan pribadinya;
- penyedia memperoleh penjualan, alat operasional, profil/katalog, dan peluang promosi dari pelanggan;
- penonton memperoleh referensi dan informasi yang lebih kontekstual;
- Pluits memperoleh aktivitas transaksi, data lifecycle yang sah, retensi, dan peluang pendapatan dari transaksi.

Founder memberi contoh komisi Pluits sebesar **2% dari nilai transaksi**. Angka ini adalah ilustrasi hipotesis monetisasi, bukan tarif final yang telah disetujui. Perlu riset biaya payment processing, pajak, refund/chargeback, settlement, dukungan pelanggan, kontrak penyedia, kategori usaha, margin, dan ketentuan hukum. Tarif dapat berbeda menurut kategori/kontrak atau tidak layak diterapkan pada transaksi tertentu; jangan menjanjikan “tidak ada pihak yang rugi” sebelum unit economics dan dampak kepada pelanggan/merchant diuji.

Founder juga mengamati bahwa sebagian pelanggan mungkin tetap memilih transaksi melalui Pluits walaupun harga akhir sesekali lebih tinggi daripada kanal lain, karena nilai utama yang dicari bukan selalu harga termurah: transaksi tersebut memungkinkan pengalaman yang ingin mereka tampilkan terhubung ke Feed/Trip. Ini adalah hipotesis perilaku yang perlu divalidasi, bukan alasan untuk menyembunyikan perbedaan harga. Harga total, biaya, syarat, dan manfaat harus transparan sebelum pembayaran; Pluits tidak boleh mengandalkan kebingungan pelanggan atau menekan merchant untuk menaikkan harga.

### 8. Mengapa pengalaman sosial harus akrab, tetapi bukan tiruan Instagram
Pengguna yang sudah terbiasa dengan Instagram memiliki kebiasaan dan jaringan sosial yang kuat. Memindahkan kebiasaan itu membutuhkan alasan yang bermakna, bukan hanya menambahkan katalog, peta, atau tombol transaksi. Hipotesis founder: alasan untuk mencoba Pluits adalah mereka tetap dapat menikmati pengalaman visual dan sosial yang familiar, sambil memperoleh nilai tambahan berupa transaksi yang dapat ditautkan, catatan Trip, referensi produk/layanan, dan bukti pengalaman.

Karena itu:
- Feed, foto/video, Story, interaksi, profil, dan konsumsi konten harus mudah dikenali serta nyaman.
- Pluits tidak boleh menyalin identitas visual, detail UI, atau seluruh pola Instagram secara membabi buta.
- Perbedaan Pluits harus terasa pada konteks dan hubungan data di balik konten: profil penyedia resmi, katalog, transaksi, pengalaman, Trip, serta kontrol privasi.
- Konten personal non-transaksi tetap mempunyai tempat agar Feed tidak berubah menjadi katalog iklan atau daftar kuitansi.
- Sponsor/iklan, konten resmi bisnis, konten pelanggan, dan konten yang memiliki bukti transaksi harus dapat dibedakan dengan jelas.

### 9. Rantai nilai dan kemungkinan network effect
1. Pengguna menemukan Pluits karena pengalaman sosial yang akrab dan konten yang menarik.
2. Pengguna melakukan transaksi yang memang ingin dilakukan melalui Pluits, misalnya kamar hotel atau layanan tambahan.
3. Aktivitas transaksi yang sah dapat menjadi sumber konteks untuk konten dan Trip.
4. Pengguna membagikan pengalaman ketika ia mau; konten muncul di Feed pada waktu publikasi dan di Trip menurut waktu kejadian.
5. Teman/penonton menemukan penyedia, melihat katalog dan informasi, membandingkan pilihan, lalu melakukan transaksi atau menyimpan inspirasi.
6. Penyedia memperoleh penjualan dan distribusi sosial, sehingga memiliki alasan mengelola profil, katalog, stok, jadwal, dan ketersediaannya di Pluits.
7. Semakin banyak penyedia dengan katalog/availability yang benar, semakin berguna discovery dan transaksi bagi pengguna.
8. Semakin banyak pengalaman nyata yang dibagikan, semakin kaya referensi sosial dan Trip; ini dapat memperkuat alasan pengguna dan penyedia untuk kembali.

Rantai ini adalah hipotesis network effect dua sisi/berlapis. Ia tidak otomatis terjadi hanya karena fitur tersedia. Perlu validasi supply onboarding, demand, conversion, repeat transaction, content creation, trust, merchant operations, dan biaya akuisisi.

### 10. Dampak lintas domain
- **Social:** konten biasa tetap didukung; konten tertentu dapat menautkan transaksi/layanan/produk; Feed memakai published time; label bukti harus presisi; komentar/respons bisnis dan pengaturan audiens perlu aturan.
- **Trip:** menyusun pengalaman aktual dari event yang sah; mengelompokkan perjalanan seperti My Bali; mendukung kunjungan berulang; memisahkan plan dari actual; menjaga timestamp kejadian dan privasi.
- **Marketplace/Commerce:** transaksi kamar/layanan tambahan/produk mempunyai item dan lifecycle masing-masing; harga, stok, jadwal, kapasitas, payment, fulfilment, refund dan settlement harus server-authoritative. Pemesanan akomodasi/aktivitas masa depan berbeda dari local instant/same-day fulfillment barang.
- **GeoDirectory:** menyediakan identitas kanonis untuk properti, hotel, restoran, spa, beach club, toko, tempat, dan penyedia. Tempat yang tercatat di direktori tidak otomatis menjadi bisnis aktif/terkelola atau otomatis tampil sebagai penyedia aktif di Explore. Klaim dan otorisasi pengelola harus sah.
- **Business tools:** halaman/landing page, katalog, inventory/stock, schedule/availability, booking/order management dan pengaturan kategori adalah hipotesis paket alat merchant. Hak owner/staff, audit trail, dan keamanan harus dibedakan.
- **Identity/trust:** transaksi, reservasi, check-in, layanan selesai, peserta, review, dan unggahan adalah status berbeda. Jangan mengklaim bukti yang tidak tersedia.

### 11. Risiko, batas, dan hal yang belum boleh diasumsikan
- **Privasi dan keselamatan:** tidak benar bahwa 99% orang pasti ingin semua aktivitas publik. Sebagian orang mungkin ingin berbagi, sebagian hanya ke teman, sebagian privat. Default, consent, nominal, detail hotel, tanggal perjalanan, peserta, dan lokasi perlu kontrol yang jelas.
- **Validitas bukti:** transaksi membuktikan event transaksi sesuai statusnya; tidak otomatis membuktikan check-in, kehadiran, kualitas, durasi aktual, atau semua peserta. Bukti untuk setiap klaim harus didefinisikan terpisah.
- **Kronologi:** jangan mengizinkan edit tanggal transaksi/kejadian melalui UI; koreksi harus melalui audit trail dan sumber backend. Belum diputuskan mekanisme time provenance untuk aktivitas non-transaksi.
- **Konten katalog:** hak penggunaan foto resmi dan cara menampilkan foto katalog versus foto pengguna harus jelas.
- **Manipulasi dan insentif:** jangan mendorong transaksi palsu, review berbayar terselubung, pembelian demi status, tekanan sosial, self-dealing, atau merchant membuat transaksi fiktif. Review harus tetap jujur dan pengungkapan insentif wajib jelas.
- **Keadilan harga:** nilai sosial tidak membenarkan harga/biaya tersembunyi atau klaim termurah yang tidak benar.
- **Ekonomi merchant:** komisi 2% belum final. Biaya payment, refund, chargeback, pajak, settlement, margin, dan kontrak dapat membuat model berbeda per kategori.
- **Operasional:** merchant tools gratis atau berbayar, batas fitur gratis, onboarding, dukungan, integrasi POS, settlement, dan SLA belum ditetapkan.
- **Feed quality:** Feed tidak boleh dipenuhi promosi bisnis atau konten transaksi yang monoton; konten personal biasa tetap penting.
- **Adopsi:** perpindahan dari Instagram tidak dapat diasumsikan hanya karena UI mirip. Network effect membutuhkan pengguna, penyedia, konten bermakna, transaksi yang benar, dan kualitas layanan.
- **Skala internasional:** contoh hotel premium/Bali dan beach club menunjukkan potensi internasional, tetapi ekspansi membutuhkan payment, mata uang, bahasa, pajak, kontrak, compliance, dukungan, dan supply lokal di tiap wilayah.

### 12. Pertanyaan validasi sebelum dipromosikan menjadi keputusan bisnis
1. Apa saja event yang dapat menghasilkan activity/Trip record: paid order, booking confirmed, check-in, redeem, service completed, atau kombinasi dengan status bukti berbeda?
2. Untuk kamar hotel, apakah pengalaman baru dapat dipublikasikan setelah booking, setelah pembayaran, saat check-in, atau setelah check-out? Klaim mana yang boleh muncul pada tiap tahap?
3. Bagaimana transaksi layanan tambahan di lokasi diintegrasikan: checkout Pluits, QR/POS merchant, payment link, atau mekanisme lain? Apa yang terjadi untuk cash/card di luar platform?
4. Apakah setiap transaksi otomatis membuat private Trip event, sementara Feed/Story memerlukan tindakan publikasi pengguna?
5. Bagaimana pengguna memilih item katalog/foto resmi yang cocok dengan produk yang dibeli tanpa menyiratkan foto itu diambil sendiri?
6. Bagaimana published time dan occurred time ditampilkan konsisten pada Feed, detail post, dan Trip?
7. Bagaimana satu perjalanan mengelompokkan transaksi dan aktivitas multi-merchant di wilayah/periode yang sama tanpa menggabungkan transaksi berbeda?
8. Bagaimana Trip menampilkan kunjungan berulang ke kota yang sama dan menghitung jumlah kunjungan secara akurat?
9. Bagaimana companion/teman ditautkan ke pengalaman tanpa menyiratkan mereka membayar atau hadir jika belum ada bukti/consent?
10. Paket alat bisnis mana yang benar-benar gratis, apa batasnya, dan apa sumber biaya operasionalnya?
11. Apakah komisi 2% layak untuk setiap kategori dan siapa yang menanggung biaya payment/refund/chargeback/pajak?
12. Apa metrik yang menunjukkan bahwa pelanggan memilih Pluits karena nilai sosial, bukan karena promosi sementara?
13. Apa metrik merchant yang menunjukkan kenaikan penjualan/retensi yang dapat diatribusikan ke konten dan transaksi Pluits?
14. Bagaimana menjaga feed tetap sosial dan menarik bagi penonton yang tidak sedang ingin bertransaksi?

### 13. Klasifikasi dan batas keputusan
- **Pernyataan/arah founder:** perilaku berbagi dan menunjukkan pengalaman adalah motivasi sosial yang ingin didukung, bukan diwajibkan; Feed harus familiar bagi pengguna media sosial; transaksi dapat menjadi dasar bukti; waktu publikasi berbeda dari waktu kejadian; Trip mencatat perjalanan dan kunjungan berulang; hotel/merchant memperoleh promosi serta alat operasional; Pluits dapat memperoleh komisi transaksi.
- **Contoh ilustratif:** Ibu Nia, Grand Hyatt, kamar Rp5–10 juta, spa sekitar Rp6 juta, makan di tepi pantai/beach club, dan komisi 2%. Angka/nama ini tidak otomatis menjadi tarif, kontrak, atau target komersial.
- **Hipotesis strategis:** pengguna akan memilih transaksi Pluits demi nilai sosial dan catatan pengalaman; penyedia akan bergabung karena pelanggan ingin membagikan pengalaman; alat merchant memperkuat supply onboarding; konten transaksi meningkatkan trust dan conversion; model dapat menarik segmen premium dan berkembang internasional.
- **Hal belum diputuskan:** tarif komisi, paket gratis/berbayar, aturan publikasi, proof lifecycle, POS/offline transaction, timestamp mechanism, data publik, algoritma feed, merchant acquisition, dan urutan implementasi.
- **Keputusan:** belum ada persetujuan final untuk mengubah Business Model Master, mengunci tarif 2%, membangun integrasi POS, atau memulai vertical hotel/spa/restaurant. Catatan ini merekam hipotesis model bisnis untuk dievaluasi founder; tidak mengubah prioritas Social-first yang sedang berlaku.

### 14. Next step
Lanjutkan founder sharing untuk melengkapi sisi pengguna, merchant, transaksi, dan ekonomi platform. Setelah pembahasan cukup, lakukan evaluasi unit economics, proof model, privasi, supply/demand acquisition, dan kompetitor. Hanya setelah founder menyatakan persetujuan secara eksplisit, buat D-XXX, promosikan bagian yang disetujui ke Business Model Master, lalu turunkan spesifikasi dan roadmap sesuai SOP Product Change Control.



## IDEA-010 — Organisasi lokal, kontribusi komunitas, layanan publik, dan operasi wilayah
- **Tanggal ditemukan:** 9 November 2026.
- **Sumber:** sharing founder tentang masjid, gereja, banjar, yayasan, sekolah, kantor polisi, pemadam kebakaran, pengumuman, kontribusi melalui wallet, kebutuhan hiring, klaim pengelola, kantor lokal, dan ekspansi Bali-first.
- **Kategori:** Business Model | GeoDirectory | Organization | Community | Finance | Trust/Safety | Operations | Regional Expansion.
- **Jenis:** OBSERVATION | HYPOTHESIS | PROPOSAL.
- **Status:** NEEDS RESEARCH untuk workflow dan implementasi. Prinsip arah besarnya telah dirangkum dalam D-004 dan Business Model Master Bagian 32; detail teknis/operasional belum otomatis disetujui.

### Narasi founder
GeoDirectory tidak hanya menampilkan toko. Peta harus menggambarkan tempat dan entitas yang hadir di kehidupan masyarakat: sekolah, rumah ibadah, banjar, yayasan, komunitas, kantor pemerintah, kantor polisi, pemadam kebakaran, dan fasilitas lain. Masing-masing dapat memiliki pengelola dan aktivitas.

Contoh tempat ibadah: pengelola mengumumkan kegiatan atau kebutuhan. Masyarakat dapat melihat dan berpartisipasi. Jika kontribusi dana diaktifkan, pengguna dapat memilih untuk membagikan kontribusinya atau menyimpannya secara privat. Pengelola membutuhkan identitas kewenangan, pencatatan dana, dan pertanggungjawaban.

Contoh banjar: pengurus mengumumkan rapat, kegiatan, kebutuhan warga, atau informasi wilayah. Profil organisasi menjadi tempat informasi yang lebih mudah ditemukan dan dikelola.

Perusahaan/organisasi dapat menerbitkan kebutuhan tenaga kerja. Pengguna memiliki profil personal dan profesional yang dapat menampilkan keahlian, portofolio, dan afiliasi yang diverifikasi.

### Hipotesis manfaat
- Masyarakat lebih mudah menemukan organisasi dan kegiatan lokal.
- Organisasi memiliki kanal informasi dan pengelolaan digital.
- Pengelola dapat membangun transparansi kegiatan dan kontribusi.
- Profesional dapat menemukan peluang kerja dan membangun portofolio.
- Pemerintah/lembaga publik berpotensi tertarik pada peta entitas dan kanal informasi yang terstruktur, tetapi adopsi/kemitraan resmi tidak boleh diasumsikan.
- Kantor dan staf lokal dapat membantu klaim, verifikasi, dukungan, dan sengketa ketika volume kasus membutuhkannya.

### Pertanyaan riset
1. Bagaimana mengonfirmasi bahwa pemohon klaim benar-benar pengurus/pegawai/kuasa yang sah?
2. Bagaimana organisasi memiliki banyak pengelola, pergantian pengurus, cabang, dan masa jabatan?
3. Bagaimana dana kontribusi dipisahkan dari wallet personal dan bagaimana laporan pertanggungjawabannya?
4. Apa perbedaan donasi, iuran, pembayaran layanan, sponsorship, dan pembelian?
5. Siapa yang bertanggung jawab terhadap informasi darurat dan bagaimana mencegah PLUITS dianggap kanal resmi tanpa kerja sama?
6. Bagaimana lowongan kerja, aplikasi, dokumen, dan komunikasi dilindungi?
7. Bagaimana laporan lokasi palsu diperiksa, banding, dan mencegah laporan jahat?
8. Apa metrik dan threshold yang membenarkan kantor lokal/staf?
9. Bagaimana region gate Bali diterapkan tanpa memblokir wisatawan atau akun yang sah?
10. Struktur URL wilayah mana yang tepat untuk SEO, tenant isolation, dan administrasi?

### Risiko dan batas
- Tidak ada pengelolaan organisasi hanya berdasarkan klaim sepihak.
- Tidak ada dana sungguhan sebelum ledger, payment, reconciliation, legal, refund, dan audit siap.
- Laporan pengguna bukan vonis otomatis.
- Informasi polisi/pemadam/layanan publik harus berasal dari entitas resmi atau sumber berlisensi dan diberi status yang benar.
- Data agama/afiliasi pribadi tidak boleh disimpulkan dari lokasi rumah ibadah yang dikunjungi.
- Jumlah kantor, persentase coverage, biaya, dan ROI belum ditentukan.

### Next step
Riset legal/operasional organisasi, desain role/stewardship, model kontribusi, hiring workflow, dan regional service desk. Setelah founder memutuskan detailnya, promosikan bagian yang disetujui melalui Product Change Control.


## IDEA-011 — Penghapusan akun tidak aktif dan proteksi screenshot/download
- **Tanggal ditemukan:** 10 November 2026.
- **Sumber:** sharing founder tentang penghapusan akun setelah satu tahun tidak aktif dan perlindungan foto/video.
- **Kategori:** Account Lifecycle | Privacy | Media Protection | Legal | Trust/Safety.
- **Jenis:** PROPOSAL / NEEDS RESEARCH.
- **Status:** BELUM DISETUJUI sebagai kebijakan aktif.

### A. Penghapusan akun tidak aktif
Founder mempertimbangkan penghapusan akun tepat 12 bulan setelah aktivitas terakhir, dengan peringatan mulai enam bulan sebelumnya melalui email dan kemungkinan nomor telepon. Belum diputuskan final.
Pertanyaan wajib: definisi aktivitas yang mereset timer; akun bisnis/organisasi dan dana/transaksi; data yang wajib disimpan; masa pemulihan; proses ekspor; akun yang sedang disengketakan; validitas kontak; serta hukum dan perlindungan konsumen.
Jangan membuat job penghapusan otomatis atau mengumumkan aturan satu tahun sebelum keputusan final.

### B. Pencegahan screenshot/download
Founder ingin mengurangi penyimpanan gambar/video dan menambahkan watermark jika media berhasil disalin. Pemblokiran screenshot masih dipertimbangkan dan tidak dapat dijamin pada browser/web lintas perangkat.
Arah yang disukai untuk diteliti: kontrol akses media, URL sementara, tidak menyediakan direct download sebagai default, watermark dengan @username pemilik dan identitas Pluits pada salinan resmi, serta fingerprint tersembunyi. Jangan menjanjikan pencegahan 100%.
