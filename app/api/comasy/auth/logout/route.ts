import {NextRequest,NextResponse} from "next/server";
import {CUSTOMER_COOKIE_NAME} from "@/lib/comasyAuth";
import {getSession,invalidateSession,SESSION_COOKIE_NAME} from "@/lib/auth/session";
export async function POST(request:NextRequest){
 const session=await getSession();if(session)await invalidateSession(session.sessionId);
 const response=NextResponse.redirect(new URL("/comasy/dashboard/login",request.url),303);
 for(const name of [CUSTOMER_COOKIE_NAME,SESSION_COOKIE_NAME])response.cookies.set(name,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
 return response;
}
