export interface FormErrors {
  fullName?: string;
  mobile?: string;
  email?: string;
  practiceArea?: string;
  caseSummary?: string;
}

export function validateConsultationForm(data: {
  fullName?: string;
  mobile?: string;
  email?: string;
  practiceArea?: string;
  caseSummary?: string;
}): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter a valid full name (at least 2 characters)';
  }

  const mobileClean = (data.mobile || '').replace(/\s/g, '');
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileClean || !mobileRegex.test(mobileClean)) {
    errors.mobile = 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.practiceArea) {
    errors.practiceArea = 'Please select a legal practice area';
  }

  if (!data.caseSummary || data.caseSummary.trim().length < 10) {
    errors.caseSummary = 'Please provide a case summary (at least 10 characters)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
