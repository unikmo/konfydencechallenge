import Link from "next/link";
import { getAccount } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
export default async function CoMaSyLoginPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
 const {error}=await searchParams;const account=await getAccount();
 const memberships=account?.emailVerifiedAt?await prisma.comasyAdministrator.findMany({where:{email:account.email,active:true},include:{organization:{select:{name:true,slug:true}}}}):[];
 return <main className="kg-state"><section className="kg-state-card"><Link href="/comasy">Konfydence / CoMaSy</Link><h1>Organisation administrator sign-in</h1><p>Use your named Konfydence account. Participants use their own invitation link and cannot access this dashboard.</p>{error?<p role="alert">Your account does not have administrator access to that workspace.</p>:null}{account?.emailVerifiedAt?<><p>Signed in as {account.email}</p>{memberships.length?<form method="post" action="/api/comasy/auth/login" className="kc-form"><label>Organisation workspace<select name="slug">{memberships.map(m=><option key={m.id} value={m.organization.slug}>{m.organization.name}</option>)}</select></label><button type="submit">Open admin dashboard</button></form>:<p>No administrator membership is assigned. Ask your organisation administrator or Konfydence account owner to add your verified email.</p>}</>:<Link className="k-button" href="/account/sign-in?next=/comasy/dashboard/login">Sign in with your email</Link>}</section></main>;
}
