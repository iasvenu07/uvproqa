import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, User, Phone, Edit3, MessageSquare, Send, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ message: string; referenceId: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error when user modifies it
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessResponse(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          // Map server-side validation errors
          setErrors(data.errors);
        } else {
          setErrors({ global: data.error || "An unexpected error occurred during submission." });
        }
      } else {
        setSuccessResponse({
          message: data.message,
          referenceId: data.referenceId
        });
        // Clear form
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      }
    } catch (err) {
      console.error("Submission failed", err);
      setErrors({ global: "Unable to establish secure connection to the API gateway. Please check your network." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-300 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        {!successResponse ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Global Error Banner */}
            {errors.global && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/15 text-rose-400 rounded-xl text-xs flex items-center gap-2.5">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{errors.global}</span>
              </div>
            )}

            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User size={14} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="E.g., Venugopal Ummadisetty"
                    className={`w-full bg-black/40 border ${
                      errors.name ? "border-rose-500" : "border-white/5 focus:border-indigo-500/50"
                    } pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none transition-all`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-rose-500 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail size={14} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="yourname@organization.com"
                    className={`w-full bg-black/40 border ${
                      errors.email ? "border-rose-500" : "border-white/5 focus:border-indigo-500/50"
                    } pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-rose-500 font-medium">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Row 2: Phone and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">
                  Phone Number <span className="text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone size={14} />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 94928 70650"
                    className={`w-full bg-black/40 border ${
                      errors.phone ? "border-rose-500" : "border-white/5 focus:border-indigo-500/50"
                    } pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none transition-all`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-rose-500 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Subject Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">
                  Subject / Project Topic <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Edit3 size={14} />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="E.g., Automated Testing Project"
                    className={`w-full bg-black/40 border ${
                      errors.subject ? "border-rose-500" : "border-white/5 focus:border-indigo-500/50"
                    } pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none transition-all`}
                  />
                </div>
                {errors.subject && (
                  <p className="text-[10px] text-rose-500 font-medium">{errors.subject}</p>
                )}
              </div>
            </div>

            {/* Message Box */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">
                Message & Detail Scope <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-slate-500">
                  <MessageSquare size={14} />
                </div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Provide details about your project needs, SDET recruitment, or testing inquiries..."
                  className={`w-full bg-black/40 border ${
                    errors.message ? "border-rose-500" : "border-white/5 focus:border-indigo-500/50"
                  } pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none transition-all resize-none`}
                ></textarea>
              </div>
              {errors.message && (
                <p className="text-[10px] text-rose-500 font-medium">{errors.message}</p>
              )}
            </div>

            {/* Validation & Submit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono bg-emerald-500/10 py-1 px-2.5 rounded-lg border border-emerald-500/15">
                <ShieldCheck size={12} />
                Server-Side Cryptographic Validation Guard Active
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-55 text-white font-bold text-xs uppercase tracking-widest py-2.5 px-5 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating Payload...
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    Send Proposal Lead
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 px-4 flex flex-col items-center justify-center"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full mb-4 border border-emerald-500/10 animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Proposal Transmitted Safely!</h4>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              {successResponse.message}
            </p>

            <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-xl max-w-xs w-full">
              <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-bold">Transaction Lead Ref ID</span>
              <span className="text-xs text-indigo-400 font-mono font-bold mt-1 block select-all">
                {successResponse.referenceId}
              </span>
            </div>

            <button
              onClick={() => setSuccessResponse(null)}
              className="mt-6 text-xs text-slate-400 hover:text-indigo-400 hover:underline transition-all cursor-pointer"
            >
              Submit Another Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
