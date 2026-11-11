/**
 * Seller Center navigation component.
 * Owns only Seller Center workspace navigation markup; data and navigation state
 * remain controlled by the Seller page controller.
 */
export function renderSellerNavigation({user,activeTab,tabs}){
 const nav=tabs.map(([id,label])=>`<button type="button" data-tab="${id}" class="${activeTab===id?'active':''}" aria-current="${activeTab===id?'page':'false'}">${label}</button>`).join('');
 return `<aside class="pluits-sidebar" aria-label="Navigasi Seller Center">
  <div class="pluits-user"><b>${escapeHtml(user?.user_metadata?.full_name||user?.email||'Akun')}</b><small>${escapeHtml(user?.email||'')}</small></div>
  <nav aria-label="Menu toko">${nav}</nav>
  <div class="pluits-sidebar-foot">PLUITS INDONESIA<br><small>Seller Center v0.1</small></div>
 </aside>
 <nav class="pluits-mobile-tabs" aria-label="Menu Seller Center">${nav}</nav>`;
}
function escapeHtml(value){
 return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
