import { Metadata } from 'next'

import { bemClass } from '@/utils'

import Container from '@/components/container'
import Text from '@/components/text'
import PausedAnimationCoverPage from '@/components/paused-animation-cover-page'

import './style.scss'

const blk = 'end-user-license-agreement'

const EndUserLicenseAgreement = () => (
  <>
    <PausedAnimationCoverPage />
    <Container>
      <Text tag="h1" typography="xxl" className={bemClass([blk, 'page-title'])}>
        END USER LICENSE AGREEMENT
      </Text>
      <div className={bemClass([blk, 'summary'])}>
        <Text tag="p" typography="l" className={bemClass([blk, 'summary-text'])}>
          END USER LICENSE AGREEMENT IS FOR ALL LOGINEXT’S MOBILE AND WEB APPLICATIONS AND ALL
          ITS VERSIONS WHICH OFFERS A LOCATION BASED REAL-TIME TRACKING AND ANALYTICS SOLUTION.
          BY DOWNLOADING, INSTALLING, COPYING, ACCESSING OR USING THE SOFTWARES, YOU AGREE TO
          THE TERMS OF THIS END USER LICENSE AGREEMENT. IF YOU ARE ACCEPTING THESE TERMS ON
          BEHALF OF ANOTHER PERSON OR COMPANY OR OTHER LEGAL ENTITY, YOU REPRESENT AND WARRANT
          THAT YOU HAVE FULL AUTHORITY TO BIND THAT PERSON, COMPANY OR LEGAL ENTITY TO THESE
          TERMS.
        </Text>
        <Text tag="p" typography="l" className={bemClass([blk, 'summary-text'])}>
          <>
            <strong>IF YOU DO NOT AGREE TO THESE TERMS:</strong>
            <br />
            1. DO NOT DOWNLOAD, INSTALL, COPY, ACCESS OR USE THE SOFTWARE, AND<br />

            2. PROMPTLY RETURN THIS SOFTWARE AND PROOF OF ENTITLEMENT TO THE PARTY FROM WHOM YOU ACQUIRED THEM
          </>
        </Text>
      </div>
      <div className={bemClass([blk, 'content'])}>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          INTRODUCTION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          This End User License Agreement (&quot;EULA&quot;) is entered into as of the date of download
          (&quot;Effective Date&quot;) by and between Loginext Solutions Private Limited (&quot;LogiNext&quot;), a
          company incorporated under The Companies Act, 2013, having its registered office at
          1901, Happiness, City of Joy, Mulund West, Mumbai 400080, and the person, company or
          entity (&quot;User&quot;) who downloads, installs or uses the mobile or web application for any
          purpose including for the purposes of inter-operability or individual investigation.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Whereas, LogiNext has developed a proprietary solution using map data, and the related
          proprietary technology to track, search, manipulate, calculate and display the location
          data via web and mobile interface; Whereas, User desires to download, install or use the
          LogiNext Mobile Applications and LogiNext Subscription Service (as those terms are defined
          below);
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Now Therefore, in consideration of the terms and conditions set forth herein, LogiNext
          and User agree as follows:
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          1. DEFINITIONS
        </Text>
        <ul className={bemClass([blk, 'content-list', ['letter']])}>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            &quot;User&apos;s Internal Computers&quot; shall mean any computer server or standalone
            computer within Client&apos;s control and located in buildings or premises used for internal
            work and work related activities.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            &quot;Confidential Information&quot; shall mean any confidential or proprietary information of
            LogiNext, including but not limited to, information regarding LogiNext&apos;s products,
            data, images, software, applications, specifications, libraries, utilities, services,
            technology, business, the LogiNext Subscription Service, any feedback provided by User,
            and the terms and conditions of this Agreement.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            &quot;Intellectual Property Right&quot; shall mean any patent, copyright, trademark, or trade
            secret rights, or any other intellectual property right or proprietary rights in any
            invention, information, know-how, or technology, whether now known or hereafter
            recognized, and whether registered or unregistered.
          </Text>
        </ul>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          2. RIGHTS & RESTRICTIONS
        </Text>
        <ul className={bemClass([blk, 'content-list', ['letter']])}>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            User shall not use the LogiNext Mobile Applications or the LogiNext Subscription
            Service in contravention of this Agreement or applicable laws.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            User acknowledges that the LogiNext Mobile Applications and LogiNext Subscription
            Service contain valuable trade secrets of LogiNext. Accordingly, except as expressly
            permitted herein, User will not (i) transfer, assign, sublicense, distribute, or
            provide access the LogiNext Subscription Service or LogiNext Mobile Applications,
            (ii) reproduce, modify, or create derivative works of any images provided with the
            LogiNext Subscription Service or LogiNext Mobile Applications, or (iii) disassemble,
            decompile or otherwise reverse engineer any LogiNext Mobile Applications or LogiNext
            Subscription Services.
          </Text>
        </ul>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          3. OWNERSHIP
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          As between the User and LogiNext (&quot;Parties&quot;), LogiNext owns all right, title, and
          interest in and to the LogiNext Mobile Applications and LogiNext Subscription Service,
          including all Intellectual Property Rights therein. There are no implied licenses
          granted under this Agreement. Nothing contained herein shall be construed as conferring
          upon User any right to use in advertising, publicity or other marketing activities,
          any name, trade name, trademark, logo, or other designation of LogiNext. When User
          downloads the app, uploads, submits, stores, sends or receives content to or through
          LogiNext Mobile Application or Subscription Services, User gives LogiNext (and those we
          work with) a worldwide license to use, host, store, reproduce, modify and create derivative
          works (such as those resulting from translations, adaptations or other changes LogiNext
          makes so that its services work better).
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          4. LIMITATION OF LIABILITY
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          IN NO EVENT WILL LOGINEXT BE LIABLE TO USER OR ANY THIRD PARTY FOR ANY INCIDENTAL,
          INDIRECT, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING LOST PROFITS,
          LOST DATA OR LOST REVENUE ARISING FROM OR RELATED TO THIS AGREEMENT OR THE LOGINEXT
          SUBSCRIPTION SERVICE OR LOGINEXT MOBILE APPLICATIONS, HOWEVER CAUSED AND REGARDLESS OF
          THE FORM OF ACTION, WHETHER IN CONTRACT OR TORT OR OTHERWISE, EVEN IF LOGINEXT HAS BEEN
          ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          5. CONFIDENTIALITY
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          User will restrict access to the Confidential Information to those of its employees
          who have signed confidentiality agreements at least as restrictive as those contained
          herein. User shall use at least the same standard of care as used to protect its own
          confidential information of similar nature, but no less than reasonable care, to prevent
          unauthorized use or disclosure of the Confidential Information. Upon discovering any
          unauthorized use or disclosure of Confidential Information, User shall promptly notify
          LogiNext.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          6. INDEMNIFICATION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          User agrees to defend, indemnify and hold harmless LogiNext and its officers, directors,
          employees, and agents from and against any and all third party claims, demands, actions,
          losses, liabilities, damages or expenses (including court costs and reasonable attorney&apos;s fees)
          arising out of or relating to any use by User.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          7. GOVERNING LAW
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          All disputes arising out of or relating to this Agreement or its subject matter will
          be governed by the substantive laws of India, if you purchased the license to the
          Software in the India.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          8. APPLICATION OF TERMS OF USE OF PRIVACY POLICY-
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          BY DOWNLOADING, INSTALLING, COPYING, ACCESSING OR USING THE SOFTWARES, YOU AGREE TO
          THE TERMS OF USE AND PRIVACY POLICY.
        </Text>
      </div>
    </Container>
  </>
)

const title = 'End User License Agreement - Loginext'
const description = 'End User License Agreement - Loginext'
const url = 'https://www.loginextsolutions.com/end-user-license-agreement'

const metadata: Metadata = {
  title,
  description,
  openGraph: {
    locale: 'en_US',
    type: 'website',
    title,
    description,
    url,
    siteName: 'loginextsolutions',
  },
  twitter: {
    title,
    description,
    card: 'summary'
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  EndUserLicenseAgreement as default,
  metadata
}

