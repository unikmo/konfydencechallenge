import {escapeHtml,sendTransactionalEmail} from "./email";
export async function sendComasyInvitation(email:string,organizationName:string,link:string) {
 const configured=Boolean(process.env.TRANSACTIONAL_EMAIL_GATEWAY_URL||(process.env.NEXT_PUBLIC_CUSTOMER_HOSTED!=="1"&&process.env.BREVO_API_KEY));
 if(!configured)return {sent:false,error:"Email delivery is not configured. Share the participant link securely."};
 const sent=await sendTransactionalEmail({to:email,subject:organizationName+" invited you to Konfydence",html:"<p>Your organisation invited you to decision practice.</p><p><a href=\""+escapeHtml(link)+"\">Open your private participant page</a></p><p>Do not forward this private link. Your organisation administrator can see your participation and responses.</p>",tags:["comasy","participant-invitation"]});
 return sent?{sent:true,error:null}:{sent:false,error:"Email delivery failed. Share the participant link securely or retry."};
}
