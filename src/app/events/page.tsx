import React from "react";
import EventsPageClient from "./EventsPageClient";

export const metadata = {
  title: "Campus Events & Tickets | Skyline Student Association",
  description: "Browse upcoming workshops, summits, cultural fests, and book tickets with member discounts.",
};

export default function EventsPage() {
  return <EventsPageClient />;
}
