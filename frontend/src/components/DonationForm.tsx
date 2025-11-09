import { useMemo, useState } from "react";
import { getCountryOptions, getCountryName } from "../lib/countryData";

type DonationFormValues = {
  donorCountry: string;
  recipientCountry: string;
  amount: string;
  message: string;
};

export interface DonationFormProps {
  onSubmit: (input: {
    donorCountry: string;
    recipientCountry: string;
    amount: number | null;
    message: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

const defaultValues: DonationFormValues = {
  donorCountry: "",
  recipientCountry: "",
  amount: "",
  message: "",
};

export function DonationForm({ onSubmit, isSubmitting = false }: DonationFormProps) {
  const options = useMemo(() => getCountryOptions(), []);
  const [values, setValues] = useState<DonationFormValues>(defaultValues);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!values.donorCountry || !values.recipientCountry) {
      setError("Please select both your country and the destination country.");
      return;
    }

    if (values.donorCountry === values.recipientCountry) {
      setError("Please choose two different countries for a donation route.");
      return;
    }

    const parsedAmount = values.amount.trim()
      ? Number.parseFloat(values.amount)
      : NaN;

    if (values.amount.trim() && Number.isNaN(parsedAmount)) {
      setError("Donation amount must be a valid number.");
      return;
    }

    await onSubmit({
      donorCountry: values.donorCountry,
      recipientCountry: values.recipientCountry,
      amount: Number.isNaN(parsedAmount) ? null : parsedAmount,
      message: values.message.trim(),
    });

    setValues(defaultValues);
  };

  return (
    <form className="donation-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Make an Impact</h2>
        <p>Connect your generosity to a cause across the globe in real-time.</p>
      </div>

      <label className="form-field">
        <span>Your Country</span>
        <select
          name="donorCountry"
          value={values.donorCountry}
          onChange={handleChange}
          required
        >
          <option value="">Select your country</option>
          {options.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span>Destination Country</span>
        <select
          name="recipientCountry"
          value={values.recipientCountry}
          onChange={handleChange}
          required
        >
          <option value="">Select a country to support</option>
          {options.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span>Donation Amount (optional)</span>
        <input
          type="number"
          min="0"
          step="0.01"
          name="amount"
          value={values.amount}
          onChange={handleChange}
          placeholder="e.g. 50"
        />
      </label>

      <label className="form-field">
        <span>Message (optional)</span>
        <textarea
          name="message"
          value={values.message}
          onChange={handleChange}
          rows={3}
          maxLength={280}
          placeholder="Share a note of encouragement"
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Sending your donation..."
          : `Send from ${
              getCountryName(values.donorCountry ?? "") ?? "your country"
            }`}
      </button>
    </form>
  );
}
