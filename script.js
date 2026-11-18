const $ = (selector) => document.querySelector(selector);
const money = (value) => `$${Math.round(value / 1000).toLocaleString()}k`;

function renderPath(values, width, height, padding) {
  const max = Math.max(...values) * 1.12;
  const step = (width - padding * 2) / (values.length - 1);
  return values.map((value, index) => `${index ? 'L' : 'M'}${(padding + index * step).toFixed(1)},${(height - padding - (value / max) * (height - padding * 2)).toFixed(1)}`).join(' ');
}
function svgChart(node, revenue, profit) {
  const w = node.viewBox.baseVal.width || 620, h = node.viewBox.baseVal.height || 260, p = 28;
  const labels = revenue.map((_, index) => data[index]?.month || '');
  const dots = revenue.map((value,index) => { const max=Math.max(...revenue)*1.12; const x=p+index*(w-p*2)/(revenue.length-1); const y=h-p-(value/max)*(h-p*2); return `<circle cx="${x}" cy="${y}" r="3" fill="#61e3d0"/>`; }).join('');
  node.innerHTML = `<path d="M${p} ${h-p}H${w-p}" stroke="#24435e"/><path d="${renderPath(revenue,w,h,p)}" fill="none" stroke="#61e3d0" stroke-width="3"/><path d="${renderPath(profit,w,h,p)}" fill="none" stroke="#8fb9ff" stroke-width="3"/>${dots}${labels.map((label,index)=>`<text x="${p+index*(w-p*2)/(labels.length-1)}" y="${h-8}" fill="#8fa6bb" font-size="10" text-anchor="middle">${label}</text>`).join('')}`;
}
let data = [];
async function loadDashboard() {
  const status = $('#dashboardStatus');
  try {
    const response = await fetch('data/portfolio-sales.csv');
    if (!response.ok) throw new Error('Unable to load sample data');
    const rows = (await response.text()).trim().split(/\r?\n/);
    const [header,...lines] = rows;
    data = lines.map(line => { const values=line.split(','); return Object.fromEntries(header.split(',').map((key,index)=>[key, key === 'month' || key === 'category' || key === 'region' ? values[index] : Number(values[index]) ])); });
    renderDashboard('overview');
    status.textContent = 'Sample data loaded locally from portfolio-sales.csv.';
  } catch (error) { status.textContent = 'Dashboard data could not be loaded. Open the site through a local web server to enable the interactive preview.'; status.classList.add('error'); }
}
function renderDashboard(view) {
  const monthly = [...data.reduce((map,row)=>{const item=map.get(row.month)||{month:row.month,revenue:0,profit:0};item.revenue+=row.revenue;item.profit+=row.profit;map.set(row.month,item);return map;},new Map()).values()].sort((a,b)=>['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(a.month)-['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(b.month));
  const revenue = monthly.map(row=>row.revenue), profit=monthly.map(row=>row.profit);
  const totalRevenue=revenue.reduce((sum,value)=>sum+value,0), totalProfit=profit.reduce((sum,value)=>sum+value,0);
  $('#revenueKpi').textContent=money(totalRevenue); $('#profitKpi').textContent=money(totalProfit); $('#marginKpi').textContent=`${(totalProfit/totalRevenue*100).toFixed(1)}%`;
  $('#latestRevenue').textContent=money(revenue.at(-1)); $('#latestProfit').textContent=money(profit.at(-1));
  svgChart($('#mainChart'),revenue,profit); svgChart($('#heroChart'),revenue,profit);
  const key = view === 'regional' ? 'region' : view === 'product' ? 'category' : 'category';
  const grouped = data.reduce((acc,row)=>{acc[row[key]]=(acc[row[key]]||0)+row.revenue;return acc},{}); const max=Math.max(...Object.values(grouped));
  $('#breakdownChart').innerHTML=Object.entries(grouped).map(([label,value])=>`<div class="breakdown-row"><span>${label}</span><div class="breakdown-bar"><i style="width:${value/max*100}%"></i></div><b>${money(value)}</b></div>`).join('');
  const titles={overview:['Sales performance overview','Revenue & profit trend','Revenue by category'],regional:['Regional performance','Revenue & profit trend','Revenue by region'],product:['Product mix','Revenue & profit trend','Revenue by category'],trend:['Monthly trend','Monthly revenue & profit','Revenue by category']}[view];
  $('#reportTitle').textContent=titles[0]; $('#mainChartTitle').textContent=titles[1]; $('#sideChartTitle').textContent=titles[2];
}
document.querySelectorAll('.dashboard-nav button').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.dashboard-nav button.active')?.classList.remove('active');button.classList.add('active');renderDashboard(button.dataset.view)}));
$('.theme-button').addEventListener('click',()=>{const light=document.body.classList.toggle('light');$('.theme-button').textContent=light?'☾':'☀';});
$('.menu-button').addEventListener('click',()=>{const nav=$('nav');nav.classList.toggle('open');$('.menu-button').setAttribute('aria-expanded',String(nav.classList.contains('open')));});
$('#contactForm').addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.currentTarget),message=$('.form-message');if(!form.get('name')||!form.get('email')||!form.get('message')){message.textContent='Please complete your name, email, and message.';message.className='form-message error';return}message.textContent='Thanks! Message validation is complete. Connect a form service or backend to enable delivery.';message.className='form-message';event.currentTarget.reset();});
loadDashboard();
