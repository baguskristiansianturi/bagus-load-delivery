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

## IDEA-012 — Offline proximity text chat for emergency communication
Status: PROPOSED / NEEDS RESEARCH — NOT APPROVED FOR IMPLEMENTATION  
Source: founder request, 10 November 2026.

### User problem and goal
In an emergency, a person may have no mobile data quota, no internet connection, or a damaged/overloaded network. The proposed Pluits capability is a lightweight text-only chat that can connect people physically nearby without relying on a cloud server. Images, video, and other large media are intentionally out of scope for the first experiment; short text, discovery, delivery state, and safety are the priority.

### Important distinction
- **Offline outbox (current implementation):** a message is stored locally on the sender's device and sent to Supabase after internet returns. It cannot reach another person while both devices are disconnected.
- **True offline peer-to-peer chat (proposed):** devices discover and connect to one another locally, then exchange encrypted text directly without an internet round-trip. It only works between compatible nearby devices within radio range or through a connected relay/mesh.
- This does not provide global messaging. A remote friend in another city cannot receive a message unless there is a chain of connected devices or a gateway that eventually reconnects.

### Technical options to evaluate
1. **Android Nearby Connections API — preferred first research prototype.** Google documents discovery, connection and data exchange between nearby devices without internet, using Bluetooth, BLE and Wi-Fi under one API. It supports byte payloads/streams and encrypted peer connections. Evaluate Android compatibility, cross-platform behavior, background restrictions, permissions, battery usage, relay behavior and Play distribution requirements.
   - https://developers.google.com/nearby/connections/overview
2. **Wi-Fi Direct — candidate for higher throughput/range.** Android supports peer discovery and device-to-device network creation without an access point or internet. It needs Android native APIs, runtime permissions and connection lifecycle handling.
   - https://developer.android.com/develop/connectivity/wifi/wifi-direct
3. **Bluetooth LE — candidate for very small text and discovery.** Potentially lower throughput and more constraints; evaluate message fragmentation, connection reliability, range, battery and device compatibility.
4. **Web/PWA only — not the preferred production route.** Web Bluetooth is limited/experimental and browser support is inconsistent; it is not a dependable cross-device peer discovery and mesh transport layer. Do not promise universal offline chat through the current GitHub Pages web app.
   - https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API

### Proposed phased experiment (not approved yet)
- Phase A: two Android devices, text-only, explicit nearby-device discovery, mutual consent/pairing, encrypted one-to-one message exchange, sent/received acknowledgements, and clear local-only message history.
- Phase B: small group chat and store-and-forward through a device that remains connected to both peers.
- Phase C: evaluate multi-hop mesh routing, duplicate suppression, TTL/expiry, hop limits, abuse controls, battery and congestion. Do not claim mesh coverage until tested.
- Internet recovery: reconcile offline conversations with the normal Pluits inbox only through an explicit identity/linking process; avoid duplicate messages and spoofed identities.

### Safety, privacy and abuse requirements
- No silent discovery or automatic connection. User must opt in and see the nearby peer identity before accepting.
- Authenticate peer identity using a QR/pairing code or another reviewed trust mechanism; device name alone is not proof of account identity.
- Encrypt message payloads end-to-end for the local link; design key exchange and recovery before any real deployment.
- Limit message length, rate, group size and local cache; expire or let users delete local history.
- Prevent replay, impersonation, spam, denial-of-service, tracking and unwanted proximity contact.
- Clearly label local-only messages and distinguish queued, sent to nearby device, received, and synced to Pluits cloud. A local radio acknowledgement is not proof that the recipient read the message.
- Emergency disclaimers: this is not a replacement for emergency services, cellular emergency calls, or official warning systems. Never imply guaranteed delivery or coverage.

### Open questions
- Which Android versions and devices should be supported first?
- Is the first goal direct one-to-one chat only, or should a connected phone relay messages for others?
- How should users verify a nearby peer belongs to a Pluits account without a server?
- What is the maximum useful range and expected number of peers in an evacuation/shelter scenario?
- Should emergency mode be opt-in per session, auto-expire, and delete local history afterward?
- How should cloud sync work when internet returns, including conflict resolution and identity continuity?
- What platform/legal review and privacy disclosure are required for radio permissions and proximity discovery?

### Decision boundary
This is an unapproved research idea. Do not add native dependencies, change app packaging, request Bluetooth/Wi-Fi permissions, alter the business model, or advertise offline emergency messaging until the founder approves a tested technical direction and a safety/privacy design.

## IDEA-013 — Social platform horizon 2035: multi-format identity, editorial publishing, and contextual local discovery

- **Tanggal ditemukan:** 11 November 2026.
- **Sumber:** sharing founder tentang merancang PLUITS seolah kebutuhan sosial tahun 2035, mempertahankan budaya membaca/menulis, menggabungkan feed sosial dengan discovery lokal, artikel, tempat, dan bisnis.
- **Kategori:** Social Media | Product Vision | Content | Articles | Creator Economy | GeoDirectory | Discovery | Advertising | Recommendation.
- **Jenis:** OBSERVATION | HYPOTHESIS | PROPOSAL.
- **Status:** PROPOSED / NEEDS VALIDATION — bukan keputusan implementasi atau perubahan release scope.
- **Keterkaitan keputusan aktif:** D-001, D-002, D-004, D-006; Business Model Master Bagian 1, 23, dan 32–33. Tidak menggantikan Social Media P0 atau release gate.

### A. Visi produk: membangun pengalaman sosial jangka panjang

PLUITS dirancang bukan hanya untuk meniru pola media sosial tahun 2026, tetapi agar fondasi produknya tetap relevan menghadapi perubahan perilaku dan teknologi menuju 2035. Produk boleh memperkenalkan pola baru, tetapi manfaat dasarnya harus langsung dipahami manusia hari ini. Jangan menambahkan kompleksitas futuristik yang tidak menyelesaikan masalah nyata.

Prinsip yang diuji:
- Teknologi dan format dapat berkembang tanpa mengharuskan pengguna mempelajari ulang seluruh aplikasi.
- Satu identitas pengguna dapat menampung hubungan sosial, aktivitas, karya, dan kontribusi yang relevan dengan izin serta privasi yang jelas.
- Pengguna tidak dipaksa menjadi video creator, penjual, atau pembeli agar dianggap bernilai.
- Konten sosial, pengetahuan, penemuan lokal, dan transaksi saling terhubung tetapi tidak dicampur menjadi satu ranking atau satu model data.
- Pengalaman sosial harus tetap bernilai bahkan saat pengguna tidak berbelanja atau bepergian.

### B. Penulis dan artikel sebagai ekspresi inti, bukan fitur kelas dua

Founder mengamati bahwa budaya blogger/penulis tampak kurang terlihat di tengah dominasi video, tetapi kebiasaan membaca dan menulis tidak hilang. Sebagian orang menulis karena minat, dokumentasi, pengetahuan, ekspresi, atau kebutuhan membangun portofolio, terlepas dari jumlah pembaca.

**Hipotesis:** PLUITS dapat memberi rumah yang layak bagi penulis dan pembaca di dalam platform sosial yang sama, tanpa memaksa mereka mengubah karya menjadi video atau materi promosi.

Usulan pengalaman:
- Satu profil, beberapa bentuk ekspresi: Posts, Reels/Video, Articles, dan About.
- Artikel adalah format konten kelas satu yang dapat diterbitkan, disimpan sebagai draft, diedit, dibaca, dibagikan, dikomentari, dan ditemukan sesuai kontrol visibilitas.
- Artikel dapat berupa catatan pendek/panjang, pengalaman, perjalanan, ulasan, opini, pengetahuan, dokumentasi komunitas, dan tulisan personal.
- Artikel publik memiliki URL permanen yang dapat dibagikan dan berpotensi diindeks mesin pencari; pembaca publik tidak harus login untuk membaca. Aksi yang membutuhkan identitas tetap meminta login.
- Profil dapat mengarsipkan karya penulis agar pembaca dapat menjelajahi tulisan berdasarkan penulis/topik/waktu.
- Artikel tidak wajib memiliki produk, tautan affiliate, transaksi, atau video.
- Pengalaman membaca harus mengutamakan tipografi, struktur heading, gambar, aksesibilitas, kecepatan, dan kenyamanan layar kecil.
- Creator/author analytics dan monetisasi dapat diteliti kemudian; jangan menjanjikan pendapatan atau menetapkan skema bagi hasil sebelum validasi.

Batas teknis yang perlu diteliti: apakah artikel merupakan content type dari sistem post yang sama dengan renderer/editor khusus, atau entitas editorial terpisah yang terhubung ke profil dan feed. Hindari duplikasi identitas, komentar, like, moderation, media, dan permission.

### C. Home dan Explore sebagai discovery berlapis

Usulan founder: beranda tidak hanya menampilkan postingan dan iklan; pengguna juga dapat menemukan tempat, restoran, destinasi, artikel populer, kegiatan, komunitas, dan informasi lokal dalam kartu/carousel yang ramah layar ponsel.

Arah eksplorasi:
- **Home:** tetap menjadi feed sosial kanonis yang mengutamakan orang yang diikuti dan konten yang relevan. Sisipkan modul discovery kontekstual secara terukur di antara konten, bukan mengubah beranda menjadi dashboard katalog atau papan iklan.
- **Explore:** menjadi ruang penemuan yang lebih luas dan eksplisit: orang/kreator, konten, artikel, topik, komunitas, tempat, bisnis, dan aktivitas lokal.
- **Local Pulse (nama kerja):** modul discovery wilayah yang membantu pengguna menemukan hal menarik di sekitar atau lokasi pilihan. Modul dapat berupa kartu tempat, restoran, destinasi, event, dan cerita lokal; carousel horizontal cocok diuji di mobile, tetapi bukan satu-satunya pola layout.
- **Reading / Articles:** permukaan editorial untuk tulisan baru, populer, pilihan topik, dan penulis yang relevan. Popularitas tidak hanya berdasarkan views; kualitas dan keragaman perlu diteliti.
- **Communities:** kegiatan, pengumuman, dan percakapan komunitas/organisasi yang relevan.
- **Business discovery:** profil dan layanan bisnis lokal yang dapat ditemukan secara organik, tanpa membuat semua postingan menjadi promosi.
- **Sponsored content:** diberi label jelas dan dibedakan dari rekomendasi organik.

Home/Explore tidak harus menampilkan semua modul pada setiap sesi. Frekuensi, posisi, kepadatan, personalisasi, dan kemampuan pengguna mengatur minat harus diuji agar pengalaman tidak terasa penuh, repetitif, atau didominasi kartu komersial.

### D. Local Pulse: jangan mengarang sinyal "ramai"

Local Pulse adalah hipotesis discovery, bukan klaim real-time yang sudah tersedia. PLUITS wajib membedakan sinyal berikut:
1. **Sedang ramai sekarang:** hanya jika ada sumber real-time yang sah, cukup akurat, memiliki ambang agregasi privasi, dan dapat dijelaskan.
2. **Populer di wilayah ini:** sinyal historis/berperiode dari aktivitas berkualitas yang relevan, bukan klaim sedang penuh.
3. **Banyak dibicarakan:** percakapan/unggahan publik yang memenuhi ambang dan moderasi; bukan bukti kunjungan.
4. **Sering disimpan/dikunjungi:** masing-masing hanya jika event yang sah tersedia dan definisi metrik jelas.
5. **Direkomendasikan untuk Anda:** relevansi minat/lokasi yang dipilih; bukan klaim popularitas.

Like, impressions, atau jumlah posting tidak boleh sendirian menjadi bukti bahwa restoran sedang ramai. Jangan menampilkan jumlah orang di lokasi, live presence, atau heatmap individu tanpa dasar data, persetujuan, perlindungan privasi, dan review risiko. Lokasi presisi tidak boleh dibuka secara default. Sediakan pilihan lokasi manual; jangan memaksa GPS.

### E. Prinsip ranking dan monetisasi yang harus dipisahkan

- Social feed ranking bertujuan menjaga relevansi hubungan/konten dan pengalaman pengguna.
- Editorial/article discovery menilai relevansi topik, kualitas pengalaman baca, freshness, keragaman penulis, dan sinyal negatif; jangan hanya mengejar clickbait/views.
- Local discovery menilai relevansi geografis, kualitas informasi, status verifikasi, kesegaran data, dan bukti yang sesuai jenis klaim.
- Search menjawab maksud dan filter eksplisit pengguna.
- Sponsored placement adalah inventori berbayar yang ditandai jelas; pembayaran tidak boleh menyamar sebagai ranking organik atau klaim kualitas.
- Economic attribution/affiliate/transaksi tetap terpisah dari social ranking; pengguna tidak harus bertransaksi agar kontennya dihargai.
- Pengguna perlu kontrol minat/topik/lokasi dan feedback seperti tidak tertarik/sembunyikan/laporkan; dampak personalisasi perlu dapat dievaluasi.

Potensi pendapatan yang dapat diteliti: iklan/sponsor yang relevan, promosi lokal, layanan bisnis, dan mekanisme monetisasi kreator/penulis. Ini bukan persetujuan tarif, komisi, subscription, atau pembagian pendapatan. Jangan mengoptimalkan feed demi iklan dengan mengorbankan trust dan retensi jangka panjang.

### F. Hubungan dengan model bisnis dan cerita pengguna

Arah ini harus tetap berangkat dari masalah manusia, termasuk perjalanan Ibu Nia sebagai contoh kebutuhan nyata, bukan dari daftar fitur atau teknologi. Uji apakah:
- Orang yang tidak membuat video tetap menemukan tempat untuk berekspresi dan membangun karya.
- Pembaca menemukan tulisan yang berguna tanpa harus berpindah aplikasi.
- Pengguna lokal menemukan tempat/aktivitas yang relevan tanpa klaim palsu tentang keramaian.
- Bisnis lokal memperoleh discovery yang adil tanpa harus membeli semua jangkauan.
- Kreator dan penulis memperoleh identitas serta arsip karya yang berkelanjutan.
- Komunitas dan organisasi dapat berbagi informasi tanpa konten mereka tenggelam oleh materi komersial.

### G. Risiko, pertanyaan riset, dan validasi

1. Apakah Home dan Explore memiliki tujuan yang cukup berbeda sehingga pengguna memahami keduanya?
2. Seberapa sering modul carousel muncul sebelum feed terasa seperti portal iklan?
3. Apakah artikel perlu editor terstruktur, draft/autosave, cover, kategori/tag, seri, reading time, canonical URL, SEO metadata, dan komentar?
4. Bagaimana menjaga kualitas artikel tanpa membuat proses penerbitan berat atau mematikan tulisan personal?
5. Apa sinyal lokal yang tersedia dan sah untuk setiap label Local Pulse?
6. Bagaimana mengurangi manipulasi check-in, review, views, saves, dan aktivitas lokasi?
7. Bagaimana penulis/kreator memperoleh manfaat ekonomi tanpa membayar untuk ranking atau memaksa transaksi?
8. Bagaimana rekomendasi menjaga keragaman penulis, topik, wilayah, dan sumber?
9. Bagaimana pengguna mengontrol personalisasi, lokasi, sponsored content, dan kategori yang tidak ingin dilihat?
10. Bagaimana akses publik dan SEO artikel diseimbangkan dengan profil privat, penghapusan, hak cipta, moderasi, dan privasi?
11. Metrik apa yang membuktikan manfaat: meaningful reading, return readership, saves, follows, kualitas interaksi, local discovery actions, laporan negatif, dan kepuasan pengguna—bukan hanya time spent?

### H. Tahapan dan batas implementasi

- **Sekarang / Social P0:** tuntaskan Inbox dan seluruh Social First Release yang sudah disepakati; jangan mengalihkan fokus pengerjaan aktif ke vertical baru.
- **Discovery research:** petakan kebutuhan Home vs Explore, format artikel, Local Pulse, sumber data, privasi, dan metrik. Uji dengan prototipe/riset pengguna sebelum perubahan arsitektur.
- **Social foundation increment:** bila disetujui, mulai dari dukungan artikel sebagai ekspresi konten yang menyatu dengan identitas/feed tanpa merusak post/video yang ada.
- **Discovery increment:** uji modul lokal dan editorial secara bertahap dengan data yang tersedia; jangan menyatakan "live/ramai" sebelum ada bukti.
- **Business/monetization increment:** lakukan setelah kualitas discovery, trust, dan demand terbukti; pricing dan revenue-share perlu keputusan terpisah.

Tidak ada persetujuan untuk implementasi sekarang, perubahan schema, pengaktifan iklan, pembuatan algoritma baru, atau perubahan release gate. Ide ini disimpan sebagai bahan riset dan diskusi lanjutan.

## IDEA-014 — PLUITS Social Workspace: persistent social presence inside a professional desktop

- **Tanggal ditemukan:** 11 November 2026.
- **Sumber:** sharing founder tentang pengalaman personal sebagai blogger/penulis, bekerja dan mengelola usaha melalui banyak aplikasi/browser, serta imajinasi satu ruang desktop PLUITS yang menyatukan pekerjaan aktif dan kehidupan sosial.
- **Kategori:** Product Vision | Desktop UX | Social Workspace | Creator Tools | Articles | Store Management | Services | Messaging | Notifications | Presence.
- **Jenis:** FOUNDER INSIGHT | OBSERVATION | PROPOSAL.
- **Status:** PROPOSED / NEEDS VALIDATION — belum menjadi keputusan implementasi atau perubahan release scope.
- **Keterkaitan:** IDEA-013 (Social Platform Horizon 2035), D-001, D-002, D-004, D-006. Tidak mengubah prioritas pengerjaan Social P0/Inbox.

### A. Masalah dan motivasi founder

Founder membayangkan pengguna profesional yang duduk di kafe dengan laptop: mengerjakan pekerjaan atau proyek, mengelola toko dan layanan, memantau aktivitas sosial, menulis artikel/blog, membuat atau menyiapkan media visual, serta berkomunikasi dengan relasi—tanpa harus membuka banyak aplikasi dan browser terpisah.

Pengalaman personal founder sebagai blogger/penulis menjadi akar visi: dahulu orang menulis dan saling membaca/berkomentar karena senang berbagi cerita, bukan semata mengejar SEO, desain, views, atau format video. PLUITS harus memberi ruang bagi motivasi intrinsik tersebut, sekaligus menyediakan alat yang membuat karya dan aktivitas dapat terhubung ke kebutuhan nyata.

Founder ingin membangun produk yang terlebih dahulu benar-benar berguna bagi dirinya. Asumsi bahwa ada banyak orang lain di dunia dengan kebutuhan serupa harus diperlakukan sebagai hipotesis yang perlu diuji, bukan bukti ukuran pasar.

### B. Visi: Social Workspace

**PLUITS Social Workspace** adalah konsep ruang kerja digital yang menjaga kehidupan sosial tetap hadir ketika pengguna sedang produktif. Bukan sekadar dashboard admin, dan bukan sekadar feed media sosial.

Pengguna dapat:
- Menulis, menyimpan draft, mengedit, dan menerbitkan artikel.
- Mengelola toko, katalog, produk, pesanan, dan pelanggan sesuai hak akses.
- Mengelola layanan atau proyek.
- Menyiapkan media/gambar dan materi pendukung.
- Memantau pesan, notifikasi, teman/relasi, komunitas, serta aktivitas yang relevan.
- Mengambil jeda dari pekerjaan untuk membaca, berinteraksi, dan menjelajahi konten.
- Melanjutkan ke transaksi atau tindakan nyata di PLUITS bila memang dibutuhkan.

Tujuan utamanya mengurangi perpindahan konteks dan duplikasi pekerjaan, bukan memaksa semua fitur masuk ke satu layar yang padat.

### C. Konsep desktop tiga wilayah

**1. Panel kiri — Workspace Control**
- Identitas/brand PLUITS dan pemilih konteks/workspace.
- Modul atau proyek yang sedang aktif.
- Navigasi kontekstual untuk modul aktif: misalnya Article Studio saat menulis, Store Manager saat mengelola toko, atau Services Manager saat mengelola layanan.
- Kontrol global yang konsisten: pesan, notifikasi, aktivitas, pengaturan, dan akses modul.
- Panel dapat diperkecil, diperluas, atau disembunyikan sesuai kebutuhan.
- Kontrol modul aktif dapat mengambil area atas panel; kontrol global dan modul lain tetap tersedia di bawah/kelompok navigasi yang jelas.

**2. Area tengah — Active Workspace**
- Area terbesar untuk pekerjaan utama saat itu.
- Contoh: editor artikel, manajemen produk, pesanan, layanan, proyek, media library, desain, atau analitik.
- Mendukung tab/dokumen kerja dan perpindahan konteks yang cepat bila sesuai.
- Dapat diperluas menjadi fokus penuh; jangan memaksa semua aktivitas menggunakan split pane.
- Perlu autosave/draft dan pemulihan kerja untuk aktivitas yang mendukungnya.

**3. Panel kanan — Social & Live Context**
- Teman/relasi yang sedang aktif sesuai izin privasi.
- Pesan dan aktivitas terbaru.
- Aktivitas toko/pelanggan yang relevan bagi pengguna yang berwenang.
- Komunitas dan rekomendasi konten.
- Notifikasi kontekstual dan social context.
- Dapat ditutup atau diubah ukurannya ketika pengguna membutuhkan ruang/fokus.

Tiga wilayah adalah pola desktop profesional yang dapat dikonfigurasi, bukan layout wajib untuk setiap pengguna atau setiap halaman. Ukuran panel, urutan, visibilitas, dan konteks harus dapat disesuaikan. Jangan mengorbankan area kerja utama.

### D. Persistent Social Presence

Hipotesis utama: pengguna yang sedang bekerja di PLUITS tetap menjadi bagian dari kehidupan sosial PLUITS; ia tidak harus meninggalkan aplikasi untuk menulis atau mengelola bisnis.

Pertimbangkan status presence yang bermakna dan dapat dikendalikan:
- **Online:** terhubung/aktif baru-baru ini, dengan definisi yang transparan.
- **Available:** bersedia menerima interaksi.
- **Focus:** sedang berkonsentrasi; notifikasi nonpenting dapat ditunda.
- **Away:** tidak aktif sementara.

Presence tidak boleh disimpulkan sebagai kesediaan untuk membalas pesan. Pengguna harus dapat menyembunyikan status online, memilih audiens, mengatur jam fokus, dan mengendalikan notifikasi. Jangan menampilkan aktivitas rinci seperti dokumen yang sedang diedit atau pelanggan yang sedang dilihat kepada relasi tanpa izin eksplisit.

### E. Desktop pro dan pengalaman pengguna awam

Founder menyadari desktop workspace dapat tampak kompleks bagi pengguna awam. Karena itu, usulan produk:
- **Simple mode / everyday mode:** feed, pesan, profil, dan aktivitas dengan navigasi sederhana.
- **Workspace mode / pro mode:** ruang kerja tiga wilayah dan alat produktivitas yang lebih lengkap.
- Peralihan mode mudah ditemukan; pengguna tidak harus memahami istilah teknis.
- Fitur lanjutan muncul bertahap sesuai kebutuhan/role, bukan sekaligus.
- Pengaturan default sederhana; pengguna berpengalaman dapat menyesuaikan panel dan workspace.
- Workspace yang kompleks tidak boleh menjadi syarat untuk menikmati fungsi sosial dasar.

Jangan membangun dua aplikasi yang berbeda. Mode adalah presentasi dan kemampuan yang sesuai konteks di atas fondasi identitas, konten, notifikasi, permission, dan data yang konsisten.

### F. Mobile bukan desktop yang diperkecil

Desktop adalah ruang kerja multi-panel untuk sesi produktif. Mobile harus tetap cepat, langsung, dan fokus pada satu tugas/arus utama. Pada layar kecil:
- Prioritaskan satu tugas utama pada satu waktu.
- Panel sosial menjadi drawer, sheet, atau navigasi ringkas bila dibutuhkan.
- Notifikasi dan pesan mudah dijangkau tanpa mengganggu aktivitas.
- Jangan memaksakan tiga kolom atau miniatur dashboard desktop.
- Sinkronisasi draft, status, dan konteks kerja lintas perangkat perlu diteliti.

### G. Prinsip produk dan arsitektur yang perlu diuji

- Satu identitas pengguna dengan role, permission, dan konteks workspace yang jelas.
- Modul social, editorial, commerce, services, media, messaging, dan notifications saling terhubung melalui kontrak yang stabil; tidak berarti semua domain harus digabung dalam satu tabel atau service.
- Workspace adalah lapisan pengalaman/orchestration; bukan duplikasi database setiap modul.
- Deep link dan kemampuan melanjutkan pekerjaan pada konteks yang tepat.
- Autosave, draft recovery, activity history, dan sinkronisasi lintas perangkat untuk pekerjaan yang sesuai.
- Notifikasi harus diprioritaskan dan dapat diatur: urgent, direct/social, transactional, informational, serta digest/focus.
- Role toko/organisasi menentukan informasi pelanggan dan aktivitas bisnis apa yang boleh terlihat.
- Kinerja, aksesibilitas keyboard, responsivitas, keamanan sesi, dan perlindungan data menjadi syarat dasar desktop.
- Hindari real-time presence atau live activity yang menguras baterai/bandwidth atau mengungkap informasi sensitif tanpa manfaat jelas.

### H. Model bisnis dan proposisi nilai

Potensi nilai bukan hanya iklan atau transaksi. Workspace dapat meningkatkan retensi dan kedalaman penggunaan karena pengguna kembali untuk menyelesaikan pekerjaan, memelihara relasi, dan mengelola aktivitasnya.

Segmen yang perlu diteliti:
- Penulis/blogger dan kreator yang mengelola karya sekaligus komunitas.
- Pemilik toko kecil/menengah yang mengelola katalog dan pelanggan.
- Penyedia layanan dan pekerja independen.
- Pengelola komunitas/organisasi.
- Pengguna sosial biasa yang sesekali membutuhkan alat produktivitas.

Potensi monetisasi seperti alat bisnis lanjutan, layanan profesional, atau paket workspace adalah hipotesis. Jangan mengunci paywall, subscription, biaya transaksi, atau pembagian pendapatan sebelum kebutuhan dan willingness-to-pay divalidasi. Fungsi sosial inti dan kemampuan menulis dasar tidak boleh otomatis dibuat kelas dua.

### I. Validasi sebelum desain/implementasi

1. Wawancarai blogger/penulis, pemilik toko, penyedia layanan, dan pengguna sosial biasa tentang perpindahan konteks aplikasi saat ini.
2. Uji prototipe desktop tiga panel dengan beberapa pekerjaan nyata (menulis artikel, mengelola pesanan, membalas pesan).
3. Ukur waktu penyelesaian tugas, jumlah perpindahan konteks, tingkat kesalahan, beban kognitif, dan kepuasan.
4. Uji simple mode dibanding workspace mode dengan pengguna awam dan profesional.
5. Validasi apakah panel kanan benar-benar membantu atau justru mengganggu fokus.
6. Validasi status presence, privasi, dan pengaturan notifikasi melalui skenario sensitif.
7. Uji laptop dengan resolusi dan ukuran layar berbeda; uji keyboard dan aksesibilitas.
8. Uji sinkronisasi pekerjaan desktop ke mobile dan pemulihan draft.
9. Validasi demand pasar dan willingness-to-pay; jangan menyimpulkan ukuran pasar dari preferensi founder saja.

### J. Batas roadmap

- **Pekerjaan aktif sekarang:** selesaikan halaman Pesan/Inbox dan Social First Release sesuai prioritas; IDEA-014 tidak mengalihkan fokus.
- **Riset berikutnya:** petakan persona penulis, pemilik toko, penyedia layanan, dan kebutuhan workspace.
- **Desain konsep:** buat prototipe desktop tiga panel dan mode sederhana; validasi sebelum menetapkan navigasi final.
- **Arsitektur:** identifikasi kontrak antar modul, permission, presence, notification center, deep links, draft persistence, dan sinkronisasi.
- **Implementasi:** hanya setelah keputusan produk dan scope disetujui secara terpisah.

Tidak ada persetujuan untuk mengubah UI Inbox sekarang, mengubah schema/backend, menambah menu ke release aktif, atau mengubah release gate. Simpan sebagai visi dan bahan discovery jangka panjang.

## IDEA-015 — Unified identity, professional publishing, and PLUITS-native business presence

- **Tanggal ditemukan:** 11 November 2026.
- **Sumber:** sharing founder tentang pengguna penikmat/penjelajah vs penyedia/pengelola; akun personal gratis; akun profesional/premium yang membuka publishing/blog dan alat usaha; satu identitas personal yang dapat mengelola toko, layanan, lembaga, atau destinasi bersama tim; aspirasi agar PLUITS menjadi rumah digital yang cukup lengkap sehingga banyak pengguna tidak perlu membuat website terpisah.
- **Kategori:** Business Model | Identity | Account & Entitlements | Professional Profile | Publishing | Blog | Store | Services | Organization | GeoDirectory | Team Permissions | Payments | SEO.
- **Jenis:** FOUNDER INSIGHT | PRODUCT VISION | PROPOSAL.
- **Status:** PROPOSED / NEEDS VALIDATION — bukan keputusan final pricing, schema, implementasi, atau release scope.
- **Keterkaitan:** IDEA-013 (Social Platform Horizon 2035), IDEA-014 (Social Workspace), D-004, D-005, D-006; Business Model Master Bagian 32–33.

### A. Visi platform: pengguna memiliki kepentingan berbeda

PLUITS melayani spektrum kebutuhan, bukan memaksa semua pengguna menjadi kreator atau penjual.

**Penikmat / explorer**
- Menggunakan fungsi sosial personal.
- Menikmati foto, video, tulisan, berita, komunitas, dan percakapan.
- Menjelajahi tempat, restoran, destinasi, toko, layanan, dan aktivitas.
- Membaca, menyimpan, membagikan, berbelanja, memesan, atau sekadar melihat tanpa kewajiban bertransaksi.
- Tidak perlu memahami dashboard profesional.

**Penyedia / pengelola**
- Penulis, blogger, kreator, profesional, freelancer.
- Pemilik dan pengelola toko/brand.
- Penyedia layanan.
- Pengelola destinasi/tempat.
- Media, lembaga, organisasi, komunitas, dan entitas lain.
- Membutuhkan publishing, branding, katalog, layanan, manajemen, analytics, komunikasi, tim, transaksi, dan kontrol akses sesuai konteks.

Peran tidak boleh mengunci seseorang secara permanen. Satu orang dapat menjadi explorer dalam satu perjalanan dan provider/creator dalam konteks lain. Produk perlu memunculkan alat lanjutan ketika relevan tanpa membuat pengalaman personal dasar menjadi kompleks.

### B. Pisahkan identity, public entity, workspace, dan permission

Usulan model konseptual:
1. **Personal identity / account:** akun autentikasi dan pemilik/penanggung jawab manusia; memiliki ID permanen.
2. **Public profile / entity:** objek yang dipresentasikan ke publik, misalnya profil personal, professional profile, toko, brand, organisasi/media, layanan, atau destinasi. Satu pemilik dapat mengelola lebih dari satu entitas sesuai verifikasi dan kebijakan.
3. **Workspace:** ruang pengelolaan satu atau beberapa entitas/modul: publishing, social, store, services, destination, team, analytics.
4. **Membership & permission:** hubungan anggota dengan entitas/workspace serta izin per tindakan dan per domain.
5. **Entitlement / plan:** fitur dan kuota yang aktif pada akun atau entitas berdasarkan kebijakan paket, bukan jenis identitas atau hak kepemilikan.

Jangan menyamakan Premium/Professional badge, verifikasi identitas, tipe entitas bisnis, dan paket berbayar. Verifikasi menyatakan pemeriksaan tertentu; subscription/entitlement menyatakan akses fitur; role menyatakan kewenangan. Keempatnya harus memiliki arti yang berbeda.

### C. Satu akun personal dapat mengelola entitas profesional dan bisnis

Contoh: seorang pemilik memiliki personal identity dan mengelola satu toko. Ia dapat mengundang manajer/editor:
- Owner: mengatur kepemilikan, anggota, akses sensitif, pembayaran/pencairan, dan pengaturan utama.
- Editor/content manager: membuat dan mengedit postingan, reels, artikel, media, serta informasi yang secara eksplisit diizinkan.
- Store operator: mengelola katalog/pesanan sesuai batas yang diberikan.
- Finance role: hanya untuk anggota yang diberi izin khusus; dapat dipisahkan antara melihat laporan, mengelola pembayaran, dan mengubah rekening/pencairan.
- Moderator/agency: akses sementara/terbatas dengan audit dan kemampuan dicabut.

Tidak boleh berbagi password owner. Akses ke data pelanggan, order, keuangan, rekening, refund, payout, dan perubahan kepemilikan memerlukan permission terpisah, autentikasi kuat/step-up bila relevan, audit log, dan kontrol pencabutan akses. Default permission harus least privilege.

### D. Blog / publishing sebagai manfaat inti akun profesional

Blog bukan sekadar tab tambahan. Ia adalah publishing platform yang terintegrasi dengan identitas, social graph, dan entitas.

Kegunaan:
- Hobi dan ekspresi personal bagi penulis yang menyukai tulisan panjang.
- Penjelasan layanan profesional yang tidak cukup ditampung caption.
- Storytelling dan edukasi untuk toko/brand.
- Artikel berita, opini, liputan, dan arsip bagi media/lembaga.
- Panduan destinasi, informasi fasilitas, pengalaman, dan cerita tempat.
- Dokumentasi organisasi/komunitas.
- Artikel yang terhubung secara kontekstual ke post, reel, produk, layanan, toko, destinasi, dan lokasi.

Pengalaman publik:
- Profil memiliki permukaan Posts, Reels, Articles, serta bagian lain sesuai tipe entitas/izin.
- Artikel muncul dalam katalog visual/editorial di profil dan dapat dibagikan sebagai kartu/preview pada feed.
- Halaman artikel tetap mempunyai reading experience mandiri yang nyaman dan dapat diakses publik sesuai audience.
- Artikel dapat dihubungkan ke produk, layanan, toko, destinasi, atau entitas terkait tanpa memaksa semua tulisan menjadi iklan.
- Draft dan artikel privat tidak pernah masuk feed publik, sitemap, atau mesin pencari.
- Penulis personal tidak diwajibkan memiliki toko atau melakukan monetisasi.
- Perlu editor yang mendukung draft, autosave, cover, body terstruktur, gambar/media, preview, kategori/tag, status publikasi, dan revisi; scope editor ditentukan melalui product discovery.

### E. Aspirasi PLUITS-native presence menggantikan kebutuhan website sederhana

Hipotesis jangka panjang: untuk banyak individu, profesional, UMKM, toko, penyedia jasa, kreator, destinasi, dan organisasi, profil publik + artikel + katalog + layanan + kontak + transaksi PLUITS dapat menjadi kehadiran digital utama sehingga mereka tidak perlu membangun website terpisah.

Ini bukan klaim bahwa website akan hilang atau PLUITS harus menggantikan seluruh website:
- Entitas besar dapat tetap memerlukan website/domain/infrastruktur sendiri.
- Pengguna harus tetap dapat menghubungkan domain eksternal jika kelak didukung.
- PLUITS harus menyediakan export/portability dan URL stabil agar pemilik tidak kehilangan seluruh jejak digital ketika berpindah platform.
- PLUITS tidak boleh mengunci konten pemilik secara tidak adil atau membuat link eksternal tidak mungkin digunakan.
- Posisi yang realistis: menjadi default digital home bagi banyak pengguna dan bisnis kecil, bukan satu-satunya web untuk semua orang.

### F. URL publik dan SEO: rancangan awal untuk diteliti

Pola contoh, bukan URL produksi yang sudah diputuskan:
- Personal profile: https://pluits.example/@username
- Professional/entity profile: https://pluits.example/@brandname atau route entity khusus yang konsisten.
- Blog index: https://pluits.example/@username/blog
- Article: https://pluits.example/@username/blog/descriptive-article-slug
- Category: https://pluits.example/@username/blog/category-slug

Aturan desain:
- Database memakai immutable UUID/ID untuk owner, entity, dan article; username/slug hanya locator publik.
- Slug unik pada scope yang jelas, dinormalisasi, human-readable, hyphen-separated, dan stabil.
- Perubahan username/slug harus memiliki redirect permanen yang terkontrol dari URL lama ke URL kanonis; cegah redirect chain/loop dan jangan pernah memindahkan kepemilikan hanya berdasarkan slug.
- Tentukan canonical URL untuk setiap halaman; hindari duplikasi karena query parameters, tracking, sorting, filter, atau route alias.
- Public published articles harus tersedia melalui URL HTTP(S) yang dapat diakses tanpa login; private/draft/unlisted mengikuti kebijakan visibilitas dan tidak masuk sitemap.
- Halaman publik memerlukan title dan meta description unik, heading/body yang dapat dibaca crawler, metadata penulis/penerbit, gambar representatif, canonical link, Open Graph/social preview, dan structured data yang sesuai jenis konten.
- Gunakan HTML link yang benar (a href) untuk navigasi internal; jangan mengandalkan click handler yang tidak memiliki URL crawlable.
- Sitemap index dan sitemap artikel/profil publik dihasilkan dari konten yang eligible, diperbarui saat publish/unpublish/delete, memiliki lastmod yang akurat, dan tidak memuat URL privat/noindex.
- robots.txt bukan mekanisme untuk menyembunyikan data rahasia; private content harus dilindungi oleh authorization/server.
- Search Console dan URL Inspection digunakan untuk memeriksa crawling/indexing. Sitemap submission dan structured data tidak menjamin indexing/ranking.
- Hindari membuat ribuan thin/duplicate pages, tag kosong, pencarian internal, atau halaman profil otomatis tanpa nilai konten.
- Pertimbangkan SSR/prerender untuk halaman publik agar HTML awal berisi konten penting, metadata, dan canonical. Jangan bergantung pada hash route untuk artikel.
- Sediakan 404/410 yang benar untuk konten yang dihapus, dan redirect hanya jika ada pengganti relevan.

Contoh URL harus diuji untuk username reserved, slug bentrok, nama entitas, multi-language, karakter Unicode, perubahan handle, moderasi, privasi, dan penghapusan akun. Domain pluits.example di atas adalah placeholder; keputusan domain produksi dilakukan terpisah.

### G. Skema data konseptual awal (belum migration)

Entitas yang mungkin dibutuhkan, setelah audit schema yang sudah ada:
- profiles / auth-linked personal identity.
- public_entities atau model profile/entity yang sesuai schema eksisting.
- entity_memberships dan entity_permissions / role grants.
- plans / entitlements / subscription status bila model berbayar disetujui.
- articles dengan id, author_user_id, publisher_entity_id nullable, slug, title, excerpt, body/document, cover_media_id, status, visibility, published_at, updated_at, canonical_url (jika diperlukan), dan timestamps.
- article_revisions / version history bila autosave/recovery dan audit menuntut.
- article_categories, article_tags, dan relasi yang tidak menggandakan metadata.
- article_entity_links untuk hubungan terstruktur dengan produk, layanan, toko, destinasi, dan tempat.
- public_url_aliases / redirects untuk mempertahankan URL ketika slug/username berubah.
- sitemap/outbox atau mekanisme invalidation/generation yang andal, bukan tabel sitemap manual yang cepat stale.

Jangan membuat tabel hanya karena namanya ada dalam daftar. Audit schema, relasi, RLS, query patterns, dan domain model yang sudah berjalan terlebih dahulu. Tentukan apakah artikel merupakan content subtype dari model post yang ada atau domain editorial tersendiri dengan integrasi social feed; hindari duplikasi komentar, likes, media, moderation, identity, dan audience rules.

### H. Model bisnis: manfaat dan monetisasi harus dipisahkan

Akun personal gratis dapat menikmati social, discovery, reading, dan aktivitas dasar. Fitur profesional dapat menjadi paket/entitlement yang membuka alat tambahan seperti publishing workflow, team seats, analytics, store/services management, custom branding, atau kapasitas media—tetapi hanya setelah manfaat dan willingness-to-pay divalidasi.

Prinsip:
- Jangan membuat pengguna membayar untuk membaca artikel publik.
- Jangan mengharuskan penulis personal membeli paket bisnis hanya untuk menulis.
- Jangan mencampur verifikasi dengan pembayaran.
- Jangan mengunci data atau identitas pemilik ketika paket berhenti.
- Jelaskan fitur, kuota, dan batas paket dengan transparan.
- Biaya transaksi, payment processing, payout, refund, escrow/penahanan dana, subscription, dan monetisasi kreator memerlukan model risiko, legal, operasional, serta payment-provider review tersendiri.
- Pembayaran aman harus dirancang sesuai negara, metode pembayaran, settlement, KYC/KYB yang relevan, dispute, refund, fraud, dan perlindungan pembeli/penjual. Jangan menjanjikan escrow atau perlindungan universal tanpa penyedia dan kerangka hukum yang mendukung.

### I. Validasi pasar dan risiko

Uji dengan beberapa persona nyata:
- Pembaca/penikmat yang tidak ingin mengelola apa pun.
- Blogger/penulis independen.
- Profesional penyedia layanan.
- UMKM/pemilik toko dengan manajer.
- Pengelola destinasi.
- Media/lembaga dengan banyak editor dan approver.

Pertanyaan:
1. Apa alasan nyata mereka memilih profil/blog PLUITS dibanding website, blog host, atau social media yang sudah dipakai?
2. Apakah mereka ingin semua konten di satu profil, atau butuh pemisahan profil personal dan entitas?
3. Fitur blog minimum apa yang cukup untuk mulai menerbitkan tulisan berkualitas?
4. Seberapa penting custom domain, export, newsletter, analytics, dan integrasi eksternal?
5. Apakah pengelolaan tim dan pemisahan keuangan/operasional merupakan kebutuhan awal?
6. Apakah paket profesional berbayar memiliki willingness-to-pay yang nyata?
7. Bagaimana menjaga pengguna awam agar tidak kewalahan dengan tool provider?
8. Bagaimana melindungi konsumen ketika entitas menjual produk/jasa dan memproses pembayaran?
9. Bagaimana memitigasi spam SEO, thin content, impersonation, backlink abuse, dan konten terlarang?
10. Bagaimana mencegah satu akun personal menjadi single point of failure bagi perusahaan yang memiliki banyak staf?

### J. Prioritas dan batas implementasi

- **Fokus langsung setelah sharing ini:** blog/article publishing, karena founder ingin mulai menulis dan ini dapat menjadi use case pertama untuk menguji model.
- **Tahap awal blog:** tentukan author/owner, draft, editor, publish, public article route, URL stabil, halaman artikel publik, metadata dasar, permission/visibility, dan discovery dari profil/feed.
- **SEO foundation:** siapkan SSR/prerender atau solusi rendering publik, canonical, sitemap, crawlable links, robots/noindex rules, metadata dan structured data yang sesuai; verifikasi dengan test dan Search Console setelah tersedia.
- **Tahap berikutnya:** integrasi article dengan professional/entity profile, store, services, destinations, team permissions, dan analytics.
- **Pembayaran:** desain terpisah dengan review keamanan, legal, dan payment provider sebelum transaksi nyata diaktifkan.
- **Urutan aktif yang sudah berjalan:** jangan menghentikan penyelesaian Inbox/Social P0 tanpa keputusan founder; rencana fokus Blog adalah arah langkah berikutnya setelah prioritas aktif dituntaskan atau diubah secara eksplisit.

Tidak ada persetujuan untuk mengubah schema, pricing, role production, pembayaran, atau release gate melalui catatan ini. Semua rancangan URL, tabel, paket, dan fitur di atas masih proposal dan perlu audit terhadap implementasi yang sudah ada.

## IDEA-016 — PLUITS-native discovery, social article distribution, and differentiated provider algorithms

- **Tanggal ditemukan:** 11 November 2026.
- **Sumber:** founder clarification that blog/article is primarily a publisher format inside PLUITS, not primarily a Google-search landing page; internal discovery and social recommendation are the priority; articles can be boosted for in-platform reach; ranking should emphasize meaningful human interaction/helpfulness rather than reading duration; publishers, stores, services, destinations and personal creators require different distribution models; AI writing assistance and fair rights-claim processes.
- **Kategori:** Feed Ranking | Discovery | Articles | Publishing | Ads & Boost | Commerce Discovery | Local Discovery | UGC | AI Assistance | Content Integrity | Copyright & Moderation.
- **Jenis:** FOUNDER INSIGHT | PRODUCT VISION | PROPOSAL.
- **Status:** PROPOSED / NEEDS VALIDATION — no ranking formula, ad product, moderation policy, or production change approved.
- **Keterkaitan:** IDEA-013, IDEA-015, D-001, D-004, D-006; prior Ibu Nia user-journey/product-discovery work.

### A. Core product position: PLUITS is the primary discovery pool

The blog is a publishing format inside PLUITS. Its primary product purpose is to let people and entities publish long-form stories, explanations, news, opinions, guides, and experiences that can be discovered in the social ecosystem. It is not primarily an attempt to become a Google-indexed article farm or a replacement for search engines.

Users may encounter articles while browsing photos, posts, reels, communities, profiles, topics, or recommendations. The article can be opened for deeper reading, but the platform's primary success is meaningful discovery, social interaction, and useful connections inside PLUITS.

External search visibility is optional and controlled by publication visibility/indexing settings and platform eligibility. Publicly accessible does not automatically mean guaranteed Google indexing. Private, restricted, draft, and unlisted content must not leak through sitemap, public feeds, metadata, or search endpoints.

### B. Article distribution and ranking

Articles are social content, not ranked primarily by dwell time. Candidate ranking signals:
- Explicit positive reactions and their quality/context.
- Meaningful comments and healthy discussion, not raw comment volume.
- Shares and recommendations by people.
- Saves/bookmarks and later return value.
- Follows or meaningful connection after discovery.
- User feedback such as helpful/relevant/not interested.
- Topic, language, location (when relevant and permitted), and declared interests.
- Relationship to followed publishers, authors, communities, and entities.
- Freshness when the subject is time-sensitive.
- Content integrity, originality signals, safety, policy compliance, and confidence.
- Negative feedback, hides, reports, spam indicators, and coordinated manipulation.

Reading duration may be used as a limited diagnostic signal (e.g., detect immediate bounce or measure usability), but should not be the principal objective or be optimized to maximize time spent. Avoid treating raw engagement as proof of quality: controversy, outrage, spam, engagement bait, and coordinated activity can inflate interactions.

The system should distinguish:
- **Following distribution:** updates from accounts/entities a user intentionally follows, subject to user controls and relevance/freshness.
- **Recommendation distribution:** discovery beyond the follow graph based on user interests and content value.
- **Trending/popular:** time-bounded and context-aware, with anti-manipulation controls.
- **Paid boost:** clearly labeled sponsored distribution, separate from organic ranking and with campaign transparency.

Do not guarantee FYP or reach. Creators/publishers should receive understandable insights, not promises of virality.

### C. Differentiated distribution by content/provider type

A shared discovery infrastructure can support different candidate generation, ranking, and conversion objectives. Do not use one ranking formula for every object.

**Personal posts and reels**
- Primarily social graph, explicit interests, content format preference, and recommendations.
- Followers can receive posts/reels from accounts they follow, with user controls and feed design.
- Recommendation beyond followers must be relevant and safety-aware.

**Articles, publishers, media, and news**
- Followers of a publisher can receive its eligible publications.
- Articles may be recommended to non-followers based on subject relevance, meaningful interaction, freshness (especially news), source/context, and integrity.
- Long-form writing is a first-class format, including personal diaries, family travel, reflections, essays, and hobby writing.
- Not every article must be newsworthy, SEO-optimized, commercial, or designed for maximum engagement.
- Publisher identity and author attribution should be clear; organizations can manage publishing through authorized team roles.

**Stores and products**
- A store/product should not automatically broadcast every catalog change as a social post to all followers.
- Discovery should respond to shopping intent, category, availability, price/quality signals, location/shipping context, user preferences, and trustworthy reviews.
- Product promotion is a separate, clearly disclosed paid option.
- Commerce ranking must not let payment silently override relevance, safety, or user choice.

**Services and professionals**
- Discovery based on service need, category, geography where relevant, qualifications/portfolio, availability, transparent pricing where applicable, reviews, responsiveness, and trust.
- Providers should not be forced into a publisher-style follower feed to be discoverable.

**Destinations, places, and local businesses**
- Discovery can combine geodirectory facts, location, interests, availability/hours when verified, visitor experiences, UGC, and official provider information.
- Separate official facts from user-generated experiences and sponsored placement.
- Local relevance must respect location permissions and user controls.

**Communities and organizations**
- Distribution follows membership, explicit subscriptions, topic relevance, and community moderation rules.
- Organizational notices should be distinguished from ordinary social content.

### D. Paid boost and monetization

Publishers, stores, service providers, and destination operators may pay to expand eligible reach within PLUITS. This is a possible revenue source, not an approved launch feature.

Principles:
- Paid reach is always clearly labeled (e.g., Sponsored/Promoted).
- Paid distribution never masquerades as organic recommendation.
- Campaign setup specifies audience, geography, duration, budget, objectives, and content eligibility.
- Provide spending limits, receipts, reporting, and controls to stop campaigns.
- Do not sell sensitive personal attributes or expose private user behavior to advertisers.
- Do not guarantee views, sales, or FYP placement.
- Organic distribution remains available; payment must not be required to reach existing followers under the product's stated feed model.
- Ranking and ad delivery must protect users from excessive repetition and low-quality campaigns.
- Validate advertiser demand, pricing, fraud controls, and legal obligations before implementation.

### E. User-generated experience and the Ibu Nia journey

Example: a person stays at a hotel and shares a genuine story, photo, or review. PLUITS may connect the experience to:
- The original author and post/article.
- The place/hotel's geodirectory profile.
- Official hotel information and services.
- Other visitor experiences, with appropriate context.
- Nearby destinations or services.

The hotel should not have to pay for the existence of a genuine user story. The provider can separately promote its official profile or campaign, but paid promotion must not alter the truth or provenance of the user's experience. Do not imply a customer endorses a provider without consent. Provide correction/report flows for inaccurate or harmful claims, while protecting legitimate criticism and authentic experience.

### F. AI writing assistance and content integrity

AI may assist users with brainstorming, outlines, grammar, translation, summarization, rewriting, accessibility, and drafting. The user remains in control of publication and is responsible for claims and rights in submitted material.

- Do not automatically punish content solely because AI assistance is detected or suspected.
- Avoid unreliable binary "AI-generated" detection as a moderation verdict.
- Consider optional, contextual disclosure where it materially affects trust (e.g., synthetic media, impersonation, fabricated reporting), without stigmatizing ordinary writing assistance.
- Detect likely duplicate/reused content as a review/ranking integrity signal, not an automatic guilt verdict.
- Similarity may be legitimate: quotation, common facts, syndicated/licensed news, references, templates, or independent coverage of the same event.
- Provide reporting, evidence review, appeal, and proportional enforcement.
- Do not reward mass-generated low-value duplicates or spam merely because they trigger engagement.

### G. Images, copyright, and rights claims

An image found through Google or another search engine is not automatically free to reuse. PLUITS should not automatically punish every uploader based only on image similarity or a weak automated match.

Proposed process:
1. Allow uploaders to identify source/license/ownership where appropriate.
2. Provide a clear copyright/rights complaint mechanism.
3. Request reasonable evidence and identify the specific material/URL.
4. Review claims consistently, including authorized representatives and licensing context.
5. Notify the affected uploader and provide an appropriate response/counter-notice or appeal process where legally applicable.
6. Restrict/remove material when required by law or platform policy; apply repeat-infringer rules proportionately.
7. Keep audit trails and protect the complainant's and uploader's personal information.

Do not promise that PLUITS will never moderate or remove material. The founder's desired principle is not to shame or automatically punish ordinary users; it does not override copyright law, safety obligations, privacy, or valid takedown requirements.

### H. Product and integrity metrics

Measure more than raw views or time spent:
- Meaningful positive interactions per eligible impression.
- Helpful/save/share/follow actions with quality and abuse adjustments.
- User-reported relevance and satisfaction.
- Healthy discussion and report/hide rates.
- Repeat readership and creator/publisher retention.
- Diversity of creators and topics discovered.
- Follower feed reliability and user control.
- Provider discovery-to-contact/booking/purchase outcomes where appropriate.
- Sponsored vs organic clarity, ad frequency, and user feedback.
- Spam, coordinated engagement, duplicate-content abuse, copyright complaints, and moderation appeal outcomes.

Metrics differ by content type. A useful service listing may succeed through a qualified contact or booking, not likes. A personal essay may succeed through saves and thoughtful conversation, not immediate sales.

### I. UX and policy implications

- Let users tune followed content, recommendations, topics, and sponsored content separately.
- Explain why a recommendation appears in understandable language.
- Provide "not interested", mute, hide, block, report, and topic controls.
- Keep paid content visibly distinct from organic content.
- Preserve authorship and source attribution when content is shared/reposted.
- Distinguish official entity information from user-generated claims and experiences.
- Support personal writing without demanding commercial intent, SEO optimization, or video format.
- Avoid forcing every provider into the same account/publishing workflow; apply entity type, role, and permissions.
- Do not expose private profile or behavioral data to a business merely because it has a professional account.

### J. Research and implementation boundary

Research:
1. Interview readers, writers, publishers, stores, service providers, and destination operators.
2. Prototype article cards in feed, article detail, publisher profile, and Explore.
3. Test follower distribution vs recommendation distribution with user controls.
4. Test whether comments/saves/helpful feedback are better quality signals than dwell time.
5. Design ranking safeguards against engagement bait, bots, brigading, and paid manipulation.
6. Test distinct product/service/destination discovery journeys.
7. Define advertising labels, campaign controls, billing, and privacy before boost launch.
8. Review copyright, privacy, defamation, consumer protection, and platform obligations for target jurisdictions.
9. Define ranking transparency, appeals, moderation operations, and creator analytics.
10. Validate that a personal diary or family travel blog can thrive without business/SEO pressure.

Implementation boundary:
- This idea does not authorize changing current Inbox/Social P0 work.
- Blog/article publishing remains a proposed next product focus, subject to audit of current repository and Supabase schema.
- Ranking, paid boost, AI moderation, copyright tooling, and payments are separate future workstreams requiring product/security/legal design.
- No production schema, ranking formula, ad campaign, moderation rule, or release gate is changed by this idea.

