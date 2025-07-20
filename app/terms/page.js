import Header from '../../components/Header'

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              These Terms and Conditions ("Terms") govern your use of RIGHT2FIX ("the Website"). By accessing or using the Website, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use the Website. These Terms are a legally binding agreement between you and RIGHT2FIX.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Use of the Website</h2>
            <p>
              The Website provides a platform for users to compare prices and features of auto parts from various third-party suppliers. RIGHT2FIX does not sell any products directly and is not responsible for transactions between you and third-party vendors. You acknowledge that any reliance on the information provided on the Website is at your own risk. We do not guarantee the accuracy, availability, or suitability of any products listed on the Website. The content on the Website is provided "as is" and is for general informational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Obligations and Conduct</h2>
            <p className="mb-2">You agree to use the Website for lawful purposes only. You must not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Website in any way that violates any applicable local, national, or international law or regulation.</li>
              <li>Attempt to gain unauthorized access to any part of the Website, its servers, or any data associated with it.</li>
              <li>Distribute, modify, transmit, reuse, download, repost, copy, or use the content of the Website for public or commercial purposes without our written permission.</li>
              <li>Post, transmit, or introduce any malicious software, viruses, or harmful content that may impair the functionality of the Website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Third-Party Links and Content</h2>
            <p>
              The Website may contain links to third-party websites, products, or services that are not owned or controlled by RIGHT2FIX. RIGHT2FIX has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party websites or services. Any transactions or interactions between you and third-party vendors are solely between you and the vendor. RIGHT2FIX will not be liable for any loss or damage incurred as a result of such dealings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Use of Manufacturer Names and Symbols</h2>
            <p>
              All manufacturer names, symbols, and descriptions used in our images and text are used solely for identification purposes. It is neither inferred nor implied that any item sold by RIGHT2FIX is a product authorized by or in any way connected with any vehicle manufacturers displayed on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, RIGHT2FIX and its affiliates, officers, directors, employees, and agents will not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Website or any content provided herein. This includes, but is not limited to, damages for errors, omissions, interruptions, defects, delays, computer viruses, loss of profits, loss of data, and unauthorized access to user transmissions or data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Disclaimer of Warranties</h2>
            <p>
              RIGHT2FIX makes no representations or warranties of any kind, express or implied, regarding the Website's operation or the information, content, materials, or products included on the Website. To the fullest extent permissible by applicable law, RIGHT2FIX disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
            <p>
              RIGHT2FIX reserves the right to modify these Terms at any time. Any changes will be effective immediately upon posting on the Website. It is your responsibility to review these Terms periodically. Your continued use of the Website after any modifications to the Terms will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Texas, without regard to its conflict of law principles. Any dispute arising from these Terms or your use of the Website shall be resolved exclusively in the courts of Texas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Affiliate Marketing Disclosure</h2>
            <p>
              RIGHT2FIX participates in affiliate marketing programs, which means we may earn commissions from qualifying purchases made through links on our website. These affiliate links do not affect the price you pay. As an affiliate, RIGHT2FIX is compensated for directing traffic and business to our affiliate partners through referrals. We are committed to transparency and comply with all applicable laws and regulations, including the Federal Trade Commission (FTC) guidelines, which require us to clearly disclose our affiliate relationships to our users. Our goal is to provide honest, accurate information to help you make informed purchasing decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at hello@right2fix.com
            </p>
          </section>
        </div>
      </div>
    </>
  )
}