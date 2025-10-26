"use client";

import { useState } from "react";
import { Tabs } from "@components/ui/tabs";
import { useHeaderTabs } from "@components/navigation/tabs-context";
import { useRouter, usePathname } from "next/navigation";
import { ConfirmationModal } from "@components/ui/confirmation-modal";

export function HeaderTabs() {
  const { setActive, active } = useHeaderTabs();
  const router = useRouter();
  const pathname = usePathname();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  
  const tabs = [
    { title: "Home", value: "home", content: <div /> },
    { title: "Search", value: "search", content: <div /> },
    { title: "Library", value: "library", content: <div /> },
  ];

  const handleTabChange = (value: string) => {
    // Check if we're on the assembly-preview page
    if (pathname === "/assembly-preview") {
      // Show confirmation modal
      setPendingTab(value);
      setShowConfirmModal(true);
    } else {
      // Normal navigation
      navigateToTab(value);
    }
  };

  const navigateToTab = (value: string) => {
    // Set the active tab first
    setActive(value as any);
    
    // If we're not on the main page, navigate to main page
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleConfirm = () => {
    if (pendingTab) {
      navigateToTab(pendingTab);
    }
    setShowConfirmModal(false);
    setPendingTab(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setPendingTab(null);
  };

  return (
    <>
      <Tabs
        tabs={tabs as any}
        containerClassName="flex items-center gap-1"
        tabClassName="text-sm"
        activeTabClassName="bg-white border border-black/15"
        contentClassName="hidden"
        onTabChange={handleTabChange}
      />
      
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Exit Visualization?"
        message="Are you sure you want to exit the assembly visualization? Your current progress will not be saved."
        confirmText="Exit"
        cancelText="Stay"
      />
    </>
  );
}


