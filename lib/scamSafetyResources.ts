export type ScamSafetyResourceKind = "protocol" | "phone" | "computer";

export type ScamSafetyResource = {
  id: string;
  label: string;
  shortLabel: string;
  detail: string;
  kind: ScamSafetyResourceKind;
  fileId: string;
  previewPath: string;
  downloadPath: string;
  driveViewUrl: string;
};

function assetPath(resourceId: string, preview = false) {
  const params = new URLSearchParams({ resource: resourceId });
  if (preview) params.set("preview", "1");
  return `/api/resources/asset?${params.toString()}`;
}

function driveView(fileId: string) {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

const LOCAL_PREVIEWS: Record<ScamSafetyResourceKind, string> = {
  protocol: "/resources/konfydence-emergency-scam-protocol.svg",
  phone: "/resources/konfydence-phone-lock-screen.svg",
  computer: "/resources/konfydence-desktop-lock-screen.svg",
};

function lockScreen(
  kind: "phone" | "computer",
  index: number,
  fileId: string
): ScamSafetyResource {
  const number = String(index).padStart(2, "0");
  const device = kind === "phone" ? "Phone" : "Computer";
  const id = `${kind}-${number}`;
  return {
    id,
    label: `${device} lock screen ${number}`,
    shortLabel: `${device} ${number}`,
    detail:
      kind === "phone"
        ? "Konfydence phone lock-screen reminder"
        : "Konfydence desktop / computer lock-screen reminder",
    kind,
    fileId,
    previewPath: LOCAL_PREVIEWS[kind],
    downloadPath: assetPath(id),
    driveViewUrl: driveView(fileId),
  };
}

export const SCAM_SAFETY_RESOURCES: ScamSafetyResource[] = [
  {
    id: "protocol",
    label: "Emergency Scam Protocol",
    shortLabel: "Scam Protocol",
    detail: "Official printable one-page household emergency protocol",
    kind: "protocol",
    fileId: "1gF0ssmNVljRGpfEXRyRp5IaEXmT3KE7v",
    previewPath: LOCAL_PREVIEWS.protocol,
    downloadPath: assetPath("protocol"),
    driveViewUrl: driveView("1gF0ssmNVljRGpfEXRyRp5IaEXmT3KE7v"),
  },

  lockScreen("phone", 1, "1mebkS9e-4RwSzzBr4a_XN6vA_ospygiH"),
  lockScreen("phone", 2, "1WVwIkHIrHwgWTuZb4_Ah5uKehmEceMQQ"),
  lockScreen("phone", 3, "1GkHoqcxX6Tx_R4ervwtB4dZ2OfrPmfya"),
  lockScreen("phone", 4, "1QlDB2SZkCh4XeM1gEAxR0D5rbs3UBwG0"),
  lockScreen("phone", 5, "18lQUJSoaCFQcFLIgH0ndGmZ8rA10R1pq"),
  lockScreen("phone", 6, "11qhAMlgI86W1JoUz86t17oNW5R7DyRkQ"),
  lockScreen("phone", 7, "1FCik5VMPMlz1JTW2SuZ4aXfosFO0TgfQ"),
  lockScreen("phone", 8, "1zXszycwu_8Ur2rKNs807SMl-0P3EPRse"),
  lockScreen("phone", 9, "1vWt489NVBBSKF8-b38jfu9ge3Rw6BTgP"),
  lockScreen("phone", 10, "1INdxWNqjQ0LOe5UiVd5ctsj1DEZFOSCd"),
  lockScreen("phone", 11, "14Oa9ZOiyFZsjfw48B0az8woQmTbGAyq5"),
  lockScreen("phone", 12, "1f7PAwaKIsSEh7QeoGXeZCkiLkrZbfqFo"),

  lockScreen("computer", 1, "1A-8VtZA-5IUG5wsrRVuSNKFIEIocilFT"),
  lockScreen("computer", 2, "1PODTlEx0YVvKdm6MoxpsoTDdcrA07TdM"),
  lockScreen("computer", 3, "1Jj2E1wGn_Fc_t1_iVtP_cpEgous1SCMO"),
  lockScreen("computer", 4, "11RF6X3Alht6DDXP2RgkiXekj0CsN4Srg"),
  lockScreen("computer", 5, "1M1BAYC67UNh4z6pvBihXCglRbJi8-WHC"),
  lockScreen("computer", 6, "1Pw1SFxExdZrcgonsYDU9I1ARtBH0_POs"),
  lockScreen("computer", 7, "1VNVR-bGDnSwKRsmH-M7NxIf1C502cRyD"),
  lockScreen("computer", 8, "12QCzXvZWlkPLtsld5mcS3FwR20rJdzyc"),
];

export const SCAM_SAFETY_RESOURCE_MAP = new Map(
  SCAM_SAFETY_RESOURCES.map((resource) => [resource.id, resource] as const)
);

export const MAX_SCAM_SAFETY_RESOURCES_PER_REQUEST = 3;
