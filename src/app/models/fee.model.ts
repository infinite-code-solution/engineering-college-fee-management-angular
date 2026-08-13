export interface FeeStructure {
  id: number;
  student_name: string;
  roll_number: string;
  fee_type: 'Tuition' | 'Transport' | 'Examination' | 'Library';
  total_amount: number;
  amount_paid: number;
  balance_amount: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  due_date: string;
}

export interface FeeSummary {
  total_collected: number;
  total_pending: number;
  collection_rate_percentage: number;
}
