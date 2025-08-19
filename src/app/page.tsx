"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileMenu } from "@/components/mobile-menu";

export default function HomePage() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
			{/* Header */}
			<header className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-zinc-200/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-300 dark:border-zinc-700 rounded-full shadow-lg px-8 py-3 z-50 flex items-center gap-8">
				<div className="font-bold text-lg">CH</div>
				<nav className="hidden md:flex gap-8">
					<a href="#accelerator" className="font-medium hover:underline">
						Accelerator
					</a>
					<a href="#team" className="font-medium hover:underline">
						Team
					</a>
					<a href="#news" className="font-medium hover:underline">
						News
					</a>
					<a href="#faq" className="font-medium hover:underline">
						FAQs
					</a>
				</nav>
				<div className="md:hidden ml-auto">
					<MobileMenu />
				</div>
				<Button variant="outline" className="hidden md:block ml-auto">
					Donate
				</Button>
				<Button variant="outline" onClick={() => (window.location.href = "/login")}>
					CRM
				</Button>
				<ModeToggle />
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-6 md:px-12 py-32">
				{/* Hero Section */}
				<section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
					<div>
						<span className="inline-block bg-zinc-200 dark:bg-zinc-800 text-sm px-4 py-2 rounded-full">
							Idea‑to‑Impact Accelerator • Fall cohorts
						</span>
						<h1 className="text-5xl font-extrabold mt-6 leading-tight">
							Build your nonprofit with clarity, confidence, and community.
						</h1>
						<p className="text-gray-700 dark:text-gray-300 mt-6">
							8‑week cohort program + practical tools backed by 25+ years of nonprofit leadership in Chicago.
						</p>
						<div className="flex gap-6 mt-8">
							<Button>Apply to Accelerator</Button>
							<Button variant="outline">Donate</Button>
							<Button variant="outline" onClick={() => (window.location.href = "/login")}>
								CRM
							</Button>
						</div>
						<p className="text-gray-700 dark:text-gray-300 mt-4">
							In‑person & online cohorts each fall.
						</p>
					</div>
					<div className="h-full bg-zinc-200 dark:bg-zinc-800 border border-solid border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden flex items-center justify-center">
						<img
							src="https://picsum.photos/800/600"
							alt="Hero Placeholder"
							className="w-full h-full object-cover"
						/>
					</div>
				</section>

				{/* Logos */}
				<div className="text-center py-12">
					<p className="text-gray-700 dark:text-gray-400">Trusted by Chicago leaders & partners</p>
				</div>

				{/* Features Section */}
				<section id="accelerator" className="py-20">
					<h2 className="text-3xl font-bold">Idea to Impact Accelerator</h2>
					<p className="text-gray-700 dark:text-gray-300 mt-4">
						8‑week nonprofit launch program — cohort‑based training, clear roadmap, peer network, pitch deck, and fundraising framework.
					</p>
					<div className="grid md:grid-cols-3 gap-8 mt-8">
						<Card className="p-6">
							<h3 className="text-xl font-semibold">Cohort‑based training</h3>
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								Weekly working sessions that turn vision into a launch‑ready program.
							</p>
						</Card>
						<Card className="p-6">
							<h3 className="text-xl font-semibold">Strategic roadmap</h3>
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								Define mission, model, operations, and metrics to scale impact.
							</p>
						</Card>
						<Card className="p-6">
							<h3 className="text-xl font-semibold">Pitch & fundraising</h3>
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								Create a deck and development plan to meet donors with confidence.
							</p>
						</Card>
					</div>
					<p className="text-gray-700 dark:text-gray-300 mt-6">Tuition: $5,000 per participant.</p>
				</section>

				{/* Blog Section */}
				<section id="news" className="py-20">
					<h2 className="text-3xl font-bold">From the Blog</h2>
					<div className="grid md:grid-cols-3 gap-8 mt-8">
						<Card className="p-6">
							<h3 className="text-xl font-semibold">Building Coach House</h3>
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								Early lessons from our first six months serving Chicago leaders.
							</p>
							<p className="text-gray-700 dark:text-gray-400 mt-4">— Joel Hamernick</p>
						</Card>
						<Card className="p-6">
							<h3 className="text-xl font-semibold">Every Chicagoan Can Help</h3>
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								How to engage during National Gun Violence Awareness: Wear Orange.
							</p>
							<p className="text-gray-700 dark:text-gray-400 mt-4">— Chicago Sun‑Times Op‑Ed</p>
						</Card>
						<Card className="p-6">
							<h3 className="text-xl font-semibold">Networks Create Opportunity</h3>
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								On the cost of segregation and the power of networks.
							</p>
							<p className="text-gray-700 dark:text-gray-400 mt-4">— Coach House</p>
						</Card>
					</div>
				</section>

				{/* FAQ Section */}
				<section id="faq" className="py-20">
					<h2 className="text-3xl font-bold">FAQ</h2>
					<div className="space-y-6 mt-8">
						<Card className="p-6">
							<strong>How long is the Accelerator?</strong>
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								8 weeks, with in‑person and online cohorts each fall.
							</p>
						</Card>
						<Card className="p-6">
							<strong>What does it cost?</strong>
							<p className="text-gray-700 dark:text-gray-300 mt-2">$5,000 per participant.</p>
						</Card>
						<Card className="p-6">
							<strong>Do you consult with existing nonprofits?</strong>
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								Yes — assessments, strategy, board training, finance, fundraising, programs, brand, and fiscal sponsorship.
							</p>
						</Card>
						<Card className="p-6">
							<strong>Where are you located?</strong>
							<p className="text-gray-700 dark:text-gray-300 mt-2">
								200 W Madison St, 2nd Floor, Chicago, IL 60606.
							</p>
						</Card>
					</div>
				</section>

				{/* Call to Action */}
				<section id="cta" className="py-20 text-center">
					<h2 className="text-3xl font-bold">Ready to build?</h2>
					<div className="flex justify-center gap-6 mt-8">
						<Button>Apply to Accelerator</Button>
						<Button variant="outline">Contact</Button>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="container mx-auto py-12 text-center">
				<p>© 2025 Coach House. All Rights Reserved.</p>
				<p className="text-gray-700 dark:text-gray-400 mt-2">
					200 W Madison Street, 2nd Floor, Chicago, IL 60606 •
					paula@coachhousesolutions.org
				</p>
			</footer>
		</div>
	);
}