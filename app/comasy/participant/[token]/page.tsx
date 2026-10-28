import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { pilotExpired } from "@/lib/comasyPlans";
export default async function ParticipantPage({params}:{params:Promise<{token:string}>}) {
 const {token}=await params;
 const p=await prisma.comasyParticipant.findUnique({where:{accessToken:token},include:{organization:{select:{name:true,pilotEndsAt:true}}}});
 if(!p||p.status==="DISABLED")notFound();
 const campaigns=await prisma.comasyCampaign.findMany({where:{organizationId:p.organizationId,OR:[{cohortId:null},{cohortId:p.cohortId||"__none__"}],status:{in:["ACTIVE","SCHEDULED","COMPLETED"]}},include:{responses:{where:{participantId:p.id},select:{scenarioId:true,score:true}}},orderBy:{createdAt:"asc"}});
 const expired=pilotExpired(p.organization);
 const done=campaigns.filter(c=>c.responses.length>=c.scenarioIds.split(",").filter(Boolean).length).length;
 return <main className="kg-state"><section className="kg-state-card" style={{width:"min(900px,100%)"}}><p className="k-kicker">{p.organization.name} / Your practice</p><h1>Hello, {p.firstName}</h1><p>{done} of {campaigns.length} assigned campaigns completed.</p><p>This private participant page shows your assignments and progress. Your organisation's administrators can see your participation and recorded decisions. Do not forward your link.</p>{expired?<p role="status">The free pilot has ended. Your progress remains available here.</p>:null}{!campaigns.length?<p>Your administrator has not assigned practice yet.</p>:null}{campaigns.map(c=>{const total=c.scenarioIds.split(",").filter(Boolean).length,completed=c.responses.length>=total;const available=!expired&&c.status!=="COMPLETED"&&(!c.scheduledAt||c.scheduledAt<=new Date());return <article key={c.id} style={{borderTop:"1px solid #ccc",paddingBlock:20}}><h2>{c.name}</h2><p>{c.designation} · {c.responses.length}/{total} decisions · {completed?"Completed":c.responses.length?"In progress":"Not started"}</p>{available&&!completed?<Link className="k-button" href={"/comasy/practice/"+token+"?campaign="+c.id} prefetch={false}>{c.responses.length?"Continue practice":"Start practice"}</Link>:null}{c.scheduledAt&&c.scheduledAt>new Date()?<p>Available from {c.scheduledAt.toISOString().slice(0,10)}</p>:null}</article>})}</section></main>;
}
