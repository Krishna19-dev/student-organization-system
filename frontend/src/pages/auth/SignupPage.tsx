import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { 
  UserPlus, Loader2, ArrowRight, ArrowLeft, ShieldCheck, 
  AlertCircle, ShoppingBag, CheckCircle2, User, Briefcase, 
  Sparkles, Check, ExternalLink, RefreshCw, CreditCard,
  GraduationCap, Phone, Mail, Building, FileText, Globe
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import { setDemoUser } from "@/lib/auth-demo";

interface Position {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements?: string | null;
  isOpen: boolean;
  vacancies: number;
  deadline?: string | null;
}

const DEFAULT_POSITIONS: Position[] = [
  {
    id: "pos-tech-lead",
    title: "Technical Lead",
    department: "Engineering",
    description: "Architect core technical systems, lead hackathon builds, and mentor junior developers.",
    requirements: "Full-stack development experience (React, Node, DBs) & Git fluency.",
    isOpen: true,
    vacancies: 2,
    deadline: "Oct 25, 2026",
  },
  {
    id: "pos-web-dev",
    title: "Web Development Team",
    department: "Engineering",
    description: "Build and maintain the Club_Hub web platform, event portals, and digital badges.",
    requirements: "Knowledge of modern React, TypeScript, and responsive styling.",
    isOpen: true,
    vacancies: 4,
    deadline: "Oct 28, 2026",
  },
  {
    id: "pos-app-dev",
    title: "App Development Team",
    department: "Mobile Engineering",
    description: "Develop companion mobile experiences for digital tickets and offline check-in.",
    requirements: "React Native or Flutter familiarity.",
    isOpen: true,
    vacancies: 3,
    deadline: "Oct 30, 2026",
  },
  {
    id: "pos-design",
    title: "Design Team",
    department: "Creative & Media",
    description: "Design UI/UX prototypes, social media assets, and official club merchandise.",
    requirements: "Figma proficiency and strong visual design portfolio.",
    isOpen: true,
    vacancies: 3,
    deadline: "Oct 26, 2026",
  },
  {
    id: "pos-event-mgmt",
    title: "Event Management Team",
    department: "Operations",
    description: "Coordinate campus summits, venue logistics, guest speakers, and volunteer shifts.",
    requirements: "Strong communication and organizational skills.",
    isOpen: true,
    vacancies: 5,
    deadline: "Nov 02, 2026",
  },
  {
    id: "pos-marketing-pr",
    title: "Marketing and Public Relations",
    department: "Public Relations",
    description: "Drive campus outreach, student engagement campaigns, and external sponsor relationships.",
    requirements: "Content strategy, social media management, or public speaking.",
    isOpen: true,
    vacancies: 3,
    deadline: "Oct 27, 2026",
  },
  {
    id: "pos-finance",
    title: "Finance and Sponsorship",
    department: "Treasury",
    description: "Assist in budget forecasting, corporate sponsorships, and expense auditing.",
    requirements: "Basic budgeting, spreadsheet literacy, and ethical financial accountability.",
    isOpen: true,
    vacancies: 2,
    deadline: "Oct 29, 2026",
  },
  {
    id: "pos-content",
    title: "Content and Documentation",
    department: "Media & Editorial",
    description: "Write event coverage, technical blogs, workshop documentation, and press releases.",
    requirements: "Clear writing style and documentation experience.",
    isOpen: true,
    vacancies: 2,
    deadline: "Oct 31, 2026",
  },
  {
    id: "pos-volunteer",
    title: "General Volunteer",
    department: "Campus Engagement",
    description: "Support on-ground club activities, registration desks, and event logistics.",
    requirements: "Enthusiastic and eager to contribute to the campus community.",
    isOpen: true,
    vacancies: 10,
    deadline: "Open All Term",
  },
];

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect any guest queries to dedicated Guest Access portal
  useEffect(() => {
    const isGuestQuery =
      searchParams.get("mode") === "guest" ||
      searchParams.get("type") === "guest" ||
      searchParams.get("plan") === "guest" ||
      searchParams.get("intent") === "guest";
    if (isGuestQuery) {
      navigate("/guest-access", { replace: true });
    }
  }, [searchParams, navigate]);

  // Multi-step state for Official Member Application (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State: Personal & Academic Info
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    college: "",
    course: "",
    year: "1st Year",
    department: "",
    bio: "",
    skills: "",
    linkedinUrl: "",
    githubUrl: "",
    photoUrl: "",
  });

  // Position Selection State
  const [positions, setPositions] = useState<Position[]>(DEFAULT_POSITIONS);
  const [loadingPositions, setLoadingPositions] = useState<boolean>(false);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [isGeneralMember, setIsGeneralMember] = useState<boolean>(false);

  // Terms agreement in Step 3
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  // Payment & Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentStatus, setPaymentStatus] = useState<"IDLE" | "PENDING" | "PAID" | "FAILED">("IDLE");
  const [createdApplication, setCreatedApplication] = useState<{
    id: string;
    paymentId: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    status: string;
    amount: number;
  } | null>(null);

  // Fetch live positions from backend
  useEffect(() => {
    async function fetchPositions() {
      setLoadingPositions(true);
      try {
        const res = await fetch(`${API_BASE}/api/positions`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.positions) && data.positions.length > 0) {
            setPositions(data.positions);
          }
        }
      } catch (err) {
        console.warn("Using default club positions:", err);
      } finally {
        setLoadingPositions(false);
      }
    }
    fetchPositions();
  }, []);

  // Ensure Razorpay script is present
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = "Full name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    const cleanPhone = formData.phone.trim().replace(/^\+91/, "").replace(/\D/g, "");
    if (!formData.phone.trim()) {
      errs.phone = "Mobile number is required.";
    } else if (cleanPhone.length !== 10) {
      errs.phone = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.college.trim()) errs.college = "College or Institution name is required.";
    if (!formData.course.trim()) errs.course = "Course or Degree is required (e.g. B.Tech, BCA).";
    if (!formData.department.trim()) errs.department = "Department or Branch is required (e.g. CSE, IT).";
    if (!formData.bio.trim()) {
      errs.bio = "A short introduction is required (minimum 10 characters).";
    } else if (formData.bio.trim().length < 10) {
      errs.bio = "Introduction must be at least 10 characters long.";
    }
    if (!formData.skills.trim()) errs.skills = "Please list at least one skill or area of interest.";

    // LinkedIn URL validation
    if (formData.linkedinUrl.trim()) {
      try {
        const parsed = new URL(formData.linkedinUrl.trim());
        if (!parsed.hostname.includes("linkedin.com")) {
          errs.linkedinUrl = "Please provide a valid LinkedIn profile URL.";
        }
      } catch {
        errs.linkedinUrl = "Please provide a valid URL (starting with https://).";
      }
    }

    // GitHub URL validation (optional)
    if (formData.githubUrl.trim()) {
      try {
        new URL(formData.githubUrl.trim());
      } catch {
        errs.githubUrl = "Please enter a valid URL (starting with https://).";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else if (currentStep === 2) {
      // Step 2: Validate position selection if positions are available and applicant hasn't selected general
      const openPositions = positions.filter((p) => p.isOpen);
      if (openPositions.length > 0 && selectedPositions.length === 0 && !isGeneralMember) {
        setErrors({ positions: "Please select at least one position of interest or choose General Membership." });
        return;
      }
      setErrors({});
      setCurrentStep(3);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const togglePosition = (posId: string) => {
    setIsGeneralMember(false);
    setSelectedPositions((prev) =>
      prev.includes(posId) ? prev.filter((id) => id !== posId) : [...prev, posId]
    );
    if (errors.positions) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.positions;
        return copy;
      });
    }
  };

  // Step 4: Initiate Razorpay Checkout
  const handleProceedToPayment = async () => {
    if (!termsAgreed) {
      setErrors({ terms: "Please confirm that you have reviewed the membership terms and conditions." });
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus("PENDING");
    setErrors({});

    try {
      // 1. Create Application & Razorpay Order on Backend
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        course: formData.course.trim(),
        year: formData.year,
        department: formData.department.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills.trim(),
        linkedinUrl: formData.linkedinUrl.trim(),
        githubUrl: formData.githubUrl.trim(),
        photoUrl: formData.photoUrl.trim(),
        positionIds: isGeneralMember ? [] : selectedPositions,
        positions: isGeneralMember ? ["General Membership"] : selectedPositions.map((id) => {
          const found = positions.find((p) => p.id === id);
          return found ? found.title : id;
        }),
      };

      const res = await fetch(`${API_BASE}/api/applications/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || "Failed to initialize membership application.");
      }

      setCreatedApplication({
        id: data.applicationId,
        paymentId: data.paymentId,
        razorpayOrderId: data.orderId,
        status: "PAYMENT_PENDING",
        amount: data.amount || 30000,
      });

      // 2. Open Razorpay Checkout Modal
      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay Checkout SDK could not be loaded. Please check your internet connection.");
      }

      const options = {
        key: data.key || "rzp_test_TmPB80JLFGV93g",
        amount: data.amount || 30000,
        currency: data.currency || "INR",
        name: "Club_Hub",
        description: "One-Time Membership Joining Fee (₹300)",
        order_id: data.orderId,
        prefill: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          contact: formData.phone.trim(),
        },
        theme: {
          color: "#017E84",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setPaymentStatus("FAILED");
            setErrors({ payment: "Payment window was closed. You can retry paying the ₹300 joining fee below." });
          },
        },
        handler: async (response: any) => {
          // 3. Verify Payment on Backend
          try {
            const verifyRes = await fetch(`${API_BASE}/api/applications/verify-onboard`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                applicationId: data.applicationId,
                paymentId: data.paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error?.message || verifyData.message || "Payment verification failed.");
            }

            setPaymentStatus("PAID");
            setCreatedApplication((prev) => ({
              ...prev!,
              razorpayPaymentId: response.razorpay_payment_id,
              status: "UNDER_REVIEW",
            }));

            // Advance to Step 5 (Confirmation)
            setCurrentStep(5);
            window.scrollTo(0, 0);
          } catch (verifyErr: any) {
            setPaymentStatus("FAILED");
            setErrors({ payment: verifyErr.message || "Payment verification failed on the server." });
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (failedRes: any) => {
        setIsSubmitting(false);
        setPaymentStatus("FAILED");
        setErrors({
          payment: failedRes?.error?.description || "Payment failed or was declined. Please try again.",
        });
      });

      rzp.open();
    } catch (err: any) {
      setIsSubmitting(false);
      setPaymentStatus("FAILED");
      setErrors({ payment: err.message || "Unable to start payment. Please check your network." });
    }
  };

  const openPositions = positions.filter((p) => p.isOpen);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#017E84]/10 text-[#017E84]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Membership Application</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Join Club_Hub as Official Member (₹300)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          One-time ₹300 joining fee. Complete your registration, select open club positions of interest, and join our active student organization.
        </p>
      </div>

      {/* OFFICIAL MEMBERSHIP MULTI-STEP FLOW */}
      <div className="space-y-6">
          {/* Step Progress Bar (1 to 5) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
              <span className={currentStep >= 1 ? "text-[#017E84]" : ""}>1. Personal Info</span>
              <span className={currentStep >= 2 ? "text-[#017E84]" : ""}>2. Club Positions</span>
              <span className={currentStep >= 3 ? "text-[#017E84]" : ""}>3. Review &amp; Fee</span>
              <span className={currentStep >= 4 ? "text-[#017E84]" : ""}>4. Razorpay</span>
              <span className={currentStep >= 5 ? "text-emerald-600" : ""}>5. Confirmed</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#017E84] transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: Personal and Academic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#017E84]" />
                  <span>Step 1: Personal &amp; Academic Details</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Please provide accurate information for your student membership file and review.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Aanya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                  {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="aanya@college.edu"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile Number (Indian 10-Digit) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* College / Institution */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    College / Institution Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="e.g. Bangalore Institute of Technology"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                    />
                  </div>
                  {errors.college && <p className="text-[11px] text-red-600 mt-1">{errors.college}</p>}
                </div>

                {/* Course / Degree */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Course / Degree <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                    />
                  </div>
                  {errors.course && <p className="text-[11px] text-red-600 mt-1">{errors.course}</p>}
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Current Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none bg-white font-medium"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Post-Graduate">Post-Graduate / Masters</option>
                  </select>
                </div>

                {/* Department / Branch */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Department or Branch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                  {errors.department && <p className="text-[11px] text-red-600 mt-1">{errors.department}</p>}
                </div>

                {/* Short Introduction */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Short Introduction / Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself, why you want to join Club_Hub, and what you hope to achieve..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                  {errors.bio && <p className="text-[11px] text-red-600 mt-1">{errors.bio}</p>}
                </div>

                {/* Skills and Areas of Interest */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Skills and Areas of Interest <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. React, Python, UI Design, Event Logistics, Public Speaking"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                  {errors.skills && <p className="text-[11px] text-red-600 mt-1">{errors.skills}</p>}
                </div>

                {/* LinkedIn Profile URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                  {errors.linkedinUrl && <p className="text-[11px] text-red-600 mt-1">{errors.linkedinUrl}</p>}
                </div>

                {/* GitHub or Portfolio URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    GitHub / Portfolio URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                  {errors.githubUrl && <p className="text-[11px] text-red-600 mt-1">{errors.githubUrl}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  to="/guest-access"
                  className="text-xs text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1"
                >
                  <span>Looking for free visitor access?</span>
                  <span className="font-bold text-[#017E84] hover:underline">Continue as Guest (₹0) &rarr;</span>
                </Link>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Position Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Dynamic Club Position Selection */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#017E84]" />
                    <span>Step 2: Available Club Positions</span>
                  </h2>
                  <span className="text-xs bg-teal-50 text-[#017E84] font-bold px-3 py-1 rounded-full border border-teal-200">
                    {openPositions.length} Openings
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select positions you are interested in contributing to. Positions are fetched dynamically from club records.
                </p>
              </div>

              {/* Crucial Disclaimer banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Important Appointment Notice:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Expressing interest in a position is not an automatic appointment. The Club Administration reviews all applicant profiles and assigns official roles based on qualifications. You may also join as a General Member.
                </p>
              </div>

              {errors.positions && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errors.positions}</span>
                </div>
              )}

              {/* General Member Option */}
              <div
                onClick={() => {
                  setIsGeneralMember(!isGeneralMember);
                  if (!isGeneralMember) setSelectedPositions([]);
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isGeneralMember
                    ? "border-[#017E84] bg-teal-50/50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold text-xs text-gray-900 flex items-center gap-2">
                    <span>General Club Membership (No specific position)</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                      Open to all
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Apply for general membership perks, events, and workshops without committing to a dedicated team role.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isGeneralMember
                      ? "bg-[#017E84] border-[#017E84] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isGeneralMember && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Dynamic Position Cards Grid */}
              {loadingPositions ? (
                <div className="py-12 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#017E84]" />
                  <span>Loading open club positions...</span>
                </div>
              ) : openPositions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-2">
                  <p className="text-xs font-bold text-gray-700">
                    There are currently no open positions. You may still submit a general club membership application.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {openPositions.map((pos) => {
                    const isSelected = selectedPositions.includes(pos.id);
                    return (
                      <div
                        key={pos.id}
                        onClick={() => togglePosition(pos.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? "border-[#017E84] bg-teal-50/40 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-xs text-gray-900">{pos.title}</h3>
                              <span className="text-[10px] text-[#017E84] font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                                {pos.department}
                              </span>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-[#017E84] border-[#017E84] text-white"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>

                          <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                            {pos.description}
                          </p>

                          {pos.requirements && (
                            <div className="text-[10px] text-gray-500 italic bg-gray-50 p-2 rounded-lg">
                              Req: {pos.requirements}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 pt-2 font-medium">
                          <span>{pos.vacancies} {pos.vacancies === 1 ? "opening" : "openings"}</span>
                          {pos.deadline && <span>Deadline: {pos.deadline}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 1</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <span>Review Application &amp; Benefits</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review Application & Membership Benefits */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#017E84]" />
                  <span>Step 3: Review Application &amp; Membership Benefits</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Please review your details carefully before proceeding to the one-time ₹300 joining fee payment.
                </p>
              </div>

              {/* Applicant Review Summary */}
              <div className="p-5 rounded-2xl bg-[#FAF7F9] border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                  <span className="text-xs font-black uppercase text-gray-900">Applicant Summary</span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-[#017E84] font-bold hover:underline"
                  >
                    Edit Details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Full Name:</span>
                    <span className="font-bold text-gray-900">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Email:</span>
                    <span className="font-bold text-gray-900">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Mobile:</span>
                    <span className="font-medium text-gray-800">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Institution:</span>
                    <span className="font-medium text-gray-800">{formData.college}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Course &amp; Year:</span>
                    <span className="font-medium text-gray-800">{formData.course} · {formData.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Department:</span>
                    <span className="font-medium text-gray-800">{formData.department}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/80">
                  <span className="text-gray-400 block text-[11px] mb-1">Selected Positions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {isGeneralMember || selectedPositions.length === 0 ? (
                      <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-[#017E84] font-bold text-xs">
                        General Membership
                      </span>
                    ) : (
                      selectedPositions.map((id) => {
                        const found = positions.find((p) => p.id === id);
                        return (
                          <span
                            key={id}
                            className="px-2.5 py-1 rounded-lg bg-teal-100 text-[#017E84] font-bold text-xs"
                          >
                            {found ? found.title : id}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                {formData.linkedinUrl && (
                  <div className="text-xs">
                    <span className="text-gray-400 block text-[11px]">LinkedIn:</span>
                    <a
                      href={formData.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#017E84] hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>{formData.linkedinUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Membership Benefits & Fee Card */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#017E84]/30 space-y-4">
                <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-black text-sm text-gray-900">Official Membership Package</h3>
                    <p className="text-[11px] text-gray-500">One-time joining fee · No recurring renewal charge</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#017E84]">₹300</span>
                    <span className="text-[10px] text-gray-400 block">One-Time Total</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Official Club_Hub Member ID upon approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Goodies &amp; Club T-Shirt Eligibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Team collaboration &amp; workspace access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Full refund if application is not approved</span>
                  </div>
                </div>
              </div>

              {/* Terms Confirmation Checkbox */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => {
                      setTermsAgreed(e.target.checked);
                      if (errors.terms) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.terms;
                          return copy;
                        });
                      }
                    }}
                    className="mt-0.5 rounded text-[#017E84] focus:ring-[#017E84]"
                  />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    I confirm that the submitted details are correct. I understand that the ₹300 joining fee is a one-time charge, and that official membership and position assignments are subject to administrative review and approval.
                  </span>
                </label>
                {errors.terms && <p className="text-[11px] text-red-600">{errors.terms}</p>}
                {errors.payment && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errors.payment}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Positions</span>
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹300 via Razorpay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Razorpay In-Flight / Failed Retry Screen */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#017E84]/10 text-[#017E84] flex items-center justify-center mx-auto">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Razorpay Payment Processing</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Complete your ₹300 joining fee via the Razorpay checkout overlay.
                </p>
              </div>

              {errors.payment && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 max-w-md mx-auto">
                  {errors.payment}
                </div>
              )}

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Review Details
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span>Retry Razorpay Payment (₹300)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Under Review Confirmation */}
          {currentStep === 5 && (
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-lg space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Payment Verified — Pending Review</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Application Submitted Successfully!
                </h2>
              </div>

              {/* Mandated exact message */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed max-w-lg mx-auto text-left space-y-3">
                <p className="font-semibold text-gray-900">
                  “Your Club_Hub membership application and payment have been received successfully. Your application is now awaiting administrative review. Our club administration aims to review your information within one working day. Once approved, you will receive instructions to activate your member account and access your official membership ID.”
                </p>
                <div className="pt-3 border-t border-gray-200 text-[11px] text-gray-500 space-y-1">
                  <div><strong>Application Ref:</strong> {createdApplication?.id}</div>
                  {createdApplication?.razorpayPaymentId && (
                    <div><strong>Razorpay Payment ID:</strong> {createdApplication?.razorpayPaymentId}</div>
                  )}
                  <div><strong>Joining Fee:</strong> ₹300 (INR) Verified</div>
                  <div><strong>Target Review Time:</strong> Within 1 working day</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/application-status"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Track Application Status</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/events"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Explore Club Events as Guest
                </Link>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
