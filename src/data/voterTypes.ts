export interface Voter {
  membershipNo: string;
  name: string;
  division: string;
  university: string;
  centre: string;
  passingYear: string;
  address: string;
  phone: string | null;
  email: string | null;
  status: 'active' | 'defaulter';
  duesYears: number | null;
  duesAmount: number | null;
  paidUpto: string | null;
  jobLocation: string | null;
}
