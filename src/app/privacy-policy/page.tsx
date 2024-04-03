import { Metadata } from 'next'

import { bemClass } from '@/utils'

import Text from '@/components/text'
import Container from '@/components/container'
import PausedAnimationCoverPage from '@/components/paused-animation-cover-page'

import './style.scss'

const blk = 'privacy-policy'

const PrivacyPolicy = () => (
  <>
    <PausedAnimationCoverPage />
    <Container>
      <Text tag="h1" typography="xxl" className={bemClass([blk, 'page-title'])}>
        PRIVACY POLICY
      </Text>
      <div className={bemClass([blk, 'summary'])}>
        <Text tag="p" typography="l" className={bemClass([blk, 'summary-text'])}>
          At Loginext Solutions Private Limited, we take your privacy seriously. This document
          explains what kind of information Loginext collects and stores, including Personally
          Identifiable Information (data that can be reasonably linked to a specific individual
          or household).
        </Text>
        <Text tag="p" typography="l" className={bemClass([blk, 'summary-text'])}>
          The words &quot;we&quot; or &quot;us&quot; or &quot;our&quot; “Company” or “Loginext” as used herein, refer to the
          company Loginext Solutions Private Limited and/or or any permitted assignees. The words
          &quot;you&quot; or &quot;your&quot; or &quot;user&quot; as used herein in the privacy policy refer to all individuals
          and/or entities accessing or using the Website for any reason. This privacy policy
          (&quot;Privacy Policy&quot;) is our commitment with respect to online privacy and we recognises
          and fulfils appropriate protection & management of Personal Information as shared by
          you with us. The Privacy Policy applies to our Services available under the domain
          loginextsolutions.com (hereinafter referred to as the &quot;Website&quot;). By visiting the
          Website you agree to be bound by this Privacy Policy and other policies. If you do not
          agree please do not use or access the website. This Privacy Policy describes the information,
          as part of the normal operation of our Services; we collect from you and what may happen
          to that information. Although this policy may seem long, we have prepared a detailed
          policy because we believe you should know as much as possible about the Website,
          Services and our practices so that you can make informed decisions. By accepting the
          Privacy Policy and the Terms of Use, which prescribes Terms of Use for use of Website
          or availing Services, you expressly consent to our use and disclosure of your personal
          information in accordance with this Privacy Policy. This Privacy Policy is incorporated
          into and subject to the terms of the Terms of Use and the terms not defined here, have
          there meanings ascribed to in the Terms of Use. This Privacy Policy and Terms of Use
          are effective upon your visit of Website. We encourage you read the terms of the Privacy
          Policy and the Terms of Use entirety before you use the Website. We are committed to
          respect your online privacy and recognise your need for suitable protection and
          management of any personally identifiable information (&quot;Personal Information&quot;)
          you share with us. We are committed to protecting the privacy of our users, and strives
          to provide a safe, secure user experience. This Privacy Statement sets forth the online
          data collection and usage policies and practices that apply to this web site.
        </Text>
      </div>
      <div className={bemClass([blk, 'content'])}>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          WE PLEDGE TO:
        </Text>
        <ol className={bemClass([blk, 'content-list', ['number']])}>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            Be transparent about the different types of information we collect and how we use them.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            Ask your permission before sharing your Personally Identifiable Information with third
            parties for purposes other than to provide Loginext’s services, and to do so only when
            we think they will provide you with a welcome additional service.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            Use best – in – class data security tools to keep your data safe and protect the Loginext
            service from unauthorized access.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            <>
              By using this service, you agree to allow us to collect and process information as described below.
              If you have any questions, please contact us at
              <a href="mailto:admin@loginextsolutions.com" className={bemClass([blk, 'content-link'])}
              > admin@loginextsolutions.com
              </a>
              call at the phone number listed on
              <a href="www.loginextsolutions.com" className={bemClass([blk, 'content-link'])}
              > www.loginextsolutions.com</a>.
            </>
          </Text>
        </ol>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Information input during setup: When you order the Loginext Service, you&apos;ll be
          asked several questions about your schedule to help create an initial program of
          tracking your assets. Answering these questions helps us to set up an initial
          program that will keep you informed about your asset.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          User defined place marks and points of interest: In order for us to provide you
          with location based alerts, you will be asked to identify areas called as place
          marks or points of interest when you want to know if an asset entered or exited
          the area.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          User provided information of followers such as friends, co-workers, and family:
          We ask you contact information of other individuals whom you want to share your
          asset location with. This may include mobile phone, email address, twitter handle,
          facebook name and others.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Environmental data from Loginext’s sensors: We collect data from several sensors
          built into the Loginext tracking device. These sensors collect data such as location,
          motion, battery life and more. They can also sense when it is moving. By recording
          this information, the Loginext can provide you with accurate location information of
          your asset.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Technical information from the device: In order to improve your experience over time
          and help troubleshoot any problem you may encounter with Loginext, we record your
          Loginext model and serial number, software version, and technical information such as
          battery charge level, TCP packet load, cell phone provider information.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Order related information: We collect your personal information and payment information
          to the extent that is needed to process the order.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          User provided personal information: In order for us to provide you with tracking details
          and delivery confirmation, you or your customer may share personal information such as
          name, email address, phone number, residential address, date of birth, gender,
          images/video- including photos or video submitted to verify your identity, signatures on
          an ePoD (electronic Proof of Delivery) to acknowledge the receipt of a consignment, copy
          of Identification card, copy of residency card, copy of driving licence, copy of insurance
          document and other information which we reasonably require or that you choose to provide.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          WHAT ADDITIONAL INFORMATION DOES LOGINEXT COLLECT AND STORE WHEN A USER CONNECTS THEIR DEVICE TO THE INTERNET?
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          To access your Loginext Platform over the Internet from a computer, a smartphone or a
          tablet, you will need to connect it to your Wi-Fi network. During setup, the Loginext
          will ask for your login and password information to the Loginext application. It will
          save this, so that you can access it and control it from your computer, smartphone or
          tablet, and so that it can communicate with Loginext servers and download software updates.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Once connected to your Wi-Fi network, your Loginext regularly uploads to Loginext cloud
          servers the data mentioned to provide you with the service.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Additionally, when you create a Loginext Account, we collect and store your email address.
          From that point forward, your email address is used for communications from Loginext.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Like most Internet sites, we routinely record log entries (including information such
          as your IP address) and technical information (such as your browser type and version)
          when your browser, mobile device or Loginext device contacts our servers. These log
          files are used for troubleshooting and are stored on our cloud servers.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          HOW DOES LOGINEXT USE THE INFORMATION IT COLLECTS?
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We use this information to provide and improve the Loginext Services, which will over
          time make you asset tracking more accurate and reliable. This includes information and
          recommendations about your tracking needs. We may use your email address to send you
          this information, or to ask you to participate in surveys about your Loginext use.
          We use service providers to perform some of these functions. Those service providers
          are restricted from sharing your information for any other purpose. We use industry - standard
          methods to keep this information safe and secure while transmitted over your home network and
          through the Internet to our cloud servers.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          WITH WHOM DOES LOGINEXT SHARE MY INFORMATION?
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Under no circumstance do we share Personally Identifiable Information for any commercial
          or marketing purpose unrelated to the delivery of the Loginext service without asking you
          first. Our service technicians and other Loginext employees have supervised access to your
          information so they can answer your questions if you contact us for help and so they can
          monitor our servers for technical problems.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We may share your aggregated and anonymous information in a variety of ways, including
          publishing trends about usage patterns, to help us provide demand – response services
          and to generally improve our system. We’ve taken steps to ensure that the information
          cannot be linked back to you and we require our partners to keep all information in its
          anonymous form.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Your personal information may be collected, processed and stored by Loginext or its
          service providers in the India and other countries where our servers reside. As a
          result, your personal information may be subject to legal requirements, including
          lawful requirements to disclose personal information to government authorities,
          in those jurisdictions. We will disclose information to law enforcement, or to
          comply with other legal requests, only if provided with sufficient and appropriate
          legal process. If you select an outside party for the purchase, installation, or
          service of your Loginext device and share your personal information, we cannot
          control the collection, storage or sharing of information collected by that party.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          HOW LONG DOES LOGINEXT SAVE MY PERSONAL INFORMATION AND HOW CAN I DELETE IT?
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Loginext stores your Personally Identifiable Information on Loginext’s cloud servers for as long as you remain a Loginext customer in order to provide you with the service.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          As described above, some information is stored directly on the Loginext device. All
          information is encrypted and cannot easily be accessed. You can delete the information
          on the Loginext device by resetting it to the defaults (using Reset in the Settings menu).
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          If you want to delete your Personally Identifiable Information from Loginext’s servers,
          please call us at the phone number listed on www.Loginext.com. of the way we maintain
          certain services, after your information is deleted, backup copies may linger for some
          time before they are deleted.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          <>
            We hope this answers all of your questions. If you have any further questions,
            please contact us at
            <a href="mailto:admin@loginextsolutions.com" className={bemClass([blk, 'content-link'])}> admin@loginextsolutions.com</a>.
          </>
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          WEBSITE INFORMATION
        </Text>
        <Text tag="div" typography="s" fontWeight="bold" className={bemClass([blk, 'content-sub-title'])}>
          OUR WEBSITE EMPLOYS BROWSER COOKIES.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          When we provide services, we want to make them easy, useful and reliable. Where
          services are delivered on the internet, this sometimes involves placing small amounts
          of information on your device, for example, your computer or mobile phone. These
          include small files known as cookies. They cannot be used to identify you personally.
          These pieces of information are used to improve services for you, such as:
        </Text>
        <ul className={bemClass([blk, 'content-list'])}>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            Recognising that you may already have given a username and password so you don&apos;t
            need to do it for every web page requested.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            Evaluating how many people are using the Products and Services, so that they can be
            made easier, faster and more convenient to use.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            Analysing anonymous data to help us understand how people interact with the Product
            and Services so that we can make it better.
          </Text>
        </ul>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          In addition, when you visit our website our systems automatically collect your IP
          address and the type of browser that you use. When you browse our website, our systems
          log the Loginext web pages that you visit.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          REMARKETING
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We use cookies, which provide information to Google, who will then serve our ads to
          you based on your prior visit to our website. Google, may show our ads on other sites
          you visit on the internet.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          <>
            You may opt out of Google&apos;s use of cookies by visiting the &nbsp;
            <a href="https://support.google.com/ads/answer/2662922?hl=en" className={bemClass([blk, 'content-link'])}>
              Google advertising opt-out page</a>.
          </>
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          INFORMATION FROM PROMOTIONS
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We collect information you give us when you participate in an Loginext promotion, such
          as a sweepstakes. Specifically, you will typically be asked to provide your name and
          email address, and possibly other information such as your mailing address and telephone
          number.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We store this information in our database and will use it to communicate with you about
          the promotion. We may also use this information to promote our services to you in the
          future, unless you inform us that you opt out from receiving such communications.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We also collect information that you give us when you request additional information
          about one of our services either via our website or via one of our partners throug
          which our services are offered. (To understand what a partner of ours may do with
          information about you in the partner&apos;s custody, you should check the privacy policy of
          that partner.)
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Information we collect through these requests includes your name, phone number, and
          email address, and if you are seeking information on behalf of your company, the name
          of that company. We will use this information to provide you with details about our
          services, and we may use this information to promote our services to you in the future,
          unless you inform us that you opt out from receiving such communications.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          OTHER INFORMATION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We may retain any data you provide to us in an email inquiry, for the purpose of tracking the types of questions we receive.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          CHANGES TO THIS POLICY
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Loginext may from time to time update this privacy policy. In the event that Loginext
          merges with, or is acquired by another company, a change to this privacy policy may
          result. Whenever a change to this policy is significant, we will place a prominent
          notice on this website.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
         YOUR CONSENT
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          By using the Products and Services you consent to the collection and use of information
          by the Company. If we decide to change our Privacy Policy, we will post those changes
          on this page so that you are always aware of what information we collect, how we use it,
          and under what circumstances we disclose it. Regardless of any changes we make to our
          Privacy Policy, we will always use your personal information in accordance with the
          version of the policy in place at the time you provided your information, unless you
          give your express consent for us to do otherwise.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          OTHER WEBSITES
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          For your convenience, this website contains links to other websites, including some
          websites administered by Loginext or administered by other companies on behalf of
          Loginext, as well as to websites unrelated to Loginext. This privacy policy does not
          apply to these linked websites. Each website should be checked for its own privacy
          policy.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          UPDATING ACCOUNT INFORMATION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We do not collect sensitive personal data like; financial information such as Bank
          Account details or Credit Card or Debit Card or other payment related details;
          physical and mental or other health conditions or medical records and history;
          Biometric information such as finger prints, voice & facial patterns and DNA any other
          sensitive information which is confidential or sensitive by its nature. We do not store
          information of users like password of your e mail account. However, we cannot guarantee
          encryption or the privacy of your personal details and credit card information. When we
          receive your order, it is kept encrypted until we are ready to process it. We will take
          reasonable steps to keep the information you provide us with secure. Loginext uses the
          maximum care as is possible to ensure that all or any data / information in respect of
          electronic transfer of money does not fall in the wrong hands. Loginext shall not be
          liable for any loss or damage sustained by reason of any disclosure (inadvertent or
          otherwise) of any information concerning the user&apos;s account and / or information
          relating to or regarding online transactions using credit cards / debit cards and / or
          their verification process and particulars nor for any error, omission or inaccuracy
          with respect to any information so disclosed and used whether or not in pursuance of a
          legal process or otherwise.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          DISCLOSURE OF YOUR PERSONAL INFORMATION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          You agree and confirm that we do not rent, sell, or share Personal Information about you
          with other people (save with your consent) or non-affiliated companies except to provide
          products or Services under Terms of Use or this Privacy Policy, or under the following
          circumstances:
        </Text>
        <ol className={bemClass([blk, 'content-list', ['number']])}>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            To provide the Personal Information to trusted partners who work on behalf of or with
            us under confidentiality agreements. These entities may use your Personal Information
            to help us communicate with you about offers from us and our marketing partners.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            To respond to summons, court orders, or legal process, or to establish or exercise our
            legal rights or defend against legal claims to share Personal Information in order to
            investigate, prevent, or take action regarding illegal activities, suspected fraud,
            situations involving potential threats to the physical safety of any person, violations
            of Terms of Use, or as otherwise required by law.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            To transfer Personal Information about you if we are acquired by or merged with another
            company. In this event, we will notify you before information about you is transferred
            and becomes subject to a different privacy policy.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            From time to time, to reveal general statistical information about our Website and
            visitors, such as number of visitors, number and type of services purchased, etc.
          </Text>
          <Text tag="li" typography="s" className={bemClass([blk, 'content-text'])}>
            To transfer Personal Information about you to trusted partners, may or may not for
            gain, to promote certain products/services for commercial purposes, without any prior
            notice to you.
          </Text>
        </ol>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Please remember that if you post any of your Personal Information in public areas of
          the Website such as in online forums or chat rooms, or in the Website&apos;s searchable
          resume database, such information may be collected and used by others over whom we
          have no control. We are not responsible for the use made by third parties of information
          you post or otherwise make available in public areas of Website.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          DISCLAIMER
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          The Company does not access, store or keep credit card data. Accordingly, the Company
          shall not be responsible or liable for any loss or damage due to any disclosure whatsoever
          of Personal Information. The Company shall not be liable for any loss or damage sustained
          by reason of any disclosure (inadvertent or otherwise) of any Personal Information concerning
          the User&apos;s account and / or information relating to or regarding online transactions using
          credit cards / debit cards and / or their verification process and particulars nor for any
          error, omission or inaccuracy with respect to any information so disclosed and used.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          ASSIGNABILITY
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          The Company may assign any of its responsibilities/obligations to any other person
          without notice to the User, at its sole discretion. However, you shall not assign,
          sub-licence or otherwise transfer any of your rights under this Privacy Policy to any
          other party, unless a written consent is taken from the Company.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          SECURITY
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We protects information both online and off-line. The transmission of information,
          including any payment information, is encrypted and protected using Secure Sockets
          Layer (SSL).
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          UPDATE INFORMATION / SUGGESTIONS
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          <>
            If you would like to update or correct any information that you have provided to
            Loginext through your use of the Loginext services or this website, or you have
            suggestions for improving this privacy policy, please send an e-mail to&nbsp;
            <a
              href="mailto:admin@loginextsolutions.com"
              className={bemClass([blk, 'content-link'])}
            >
                admin@loginextsolutions.com
            </a>
          </>
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          <>
            Name - LogiNext Solutions Private Limited <br />
            Address of Registered Office, - 1901 Happiness, City of Joy, JSD Road, Mulund West, Mumbai, India 400080 <br />
            CIN - U63090MH2014PTC253522 <br />
            Contact in case of grievance:&nbsp;
            <a
              href="mailto:admin@loginextsolutions.com"
              className={bemClass([blk, 'content-link'])}
            >
                admin@loginextsolutions.com
            </a>
          </>
        </Text>
      </div>
    </Container>
  </>
)

const title = 'Privacy Policy - Loginext'
const description = 'Privacy Policy - Loginext'
const url = 'https://www.loginextsolutions.com/privacy-policy'

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
  PrivacyPolicy as default,
  metadata
}

