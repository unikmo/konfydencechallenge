// Run against a disposable loopback database and app. Disable outbound mail in the app.
const assert=require('node:assert/strict');const {createHmac,createHash,randomUUID}=require('node:crypto');const {PrismaClient}=require('@prisma/client');
const url=process.env.TEST_DATABASE_URL,base=process.env.TEST_BASE_URL||'http://127.0.0.1:3037',secret=process.env.TEST_AUTH_SECRET;
if(!url||!secret||!['localhost','127.0.0.1'].includes(new URL(url).hostname)||!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('Disposable loopback TEST_DATABASE_URL, TEST_BASE_URL and TEST_AUTH_SECRET required');
const db=new PrismaClient({datasources:{db:{url}}});const suffix=randomUUID().slice(0,8),sessions=new Map();
function cookie(id){const payload=id+'.'+(Math.floor(Date.now()/1000)+3600);return 'comasy_org='+payload+'.'+createHmac('sha256',secret).update(payload).digest('base64url')+'; kf_session='+(sessions.get(id)||'');}
async function fixture(label){const email=label+'-'+suffix+'@example.invalid';const org=await db.comasyOrganization.create({data:{name:label+' '+suffix,slug:label+'-'+suffix,administrators:{create:{email,name:'Test administrator'}}}});const account=await db.account.create({data:{email,emailVerifiedAt:new Date()}});const token=randomUUID();await db.authSession.create({data:{id:createHash('sha256').update(token).digest('hex'),accountId:account.id,expiresAt:new Date(Date.now()+3600000)}});sessions.set(org.id,token);return org;}
async function post(path,values,id,headers={}){const body=new FormData();for(const[k,v]of Object.entries(values))for(const x of(Array.isArray(v)?v:[v]))body.append(k,String(x));return fetch(base+path,{method:'POST',headers:{origin:base,...(id?{cookie:cookie(id)}:{}),...headers},body,redirect:'manual'});}
const location=r=>r.headers.get('location')||'';
const draft={action:'create',title:'Supplier bank change '+suffix,prompt:'A supplier emails an urgent request to change bank details before today’s payment run.',lang:'en',hackKey:'H',answersA:'Change bank details immediately',answersB:'Call the supplier on a known number to verify',answersC:'Hold payment and ask a colleague',scoresA:0,scoresB:4,scoresC:2,explanation:'Verify bank changes through a known supplier contact before changing payment details.',proTip:'Use a previously known telephone number.',pauseKeys:'B,C',verificationKeys:'B',impulseKeys:'A'};
async function main(){
const org=await fixture('pilot'),other=await fixture('other');
assert.equal((await post('/api/comasy/scenarios',draft)).status,401);
assert.equal((await post('/api/comasy/scenarios',draft,org.id,{origin:'https://unrelated.example'})).status,403);
const foreignCookie=cookie(org.id).replace(sessions.get(org.id),sessions.get(other.id));assert.equal((await post('/api/comasy/scenarios',draft,org.id,{cookie:foreignCookie})).status,401);
assert.match(location(await post('/api/comasy/scenarios',{...draft,scoresA:4},org.id)),/error=/);
assert.match(location(await post('/api/comasy/scenarios',draft,org.id)),/saved=1/);
let scenario=await db.scenario.findFirstOrThrow({where:{organizationId:org.id}});assert.equal(scenario.publicationStatus,'DRAFT');
assert.match(location(await post('/api/comasy/scenarios',{...draft,action:'edit',scenarioId:scenario.id,title:'Reviewed supplier change '+suffix},org.id)),/saved=1/);
assert.match(location(await post('/api/comasy/scenarios',{action:'publish',scenarioId:scenario.id},other.id)),/error=/);
await post('/api/comasy/manage',{action:'create_campaign',name:'Draft excluded',scenarioIds:scenario.id,status:'DRAFT'},org.id);assert.equal(await db.comasyCampaign.count({where:{organizationId:org.id}}),0);
assert.match(location(await post('/api/comasy/scenarios',{action:'publish',scenarioId:scenario.id},org.id)),/saved=1/);
assert.match(location(await post('/api/comasy/scenarios',{...draft,action:'edit',scenarioId:scenario.id},org.id)),/error=/);
for(let i=1;i<12;i++)assert.match(location(await post('/api/comasy/scenarios',{...draft,title:'Custom scenario '+i+' '+suffix,lang:i%2?'de':'en'},org.id)),/saved=1/);
assert.match(location(await post('/api/comasy/scenarios',{...draft,title:'Thirteenth scenario'},org.id)),/error=/);
assert.equal(await db.scenario.count({where:{organizationId:org.id}}),12);
await post('/api/comasy/manage',{action:'evidence',dataHandlingConfirmed:'yes',pilotObjectives:'Practise supplier verification',evidenceOwner:'Security team'},org.id);
await post('/api/comasy/manage',{action:'start_pilot'},org.id);let updated=await db.comasyOrganization.findUniqueOrThrow({where:{id:org.id}});assert.equal(updated.pilotEndsAt.getTime()-updated.pilotStartedAt.getTime(),28*86400000);assert.equal((await db.comasyPilot.findFirstOrThrow({where:{organizationId:org.id}})).feeUsd,0);
const shared=[];for(let i=0;i<12;i++){const s=await db.scenario.create({data:{externalId:'PUBLIC-'+suffix+'-'+i,edition:'workplace',prompt:draft.prompt,title:'Existing company scenario '+i,answersA:draft.answersA,answersB:draft.answersB,answersC:draft.answersC,answersD:'',scoresA:0,scoresB:4,scoresC:2,scoresD:0,hackKey:'H'}});shared.push(s.id);}
await post('/api/comasy/manage',{action:'create_campaign',name:'Mixed library and own content',scenarioIds:[scenario.id,shared[0]],status:'ACTIVE',designation:'BASELINE'},org.id);
const campaign=await db.comasyCampaign.findFirstOrThrow({where:{organizationId:org.id}});
await post('/api/comasy/manage',{action:'create_campaign',name:'Over programme cap',scenarioIds:shared,status:'DRAFT'},org.id);assert.equal(await db.comasyCampaign.count({where:{organizationId:org.id}}),1);
await post('/api/comasy/manage',{action:'create_campaign',name:'Foreign content',scenarioIds:scenario.id,status:'DRAFT'},other.id);assert.equal(await db.comasyCampaign.count({where:{organizationId:other.id}}),0);
for(let i=0;i<20;i++)await post('/api/comasy/manage',{action:'create_participant',firstName:'Participant',lastName:String(i),email:'participant-'+suffix+'-'+i+'@example.invalid'},org.id);
assert.equal(await db.comasyParticipant.count({where:{organizationId:org.id}}),20);
await post('/api/comasy/manage',{action:'create_participant',firstName:'Over',lastName:'Limit',email:'over-'+suffix+'@example.invalid'},org.id);assert.equal(await db.comasyParticipant.count({where:{organizationId:org.id}}),20);
const participant=await db.comasyParticipant.findFirstOrThrow({where:{organizationId:org.id}});if(process.env.TEST_MAIL_GATEWAY){assert.ok(participant.invitationSentAt);assert.equal(participant.invitationError,null);}else{assert.equal(participant.invitationSentAt,null);assert.match(participant.invitationError,/not configured/);}
assert.equal((await fetch(base+'/comasy/participant/'+participant.accessToken)).status,200);
assert.equal((await post('/api/comasy/scenarios',draft,org.id,{cookie:'participant='+participant.accessToken})).status,401);
const recorded=await post('/api/comasy/practice/respond',{token:participant.accessToken,campaignId:campaign.id,scenarioId:scenario.id,selectedAnswerKey:'B'});assert.equal(recorded.status,303);assert.ok(location(recorded).startsWith('/comasy/practice/'));
const response=await db.comasyResponse.findFirstOrThrow({where:{organizationId:org.id}});assert.equal(response.score,4);assert.equal(response.pause,true);assert.equal(response.verification,true);
await post('/api/comasy/practice/respond',{token:participant.accessToken,campaignId:campaign.id,scenarioId:scenario.id,selectedAnswerKey:'A'});assert.equal(await db.comasyResponse.count({where:{organizationId:org.id}}),1);

let summary=await(await fetch(base+'/api/comasy/reports/summary',{headers:{cookie:cookie(org.id)}})).json();assert.equal(summary.withheld,true);
const people=await db.comasyParticipant.findMany({where:{organizationId:org.id},take:5});for(const p of people.slice(1))await post('/api/comasy/practice/respond',{token:p.accessToken,campaignId:campaign.id,scenarioId:scenario.id,selectedAnswerKey:'B'});
summary=await(await fetch(base+'/api/comasy/reports/summary',{headers:{cookie:cookie(org.id)}})).json();assert.equal(summary.withheld,false);assert.ok(!JSON.stringify(summary).includes('@'));assert.ok(!JSON.stringify(summary).includes(org.name));
for(const view of['overview','people','practice','scenarios','compliance','reports','settings'])assert.equal((await fetch(base+'/comasy/dashboard?view='+view,{headers:{cookie:cookie(org.id)}})).status,200);
const csv=await(await fetch(base+'/api/comasy/reports/csv?type=executive',{headers:{cookie:cookie(org.id)}})).text();assert.ok(csv.includes('Custom scenario decisions (report period)'));
assert.equal((await fetch(base+'/api/comasy/reports/pdf?type=compliance',{headers:{cookie:cookie(org.id)}})).status,200);
const admin=await db.comasyAdministrator.findFirstOrThrow({where:{organizationId:org.id}});
assert.match(location(await post('/api/comasy/manage',{action:'disable_admin',administratorId:admin.id},org.id)),/error=/);assert.equal((await db.comasyAdministrator.findUniqueOrThrow({where:{id:admin.id}})).active,true);
await assert.rejects(db.comasyAdministrator.update({where:{id:admin.id},data:{active:false}}));
await post('/api/comasy/manage',{action:'add_admin',name:'Second administrator',email:'second-'+suffix+'@example.invalid'},org.id);assert.equal(await db.comasyAdministrator.count({where:{organizationId:org.id,active:true}}),2);
await assert.rejects(db.scenario.update({where:{id:scenario.id},data:{prompt:'Changed after publication'}}));
await assert.rejects(db.comasyScenarioProfile.update({where:{scenarioId:scenario.id},data:{verificationKeys:'A'}}));
await post('/api/comasy/manage',{action:'disable_participant',participantId:participant.id},org.id);assert.equal((await fetch(base+'/comasy/participant/'+participant.accessToken)).status,404);
await db.comasyOrganization.update({where:{id:org.id},data:{pilotEndsAt:new Date(Date.now()-1000)}});
assert.match(location(await post('/api/comasy/scenarios',draft,org.id)),/error=/);
assert.equal((await post('/api/comasy/practice/respond',{token:people[1].accessToken,campaignId:campaign.id,scenarioId:shared[0],selectedAnswerKey:'B'})).status,403);
assert.equal((await fetch(base+'/api/comasy/reports/csv',{headers:{cookie:cookie(org.id)}})).status,200);
const basic='Basic '+Buffer.from('local-review:local-review-password').toString('base64');
for(const path of['/admin?view=pilots','/admin?view=accounts','/admin?view=scenarios','/admin?view=marketing','/admin/business'])assert.equal((await fetch(base+path,{headers:{authorization:basic}})).status,200);
await post('/api/admin/comasy',{action:'create_pilot',organizationId:org.id,plan:'FREE',feeUsd:1250},null,{authorization:basic});assert.equal((await db.comasyPilot.findFirstOrThrow({where:{organizationId:org.id}})).feeUsd,0);
for(const path of['/pricing','/de/pricing','/comasy/pilot','/de/comasy/pilotprojekt']){const r=await fetch(base+path);assert.equal(r.status,200);const html=await r.text();assert.ok(!html.includes('$1,250'));assert.ok(!html.includes('$499'));}
const leadResult=await post('/api/comasy/pilot',{firstName:'Local',lastName:'Test',workEmail:'lead-'+suffix+'@example.invalid',organization:'Lead test '+suffix,role:'IT',organizationSize:'<250',primaryObjective:'Evaluate CoMaSy',consent:'yes',pilotPlan:'FREE'});if(process.env.TEST_CUSTOMER_HOSTED === "1"){assert.equal(leadResult.status,403);}else{assert.equal(leadResult.status,303);const lead=await db.comasyLead.findFirstOrThrow({where:{workEmail:'lead-'+suffix+'@example.invalid'}});assert.equal(lead.requestedPlan,'FREE');assert.equal(await db.comasyAdministrator.count({where:{organizationId:lead.organizationId}}),0); }
console.log('PASS: named-admin isolation, last-admin protection, free 28-day pilot, 20 participant and 12 scenario caps, self-authoring, mixed campaign library, invitations, participant-only access, revocation, expiry, summaries, evidence, reports and free EN/DE pricing.');console.log('Review organisation: '+org.id);
console.log('Review admin: '+admin.email);
if(process.env.TEST_CUSTOMER_HOSTED==='1'){const response=await fetch(base+'/comasy/dashboard/login');const html=await response.text();assert.ok(!html.includes('googletagmanager.com/gtag/js'));assert.ok(!response.headers.get('content-security-policy').includes('google'));}

}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>db.$disconnect());
