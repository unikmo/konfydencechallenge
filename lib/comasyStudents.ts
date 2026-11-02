// Student participants are created by a teacher as numbered aliases (no name, no
// email). The participant table needs a unique email per organisation, so each
// alias gets a random address on the reserved ".invalid" domain (RFC 2606), which
// can never receive mail and is hidden in the dashboard.
export const STUDENT_ALIAS_DOMAIN = "@students.invalid";

export const isStudentAlias = (email: string) => email.endsWith(STUDENT_ALIAS_DOMAIN);
