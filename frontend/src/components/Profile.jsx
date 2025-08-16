import { useState } from "react";
import { User, Phone, Check, AlertCircle } from "lucide-react";
import { saveProfile } from "../api/profile";


const COUNTRIES = [
  { code: "+91", name: "India", flag: "🇮🇳", digits: 10 },
  { code: "+1", name: "US/Canada", flag: "🇺🇸", digits: 10 },
  { code: "+44", name: "UK", flag: "🇬🇧", digits: 10 },
  { code: "+61", name: "Australia", flag: "🇦🇺", digits: 9 },
  { code: "+49", name: "Germany", flag: "🇩🇪", digits: 11 },
  { code: "+33", name: "France", flag: "🇫🇷", digits: 10 },
];

export default function Profile() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const selectedCountry = COUNTRIES.find(country => country.code === countryCode);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Phone validation
    const onlyDigits = phone.replace(/\D/g, "");
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (onlyDigits.length !== selectedCountry.digits) {
      newErrors.phone = `Phone number must be ${selectedCountry.digits} digits for ${selectedCountry.name}`;
    }

    return newErrors;
  };

  const handlePhoneChange = (value) => {
    // Allow only digits and common phone number characters during typing
    const cleaned = value.replace(/[^\d\s\-()]/g, "");
    setPhone(cleaned);

    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const handleNameChange = (value) => {
    setName(value);

    // Clear name error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: "" }));
    }
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const fullNumber = `${countryCode}${cleanPhone}`;
      await saveProfile({ name: name.trim(), phone: fullNumber });

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: "Failed to save profile. Please try again.", error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneDisplay = () => {
    const digits = phone.replace(/\D/g, "");
    if (countryCode === "+91" && digits.length >= 5) {
      return digits.replace(/(\d{5})(\d{0,5})/, "$1 $2").trim();
    }
    if ((countryCode === "+1" || countryCode === "+44") && digits.length >= 3) {
      return digits.replace(/(\d{3})(\d{3})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    }
    return phone;
  };


  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="flex flex-col bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Profile Setup</h2>
          <p className="text-blue-100 mt-1">Complete your profile information</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          {submitSuccess && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-800 font-medium">Profile saved successfully!</span>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-800">{errors.submit}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="flex flex-wrap text-gray-700 font-semibold text-sm">
              WhatsApp Number *
            </label>
            <div className="flex flex-wrap gap-2">
              {/* Country Code Selector */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[50px]"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>

              {/* Phone Input */}
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formatPhoneDisplay()}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.phone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder={selectedCountry.code === "+91" ? "98765 43210" : "Enter phone number"}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {selectedCountry.name} numbers require {selectedCountry.digits} digits
            </p>
            {errors.phone && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
