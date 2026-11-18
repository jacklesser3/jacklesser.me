
(()=>{
 const pages=['campaign','brand','pilot','decision'];
 const names=['The campaign','The story','The pilot','The recommendation'];
 const cityIds=Object.keys(window.campaignViews);
 const dialog=document.querySelector('#city-viewer');
 const shell=document.querySelector('#viewer-content');
 let active='campaign', currentCity=null, returnFocus=null;
 function showPage(id){
  active=id;
  for(const p of pages){document.querySelector('#'+p).hidden=p!==id;const tab=document.querySelector('#tab-'+p);tab.setAttribute('aria-selected',String(p===id));tab.tabIndex=p===id?0:-1;}
  const n=pages.indexOf(id);
  const prev=document.querySelector('#previous-page'), next=document.querySelector('#next-page');
  prev.href='#'+pages[Math.max(0,n-1)];prev.textContent=n?'← '+names[n-1]:'← Previous';prev.setAttribute('aria-disabled',String(n===0));prev.tabIndex=n===0?-1:0;
  next.href='#'+pages[Math.min(3,n+1)];next.textContent=n<3?names[n+1]+' →':'Back to campaign ↗';if(n===3)next.href='#campaign';
  document.querySelector('#page-count').textContent=String(n+1).padStart(2,'0')+' / 04 · Creative proposal';
 }
 function closeViewer(updateHash=true){
  const wasOpen=dialog.open;if(wasOpen)dialog.close();document.body.classList.remove('modal-open');currentCity=null;
  if(updateHash)history.replaceState(null,'','#'+active);
  if(wasOpen&&returnFocus&&document.contains(returnFocus))returnFocus.focus({preventScroll:true});
 }
 function openCity(id){
  if(!currentCity)returnFocus=document.activeElement;
  currentCity=id;shell.innerHTML=window.campaignViews[id];
  document.body.classList.add('modal-open');
  if(!dialog.open)dialog.showModal();
  dialog.scrollTop=0;shell.querySelector('[data-close]').focus({preventScroll:true});
 }
 function route(){
  const hash=location.hash.slice(1)||'campaign';
  if(cityIds.includes(hash)){if(!pages.includes(active))showPage('campaign');openCity(hash);return;}
  closeViewer(false);
  const aliases={top:'campaign',cities:'campaign',story:'brand',system:'brand',budget:'pilot',timeline:'pilot',execution:'decision',downloads:'decision',measurement:'decision','budget-reference':'decision'};
  const page=pages.includes(hash)?hash:(aliases[hash]||'campaign');showPage(page);
  if(hash==='budget'||hash==='timeline'||hash==='budget-reference'){const detail=document.querySelector('#'+hash);detail.open=true;detail.scrollIntoView({block:'start',behavior:'instant'});}
  else window.scrollTo({top:0,behavior:'instant'});
 }
 document.addEventListener('click',e=>{
  const city=e.target.closest('[data-city]');
  if(city){returnFocus=city;if(location.hash==='#'+city.dataset.city)openCity(city.dataset.city);else location.hash=city.dataset.city;}
  if(e.target.closest('[data-close]'))closeViewer();
  const step=e.target.closest('[data-step]');
  if(step&&currentCity){const next=(cityIds.indexOf(currentCity)+Number(step.dataset.step)+cityIds.length)%cityIds.length;location.hash=cityIds[next];}
 });
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeViewer();});
 dialog.addEventListener('click',e=>{if(e.target===dialog)closeViewer();});
 document.querySelector('.review-nav').addEventListener('keydown',e=>{
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let n=pages.indexOf(active);
  n=e.key==='Home'?0:e.key==='End'?3:(n+(e.key==='ArrowRight'?1:-1)+4)%4;
  location.hash=pages[n];document.querySelector('#tab-'+pages[n]).focus();
 });
 document.addEventListener('keydown',e=>{
  if(!dialog.open||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const n=(cityIds.indexOf(currentCity)+(e.key==='ArrowRight'?1:-1)+cityIds.length)%cityIds.length;location.hash=cityIds[n];
 });
 window.addEventListener('hashchange',route);showPage('campaign');route();
})();
