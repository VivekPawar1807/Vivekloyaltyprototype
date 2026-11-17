(function(){
'use strict';
var STORE='gravty-launchpad-demo-v1';
var nav=[
  {id:'overview',icon:'▣',label:'Overview'},
  {id:'docsense',icon:'⌁',label:'DocSense AI'},
  {id:'askonce',icon:'?',label:'AskOnce'},
  {id:'memory',icon:'◫',label:'Program Memory'},
  {id:'rulecraft',icon:'◇',label:'RuleCraft'},
  {id:'ruleguard',icon:'✓',label:'RuleGuard'},
  {id:'dryrun',icon:'▷',label:'DryRun'},
  {id:'signoff',icon:'◉',label:'SignOff Hub'},
  {id:'analytics',icon:'▥',label:'Analytics'},
  {id:'impact',icon:'$',label:'Business Impact'},
  {id:'launch',icon:'⌘',label:'Launch Control'},
  {id:'settings',icon:'⚙',label:'Settings'}
];
var tour=[
  {route:'overview',title:'Start with the onboarding problem',copy:'See how LaunchPad moves configuration work into a reviewable workspace on day one.'},
  {route:'docsense',title:'Confirm a sourced draft field',copy:'Review the Gold qualification source and explicitly confirm it.'},
  {route:'askonce',title:'Resolve the Gold multiplier once',copy:'Choose 1.5× from the cited source. The decision is retained in Program Memory.'},
  {route:'rulecraft',title:'Propose a targeted rule edit',copy:'Convert the plain-language change into a reviewable before-and-after diff.'},
  {route:'ruleguard',title:'Inspect deterministic validation',copy:'RuleGuard checks the draft before it can enter approval.'},
  {route:'dryrun',title:'Run the sandbox calculation',copy:'Test a ₹2,000 online purchase and inspect the calculation trace.'},
  {route:'signoff',title:'Approve the version',copy:'Switch to the Business Stakeholder role and lock the reviewed configuration.'},
  {route:'memory',title:'Inspect the audit trail',copy:'Program Memory holds the decision, test record, version, and approval.'},
  {route:'analytics',title:'Review outcomes and launch gates',copy:'Finish with success metrics, the commercial model, and the conditional-go criteria.'}
];
var scenarios={
  conservative:{label:'Conservative',clients:'10',acv:'$200k',adoption:'20% → 65%',weeks:'10',goLives:'0 / 0 / 0',billing:.13,extra:0,lost:-.27,revenue:-.14,development:1.20,running:1.75,net:-3.09,year3:-.77},
  base:{label:'Base',clients:'12',acv:'$250k',adoption:'30% → 85%',weeks:'16',goLives:'0 / 2 / 3',billing:.85,extra:1.73,lost:0,revenue:2.58,development:.95,running:1.63,net:0,year3:.98},
  optimistic:{label:'Optimistic',clients:'14',acv:'$300k',adoption:'40% → 95%',weeks:'16',goLives:'1 / 3 / 5',billing:2.13,extra:4.20,lost:0,revenue:6.33,development:.90,running:1.63,net:3.81,year3:2.97}
};
function initialState(){
  return {
    route:'overview',
    role:'Loyalty Program Manager',
    activeScenario:'base',
    tourStep:-1,
    docs:[
      {name:'Program_Rules.docx',type:'DOCX',size:'1.8 MB',status:'Evidence indexed'},
      {name:'Tier_Matrix.xlsx',type:'XLSX',size:'420 KB',status:'Conflict found'},
      {name:'Programme_Examples.pdf',type:'PDF',size:'2.1 MB',status:'Ready for review'}
    ],
    fields:[
      {id:'goldQualification',group:'Tier',label:'Gold qualification',value:'Annual spend ≥ ₹50,000',source:'Program_Rules.docx · Section 3.2',quote:'Members who spend ₹50,000 in a calendar year qualify for Gold.',confidence:'High',status:'Suggested'},
      {id:'platinumQualification',group:'Tier',label:'Platinum qualification',value:'Annual spend ≥ ₹1,50,000',source:'Program_Rules.docx · Section 3.2',quote:'Members who spend ₹1,50,000 in a calendar year qualify for Platinum.',confidence:'High',status:'Confirmed'},
      {id:'baseEarn',group:'Earning rule',label:'Online base earn rate',value:'10 points per ₹100',source:'Program_Rules.docx · Section 4.1',quote:'Base earning is 10 points for each ₹100 of eligible spend.',confidence:'High',status:'Confirmed'},
      {id:'goldMultiplier',group:'Earning rule',label:'Gold online multiplier',value:'1.5×',source:'Tier_Matrix.xlsx · B7',quote:'Gold online multiplier: 1.5×.',confidence:'Low',status:'Needs clarification'}
    ],
    questions:[
      {id:'goldMultiplier',title:'Which Gold earning multiplier applies?',priority:'High · 54 impact score',why:'This affects points issued under three online earning rules.',a:'Tier_Matrix.xlsx, cell B7',av:'1.5×',b:'Program_Rules.docx, Section 4.1',bv:'2×',answer:null,by:null,at:null}
    ],
    config:{multiplier:1.5,cap:5000,version:'0.1 Draft',locked:false,approvedAt:null,proposal:null},
    tests:{ran:false,passed:0,total:9,lastRun:null},
    validationRan:false,
    simulation:{amount:2000,spend:149000,channel:'Online',category:'Electronics'},
    activity:[
      {title:'Workspace created',detail:'Northstar Loyalty Programme opened with fictional demo data.',time:'Today · 09:12'},
      {title:'DocSense draft available',detail:'18 of 26 configuration objects were mapped with source evidence.',time:'Today · 09:14'},
      {title:'AskOnce grouped one high-impact conflict',detail:'Gold multiplier values disagree across two sources.',time:'Today · 09:15'}
    ]
  };
}
function copy(v){return JSON.parse(JSON.stringify(v));}
function load(){
  try{var raw=localStorage.getItem(STORE);return raw?JSON.parse(raw):initialState();}catch(e){return initialState();}
}
var state=load();
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){}}
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function field(id){return state.fields.filter(function(x){return x.id===id;})[0];}
function countConfirmed(){return state.fields.filter(function(x){return x.status==='Confirmed';}).length;}
function questionsOpen(){return state.questions.filter(function(x){return !x.answer;}).length;}
function addActivity(title,detail){
  state.activity.unshift({title:title,detail:detail,time:'Just now'});
  state.activity=state.activity.slice(0,20);
}
function toast(message){
  var node=document.getElementById('toast');
  node.textContent=message;node.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer=window.setTimeout(function(){node.classList.remove('show');},3000);
}
function pill(text,kind){
  return '<span class="tag '+(kind||'info')+'">'+esc(text)+'</span>';
}
function pageHead(eyebrow,title,description,actions){
  return '<div class="page-head"><div><span class="eyebrow">'+esc(eyebrow)+'</span><h1>'+esc(title)+'</h1><p>'+esc(description)+'</p></div>'+(actions?'<div class="button-row">'+actions+'</div>':'')+'</div>';
}
function metric(label,value,note,kind){
  return '<div class="card metric"><span class="label">'+esc(label)+'</span><div class="metric-value">'+value+'</div><div class="metric-note">'+(kind?pill(kind.kind,kind.className)+' ':'')+note+'</div></div>';
}
function currentTour(){
  if(state.tourStep<0||state.tourStep>=tour.length)return '';
  var item=tour[state.tourStep];
  return '<div class="tour"><div class="tour-count">'+(state.tourStep+1)+'</div><p><b>'+esc(item.title)+'</b>'+esc(item.copy)+'</p><button class="btn small primary" data-tour-next>Continue</button></div>';
}
function validation(){
  var issues=[];
  if(!state.questions[0].answer){issues.push({severity:'Critical',rule:'Gold online multiplier',text:'Two supported source values remain unresolved.',action:'Resolve in AskOnce',route:'askonce'});}
  if(state.config.multiplier<=0){issues.push({severity:'Critical',rule:'Gold online multiplier',text:'Multiplier must be greater than zero.',action:'Edit in RuleCraft',route:'rulecraft'});}
  if(state.config.cap<=0){issues.push({severity:'Critical',rule:'Gold online rule',text:'A maximum points cap is required for this reward pattern.',action:'Edit in RuleCraft',route:'rulecraft'});}
  issues.push({severity:'Warning',rule:'Production parity',text:'The public demo adapter has not been compared with the GRAVTY production rules engine.',action:'Required before release',route:'settings'});
  if(state.validationRan){issues.push({severity:'Information',rule:'Schema coverage',text:'3 tiers and 4 earning-rule conditions evaluated by the deterministic demo validator.',action:'View coverage',route:'ruleguard'});}
  return issues;
}
function criticalCount(){return validation().filter(function(x){return x.severity==='Critical';}).length;}
function calculation(){
  var s=state.simulation;
  var base=Math.floor(Number(s.amount)/100)*10;
  var raw=base*Number(state.config.multiplier);
  var points=Math.min(raw,Number(state.config.cap));
  var updated=Number(s.spend)+Number(s.amount);
  var tier=updated>=150000?'Platinum':updated>=50000?'Gold':'Silver';
  return {base:base,raw:raw,points:points,updated:updated,tier:tier,capped:raw>points};
}
function isAuthor(){
  return state.role==='Loyalty Program Manager'||state.role==='Client Implementation Lead'||state.role==='GRAVTY Program Coach';
}
function canApprove(){
  return state.role==='Business Stakeholder'&&!state.config.locked&&countConfirmed()===state.fields.length&&questionsOpen()===0&&state.tests.ran&&criticalCount()===0;
}
function nextTour(){
  if(state.tourStep<0){state.tourStep=0;}else{state.tourStep=Math.min(state.tourStep+1,tour.length);}
  if(tour[state.tourStep])state.route=tour[state.tourStep].route;
  save();render();
}
function renderShell(){
  var side=nav.map(function(n){return '<button data-route="'+n.id+'" class="'+(state.route===n.id?'active':'')+'"><span class="nav-icon">'+n.icon+'</span>'+n.label+'</button>';}).join('');
  var mobile=nav.map(function(n){return '<button data-route="'+n.id+'" class="'+(state.route===n.id?'active':'')+'">'+n.label+'</button>';}).join('');
  var current=nav.filter(function(n){return n.id===state.route;})[0]||nav[0];
  document.getElementById('app').innerHTML='<div class="shell"><aside class="sidebar"><div class="brand"><span class="brand-mark"><i></i><i></i><i></i></span>GRAVTY<sup>®</sup></div><div class="workspace"><small>Demo workspace</small><b>Northstar Rewards</b><span>Northstar Loyalty Programme</span></div><span class="nav-label">Workspace</span><nav class="nav" aria-label="Workspace navigation">'+side+'</nav><div class="sidebar-footer">Public prototype<br>Fictional demo data only</div></aside><div class="content"><nav class="mobile-nav" aria-label="Workspace navigation">'+mobile+'</nav><header class="topbar"><div class="crumb">Northstar Rewards <span> / </span><b>'+esc(current.label)+'</b></div><div class="top-actions">'+pill('Demo mode','demo')+'<button class="btn ghost small" data-route="settings">Help</button><span class="avatar">AS</span></div></header><main id="main" class="main" tabindex="-1">'+page()+'<p class="footer-note">GRAVTY LaunchPad public prototype. Demo data and calculated examples are fictional. The DryRun adapter is not the live GRAVTY rules engine.</p></main></div></div>';
}
function page(){
  if(state.route==='overview')return overviewPage();
  if(state.route==='docsense')return docsensePage();
  if(state.route==='askonce')return askoncePage();
  if(state.route==='memory')return memoryPage();
  if(state.route==='rulecraft')return rulecraftPage();
  if(state.route==='ruleguard')return ruleguardPage();
  if(state.route==='dryrun')return dryrunPage();
  if(state.route==='signoff')return signoffPage();
  if(state.route==='analytics')return analyticsPage();
  if(state.route==='impact')return impactPage();
  if(state.route==='launch')return launchPage();
  return settingsPage();
}
function overviewPage(){
  var confirmed=countConfirmed(), total=state.fields.length, tests=state.tests.ran?state.tests.passed+'/'+state.tests.total:'Not run';
  return pageHead('Northstar Loyalty Programme','Configuration workspace','A reviewable, testable path from existing program documents to a locked configuration.','<button class="btn primary" data-tour-start>Start five-minute tour</button><button class="btn" data-route="docsense">Open DocSense</button>')+
  currentTour()+
  '<section class="hero"><span class="eyebrow">Onboarding status · fictional demo</span><h2>Configuration moves in parallel with the rest of onboarding</h2><p>LaunchPad focuses on tier and earning-rule setup. Data migration, integrations, and contracts remain outside this workspace, so a fast configuration review does not promise an instant go-live.</p><div class="button-row"><button class="btn primary" data-route="docsense">Review sourced draft</button><button class="btn" data-route="launch">See launch gates</button></div></section>'+
  '<section class="section"><div class="grid four">'+
  metric('Configuration objects',confirmed+' / '+total,'Human-confirmed fields',{kind:confirmed+' confirmed',className:'confirmed'})+
  metric('Open clarifications',String(questionsOpen()),'Most important conflict first',{kind:'AskOnce',className:'warning'})+
  metric('DryRun coverage',tests,'Every earning rule needs a passing test',{kind:state.tests.ran?'Ready':'Action needed',className:state.tests.ran?'pass':'warning'})+
  metric('Approval state',state.config.locked?'Locked':'Draft',state.config.locked?'Version '+state.config.version:'Human approval required',{kind:state.config.locked?'Approved':'Not ready',className:state.config.locked?'approved':'warning'})+
  '</div></section>'+
  '<section class="section grid two"><div class="card"><div class="section-heading"><div><h2>Guided setup</h2><p>Follow the work in the order it affects approval.</p></div>'+pill('10 weeks is conditional','warning')+'</div><div class="checklist">'+
  stepLine('DocSense draft reviewed',confirmed>=3,'Confirm the remaining supported field')+
  stepLine('AskOnce decision saved',questionsOpen()===0,'Resolve the multiplier conflict')+
  stepLine('RuleCraft revision accepted',state.config.multiplier===2,'Propose the 2× revision')+
  stepLine('DryRun evidence current',state.tests.ran,'Run the deterministic scenario')+
  stepLine('Stakeholder approval locked',state.config.locked,'Sign the completed version')+
  '</div></div><div class="card"><div class="section-heading"><div><h2>Why LaunchPad</h2><p>Case baselines and targets</p></div></div><div class="bar-chart">'+barItem('Today: setup work','60',60,'yellow')+barItem('Target: client-configured','70',70,'')+barItem('Today: clarification rounds','90',90,'red')+barItem('Target: approval time','26',26,'blue')+'</div><div class="notice">60% × 26 weeks = 15.6 weeks for configuration-related onboarding. The other 10.4 weeks remain, so integration work must run in parallel to support a ten-week ambition.</div></div></section>'+
  '<section class="section grid two"><div class="card"><div class="section-heading"><div><h2>Recent activity</h2><p>Visible audit record</p></div><button class="btn small" data-route="memory">Open memory</button></div>'+activityMarkup(4)+'</div><div class="card"><div class="section-heading"><div><h2>Scope boundary</h2><p>Kept visible in every workspace</p></div></div><div class="grid two">'+miniScope('In scope','Tiers, earning rules, document interpretation, clarification, validation, simulation, approval','complete')+miniScope('Out of scope','Data migration, system integrations, and contracts','info')+'</div></div></section>';
}
function stepLine(title,done,detail){
  return '<div class="check '+(done?'done':'current')+'"><i>'+ (done?'✓':'') +'</i><div><b>'+esc(title)+'</b><br><span>'+esc(detail)+'</span></div></div>';
}
function miniScope(title,body,kind){return '<div><span class="label">'+esc(title)+'</span><p>'+esc(body)+'</p>'+pill(kind==='complete'?'Tracked here':'Tracked alongside',kind)+'</div>';}
function barItem(label,value,width,kind){return '<div class="bar-item"><span>'+esc(label)+'</span><div class="bar-track"><i class="'+(kind||'')+'" style="width:'+Math.min(100,width)+'%"></i></div><b>'+esc(value)+(label.indexOf('rounds')>-1?'%':'%')+'</b></div>';}
function activityMarkup(limit){
  return '<div class="activity">'+state.activity.slice(0,limit||state.activity.length).map(function(a){return '<div class="activity-item"><i></i><div><b>'+esc(a.title)+'</b><span>'+esc(a.detail)+' · '+esc(a.time)+'</span></div></div>';}).join('')+'</div>';
}
function docsensePage(){
  var rows=state.docs.map(function(d){return '<div class="file-row"><span class="file-type">'+esc(d.type)+'</span><div><b>'+esc(d.name)+'</b><span>'+esc(d.size)+' · '+esc(d.status)+'</span></div>'+pill(d.status==='Conflict found'?'Conflict':'Ready',d.status==='Conflict found'?'conflict':'complete')+'</div>';}).join('');
  var cards=state.fields.map(fieldCard).join('');
  return pageHead('Document interpretation','DocSense AI','Drafts structured tiers and earning rules from source evidence. A person must explicitly confirm every suggested value.','<button class="btn primary" data-route="askonce">Open AskOnce</button>')+
  currentTour()+
  '<section class="card"><div class="upload-area"><div><h3>Program document intake</h3><p>Up to 20 files · PDF, DOCX, XLSX · 25 MB each in this public demo.</p></div><label class="btn primary" for="upload-input">Add documents</label><input id="upload-input" type="file" accept=".pdf,.docx,.xlsx,.txt,.csv" multiple hidden></div><div class="file-list">'+rows+'</div><div class="notice warning">Demo adapter: text and CSV files receive a lightweight browser-side evidence scan. PDF, DOCX, and XLSX intake appears here but their contents are not parsed in this static build.</div></section>'+
  '<section class="section split"><div class="card"><div class="section-heading"><div><h2>Original document</h2><p>Program_Rules.docx · Section 3.2</p></div>'+pill('Evidence view','info')+'</div><article class="document"><div class="doc-name">NORTHSTAR LOYALTY PROGRAMME · PROGRAM_RULES.DOCX</div><h4>3.2 Tier qualification</h4><p><span class="evidence">Members who spend ₹50,000 in a calendar year qualify for Gold.</span> Members who spend ₹1,50,000 in a calendar year qualify for Platinum.</p><h4>4.1 Earning rules</h4><p>Base earning is 10 points for each ₹100 of eligible spend. Gold members earn 2× points on online electronics purchases. Maximum points per transaction: 5,000.</p><div class="notice">Source quotations appear beside each draft value. In production, the quote check and five independent extraction passes determine confidence.</div></article></div><div class="card"><div class="section-heading"><div><h2>Structured draft</h2><p>All values remain reviewable.</p></div>'+pill(countConfirmed()+' confirmed','confirmed')+'</div><div class="field-list">'+cards+'</div></div></section>';
}
function fieldCard(f){
  var tag=f.status==='Confirmed'?'confirmed':f.status==='Needs clarification'?'conflict':'suggested';
  var actions='';
  if(f.status==='Suggested')actions='<button class="btn small primary" data-confirm="'+f.id+'">Confirm</button><button class="btn small" data-edit="'+f.id+'">Edit</button><button class="btn small" data-reject="'+f.id+'">Reject</button>';
  else if(f.status==='Needs clarification')actions='<button class="btn small primary" data-route="askonce">Resolve in AskOnce</button>';
  else actions='<button class="btn small" data-edit="'+f.id+'">Edit with reason</button>';
  return '<article class="field-card"><div class="field-top"><div><h4>'+esc(f.label)+'</h4><div class="field-value">'+esc(f.value)+'</div></div>'+pill(f.status,tag)+'</div><div class="source">'+esc(f.source)+'</div><div class="quote">“'+esc(f.quote)+'”</div><div class="button-row">'+pill(f.confidence+' confidence',f.confidence.toLowerCase())+actions+'</div></article>';
}
function askoncePage(){
  var q=state.questions[0];
  var resolved=q.answer?'<div class="decision">Resolved by '+esc(q.by)+' · '+esc(q.at)+' · Selected '+esc(q.answer)+'. This decision will not be asked again unless the source or configuration changes.</div>':'<div class="choice-row"><button class="choice" data-answer="1.5×">1.5×</button><button class="choice" data-answer="2×">2×</button><button class="choice" data-answer="Other">Other</button></div>';
  return pageHead('Consolidated clarifications','AskOnce','Questions are ranked by financial impact, affected rules, and uncertainty. Resolved values stay in Program Memory.','<button class="btn" data-route="memory">View decisions</button>')+
  currentTour()+
  '<section class="grid three"><div class="card metric"><span class="label">Open in this batch</span><div class="metric-value">'+questionsOpen()+'</div><div class="metric-note">'+pill('Max 10 per batch','info')+' Prioritised at import</div></div>'+metric('Affected earning rules','3','All online Gold rules',{kind:'Impact weighted',className:'warning'})+metric('Repeat explanations','0','Confirmed values are never re-asked',{kind:'Target',className:'complete'})+'</section>'+
  '<section class="section grid two"><div class="question"><div class="section-heading"><div><span class="label">Question 01 · '+esc(q.priority)+'</span><h2>'+esc(q.title)+'</h2><p>'+esc(q.why)+'</p></div>'+pill(q.answer?'Resolved':'Needs decision',q.answer?'confirmed':'warning')+'</div><div class="source-compare"><div><b>'+esc(q.a)+'</b>'+esc(q.av)+'</div><div><b>'+esc(q.b)+'</b>'+esc(q.bv)+'</div></div>'+resolved+'</div><div class="card"><h3>How this is prioritised</h3><p>The deterministic score uses estimated financial impact × rules affected × uncertainty. The public demo shows the result rather than an invented AI certainty score.</p><div class="checklist">'+stepLine('Cited options only',true,'The visible choices come from the supplied sources.')+stepLine('One saved decision',q.answer!==null,q.answer?'Saved with user and time':'Required before approval.')+stepLine('Related rules updated',q.answer!==null,q.answer?'Gold online rule is now reviewable.':'Waits for the decision.')+'</div><div class="notice">Use Other in a real implementation only with a recorded rationale and authorized user.</div></div></section>'+
  '<section class="section card"><div class="section-heading"><div><h2>Additional demo detections</h2><p>Displayed as resolved or assigned; no duplicate questions.</p></div></div><div class="grid three">'+miniScope('Rounding convention','Mapped to existing point rules','complete')+miniScope('Weekend promotion date','Assigned to Program Coach','info')+miniScope('Excluded merchant codes','Retained as an evidence gap','warning')+'</div></section>';
}
function memoryPage(){
  var history=state.activity.map(function(a){return '<tr><td>'+esc(a.time)+'</td><td><b>'+esc(a.title)+'</b><br><span>'+esc(a.detail)+'</span></td><td>'+pill(a.title.indexOf('approved')>-1?'Approval':'Workspace','info')+'</td></tr>';}).join('');
  return pageHead('Versioned source of truth','Program Memory','The public demo persists a fictional workspace in this browser. Production requires a tenant-isolated database and server-side authorization.','<button class="btn" data-route="docsense">Open source evidence</button>')+
  currentTour()+
  '<section class="grid four">'+metric('Program version',esc(state.config.version),'Drafts retain a complete history',{kind:state.config.locked?'Locked':'Active draft',className:state.config.locked?'locked':'info'})+metric('Confirmed values',countConfirmed()+' / '+state.fields.length,'Human action required',{kind:'Audited',className:'confirmed'})+metric('Decisions saved',String(state.questions.filter(function(q){return q.answer;}).length),'Conflict answers are kept',{kind:'AskOnce',className:'info'})+metric('Activity events',String(state.activity.length),'Local demo audit trail',{kind:'Browser local',className:'demo'})+'</section>'+
  '<section class="section grid two"><div class="card"><div class="section-heading"><div><h2>Configuration versions</h2><p>Changes after approval require a new version and approval cycle.</p></div><button class="btn small" data-route="signoff">Open SignOff</button></div><div class="checklist">'+stepLine('0.1 Draft imported',true,'Source documents indexed and mapped.')+stepLine('0.2 Draft revision',state.config.multiplier===2,'Gold online multiplier proposal accepted.')+stepLine('1.0 Approved',state.config.locked,state.config.locked?'Version locked by Business Stakeholder.':'Awaiting validation, tests, and stakeholder approval.')+'</div></div><div class="card"><div class="section-heading"><div><h2>Field protections</h2><p>Demo permission model</p></div></div><div class="settings-list">'+settingsRow('AI suggestions','Can create Suggested values only.','Enforced in product design')+settingsRow('Confirmed fields','Need human change reason and approval.','Requires authorization')+settingsRow('Client isolation','Not represented by local storage.','Production requirement')+'</div></div></section>'+
  '<section class="section card"><div class="section-heading"><div><h2>Activity timeline</h2><p>What changed, why it changed, and when.</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Time</th><th>Event</th><th>Record</th></tr></thead><tbody>'+history+'</tbody></table></div></section>';
}
function rulecraftPage(){
  var proposed=state.config.proposal;
  var diff=proposed!==null?'<div class="diff"><div class="before"><span class="label">Before</span><b>'+esc(field('goldMultiplier').value)+'</b></div><strong>→</strong><div class="after"><span class="label">Proposed</span><b>'+esc(proposed)+'×</b></div></div><div class="button-row" style="margin-top:12px"><button class="btn primary" data-accept-proposal>Accept proposed edit</button><button class="btn" data-discard-proposal>Discard</button></div>':'<div class="notice">Natural-language changes create a structured proposal. They never alter a rule automatically.</div>';
  return pageHead('Reviewable rule edits','RuleCraft','Build an earning rule visually or turn a clear request into a proposed structured diff.','<button class="btn" data-route="ruleguard">Open RuleGuard</button>')+
  currentTour()+
  '<section class="grid two"><div class="card"><div class="section-heading"><div><h2>Visual rule builder</h2><p>Gold online electronics rule</p></div>'+pill(state.config.locked?'Locked':'Draft',state.config.locked?'locked':'info')+'</div><div class="rule-builder"><div class="rule-line"><span class="logic">IF</span><div><b>Purchase channel</b><br><span>equals Online</span></div><button class="btn small">Edit</button></div><div class="rule-line"><span class="logic">AND</span><div><b>Purchase category</b><br><span>equals Electronics</span></div><button class="btn small">Edit</button></div><div class="rule-line"><span class="logic">AND</span><div><b>Member tier</b><br><span>equals Gold</span></div><button class="btn small">Edit</button></div><div class="rule-line"><span class="logic">THEN</span><div><b>Award '+esc(state.config.multiplier)+'× base points</b><br><span>Maximum '+esc(state.config.cap.toLocaleString('en-IN'))+' points per transaction</span></div><button class="btn small">Edit</button></div></div></div><div class="card"><h2>Plain-language edit</h2><p>Demo AI adapter: it identifies a known rule and produces a structured change request. It cannot apply the change by itself.</p><label class="label" for="rule-request">Requested change</label><textarea id="rule-request" rows="4">Change the Gold online earning multiplier from 1.5 to 2.</textarea><div class="button-row" style="margin-top:12px"><button class="btn primary" data-propose>Edit preview</button><button class="btn" data-route="dryrun">View test impact</button></div>'+diff+'</div></section>'+
  '<section class="section grid two"><div class="card"><h3>Before applying</h3><div class="checklist">'+stepLine('Target rule identified',true,'Gold online electronics earning rule.')+stepLine('Structured diff generated',proposed!==null,'Shows one value change only.')+stepLine('RuleGuard scheduled',state.validationRan,'Run deterministic validation after acceptance.')+'</div></div><div class="card"><h3>AI guardrails</h3><p>Never invent a threshold, multiplier, cap, or date. Never directly publish a configuration. Ambiguous instructions should create a clarification question.</p><div class="notice">Changing an approved configuration creates a new draft in a production workflow. This demo blocks edits after the version is locked.</div></div></section>';
}
function ruleguardPage(){
  var issues=validation();
  var rows=issues.map(function(x){var k=x.severity==='Critical'?'critical':x.severity==='Warning'?'warning':'info';return '<div class="validation-row"><div>'+pill(x.severity,k)+'</div><div><b>'+esc(x.rule)+'</b><p>'+esc(x.text)+'</p></div><a href="#" data-route="'+x.route+'">'+esc(x.action)+' →</a></div>';}).join('');
  return pageHead('Deterministic configuration checks','RuleGuard','Rules-based checks catch conflicts, missing values, invalid ranges, and unsupported configurations before approval.','<button class="btn primary" data-run-validation>Run validation</button>')+
  currentTour()+
  '<section class="grid four">'+metric('Critical',String(criticalCount()),'Blocks approval',{kind:criticalCount()?'Blocking':'Clear',className:criticalCount()?'critical':'complete'})+metric('Warnings',String(issues.filter(function(i){return i.severity==='Warning';}).length),'Needs a release plan',{kind:'Production dependency',className:'warning'})+metric('Coverage','3 tiers · 4 rules','Demo schema coverage',{kind:'Deterministic',className:'info'})+metric('Last scan',state.validationRan?'Just now':'Not run','Checks must not be skipped',{kind:state.validationRan?'Complete':'Action needed',className:state.validationRan?'complete':'warning'})+'</section>'+
  '<section class="section card"><div class="section-heading"><div><h2>Validation results</h2><p>Approval stays blocked while critical results remain.</p></div>'+pill(state.validationRan?'Scan complete':'Awaiting run',state.validationRan?'complete':'warning')+'</div>'+rows+'</section>'+
  '<section class="section grid two"><div class="card"><h3>Checks represented</h3><p>Required thresholds, valid numeric ranges, overlap detection, unreachable tiers, maximum points caps, stacking conflicts, effective dates, and supported conditions.</p><div class="notice">This prototype evaluates the shown demo schema. It does not report a clean production validation result for checks it cannot run.</div></div><div class="card"><h3>Release safeguard</h3><p>DryRun parity with the production rules engine remains a mandatory gate. The public adapter is explicitly not the live GRAVTY rules engine.</p><button class="btn" data-route="dryrun">Run DryRun</button></div></section>';
}
function dryrunPage(){
  var c=calculation();
  var tests=state.tests.ran?'<div class="checklist">'+stepLine('Normal online purchase',true,'Expected '+c.points+' points.')+stepLine('Threshold minus one',true,'Gold threshold boundary.')+stepLine('Threshold equals value',true,'Qualification condition.')+stepLine('Threshold plus one',true,'Tier transition check.')+stepLine('Maximum cap reached',true,'Cap stops excess points.')+stepLine('Excluded purchase',true,'No points awarded.')+'</div>':'<div class="empty">Run the scenario to create the deterministic trace and refresh test evidence.</div>';
  var result=state.tests.ran?'<div class="trace"><b>DETERMINISTIC EXECUTION TRACE</b>\nMember: Gold · qualifying spend ₹'+Number(state.simulation.spend).toLocaleString('en-IN')+'\nTransaction: ₹'+Number(state.simulation.amount).toLocaleString('en-IN')+' · '+esc(state.simulation.channel)+' · '+esc(state.simulation.category)+'\nMatched rule: Gold online electronics\nBase: floor(₹'+Number(state.simulation.amount).toLocaleString('en-IN')+' / ₹100) × 10 = '+c.base+' points\nMultiplier: '+state.config.multiplier+'×\nRaw points: '+c.raw+'\nCap: '+state.config.cap.toLocaleString('en-IN')+'\nFinal points: <b>'+c.points+'</b>\nUpdated qualifying spend: ₹'+c.updated.toLocaleString('en-IN')+'\nTier outcome: <b>'+c.tier+'</b></div>':'<div class="notice">DryRun results come from deterministic code. AI may explain a trace but cannot invent the numerical outcome.</div>';
  return pageHead('Sandbox rule execution','DryRun','Test a synthetic member and purchase before sign-off. The adapter is replaceable and clearly labelled as a public demo.','<button class="btn" data-route="signoff">Open SignOff Hub</button>')+
  currentTour()+
  '<section class="grid two"><div class="card"><div class="section-heading"><div><h2>Test scenario</h2><p>Fictional member and purchase data</p></div>'+pill('Demo engine','demo')+'</div><div class="grid two"><label><span class="label">Annual qualifying spend</span><input data-spend type="number" value="'+esc(state.simulation.spend)+'"></label><label><span class="label">Transaction amount</span><input data-amount type="number" value="'+esc(state.simulation.amount)+'"></label><label><span class="label">Channel</span><select data-channel><option>Online</option><option>In-store</option></select></label><label><span class="label">Category</span><select data-category><option>Electronics</option><option>Travel</option></select></label></div><div class="button-row" style="margin-top:15px"><button class="btn primary" data-run-dryrun>Run simulation</button><button class="btn" data-route="rulecraft">Edit rule</button></div></div><div class="card"><span class="label">Expected result</span><div class="metric-value">'+(state.tests.ran?c.points:'—')+' points</div><p>Gold member · ₹'+Number(state.simulation.spend).toLocaleString('en-IN')+' qualifying spend · '+state.config.multiplier+'× multiplier</p><div class="grid two">'+miniScope('Updated spend','₹'+c.updated.toLocaleString('en-IN'),c.tier==='Platinum'?'complete':'info')+miniScope('Tier transition','Gold → '+c.tier,c.tier==='Platinum'?'complete':'info')+'</div></div></section>'+
  '<section class="section grid two"><div class="card"><h2>Execution trace</h2>'+result+'</div><div class="card"><div class="section-heading"><div><h2>Test coverage</h2><p>Each earning rule needs at least one passing test.</p></div>'+pill(state.tests.ran?state.tests.passed+'/'+state.tests.total+' pass':'Not run',state.tests.ran?'pass':'warning')+'</div>'+tests+'</div></section>';
}
function signoffPage(){
  var issues=criticalCount(), status=state.config.locked?'This version is locked. Any production change would create a new approval workflow.':canApprove()?'Ready for stakeholder approval.':'Complete the required checks before approval.';
  var approval=state.config.locked?'<div class="notice">Approved '+esc(state.config.approvedAt)+' by Business Stakeholder. Version '+esc(state.config.version)+' is locked.</div>':'<button class="btn primary" data-approve '+(canApprove()?'':'disabled')+'>Review and approve version</button>';
  return pageHead('Formal approval workflow','SignOff Hub','Draft → Validation → Testing → Review → Approval → Locked. Role permissions apply to the public demo interactions.','<button class="btn" data-route="memory">Open version history</button>')+
  currentTour()+
  '<section class="card"><div class="section-heading"><div><h2>Current role</h2><p>Approval requires a Business Stakeholder. Editors can confirm fields, answer questions, and run tests.</p></div>'+pill(state.role,state.role==='Business Stakeholder'?'approved':'info')+'</div><div class="role-grid">'+['Loyalty Program Manager','Client Implementation Lead','Business Stakeholder','GRAVTY Program Coach'].map(function(r){return '<button class="role '+(state.role===r?'active':'')+'" data-role="'+r+'">'+r+'</button>';}).join('')+'</div></section>'+
  '<section class="section grid two"><div class="card"><div class="section-heading"><div><h2>Approval readiness</h2><p>'+esc(status)+'</p></div>'+pill(state.config.locked?'Locked':canApprove()?'Ready':'In progress',state.config.locked?'locked':canApprove()?'complete':'warning')+'</div><div class="checklist">'+stepLine('All draft fields confirmed',countConfirmed()===state.fields.length,countConfirmed()+' of '+state.fields.length+' confirmed')+stepLine('Open questions resolved',questionsOpen()===0,questionsOpen()?'AskOnce decision required':'All decisions saved')+stepLine('No critical validation errors',issues===0,issues?'RuleGuard found '+issues+' blocking item(s)':'RuleGuard allows progression')+stepLine('DryRun tests passing',state.tests.ran,state.tests.ran?state.tests.passed+' of '+state.tests.total+' passed':'Run deterministic test')+'</div><div class="button-row" style="margin-top:16px">'+approval+'</div></div><div class="card"><h2>Version summary</h2><div class="settings-list">'+settingsRow('Version',state.config.version,'Configuration state')+settingsRow('Validation',issues===0?'No critical errors':'Blocking errors remain',state.validationRan?'Last run just now':'Not yet run')+settingsRow('Test evidence',state.tests.ran?state.tests.passed+'/'+state.tests.total+' passing':'Not run','DryRun adapter')+settingsRow('Outstanding questions',String(questionsOpen()),'AskOnce')+'</div><div class="notice">Business Stakeholders can review, comment, approve, or request changes. They cannot edit rules.</div></div></section>'+
  '<section class="section card"><h2>Stakeholder comment</h2><p>“Gold online multiplier revised to 2× after a documented commercial decision. DryRun shows 400 points for the test case.”</p><div class="button-row"><button class="btn small">Request changes</button><button class="btn small">Add comment</button></div></section>';
}
function analyticsPage(){
  var demoApproved=state.config.locked?'Approved':'In progress';
  var rows=[
    ['Client experience','Time to approved setup','Workspace created → client approval','15.6 weeks','≤ 4 weeks','1.2 weeks','Program Memory · PM · weekly'],
    ['Client experience','Clarification rounds','Question batches + coach exchanges','9','≤ 3','1','Program Memory · PM · per client'],
    ['Client experience','Repeat explanations','Questions that restate a confirmed value','Awaiting alpha','0 AI re-asks','0','Event log · UX lead · monthly'],
    ['Adoption','Self-serve start rate','New clients starting in LaunchPad ÷ new clients','0%','≥ 80% at GA','Demo only','CRM · Delivery head · monthly'],
    ['Quality','Test coverage','Earning rules with ≥1 passing DryRun test','0%','100%',''+(state.tests.ran?'100%':'0%'),'DryRun · PM · per client'],
    ['Quality','Extraction accuracy','Correct High-confidence fields ÷ High-confidence fields','Back-test','≥ 98%','Awaiting alpha','Golden set · AI lead · per release'],
    ['Business outcome','Client-configured share','Objects with no engineering edit ÷ approved objects','≈ 0%','≥ 70%',demoApproved,'Program Memory · PM · per client'],
    ['Business outcome','Time to go-live','Contract signed → live','26 weeks','10 weeks','Not measured','Delivery tracker · VP Delivery']
  ];
  var table=rows.map(function(r){return '<tr><td>'+esc(r[0])+'</td><td><b>'+esc(r[1])+'</b></td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td><td>'+esc(r[4])+'</td><td>'+pill(r[5],r[5].indexOf('Awaiting')>-1||r[5]==='Not measured'?'warning':r[5]==='Demo only'?'demo':'info')+'</td><td>'+esc(r[6])+'</td></tr>';}).join('');
  return pageHead('Success metrics','Analytics','Every current figure is marked as a fictional demo value, awaiting alpha measurement, or an explicit case baseline.','<button class="btn" data-route="impact">View business impact</button>')+
  currentTour()+
  '<section class="grid four">'+metric('Approved setup',state.config.locked?'1.2 weeks':'In progress','Demo calculation only',{kind:'Current demo',className:'demo'})+metric('Clarification rounds','1','Target ≤ 3',{kind:'Current demo',className:'demo'})+metric('Test coverage',state.tests.ran?'100%':'0%','Target 100%',{kind:state.tests.ran?'On track':'Not run',className:state.tests.ran?'complete':'warning'})+metric('Client-configured share',state.config.locked?'100%':'0%','Demo workspace only',{kind:'Not customer performance',className:'demo'})+'</section>'+
  '<section class="section card"><div class="section-heading"><div><h2>Metric catalogue</h2><p>Baselines, targets, formulas, sources, owners, and reporting rhythm.</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Level</th><th>Metric</th><th>Definition</th><th>Baseline</th><th>Target</th><th>Current demo</th><th>Source · owner · frequency</th></tr></thead><tbody>'+table+'</tbody></table></div><div class="notice">If repeat explanations fall but clarification rounds do not, the delay may sit elsewhere, such as stakeholder approval. Alpha back-testing establishes missing baselines before targets are fixed.</div></section>';
}
function impactPage(){
  var key=state.activeScenario,s=scenarios[key];
  var buttons=Object.keys(scenarios).map(function(k){return '<button class="'+(key===k?'active':'')+'" data-scenario="'+k+'">'+scenarios[k].label+'</button>';}).join('');
  var max=6.33;
  return pageHead('Three-year commercial model','Business Impact','Bundle LaunchPad into the platform subscription. All inputs are assumptions to validate with Finance and Sales.','<button class="btn" data-route="launch">Open launch gates</button>')+
  '<section class="card"><div class="section-heading"><div><h2>Scenario comparison</h2><p>Extra impact versus no LaunchPad product, USD millions.</p></div>'+pill('Assumptions', 'warning')+'</div><div class="scenario-tabs">'+buttons+'</div><div class="grid four section">'+metric('3-year revenue impact','$'+s.revenue.toFixed(2)+'M','Earlier billing + extra go-lives + lost fees',{kind:s.label+' case',className:'info'})+metric('Development + enablement','$'+s.development.toFixed(2)+'M','One-off assumption',{kind:'Cost',className:'warning'})+metric('Running cost','$'+s.running.toFixed(2)+'M','Three years',{kind:'Cost',className:'warning'})+metric('3-year net',(s.net>=0?'+':'')+'$'+s.net.toFixed(2)+'M','Year-three net '+(s.year3>=0?'+':'')+'$'+s.year3.toFixed(2)+'M',{kind:s.net>=0?'Upside':'Downside',className:s.net>=0?'complete':'critical'})+'</div></section>'+
  '<section class="section grid two"><div class="card"><h2>'+esc(s.label)+' case drivers</h2><div class="settings-list">'+settingsRow('New clients annually',s.clients,'Assumption')+settingsRow('Average contract value',s.acv,'Assumption')+settingsRow('Adoption, Year 1 to Year 3',s.adoption,'Assumption')+settingsRow('Weeks saved per client',s.weeks,'Assumption')+settingsRow('Additional go-lives, Y1/Y2/Y3',s.goLives,'Assumption')+'</div></div><div class="card"><h2>Revenue components</h2><div class="bar-chart">'+barItem('Earlier billing','$'+s.billing.toFixed(2)+'M',s.billing/max*100,'')+barItem('Extra go-lives','$'+s.extra.toFixed(2)+'M',Math.abs(s.extra)/max*100,'blue')+barItem('Lost effort fees','$'+s.lost.toFixed(2)+'M',Math.abs(s.lost)/max*100,s.lost<0?'red':'yellow')+'</div><div class="notice">Freed engineering capacity supports extra go-lives. The model does not count it again as cost savings.</div></div></section>'+
  '<section class="section grid two"><div class="card"><h2>Commercial model</h2><p><b>Chosen:</b> bundle LaunchPad into the platform subscription to reduce adoption friction and support the 70% configuration goal.</p><p><b>Rejected:</b> a separate add-on fee, which could slow adoption.</p><p><b>Strategic change:</b> fixed-fee launch packages can turn faster delivery into implementation margin.</p></div><div class="card"><h2>Base-case sensitivity</h2><div class="bar-chart">'+barItem('ACV $150k','$1.79M',53,'yellow')+barItem('Base ACV $250k','$2.58M',77,'')+barItem('ACV $350k','$3.37M',100,'blue')+barItem('No extra go-lives','$0.85M',25,'red')+'</div></div></section>';
}
function launchPage(){
  var phases=[
    ['1. Alpha & back-test','Weeks 0–4','Run DocSense on 20–30 past onboardings and shadow 2–3 live programs while engineers continue normal configuration.','Gate A: ≥98% high-confidence accuracy · DryRun matches production 100% · zero data leaks'],
    ['2. Design-partner pilot','Weeks 4–16','3–5 standard programs. Program Coaches work inside the workspace. Fixed launch price, no extra fee.','Gate B: ≥60% client-configured · approval ≤5 weeks · ≤3 rounds · zero critical defects'],
    ['3. Controlled beta','Months 4–6','All standard new clients start in LaunchPad. Complex rules stay with coaches inside the workspace.','Gate C: ≥70% client-configured · go-live ≤10–12 weeks · defects no higher than baseline'],
    ['4. General availability','Month 6 onward','Default onboarding path for new clients; later extend to program changes for existing clients.','Scale only after the gates pass']
  ];
  var risks=[
    ['Integration becomes the bottleneck','20 → 12','Integration plan exceeds 8 weeks by week 2','Start setup on day 1 in parallel; joint Delivery plan','2 of 3 pilots approve in ≤4 weeks but go-live exceeds 14 weeks'],
    ['DocSense causes incorrect points','15 → 8','Any high-confidence back-test error','Quote check, calibrated confidence, DryRun coverage, coach review','<98% accuracy blocks pilot; any production defect pauses release'],
    ['Clients keep emailing engineers','16 → 8','<50% client edits by week 2','Coach works in workspace; workspace becomes agreed channel','Pilot self-config <50% triggers co-pilot redesign'],
    ['Supported schema cannot map enough rules','12 → 6','High unmapped share in back-test','Coverage check before pilot; keep complex programs out','<75% of past rules map'],
    ['DryRun differs from production','15 → 5','Any parity mismatch','Use the production engine and nightly parity tests','Any mismatch blocks release']
  ];
  return pageHead('Gate-based rollout','Launch Control','A missed gate keeps the product in the current phase. This is a conditional launch plan, not an unconditional date.','<button class="btn" data-route="settings">Review safeguards</button>')+
  '<section class="roadmap">'+phases.map(function(p){return '<article class="phase"><h3>'+esc(p[0])+'</h3><div class="time">'+esc(p[1])+'</div><p>'+esc(p[2])+'</p><div class="gate">'+esc(p[3])+'</div></article>';}).join('')+'</section>'+
  '<section class="section grid two"><div class="card"><h2>Pilot fit</h2><div class="grid two">'+miniScope('Include','Spend-based earning, five or fewer tiers, one currency, Excel/Word documentation, a program manager with four hours per week, executive sponsor, flexible date','complete')+miniScope('Keep out of the first pilot','Airline flight qualification, coalition earnings, multi-currency, status matching, hard launch deadlines','warning')+'</div></div><div class="card"><h2>Enablement plan</h2><p><b>Sales:</b> “Test your program before you sign off.” Promise ten weeks only after Gate C.</p><p><b>Engineers:</b> become Program Coaches, measured on programs live rather than configs built.</p><p><b>Clients:</b> kickoff, guided first upload, weekly office hours, and a workspace link for changes after two-week grace.</p></div></section>'+
  '<section class="section card"><div class="section-heading"><div><h2>Risk register</h2><p>Pre-mortem controls and stop-or-redesign thresholds.</p></div>'+pill('Conditional Go','warning')+'</div>'+risks.map(function(r){return '<div class="risk"><div><b>'+esc(r[0])+'</b><p>Early warning: '+esc(r[2])+'</p></div><div>'+pill(r[1],'warning')+'</div><div><b>Prevention / fallback</b><p>'+esc(r[3])+'</p></div><div><b>Stop or redesign if</b><p>'+esc(r[4])+'</p></div></div>';}).join('')+'<div class="notice warning">Zero tolerance: any cross-client data leak stops the product. This public demo has no client data and no cross-client backend.</div></section>'+
  '<section class="section hero"><span class="eyebrow">Recommendation</span><h2>Conditional Go</h2><p>Fund the build and a 3–5 client pilot now. Scale only when at least 75% of past rules fit supported patterns, high-confidence extraction reaches 98%, clients accept ownership with Coach support, integration runs in parallel, and DryRun uses the production rules engine.</p><div class="notice">No-regret fallback: if clients do not adopt self-service, the same tools can still reduce engineering configuration effort.</div></section>';
}
function settingsRow(title,value,note){return '<div class="settings-row"><div><h4>'+esc(title)+'</h4><p>'+esc(note)+'</p></div><div>'+esc(value)+'</div></div>';}
function settingsPage(){
  return pageHead('Demo boundaries and controls','Settings','Review safety limitations, choose a demo role, or reset the fictional local workspace.','<button class="btn danger" data-reset>Reset demo data</button>')+
  '<section class="grid two"><div class="card"><h2>AI and data safeguards</h2><div class="settings-list">'+settingsRow('Document instructions','Treated as untrusted content','Never follow instructions embedded in uploaded program documents')+settingsRow('Suggested values','Require human confirmation','AI cannot approve or publish configuration')+settingsRow('Data training','Disabled in public demo','Uploaded material is not used for training')+settingsRow('Workspace isolation','Not provided by local storage','Production requires server-side tenant isolation')+settingsRow('Credentials','None stored','This prototype has no external AI or GRAVTY connection')+'</div></div><div class="card"><h2>Public demo adapter</h2><p>DocSense content is deterministic fictional data. Text and CSV uploads receive a small in-browser scan. PDF, DOCX, and XLSX metadata can enter the intake list but their contents are not parsed.</p><p>DryRun uses transparent deterministic calculation code and a replaceable adapter. It must be replaced by the production rules engine before a real approval workflow.</p><div class="notice">Upload limits, malware scanning, rate limits, schema validation, authentication, RBAC, audit retention, and secure API keys are production requirements.</div></div></section>'+
  '<section class="section grid two"><div class="card"><h2>Demo data</h2><p>Reset clears only this browser’s fictional local workspace and restores the Northstar Rewards scenario.</p><div class="button-row"><button class="btn danger" data-reset>Reset Demo Data</button><button class="btn" data-export>Download activity record</button></div></div><div class="card"><h2>Role permissions</h2><p>Client roles can edit, confirm, answer, and test. Business Stakeholders can review and approve but cannot edit rules. This interface demonstrates permissions; production enforcement must occur server-side.</p><button class="btn" data-route="signoff">Open role controls</button></div></section>';
}
function bind(){
  document.querySelectorAll('[data-route]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();state.route=b.getAttribute('data-route');save();render();});});
  var start=document.querySelector('[data-tour-start]');if(start)start.addEventListener('click',function(){state.tourStep=0;state.route='overview';save();render();});
  document.querySelectorAll('[data-tour-next]').forEach(function(b){b.addEventListener('click',nextTour);});
  document.querySelectorAll('[data-confirm]').forEach(function(b){b.addEventListener('click',function(){if(!isAuthor()){toast('Your role cannot confirm configuration fields.');return;}var f=field(b.getAttribute('data-confirm'));if(f){f.status='Confirmed';addActivity('Field confirmed',f.label+' confirmed by '+state.role+'.');if(state.tourStep===1)state.tourStep=2;save();render();toast('Field confirmed and recorded.');}});});
  document.querySelectorAll('[data-edit]').forEach(function(b){b.addEventListener('click',function(){if(!isAuthor()){toast('Your role cannot edit fields.');return;}toast('Demo edit workflow requires a reason and new approval in production.');});});
  document.querySelectorAll('[data-reject]').forEach(function(b){b.addEventListener('click',function(){var f=field(b.getAttribute('data-reject'));if(f){f.status='Rejected';addActivity('Draft field rejected',f.label+' rejected by '+state.role+'.');save();render();toast('Draft rejected. Reset demo to restore the tour.');}});});
  document.querySelectorAll('[data-answer]').forEach(function(b){b.addEventListener('click',function(){if(!isAuthor()){toast('Your role cannot resolve questions.');return;}var q=state.questions[0],a=b.getAttribute('data-answer');if(a==='Other'){toast('Other requires a documented rationale in the production workflow.');return;}q.answer=a;q.by=state.role;q.at='Today · '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});state.config.multiplier=parseFloat(a);var f=field('goldMultiplier');f.value=a;f.status='Confirmed';f.source='AskOnce decision · '+q.a;f.quote='Human-selected from cited source options.';state.validationRan=false;state.tests.ran=false;addActivity('AskOnce decision saved','Gold online multiplier set to '+a+' by '+state.role+'.');if(state.tourStep===2)state.tourStep=3;save();render();toast('Decision saved to Program Memory.');});});
  var input=document.getElementById('upload-input');
  if(input)input.addEventListener('change',function(){Array.prototype.forEach.call(input.files,function(file){if(state.docs.length>=20)return;var ext=(file.name.split('.').pop()||'FILE').toUpperCase();state.docs.push({name:file.name,type:ext,size:Math.max(.1,file.size/1024/1024).toFixed(1)+' MB',status:(ext==='TXT'||ext==='CSV')?'Text evidence scanned':'Metadata received'});});addActivity('Documents added','Files entered the public demo intake.');save();render();toast('Documents added to the demo intake.');});
  var propose=document.querySelector('[data-propose]');if(propose)propose.addEventListener('click',function(){if(!isAuthor()||state.config.locked){toast('This role cannot propose a rule change.');return;}state.config.proposal=2;addActivity('RuleCraft proposal created','Gold online multiplier proposal: '+state.config.multiplier+'× to 2×.');save();render();toast('Structured edit preview created.');});
  var accept=document.querySelector('[data-accept-proposal]');if(accept)accept.addEventListener('click',function(){if(!isAuthor()||state.config.locked){toast('This role cannot accept a rule change.');return;}state.config.multiplier=state.config.proposal;field('goldMultiplier').value=state.config.proposal+'×';field('goldMultiplier').source='RuleCraft revision · human accepted';field('goldMultiplier').quote='Proposed change accepted by '+state.role+'.';state.config.proposal=null;state.config.version='0.2 Draft';state.tests.ran=false;state.validationRan=false;addActivity('RuleCraft revision accepted','Gold online multiplier updated to 2×; test evidence marked stale.');if(state.tourStep===3)state.tourStep=4;save();render();toast('Rule updated. Run validation and DryRun again.');});
  var discard=document.querySelector('[data-discard-proposal]');if(discard)discard.addEventListener('click',function(){state.config.proposal=null;save();render();toast('Proposed edit discarded.');});
  var validateButton=document.querySelector('[data-run-validation]');if(validateButton)validateButton.addEventListener('click',function(){state.validationRan=true;addActivity('RuleGuard validation completed',criticalCount()+' critical issue(s) found in the current draft.');if(state.tourStep===4)state.tourStep=5;save();render();toast('Deterministic validation completed.');});
  ['spend','amount','channel','category'].forEach(function(k){var n=document.querySelector('[data-'+k+']');if(n)n.addEventListener('change',function(){state.simulation[k]=k==='spend'||k==='amount'?Math.max(0,Number(n.value)):n.value;state.tests.ran=false;save();render();});});
  var run=document.querySelector('[data-run-dryrun]');if(run)run.addEventListener('click',function(){state.tests={ran:true,passed:9,total:9,lastRun:'Just now'};addActivity('DryRun tests passed','9 of 9 deterministic demo tests passed for version '+state.config.version+'.');if(state.tourStep===5)state.tourStep=6;save();render();toast('Simulation complete. Trace and test evidence recorded.');});
  document.querySelectorAll('[data-role]').forEach(function(b){b.addEventListener('click',function(){state.role=b.getAttribute('data-role');save();render();toast('Role switched to '+state.role+'.');});});
  var approve=document.querySelector('[data-approve]');if(approve)approve.addEventListener('click',openApproveModal);
  document.querySelectorAll('[data-scenario]').forEach(function(b){b.addEventListener('click',function(){state.activeScenario=b.getAttribute('data-scenario');save();render();});});
  document.querySelectorAll('[data-reset]').forEach(function(b){b.addEventListener('click',openResetModal);});
  var exp=document.querySelector('[data-export]');if(exp)exp.addEventListener('click',exportActivity);
}
function openApproveModal(){
  if(!canApprove()){toast('Approval is gated by confirmation, decisions, validation, test evidence, and stakeholder role.');return;}
  document.getElementById('modal-root').innerHTML='<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="approve-title"><h2 id="approve-title">Approve version '+esc(state.config.version)+'?</h2><p>This locks the current demo configuration. A later change would require a new version and review cycle.</p><div class="button-row"><button class="btn" data-modal-close>Cancel</button><button class="btn primary" data-modal-approve>Approve and lock</button></div></section></div>';
  document.querySelector('[data-modal-close]').addEventListener('click',closeModal);
  document.querySelector('[data-modal-approve]').addEventListener('click',function(){state.config.locked=true;state.config.version='1.0 Approved';state.config.approvedAt='Today · '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});addActivity('Configuration approved','Version 1.0 locked by Business Stakeholder.');if(state.tourStep===6)state.tourStep=7;save();closeModal();render();toast('Version approved and locked.');});
}
function openResetModal(){
  document.getElementById('modal-root').innerHTML='<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="reset-title"><h2 id="reset-title">Reset the demo workspace?</h2><p>This removes only the fictional Northstar Rewards state stored in this browser and restores the original guided scenario.</p><div class="button-row"><button class="btn" data-modal-close>Cancel</button><button class="btn danger" data-modal-reset>Reset demo data</button></div></section></div>';
  document.querySelector('[data-modal-close]').addEventListener('click',closeModal);
  document.querySelector('[data-modal-reset]').addEventListener('click',function(){state=initialState();save();closeModal();render();toast('Demo data reset.');});
}
function closeModal(){document.getElementById('modal-root').innerHTML='';}
function exportActivity(){
  var text=state.activity.map(function(a){return a.time+' | '+a.title+' | '+a.detail;}).join('\n');
  var blob=new Blob([text],{type:'text/plain'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='northstar-launchpad-activity.txt';a.click();URL.revokeObjectURL(url);toast('Activity record downloaded.');
}
function render(){renderShell();bind();}
render();
}());
