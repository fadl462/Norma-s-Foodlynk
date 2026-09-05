
const menu=[
['Main Meals','Acheké with Tilapia Regular',100,'food-01.webp'],['Main Meals','Acheké with Tilapia Regular',130,'food-12.webp'],['Main Meals','Acheké with Tilapia Platter Box',150,'food-12.webp'],['Main Meals','Acheké with Tilapia Platter Box',250,'food-13.webp'],['Main Meals','Banku with Tilapia',100,'food-13.webp'],['Main Meals','Banku with Tilapia',120,'food-13.webp'],['Main Meals','CheckCheck Fried Rice/Jollof',65,'food-02.webp'],['Main Meals','CheckCheck Fried Rice/Jollof',85,'food-02.webp'],['Main Meals','CheckCheck Fried Rice/Jollof',100,'food-06.webp'],['Main Meals','Assorted Fried Rice/Jollof',100,'food-02.webp'],['Main Meals','Assorted Fried Rice/Jollof',120,'food-06.webp'],['Main Meals','Braised Rice (Angwamo)',50,'food-06.webp'],['Main Meals','Braised Rice (Angwamo)',70,'food-06.webp'],['Main Meals','Plain Rice, Veg Stew & Grilled Chicken',50,'food-12.webp'],['Main Meals','Plain Rice, Egg Stew & Chicken',55,'food-13.webp'],['Main Meals','Zongo Rice',65,'food-02.webp'],['Main Meals','Curry Rice with Chicken',65,'food-12.webp'],['Swallow & Soups','Eba & Egusi Soup',60,'food-04.webp'],['Swallow & Soups','Eba & Egusi Soup',80,'food-04.webp'],['Swallow & Soups','Eba & Egusi Soup',100,'food-04.webp'],['Spaghetti','Assorted Spaghetti',50,'food-06.webp'],['Spaghetti','Assorted Spaghetti',70,'food-06.webp'],['Fries & Loaded Fries','Loaded Fries',75,'food-01.webp'],['Fries & Loaded Fries','Loaded Fries',100,'food-01.webp'],['Fries & Loaded Fries','Loaded Fries',120,'food-01.webp'],['Fries & Loaded Fries','Loaded Fries',150,'food-01.webp'],['Fries & Loaded Fries','Fries with Spicy Chicken Wings',75,'food-02.webp'],['Chicken, Wings & Guinea Fowl','Spicy Drumsticks (5 pcs)',70,'food-12.webp'],['Chicken, Wings & Guinea Fowl','Spicy Chicken Wings (6 pcs)',50,'food-02.webp'],['Chicken, Wings & Guinea Fowl','Spicy Chicken Wings (12 pcs)',90,'food-02.webp'],['Chicken, Wings & Guinea Fowl','Spicy Grilled Guinea Fowl (Half)',90,'food-13.webp'],['Chicken, Wings & Guinea Fowl','Spicy Grilled Guinea Fowl (Full)',160,'food-13.webp'],['Shawarma','Shawarma',65,'food-03.webp'],['Shawarma','Shawarma with Coke',75,'food-03.webp'],['Plantain','Fried Plantain with Egg Stew',40,'food-12.webp'],['Desserts','Milky Doughnuts (3 pcs)',60,'food-07.webp'],['Drinks','Sobolo',7,'food-11.webp'],['Drinks','Coke',10,'food-08.webp'],['Drinks','Fresh Fruit Juice',10,'food-09.webp']
];
const categories=['All',...new Set(menu.map(x=>x[0]))];let active='All',basket=[],service='Pickup';let slipCheckoutMode=false,menuHasBeenLeft=false;
const grid=document.getElementById('menuGrid'),chips=document.getElementById('chips');
function renderChips(){chips.innerHTML=categories.map(c=>`<button class="chip ${c===active?'active':''}" data-cat="${c.replaceAll('"','&quot;')}">${c}</button>`).join('');chips.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{active=b.dataset.cat;renderMenu()})}
function renderMenu(){renderChips();const q=document.getElementById('search').value.trim().toLowerCase();const list=menu.map((x,index)=>({x,index})).filter(({x})=>(active==='All'||x[0]===active)&&x[1].toLowerCase().includes(q));let html='',last='';list.forEach(({x,index},i)=>{if(x[0]!==last){html+=`<div class="category-label">${x[0]}</div>`;last=x[0]}html+=`<article class="menu-card"><div class="menu-image"><img loading="lazy" src="assets/img/${x[3]}" alt="${x[1]}">${i<3&&active==='All'?'<span class="menu-tag">Popular pick</span>':''}</div><div class="menu-info"><h3>${x[1]}</h3><p>Freshly prepared · Tamale</p><div class="menu-bottom"><span class="price">GHS ${x[2]}</span><button class="add" type="button" data-add-index="${index}" aria-label="Add ${x[1]} to basket">Add +</button></div></div></article>`});grid.innerHTML=html||'<p style="color:var(--muted)">No dish matches that search.</p>'}
document.getElementById('search').addEventListener('input',renderMenu);
function basketCount(){return basket.reduce((sum,x)=>sum+x.qty,0)}
function basketTotal(){return basket.reduce((sum,x)=>sum+(x.price*x.qty),0)}
function addItem(index){const item=menu[index];if(!item)return;const existing=basket.find(x=>x.id===index);if(existing)existing.qty+=1;else basket.push({id:index,name:item[1],price:Number(item[2]),qty:1});renderBasket();showToast(item[1]+' added to your food slip.');}
grid.addEventListener('click',e=>{const button=e.target.closest('[data-add-index]');if(!button)return;e.preventDefault();e.stopPropagation();const index=Number(button.dataset.addIndex);if(!Number.isInteger(index))return;addItem(index);button.classList.add('added');button.textContent='Added ✓';setTimeout(()=>{if(button.isConnected){button.classList.remove('added');button.textContent='Add +'}},900)});
function changeItem(id,delta){const item=basket.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)basket=basket.filter(x=>x.id!==id);renderBasket()}
function removeItem(id){basket=basket.filter(x=>x.id!==id);renderBasket();showToast('Item removed from your food slip.');}
function renderMiniBasket(){const slip=document.getElementById('miniOrderSlip'),list=document.getElementById('miniList'),count=document.getElementById('miniCount'),total=document.getElementById('miniTotal');if(!basket.length){slip.classList.remove('visible');return}const countValue=basketCount();count.textContent=countValue+' '+(countValue===1?'item':'items');list.innerHTML=basket.map(x=>`<div class="mini-slip-row"><span class="mini-slip-name" title="${x.name}">${x.name}</span><div class="mini-slip-controls"><button type="button" data-slip-minus="${x.id}" aria-label="Remove one ${x.name}">−</button><span class="mini-slip-qty">${x.qty}</span><button type="button" data-slip-plus="${x.id}" aria-label="Add another ${x.name}">+</button></div><span class="mini-slip-price">GHS ${x.price*x.qty}</span><button type="button" class="mini-slip-remove" data-slip-remove="${x.id}" aria-label="Remove ${x.name} from food slip">×</button></div>`).join('');total.textContent='GHS '+basketTotal();if(!slipCheckoutMode)slip.classList.add('visible');else slip.classList.remove('visible')}
document.getElementById('miniList').addEventListener('click',e=>{const plus=e.target.closest('[data-slip-plus]');const minus=e.target.closest('[data-slip-minus]');const remove=e.target.closest('[data-slip-remove]');if(plus){changeItem(Number(plus.dataset.slipPlus),1)}else if(minus){changeItem(Number(minus.dataset.slipMinus),-1)}else if(remove){removeItem(Number(remove.dataset.slipRemove))}});
function openBasket(){slipCheckoutMode=true;document.getElementById('miniOrderSlip').classList.remove('visible');document.getElementById('miniOrderSlip').classList.add('checkout-hidden');document.getElementById('order').scrollIntoView({behavior:'smooth',block:'start'})}
function renderBasket(){const el=document.getElementById('basket');const countValue=basketCount();document.getElementById('count').textContent=countValue+' '+(countValue===1?'item':'items');if(!basket.length){el.innerHTML='<div class="basket-empty">Your basket is empty. Add something delicious from the menu.</div>';document.getElementById('total').textContent='GHS 0';renderMiniBasket();return}el.innerHTML=basket.map(x=>`<div class="basket-row"><div><div class="basket-name">${x.name}</div><div class="basket-meta">GHS ${x.price} each · ${x.qty} ${x.qty===1?'plate':'plates'}</div></div><div class="qty"><button type="button" data-basket-minus="${x.id}" aria-label="Remove one ${x.name}">−</button><strong>${x.qty}</strong><button type="button" data-basket-plus="${x.id}" aria-label="Add another ${x.name}">+</button><strong>GHS ${x.price*x.qty}</strong><button type="button" data-basket-remove="${x.id}" aria-label="Remove ${x.name}">×</button></div></div>`).join('');document.getElementById('total').textContent='GHS '+basketTotal();renderMiniBasket()}
document.getElementById('basket').addEventListener('click',e=>{const plus=e.target.closest('[data-basket-plus]');const minus=e.target.closest('[data-basket-minus]');const remove=e.target.closest('[data-basket-remove]');if(plus)changeItem(Number(plus.dataset.basketPlus),1);else if(minus)changeItem(Number(minus.dataset.basketMinus),-1);else if(remove)removeItem(Number(remove.dataset.basketRemove))});
function sendWhatsApp(){if(!basket.length){showToast('Add an item to your basket first.');return}const total=basketTotal(),lines=basket.map(x=>`• ${x.name} × ${x.qty} — GHS ${x.price*x.qty}`);const msg=`Hi Norma’s Foodlynk! I’d like to place an order.\n\n${lines.join('\n')}\n\nEstimated total: GHS ${total}\nService: ${service}\n\nPlease confirm availability, delivery/pickup details and final total.`;window.open('https://wa.me/233500691238?text='+encodeURIComponent(msg),'_blank')}
document.getElementById('miniCheckout').onclick=openBasket;document.getElementById('whatsapp').onclick=sendWhatsApp;document.getElementById('clear').onclick=()=>{basket=[];renderBasket();showToast('Basket cleared.')};document.querySelectorAll('.delivery button').forEach(b=>b.onclick=()=>{service=b.dataset.service;document.querySelectorAll('.delivery button').forEach(x=>x.classList.remove('active'));b.classList.add('active')});
function showToast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove('show'),1700)}
function openModal(src){document.getElementById('modalImg').src=src;document.getElementById('modal').classList.add('open');document.body.classList.add('lock')}function closeModal(){document.getElementById('modal').classList.remove('open');document.body.classList.remove('lock')}
document.getElementById('modal').onclick=e=>{if(e.target.id==='modal')closeModal()};document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();nav?.classList.remove('open')}});
const gallery=['food-01.webp','food-02.webp','food-04.webp','food-01.webp','food-02.webp','food-03.webp','food-12.webp','food-07.webp'];document.getElementById('dishTrack').innerHTML=[...gallery,...gallery].map((p,i)=>`<div class="dish-card" onclick="openModal('assets/img/${p}')"><img src="assets/img/${p}" alt="Norma’s Foodlynk dish" loading="lazy"><div class="dish-copy"><span>${i%2?'Made for sharing':'Norma’s Foodlynk'}</span><h3 class="serif">${['Big flavour plates','Comfort, loaded','Straight from the kitchen','Good food, no fuss'][i%4]}</h3><span class="dish-price">Tap to view</span></div></div>`).join('');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
function updateStatus(){const now=new Date(),h=now.getHours()+now.getMinutes()/60,el=document.getElementById('status');if(h>=10&&h<17){el.textContent='Kitchen is open · taking orders now';el.style.color='var(--lime)'}else{el.textContent='Kitchen hours · 10:00 AM–5:00 PM';el.style.color='rgba(255,255,255,.75)'}}updateStatus();setInterval(updateStatus,60000);
const nav=document.getElementById('nav'),menuToggle=document.getElementById('menuToggle');menuToggle.onclick=()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')};nav.querySelectorAll('.navlinks a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation')});document.getElementById('floatingOrder').onclick=openBasket;
const cursor=document.getElementById('cursor');if(matchMedia('(pointer:fine)').matches){document.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});document.querySelectorAll('a,button,.menu-card,.dish-card').forEach(e=>{e.addEventListener('mouseenter',()=>cursor.classList.add('big'));e.addEventListener('mouseleave',()=>cursor.classList.remove('big'))})}else cursor.remove();
renderMenu();renderBasket();

// Food slip visibility: it follows the menu, but disappears once the guest enters checkout.
// After checkout, it returns only when the guest actually comes back to the menu section.
const menuSection=document.getElementById('menu');
const slip=document.getElementById('miniOrderSlip');
const menuVisibilityObserver=new IntersectionObserver(entries=>{
  const entry=entries[0];
  if(!entry.isIntersecting){
    menuHasBeenLeft=true;
    slip.classList.remove('visible');
    return;
  }
  if(menuHasBeenLeft){
    slipCheckoutMode=false;
    if(basket.length){
      slip.classList.remove('checkout-hidden');
      renderMiniBasket();
    }
  }else if(!slipCheckoutMode && basket.length){
    slip.classList.remove('checkout-hidden');
    renderMiniBasket();
  }
},{threshold:0.12});
menuVisibilityObserver.observe(menuSection);

// Interaction hardening
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{const target=document.querySelector(a.getAttribute('href'));if(target){target.setAttribute('tabindex','-1');setTimeout(()=>target.removeAttribute('tabindex'),900)}}));
window.addEventListener('resize',()=>{if(window.innerWidth>820){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation')}});

// V18 header behavior: compact on scroll and highlight the section currently in view.
(function(){
  const header=document.getElementById('nav');
  if(!header) return;
  const links=[...header.querySelectorAll('.navlinks a')];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const syncHeader=()=>header.classList.toggle('scrolled',window.scrollY>42);
  syncHeader();
  window.addEventListener('scroll',syncHeader,{passive:true});
  const setActive=(id)=>links.forEach(a=>a.classList.toggle('active',id && a.getAttribute('href')==='#'+id));
  const observer=new IntersectionObserver(entries=>{
    if(window.scrollY<90){setActive(null);return;}
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible) setActive(visible.target.id);
  },{rootMargin:'-30% 0px -55% 0px',threshold:[0,.2,.5,1]});
  sections.forEach(s=>observer.observe(s));
  if(location.hash && location.hash !== '#top') setActive(location.hash.slice(1));
  else setActive(null);
})();
