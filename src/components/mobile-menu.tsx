"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="rounded-full p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            <Link href="#accelerator" className="font-medium hover:underline">
              Accelerator
            </Link>
            <Link href="#team" className="font-medium hover:underline">
              Team
            </Link>
            <Link href="#news" className="font-medium hover:underline">
              News
            </Link>
            <Link href="#faq" className="font-medium hover:underline">
              FAQs
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
