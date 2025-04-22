"use client";

import { useEffect } from "react";

// Use this component to load Bootstrap JS on the client side
// since Next.js 13+ uses server components by default.
export default function BootstrapClient() {
  useEffect(() => {
    // Load Bootstrap JS
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
