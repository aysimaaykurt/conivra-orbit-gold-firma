export type MembershipStatus = "Gold" | "Silver" | "Bronze" | "Standard";

export interface CompanyProfile {
  companyName: string;
  status: MembershipStatus;
}

export const mockCompany: CompanyProfile = {
  companyName: "AVT Yazılım",
  status: "Gold",
};
