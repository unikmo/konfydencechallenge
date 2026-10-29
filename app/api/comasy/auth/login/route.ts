import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerSessionCookie } from "@/lib/comasyAuth";
import { getAccount } from "@/lib/auth/session";
export async function POST(request: NextRequest) {
 const account = await getAccount();
 if (!account?.emailVerifiedAt) return NextResponse.redirect(new URL("/account/sign-in?next=/comasy/dashboard/login",request.url),303);
 const form=await request.formData();
 const slug=String(form.get("slug")||"").trim().toLowerCase();
 const admin=await prisma.comasyAdministrator.findFirst({where:{email:account.email,active:true,organization:{slug}},select:{organizationId:true}});
 if(!admin) return NextResponse.redirect(new URL("/comasy/dashboard/login?error=1",request.url),303);
 const c=customerSessionCookie(admin.organizationId);const r=NextResponse.redirect(new URL("/comasy/dashboard",request.url),303);r.cookies.set(c.name,c.value,c.options);return r;
}
