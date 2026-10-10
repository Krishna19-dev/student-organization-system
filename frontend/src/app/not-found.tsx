import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
        <Compass className="w-6 h-6 text-secondary-light" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-body">404 - Page Not Found</h1>
        <p className="text-sm text-muted">
          The campus resource or page you are looking for does not exist or has moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Skyline Home</span>
      </Link>
    </div>
  );
}
