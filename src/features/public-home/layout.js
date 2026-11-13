import {renderSocialMobileNav} from '../../components/social/navigation.js';
import {renderPublicNavbar} from './navbar.js';
import './navbar.css';
import './public-home.css';
import {renderPublicHero} from './hero.js';
import {renderPublicDiscovery} from './discovery.js';
import {renderPublicNearby} from './nearby.js';
import {renderPublicStories} from './stories.js';
import {renderPublicMarketplace} from './marketplace.js';
import {renderPublicJoin} from './join.js';
import {renderPublicFooter} from './footer.js';
import {renderAppDownload} from '../app-download/index.js';

/** Public visitor homepage composition only. Data/auth remain in pages/home. */
export function renderPublicHomeLayout({image,nearbyContent}) {
 return `<div class="pl-social-home pl-public-home">
  ${renderPublicNavbar()}
  <main class="pl-public-shell">
   ${renderPublicHero(image)}
   ${renderPublicDiscovery(image)}
   ${renderPublicNearby(nearbyContent)}
   ${renderPublicStories(image)}
   ${renderPublicMarketplace(image)}
   ${renderPublicJoin()}
   ${renderAppDownload()}
  </main>
  ${renderPublicFooter()}
  ${renderSocialMobileNav({active:'home',publicHome:true})}
 </div>`;
}