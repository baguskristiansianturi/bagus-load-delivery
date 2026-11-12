export const DEFAULT_PROFILE_IMAGE_FRAME=Object.freeze({avatar_x:50,avatar_y:42,avatar_zoom:1,card_x:50,card_y:32,card_zoom:1});
const clamp=(value,min,max,fallback)=>{const number=Number(value);return Number.isFinite(number)?Math.min(max,Math.max(min,number)):fallback;};
export function normalizeProfileImageFrame(value={}){
 return {
  avatar_x:clamp(value.avatar_x,0,100,DEFAULT_PROFILE_IMAGE_FRAME.avatar_x),
  avatar_y:clamp(value.avatar_y,0,100,DEFAULT_PROFILE_IMAGE_FRAME.avatar_y),
  avatar_zoom:clamp(value.avatar_zoom,1,2.5,DEFAULT_PROFILE_IMAGE_FRAME.avatar_zoom),
  card_x:clamp(value.card_x,0,100,DEFAULT_PROFILE_IMAGE_FRAME.card_x),
  card_y:clamp(value.card_y,0,100,DEFAULT_PROFILE_IMAGE_FRAME.card_y),
  card_zoom:clamp(value.card_zoom,1,2.5,DEFAULT_PROFILE_IMAGE_FRAME.card_zoom)
 };
}
export function profileImageFrameCss(value={},variant='avatar'){
 const frame=normalizeProfileImageFrame(value),prefix=variant==='card'?'card':'avatar';
 return '--ua-image-x:'+frame[prefix+'_x']+'%;--ua-image-y:'+frame[prefix+'_y']+'%;--ua-image-zoom:'+frame[prefix+'_zoom']+';';
}
export function readProfileImageFrame(form,current={}){
 const frame=normalizeProfileImageFrame(current);
 form?.querySelectorAll('[data-image-frame]').forEach(input=>{frame[input.dataset.imageFrame]=input.value;});
 return normalizeProfileImageFrame(frame);
}
