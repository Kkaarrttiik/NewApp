// ─── Shared mock data for the BD Panel ────────────────────────────────────────

// export interface Agency {
//   id: string;
//   name: string;
//   country: string;
//   totalHosts: number;
//   hostEarnings: number;
//   agencyCommission: number;
//   bdCommission: number;
//   growthPct: number;
//   status: 'Active' | 'Inactive' | 'Probation';
//   joinDate: string;
//   tier: 'Gold' | 'Silver' | 'Bronze';
// }

// export interface Host {
//   id: string;
//   agencyId: string;
//   agencyName: string;
//   name: string;
//   country: string;
//   liveHours: number;
//   giftEarnings: number;
//   agencyShare: number;
//   performanceRating: number;
//   joinDate: string;
//   status: 'Active' | 'Inactive';
// }

// export interface CommissionRow {
//   date: string;
//   agencyName: string;
//   hostContribution: number;
//   agencyCommission: number;
//   bdCommission: number;
//   status: 'Settled' | 'Pending' | 'Processing';
// }

// export interface WithdrawRecord {
//   id: string;
//   amount: number;
//   requestDate: string;
//   status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
//   processedBy: string;
//   transactionId: string;
//   method: string;
// }

// ─── Agencies ──────────────────────────────────────────────────────────────────
export const agencies = [
  {
    id: "AGN-001",
    name: "Star Talent Co.",
    country: "United States",
    totalHosts: 24,
    hostEarnings: 284000,
    agencyCommission: 42600,
    bdCommission: 8520,
    growthPct: 18.4,
    status: "Active",
    joinDate: "2025-06-01",
    tier: "Gold",   
  },
  {
    id: "AGN-002",
    name: "Global Stream Hub",
    country: "United Kingdom",
    totalHosts: 18,
    hostEarnings: 196000,
    agencyCommission: 29400,
    bdCommission: 5880,
    growthPct: 12.1,
    status: "Active",
    joinDate: "2025-07-15",
    tier: "Gold",
  },
  {
    id: "AGN-003",
    name: "Elite Creators Ltd.",
    country: "Canada",
    totalHosts: 15,
    hostEarnings: 152000,
    agencyCommission: 22800,
    bdCommission: 4560,
    growthPct: 9.7,
    status: "Active",
    joinDate: "2025-08-20",
    tier: "Silver",
  },
  {
    id: "AGN-004",
    name: "NextGen Media",
    country: "Australia",
    totalHosts: 11,
    hostEarnings: 98000,
    agencyCommission: 14700,
    bdCommission: 2940,
    growthPct: -3.2,
    status: "Probation",
    joinDate: "2025-09-10",
    tier: "Silver",
  },
  {
    id: "AGN-005",
    name: "Creative Hub Inc.",
    country: "Germany",
    totalHosts: 8,
    hostEarnings: 76000,
    agencyCommission: 11400,
    bdCommission: 2280,
    growthPct: 6.5,
    status: "Active",
    joinDate: "2025-10-05",
    tier: "Bronze",
  },
  {
    id: "AGN-006",
    name: "StreamKings",
    country: "France",
    totalHosts: 6,
    hostEarnings: 54000,
    agencyCommission: 8100,
    bdCommission: 1620,
    growthPct: -1.8,
    status: "Inactive",
    joinDate: "2025-11-01",
    tier: "Bronze",
  },
  {
    id: "AGN-007",
    name: "Apex Digital",
    country: "Singapore",
    totalHosts: 20,
    hostEarnings: 218000,
    agencyCommission: 32700,
    bdCommission: 6540,
    growthPct: 22.3,
    status: "Active",
    joinDate: "2025-05-15",
    tier: "Gold",
  },
  {
    id: "AGN-008",
    name: "Pacific Streamers",
    country: "Japan",
    totalHosts: 13,
    hostEarnings: 134000,
    agencyCommission: 20100,
    bdCommission: 4020,
    growthPct: 8.9,
    status: "Active",
    joinDate: "2025-07-01",
    tier: "Silver",
  },
];

// ─── Hosts ─────────────────────────────────────────────────────────────────────
export const hosts = [
  {
    id: "HST-001",
    agencyId: "AGN-001",
    agencyName: "Star Talent Co.",
    name: "Emma Chen",
    country: "US",
    liveHours: 312,
    giftEarnings: 28400,
    agencyShare: 4260,
    performanceRating: 4.9,
    joinDate: "2025-06-15",
    status: "Active",
  },
  {
    id: "HST-002",
    agencyId: "AGN-001",
    agencyName: "Star Talent Co.",
    name: "James Liu",
    country: "US",
    liveHours: 280,
    giftEarnings: 22100,
    agencyShare: 3315,
    performanceRating: 4.7,
    joinDate: "2025-07-01",
    status: "Active",
  },
  {
    id: "HST-003",
    agencyId: "AGN-001",
    agencyName: "Star Talent Co.",
    name: "Sophia Park",
    country: "US",
    liveHours: 256,
    giftEarnings: 19800,
    agencyShare: 2970,
    performanceRating: 4.6,
    joinDate: "2025-07-10",
    status: "Active",
  },
  {
    id: "HST-004",
    agencyId: "AGN-002",
    agencyName: "Global Stream Hub",
    name: "Oliver Wright",
    country: "UK",
    liveHours: 298,
    giftEarnings: 26300,
    agencyShare: 3945,
    performanceRating: 4.8,
    joinDate: "2025-08-01",
    status: "Active",
  },
  {
    id: "HST-005",
    agencyId: "AGN-002",
    agencyName: "Global Stream Hub",
    name: "Isabella Smith",
    country: "UK",
    liveHours: 241,
    giftEarnings: 18900,
    agencyShare: 2835,
    performanceRating: 4.5,
    joinDate: "2025-08-15",
    status: "Active",
  },
  {
    id: "HST-006",
    agencyId: "AGN-003",
    agencyName: "Elite Creators Ltd.",
    name: "Noah Martin",
    country: "CA",
    liveHours: 220,
    giftEarnings: 16700,
    agencyShare: 2505,
    performanceRating: 4.4,
    joinDate: "2025-09-01",
    status: "Active",
  },
  {
    id: "HST-007",
    agencyId: "AGN-003",
    agencyName: "Elite Creators Ltd.",
    name: "Ava Thompson",
    country: "CA",
    liveHours: 198,
    giftEarnings: 14200,
    agencyShare: 2130,
    performanceRating: 4.3,
    joinDate: "2025-09-15",
    status: "Active",
  },
  {
    id: "HST-008",
    agencyId: "AGN-004",
    agencyName: "NextGen Media",
    name: "Liam Johnson",
    country: "AU",
    liveHours: 176,
    giftEarnings: 11800,
    agencyShare: 1770,
    performanceRating: 3.9,
    joinDate: "2025-10-01",
    status: "Active",
  },
  {
    id: "HST-009",
    agencyId: "AGN-004",
    agencyName: "NextGen Media",
    name: "Mia Davis",
    country: "AU",
    liveHours: 154,
    giftEarnings: 9400,
    agencyShare: 1410,
    performanceRating: 3.7,
    joinDate: "2025-10-15",
    status: "Inactive",
  },
  {
    id: "HST-010",
    agencyId: "AGN-005",
    agencyName: "Creative Hub Inc.",
    name: "Lucas Müller",
    country: "DE",
    liveHours: 210,
    giftEarnings: 15600,
    agencyShare: 2340,
    performanceRating: 4.5,
    joinDate: "2025-10-20",
    status: "Active",
  },
  {
    id: "HST-011",
    agencyId: "AGN-006",
    agencyName: "StreamKings",
    name: "Clara Dubois",
    country: "FR",
    liveHours: 140,
    giftEarnings: 8900,
    agencyShare: 1335,
    performanceRating: 3.8,
    joinDate: "2025-11-10",
    status: "Inactive",
  },
  {
    id: "HST-012",
    agencyId: "AGN-007",
    agencyName: "Apex Digital",
    name: "Wei Zhang",
    country: "SG",
    liveHours: 334,
    giftEarnings: 31200,
    agencyShare: 4680,
    performanceRating: 5.0,
    joinDate: "2025-05-20",
    status: "Active",
  },
  {
    id: "HST-013",
    agencyId: "AGN-007",
    agencyName: "Apex Digital",
    name: "Priya Kumar",
    country: "SG",
    liveHours: 302,
    giftEarnings: 27100,
    agencyShare: 4065,
    performanceRating: 4.8,
    joinDate: "2025-06-01",
    status: "Active",
  },
  {
    id: "HST-014",
    agencyId: "AGN-008",
    agencyName: "Pacific Streamers",
    name: "Yuki Tanaka",
    country: "JP",
    liveHours: 268,
    giftEarnings: 21400,
    agencyShare: 3210,
    performanceRating: 4.6,
    joinDate: "2025-07-10",
    status: "Active",
  },
];

// ─── Commission rows ────────────────────────────────────────────────────────────
export const commissionRows = [
  {
    date: "2026-03-01",
    agencyName: "Star Talent Co.",
    hostContribution: 284000,
    agencyCommission: 42600,
    bdCommission: 8520,
    status: "Settled",
  },
  {
    date: "2026-03-01",
    agencyName: "Apex Digital",
    hostContribution: 218000,
    agencyCommission: 32700,
    bdCommission: 6540,
    status: "Settled",
  },
  {
    date: "2026-02-01",
    agencyName: "Global Stream Hub",
    hostContribution: 196000,
    agencyCommission: 29400,
    bdCommission: 5880,
    status: "Settled",
  },
  {
    date: "2026-02-01",
    agencyName: "Pacific Streamers",
    hostContribution: 134000,
    agencyCommission: 20100,
    bdCommission: 4020,
    status: "Processing",
  },
  {
    date: "2026-02-01",
    agencyName: "Elite Creators Ltd.",
    hostContribution: 152000,
    agencyCommission: 22800,
    bdCommission: 4560,
    status: "Settled",
  },
  {
    date: "2026-01-01",
    agencyName: "NextGen Media",
    hostContribution: 98000,
    agencyCommission: 14700,
    bdCommission: 2940,
    status: "Settled",
  },
  {
    date: "2026-01-01",
    agencyName: "Creative Hub Inc.",
    hostContribution: 76000,
    agencyCommission: 11400,
    bdCommission: 2280,
    status: "Settled",
  },
  {
    date: "2026-01-01",
    agencyName: "StreamKings",
    hostContribution: 54000,
    agencyCommission: 8100,
    bdCommission: 1620,
    status: "Pending",
  },
  {
    date: "2025-12-01",
    agencyName: "Star Talent Co.",
    hostContribution: 261000,
    agencyCommission: 39150,
    bdCommission: 7830,
    status: "Settled",
  },
  {
    date: "2025-12-01",
    agencyName: "Apex Digital",
    hostContribution: 194000,
    agencyCommission: 29100,
    bdCommission: 5820,
    status: "Settled",
  },
];

// ─── Withdraw history ──────────────────────────────────────────────────────────
export const withdrawHistory = [
  {
    id: "WD-001",
    amount: 8500,
    requestDate: "2026-03-01",
    status: "Pending",
    processedBy: "—",
    transactionId: "—",
    method: "Bank Transfer",
  },
  {
    id: "WD-002",
    amount: 7200,
    requestDate: "2026-01-20",
    status: "Paid",
    processedBy: "Admin01",
    transactionId: "TXN-84521",
    method: "Bank Transfer",
  },
  {
    id: "WD-003",
    amount: 6100,
    requestDate: "2025-12-15",
    status: "Paid",
    processedBy: "Admin02",
    transactionId: "TXN-77201",
    method: "UPI",
  },
  {
    id: "WD-004",
    amount: 4800,
    requestDate: "2025-11-05",
    status: "Rejected",
    processedBy: "Admin01",
    transactionId: "—",
    method: "Bank Transfer",
  },
  {
    id: "WD-005",
    amount: 5500,
    requestDate: "2025-10-12",
    status: "Paid",
    processedBy: "Admin02",
    transactionId: "TXN-61098",
    method: "Bank Transfer",
  },
];

// ─── Monthly trend data ────────────────────────────────────────────────────────
export const monthlyTrend = [
  {
    month: "Sep",
    hostEarnings: 680000,
    agencyCommission: 102000,
    bdCommission: 20400,
  },
  {
    month: "Oct",
    hostEarnings: 720000,
    agencyCommission: 108000,
    bdCommission: 21600,
  },
  {
    month: "Nov",
    hostEarnings: 790000,
    agencyCommission: 118500,
    bdCommission: 23700,
  },
  {
    month: "Dec",
    hostEarnings: 860000,
    agencyCommission: 129000,
    bdCommission: 25800,
  },
  {
    month: "Jan",
    hostEarnings: 920000,
    agencyCommission: 138000,
    bdCommission: 27600,
  },
  {
    month: "Feb",
    hostEarnings: 980000,
    agencyCommission: 147000,
    bdCommission: 29400,
  },
  {
    month: "Mar",
    hostEarnings: 1050000,
    agencyCommission: 157500,
    bdCommission: 31500,
  },
];

export const bdCommissionTrend = [
  { month: "Sep", amount: 20400 },
  { month: "Oct", amount: 21600 },
  { month: "Nov", amount: 23700 },
  { month: "Dec", amount: 25800 },
  { month: "Jan", amount: 27600 },
  { month: "Feb", amount: 29400 },
  { month: "Mar", amount: 31500 },
];
