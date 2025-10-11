import Link from "next/link"
import { SUPPORTED_COUNTRIES } from "@/lib/countries"

export default function StripeSetupHelpPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/settings"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Settings
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">How to Set Up Stripe Payouts</h1>
            <p className="text-gray-600 mt-2">
              Complete guide for setting up your payout method to receive donations
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 mb-4">
                To receive donations from players, you need to connect a Stripe account. We use <strong>Stripe Connect Express</strong> which allows you to receive payments <strong>as an individual</strong> - no business registration required!
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Even though Stripe asks for &quot;business&quot; information, you&apos;re setting this up as an <strong>individual</strong>. The business questions are for regulatory compliance, not because you need to register a business.
                </p>
              </div>
            </section>

            {/* What You'll Need */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What You&apos;ll Need</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">📋 Personal Information</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Your legal name (first &amp; last)</li>
                    <li>• Date of birth</li>
                    <li>• Home address</li>
                    <li>• Phone number</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">🏦 Banking Details</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Personal bank account</li>
                    <li>• Account number</li>
                    <li>• Routing/sort code (country-specific)</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">🆔 Identification</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Government-issued photo ID</li>
                    <li>• Driver&apos;s license or passport</li>
                    <li>• Clear, readable photo</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">💼 Tax Information</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Tax ID (SSN, TFN, etc.)</li>
                    <li>• Usually optional initially</li>
                    <li>• Required for larger amounts</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* General Instructions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Fill Out the Form</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Business Name</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Enter your personal name</strong> (e.g., &quot;John Smith&quot;)<br />
                    NOT a business name. This is your legal name as an individual.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Business Name (DBA) / Doing Business As</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Leave blank</strong> or enter your server name<br />
                    This is optional. Use it if you want donations to show a specific name.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Business Registration Number</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Leave blank if you don&apos;t have one</strong><br />
                    (ABN in Australia, EIN in US, etc.) - Only fill if you have one. Most individuals don&apos;t need this.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Business Address</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Use your home address</strong><br />
                    This is where you&apos;ll receive tax documents and official correspondence.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Industry</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Select:</strong> &quot;Charitable and Social Service Organizations&quot; or &quot;Membership Organizations&quot;<br />
                    This categorizes your activity as donations/community support.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Business Website</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Enter:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">https://commpledge.vercel.app</code><br />
                    Or your server&apos;s website if you have one.
                  </p>
                </div>
              </div>
            </section>

            {/* Country-Specific Instructions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Country-Specific Requirements</h2>

              {/* Australia */}
              <div className="mb-6 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🇦🇺 Australia</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>Bank Account:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>BSB number (6 digits)</li>
                      <li>Account number (6-10 digits)</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Tax Information:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>Tax File Number (TFN) - optional for small amounts</li>
                      <li>ABN - only if you have one (not required for individuals)</li>
                    </ul>
                  </div>
                  <div>
                    <strong>ID Verification:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>Australian driver&apos;s license, OR</li>
                      <li>Australian passport</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> You don&apos;t need an ABN to receive donations as an individual. Only provide it if you already have one for other reasons.
                    </p>
                  </div>
                </div>
              </div>

              {/* United States */}
              <div className="mb-6 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🇺🇸 United States</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>Bank Account:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>Routing number (9 digits)</li>
                      <li>Account number</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Tax Information:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>Social Security Number (SSN) - required</li>
                      <li>EIN - only if you have a business (not needed for individuals)</li>
                    </ul>
                  </div>
                  <div>
                    <strong>ID Verification:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>State-issued driver&apos;s license, OR</li>
                      <li>US passport</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* United Kingdom */}
              <div className="mb-6 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🇬🇧 United Kingdom</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>Bank Account:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>Sort code (6 digits)</li>
                      <li>Account number (8 digits)</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Tax Information:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>National Insurance number - optional initially</li>
                      <li>UTR (Unique Taxpayer Reference) - only if self-employed</li>
                    </ul>
                  </div>
                  <div>
                    <strong>ID Verification:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>UK driver&apos;s license, OR</li>
                      <li>UK passport</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Canada */}
              <div className="mb-6 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🇨🇦 Canada</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>Bank Account:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>Institution number (3 digits)</li>
                      <li>Transit number (5 digits)</li>
                      <li>Account number</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Tax Information:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>Social Insurance Number (SIN) - required</li>
                      <li>Business Number - only if you have a registered business</li>
                    </ul>
                  </div>
                  <div>
                    <strong>ID Verification:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>Canadian driver&apos;s license, OR</li>
                      <li>Canadian passport</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* European Union */}
              <div className="mb-6 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🇪🇺 European Union Countries</h3>
                <p className="text-sm text-gray-600 mb-3">
                  (Germany, France, Spain, Italy, Netherlands, etc.)
                </p>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>Bank Account:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>IBAN (International Bank Account Number)</li>
                      <li>BIC/SWIFT code (for some banks)</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Tax Information:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>VAT ID - only if you have a business (most individuals don&apos;t)</li>
                      <li>Tax ID varies by country (optional initially)</li>
                    </ul>
                  </div>
                  <div>
                    <strong>ID Verification:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      <li>National ID card, OR</li>
                      <li>Passport from your country</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Other Countries */}
              <div className="mb-6 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🌏 Other Supported Countries</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Requirements vary by country but generally include:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Personal bank account in your country</li>
                  <li>Government-issued photo ID</li>
                  <li>Tax ID (if required by your country)</li>
                  <li>Proof of address (sometimes)</li>
                </ul>
                <div className="mt-4">
                  <p className="text-xs text-gray-600">
                    <strong>Supported Countries:</strong> {SUPPORTED_COUNTRIES.map(c => c.flag).join(" ")}
                  </p>
                </div>
              </div>
            </section>

            {/* Step by Step */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step Instructions</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">Personal Details</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Enter your <strong>personal name</strong> (not a business name). Use your legal name exactly as it appears on your ID.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">Business Information (Fill as Individual)</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Even though it says &quot;business,&quot; fill it as an individual:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2 ml-2">
                      <li><strong>Legal name:</strong> Your personal name</li>
                      <li><strong>DBA:</strong> Leave blank or use your server name</li>
                      <li><strong>Registration number:</strong> Leave blank (unless you have ABN/EIN)</li>
                      <li><strong>Address:</strong> Your home address</li>
                      <li><strong>Industry:</strong> Select &quot;Charitable&quot; or &quot;Membership Organizations&quot;</li>
                      <li><strong>Website:</strong> Enter <code className="bg-gray-100 px-1">commpledge.vercel.app</code></li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">Banking Information</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Enter your <strong>personal bank account</strong> details. This is where you&apos;ll receive payouts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">Identity Verification</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Upload a clear photo of your government-issued ID. Make sure all text is readable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">Review and Submit</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Review all information carefully. Stripe will verify your details and activate your account, usually within 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Common Questions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Questions</h2>

              <div className="space-y-4">
                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-900">Why does it ask for business information?</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Financial regulations require Stripe to collect certain information about any economic activity. Even as an individual, you need to declare what you&apos;re receiving money for. Just fill it with your personal details.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-900">Do I need to register a business?</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>No!</strong> You can operate as an individual. Leave business registration fields blank unless you already have a registered business.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-900">Do I need a business bank account?</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>No!</strong> Use your personal bank account. The money will be deposited there.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-900">What about taxes?</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Stripe will report your earnings to tax authorities (IRS in US, ATO in Australia, etc.). You&apos;re responsible for declaring this as income. Consult a tax professional for specific advice.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-900">How long does verification take?</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Usually 24-48 hours. Sometimes instant if all information is clear. You&apos;ll receive an email when approved.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-900">When will I receive payouts?</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    After verification completes, payouts are automatic:
                  </p>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>Default: Daily (for verified accounts)</li>
                    <li>New accounts: 7-14 day rolling basis initially</li>
                    <li>Changes to daily after processing history</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-900">Is there a minimum payout amount?</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Varies by country. Usually $1-25 USD equivalent. Stripe will hold funds until minimum is reached.
                  </p>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Tips for Success</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Use your <strong>personal name</strong> everywhere, not a business name</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Make sure your ID is clear and all text is readable</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Double-check your bank details - errors delay payouts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Leave business registration fields <strong>blank</strong> if you don&apos;t have them</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete all required fields - incomplete forms delay approval</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Check your email - Stripe may ask for additional verification</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Payout Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Understanding Payouts</h2>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How Payouts Work</h3>
                <p className="text-gray-700 mb-4">
                  When someone donates to your server, the money goes through this process:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">Donation Made</p>
                      <p className="text-sm text-gray-600">Player donates via saved card → Payment captured by Stripe</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">Platform Fee Deducted</p>
                      <p className="text-sm text-gray-600">5% platform fee taken (Stripe fees separate)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">Added to Balance</p>
                      <p className="text-sm text-gray-600">95% of donation added to your Stripe balance</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">Automatic Payout</p>
                      <p className="text-sm text-gray-600">Stripe automatically transfers to your bank account</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payout Timeline */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">⏱️ Payout Timeline</h3>
                
                <div className="space-y-4">
                  <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">🆕 New Accounts (First 2-4 weeks)</h4>
                    <p className="text-sm text-amber-800 mb-2">
                      When you first connect Stripe, there&apos;s an initial holding period for security:
                    </p>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1 ml-2">
                      <li><strong>First payout:</strong> 7-14 days after first donation</li>
                      <li><strong>Reason:</strong> Fraud protection and account verification</li>
                      <li><strong>What happens:</strong> Funds accumulate, then first payout includes everything</li>
                    </ul>
                  </div>

                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Established Accounts (After Initial Period)</h4>
                    <p className="text-sm text-green-800 mb-2">
                      Once your account is established, payouts become automatic and fast:
                    </p>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1 ml-2">
                      <li><strong>Schedule:</strong> Daily automatic payouts</li>
                      <li><strong>Timeline:</strong> 2-3 business days to your bank</li>
                      <li><strong>Example:</strong> Donation Monday → In your bank Wednesday/Thursday</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Country Payout Times */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🌍 Payout Times by Country</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">🇦🇺 Australia</td>
                        <td className="px-4 py-3 text-sm text-gray-700">2-3 business days</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Direct deposit</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">🇺🇸 United States</td>
                        <td className="px-4 py-3 text-sm text-gray-700">2 business days</td>
                        <td className="px-4 py-3 text-sm text-gray-700">ACH transfer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">🇬🇧 United Kingdom</td>
                        <td className="px-4 py-3 text-sm text-gray-700">2-3 business days</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Faster Payments</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">🇨🇦 Canada</td>
                        <td className="px-4 py-3 text-sm text-gray-700">3-5 business days</td>
                        <td className="px-4 py-3 text-sm text-gray-700">EFT transfer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">🇪🇺 EU Countries</td>
                        <td className="px-4 py-3 text-sm text-gray-700">2-4 business days</td>
                        <td className="px-4 py-3 text-sm text-gray-700">SEPA transfer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">🇸🇬 Singapore</td>
                        <td className="px-4 py-3 text-sm text-gray-700">3-7 business days</td>
                        <td className="px-4 py-3 text-sm text-gray-700">PayNow/GIRO</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">Other countries</td>
                        <td className="px-4 py-3 text-sm text-gray-700">3-7 business days</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Local transfer</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* How to Check Payouts */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 How to Check Your Payouts</h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Method 1: Stripe Dashboard (Most Detailed)</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 ml-2">
                      <li>Go to <a href="https://dashboard.stripe.com/connect/accounts" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Stripe Dashboard</a></li>
                      <li>Sign in with your Stripe Express account</li>
                      <li>Click <strong>&quot;Balance&quot;</strong> in the sidebar</li>
                      <li>You&apos;ll see:
                        <ul className="list-disc list-inside mt-1 ml-4">
                          <li><strong>Available balance:</strong> Ready to be paid out</li>
                          <li><strong>Pending balance:</strong> Being processed</li>
                          <li><strong>Payout schedule:</strong> Next payout date</li>
                        </ul>
                      </li>
                      <li>Click <strong>&quot;Payouts&quot;</strong> to see history of bank transfers</li>
                    </ol>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Method 2: Email Notifications</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Stripe automatically sends email notifications for:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                      <li>✅ When a donation is received</li>
                      <li>✅ When a payout is initiated</li>
                      <li>✅ When money arrives in your bank</li>
                      <li>✅ If there are any issues with payouts</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Method 3: Your Bank Account</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Check your bank statement for deposits from:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                      <li><strong>Descriptor:</strong> &quot;STRIPE&quot; or &quot;Stripe Payments&quot;</li>
                      <li><strong>Reference:</strong> May include your platform name</li>
                      <li><strong>Amount:</strong> Net amount after fees</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* What You'll Receive */}
              <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">💵 What You&apos;ll Actually Receive</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-700 mb-2">Example: Player donates <strong>$10.00 USD</strong></p>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Donation amount:</span>
                        <span className="font-semibold">$10.00</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Platform fee (5%):</span>
                        <span className="font-semibold">-$0.50</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Stripe processing fee (~2.9% + $0.30):</span>
                        <span className="font-semibold">-$0.59</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between text-green-600 font-bold">
                        <span>You receive:</span>
                        <span>$8.91</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 mt-3">
                    <p><strong>Note:</strong> Stripe fees vary by card type and country. International cards may have higher fees (~3.9% + $0.30).</p>
                  </div>
                </div>
              </div>

              {/* Payout Schedule Explained */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📅 Payout Schedule Explained</h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Daily Payouts (Standard)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Our platform is configured for <strong>daily automatic payouts</strong>:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                      <li>Stripe initiates payout once per day</li>
                      <li>Includes all donations from previous day</li>
                      <li>Takes 2-5 business days to reach bank</li>
                      <li>No action needed - completely automatic</li>
                    </ul>
                    <div className="mt-3 bg-gray-50 rounded p-3">
                      <p className="text-xs text-gray-700">
                        <strong>Example Timeline:</strong><br />
                        Monday: $20 in donations → Payout initiated Tuesday → Money in bank Thursday
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Rolling Reserve (New Accounts)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      For the first 2-4 weeks, Stripe uses a <strong>rolling reserve</strong>:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                      <li>Payouts delayed by 7-14 days initially</li>
                      <li>Protects against fraud and chargebacks</li>
                      <li>Automatically switches to daily schedule after building history</li>
                      <li>Completely normal - happens to all new accounts</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Minimum Payout */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">💵 Minimum Payout Amounts</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Stripe won&apos;t send a payout until your balance reaches a minimum threshold:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded p-3">
                    <p className="text-sm"><strong>🇦🇺 Australia:</strong> $1 AUD</p>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <p className="text-sm"><strong>🇺🇸 United States:</strong> $1 USD</p>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <p className="text-sm"><strong>🇬🇧 UK:</strong> £1 GBP</p>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <p className="text-sm"><strong>🇪🇺 EU:</strong> €1 EUR</p>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <p className="text-sm"><strong>🇨🇦 Canada:</strong> $1 CAD</p>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <p className="text-sm"><strong>Other:</strong> $1-25 USD equiv.</p>
                  </div>
                </div>
              </div>

              {/* Viewing Payouts */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">👀 How to View Your Earnings</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">In Stripe Dashboard:</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 ml-2">
                      <li>Visit <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">dashboard.stripe.com</a></li>
                      <li>Log in with your Stripe account</li>
                      <li>View <strong>Balance</strong> - See available and pending funds</li>
                      <li>View <strong>Payouts</strong> - See transfer history to bank</li>
                      <li>View <strong>Payments</strong> - See individual donations received</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Understanding Your Balance:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                      <li><strong>Available:</strong> Ready to be paid out (will go out on next payout)</li>
                      <li><strong>Pending:</strong> Being processed (will become available soon)</li>
                      <li><strong>In transit:</strong> On the way to your bank</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Instant Payouts */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">⚡ Instant Payouts (Optional)</h3>
                <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Some countries support <strong>Instant Payouts</strong> for eligible accounts:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2 mb-3">
                    <li><strong>Speed:</strong> Money in your bank within minutes</li>
                    <li><strong>Cost:</strong> 0.5-1% fee per payout</li>
                    <li><strong>Eligibility:</strong> Must have debit card linked (not all banks supported)</li>
                    <li><strong>Availability:</strong> US, UK, EU, SG, AU (limited banks)</li>
                  </ul>
                  <p className="text-xs text-purple-800">
                    <strong>Note:</strong> Most users stick with free daily payouts. Instant is optional for urgent needs.
                  </p>
                </div>
              </div>

              {/* Tax Information */}
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📋 Tax Reporting</h3>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Important:</strong> Donations you receive are considered income for tax purposes.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>What Stripe Does:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Reports your earnings to tax authorities (IRS, ATO, HMRC, etc.)</li>
                    <li>Sends you tax forms (1099-K in US, similar in other countries)</li>
                    <li>Usually only if you earn over threshold (e.g., $600/year in US)</li>
                  </ul>
                  <p className="mt-3"><strong>What You Should Do:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Keep records of donations received</li>
                    <li>Declare as income on tax return</li>
                    <li>Consult a tax professional for specific advice</li>
                    <li>Deduct server hosting costs (may be applicable)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🔧 Troubleshooting</h2>

              <div className="space-y-3">
                <details className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    Account verification is taking too long
                  </summary>
                  <p className="text-sm text-gray-700 mt-2">
                    Stripe typically verifies within 24-48 hours. If it&apos;s longer, check:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2 ml-2">
                    <li>Your email for verification requests</li>
                    <li>Stripe dashboard for pending actions</li>
                    <li>ID photo quality (upload clearer photo if needed)</li>
                  </ul>
                </details>

                <details className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    Bank details rejected
                  </summary>
                  <p className="text-sm text-gray-700 mt-2">
                    Common issues:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2 ml-2">
                    <li>Account number format incorrect</li>
                    <li>Using savings account (use checking/current)</li>
                    <li>Bank doesn&apos;t support electronic transfers</li>
                  </ul>
                </details>

                <details className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    Need to change country
                  </summary>
                  <p className="text-sm text-gray-700 mt-2">
                    If you selected the wrong country, you need to reset:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-gray-700 mt-2 ml-2">
                    <li>Go to <Link href="/dashboard/stripe/reset" className="text-indigo-600 hover:underline">/dashboard/stripe/reset</Link></li>
                    <li>Delete your current connection</li>
                    <li>Update country in Settings</li>
                    <li>Connect again with correct country</li>
                  </ol>
                </details>

                <details className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    Still asking for business registration
                  </summary>
                  <p className="text-sm text-gray-700 mt-2">
                    This is normal for compliance. You can:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2 ml-2">
                    <li><strong>Leave it blank</strong> - Most individuals don&apos;t have this</li>
                    <li>Enter your personal name as the &quot;business name&quot;</li>
                    <li>Select industry: &quot;Charitable&quot; or &quot;Membership&quot;</li>
                  </ul>
                </details>
              </div>
            </section>

            {/* Get Help */}
            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Stripe Support</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    For account setup issues or verification questions:
                  </p>
                  <a
                    href="https://support.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Visit Stripe Support →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Platform Support</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    For platform-specific issues:
                  </p>
                  <Link
                    href="/settings"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Go to Settings →
                  </Link>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white text-center">
              <h2 className="text-xl font-bold mb-2">Ready to Get Started?</h2>
              <p className="mb-4">
                Connect your Stripe account and start receiving donations today!
              </p>
              <Link
                href="/settings"
                className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
              >
                Go to Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
