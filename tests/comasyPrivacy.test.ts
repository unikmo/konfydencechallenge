import {sendTransactionalEmail} from "../lib/email";
import {preferVercelPostgresConnectionEnv} from "../lib/databaseEnv";
describe("customer-controlled deployment boundaries",()=>{
 const original={...process.env};
 afterEach(()=>{process.env={...original};jest.restoreAllMocks();});
 it("does not use vendor mail when a private mail gateway is absent",async()=>{process.env.NEXT_PUBLIC_CUSTOMER_HOSTED="1";delete process.env.TRANSACTIONAL_EMAIL_GATEWAY_URL;const mock=jest.spyOn(global,"fetch");expect(await sendTransactionalEmail({to:"test@example.invalid",subject:"Test",html:"<p>Test</p>"})).toBe(false);expect(mock).not.toHaveBeenCalled();});
 it("sends only to the configured gateway with redirects disabled",async()=>{process.env.NEXT_PUBLIC_CUSTOMER_HOSTED="1";process.env.TRANSACTIONAL_EMAIL_GATEWAY_URL="https://mail.example.invalid/send";const mock=jest.spyOn(global,"fetch").mockResolvedValue(new Response("",{status:202}));expect(await sendTransactionalEmail({to:"test@example.invalid",subject:"Test",html:"<p>Test</p>"})).toBe(true);expect(mock).toHaveBeenCalledWith("https://mail.example.invalid/send",expect.objectContaining({redirect:"error"}));});
 it("rejects vendor-owned private gateway destinations",async()=>{process.env.NEXT_PUBLIC_CUSTOMER_HOSTED="1";process.env.TRANSACTIONAL_EMAIL_GATEWAY_URL="https://konfydence.com/mail";const mock=jest.spyOn(global,"fetch");expect(await sendTransactionalEmail({to:"test@example.invalid",subject:"Test",html:"<p>Test</p>"})).toBe(false);expect(mock).not.toHaveBeenCalled();});
 it("does not override the customer database using vendor integration variables",()=>{const env={NEXT_PUBLIC_CUSTOMER_HOSTED:"1",DATABASE_URL:"customer",POSTGRES_PRISMA_URL:"vendor"};preferVercelPostgresConnectionEnv(env);expect(env.DATABASE_URL).toBe("customer");});
});
