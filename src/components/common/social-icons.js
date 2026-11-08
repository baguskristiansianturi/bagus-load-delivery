const paths={
 search:'<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
 heart:'<path d="M20.8 8.8c0 5.1-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.8A4.8 4.8 0 0 1 8 4c1.7 0 3.2.9 4 2.2C12.8 4.9 14.3 4 16 4a4.8 4.8 0 0 1 4.8 4.8Z"></path>',
 comment:'<path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.2-3.5A7.5 7.5 0 1 1 20 11.5Z"></path>',
 send:'<path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>',
 bookmark:'<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4Z"></path>',
 more:'<circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle>',
 edit:'<path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2Z"></path>',
 plus:'<path d="M12 5v14M5 12h14"></path>',
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z"></path>',
 compass:'<circle cx="12" cy="12" r="9"></circle><path d="m15.5 8.5-2.2 5-4.8 2 2-4.8Z"></path>',
 reels:'<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="m10 9 5 3-5 3Z"></path>',
 user:'<circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5"></path>'
};
export function socialIcon(name,{size=20,className=''}={}){
 const body=paths[name];if(!body)return '';
 return '<svg class="pl-icon '+className+'" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+body+'</svg>';
}
