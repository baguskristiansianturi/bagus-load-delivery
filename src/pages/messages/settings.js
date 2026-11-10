import './settings.css';

const groups = [
  {
    id:'privacy', icon:'◉', title:'Privacy & Security', description:'Control who can contact you and see your messaging activity.',
    items:[
      ['Activity Status','Choose who can see when you are active.'],
      ['Read Receipts','Choose whether people can see when you have read their messages.'],
      ['Typing Indicators','Control whether others can see when you are typing.'],
      ['Who Can Message You','Everyone, accounts you follow, or connected people.'],
      ['Blocked Accounts','Review accounts that cannot contact you.']
    ]
  },
  {
    id:'requests', icon:'✉', title:'Message Requests', description:'Manage messages from people you are not connected with.',
    items:[
      ['Request Filtering','Separate messages from people you know and people you do not.'],
      ['Spam & Suspicious Requests','Filter spam, risky links, and suspicious activity.'],
      ['Conversation Approval','Choose when a request becomes a regular conversation.']
    ]
  },
  {
    id:'notifications', icon:'♧', title:'Message Notifications', description:'Choose which alerts you want to receive.',
    items:[
      ['New Messages','Alerts for incoming messages in your main inbox.'],
      ['Message Requests','Pemberitahuan ketika ada permintaan percakapan baru.'],
      ['Notification Sound','Turn message sounds on or off.'],
      ['Message Previews','Show or hide message content in notifications.'],
      ['Pause Notifications','Set quiet hours to avoid interruptions.']
    ]
  },
  {
    id:'appearance', icon:'◐', title:'Appearance & Experience', description:'Customize how messages look and feel.',
    items:[
      ['Theme','Light, dark, or match your device settings.'],
      ['Text Size','Adjust text size for comfortable reading.'],
      ['Enter to Send','Choose whether Enter sends a message or starts a new line.'],
      ['Animations','Reduce motion and animations if needed.']
    ]
  },
  {
    id:'media', icon:'▧', title:'Media & Data', description:'Manage data usage and media behavior in conversations.',
    items:[
      ['Autoplay Videos','Choose whether videos play automatically.'],
      ['Auto-download Media','Choose when photos and videos load automatically.'],
      ['Data Saver','Reduce mobile data usage when viewing media.'],
      ['Upload Quality','Choose media quality when sending photos and videos.']
    ]
  },
  {
    id:'support', icon:'?', title:'Help & Account Safety', description:'Get help with messaging issues and account safety.',
    items:[
      ['Report a Conversation','Report spam, harassment, or content that violates our rules.'],
      ['Messaging Help Center','Guides for managing messages and protecting your account.'],
      ['Privacy Information','Learn how Pluits handles messaging data.']
    ]
  }
];

export function messageSettingsPage(){
  return `<main class="pl-dm-settings">
    <header class="pl-dm-settings-head">
      <a class="pl-dm-settings-back" href="#/inbox" aria-label="Back to Messages"><span aria-hidden="true">‹</span><small>Messages</small></a>
      <div class="pl-dm-settings-head-copy"><span>PLUITS · MESSAGING</span><h1>Message Settings</h1></div>
      
    </header>
    <div class="pl-dm-settings-body">
      <div class="pl-dm-settings-intro">
        <span class="pl-dm-settings-eyebrow">MESSAGE PREFERENCES</span>
        <h2>Make messaging work for you</h2>
        <p>Explore the proposed controls for privacy, requests, notifications, appearance, media, and support.</p>
      </div>
      <div class="pl-dm-settings-groups">
        ${groups.map((group,index)=>`<details class="pl-dm-settings-group" ${index===0?'open':''} id="dm-setting-${group.id}">
          <summary><span class="pl-dm-settings-icon" aria-hidden="true">${group.icon}</span><span class="pl-dm-settings-group-copy"><strong>${group.title}</strong><small>${group.description}</small></span><span class="pl-dm-settings-chevron" aria-hidden="true">⌄</span></summary>
          <div class="pl-dm-settings-items">${group.items.map(item=>`<div class="pl-dm-settings-item"><span><strong>${item[0]}</strong><small>${item[1]}</small></span><em>Proposed</em></div>`).join('')}</div>
        </details>`).join('')}
      </div>
      <p class="pl-dm-settings-footnote">These are proposed settings for review. They do not change your account preferences or privacy controls yet.</p>
    </div>
  </main>`;
}

export function bindMessageSettingsPage(){
  document.querySelectorAll('.pl-dm-settings-group').forEach(group=>{
    group.addEventListener('toggle',()=>{
      group.classList.toggle('is-open',group.open);
    });
  });
}
