import { Metadata } from 'next'
import Link from 'next/link'

import { bemClass } from '@/utils'

import Text from '@/components/text'
import Container from '@/components/container'
import PausedAnimationCoverPage from '@/components/paused-animation-cover-page'

import './style.scss'

const blk = 'terms-and-conditions'

const TermsAndConditions = () => (
  <>
    <PausedAnimationCoverPage />
    <Container>
      <Text tag="h1" typography="xxl" className={bemClass([blk, 'page-title'])}>
        TERMS AND CONDITIONS
      </Text>
      <div className={bemClass([blk, 'summary'])}>
        <Text tag="p" typography="l" className={bemClass([blk, 'summary-text'])}>
          <>
            In these Terms of Use, the words “you” and “your” refer to each customer or Site
            visitor or User. “we”, us” and “our” refer to Loginext Solutions Private Limited.
            The Terms of use governs your use of the website and Products & Services available
            under the domain <Link href="/" className={bemClass([blk, 'content-link'])}>www.loginextsolutions.com</Link> (hereinafter
            referred to as the &quot;Website&quot;).
          </>
        </Text>
        <Text tag="p" typography="l" className={bemClass([blk, 'summary-text'])}>
          BY ACCESSING THIS WEBSITE AND ANY PAGES THEREOF, YOU AGREE TO BE BOUND BY THE TERMS
          OF USE AS BELOW, INCLUDING ANY FUTURE AMENDMENTS (HEREINAFTER COLLECTIVELY REFERRED
          TO AS THE &quot;TERMS OF USE&quot;). IF YOU DO NOT AGREE TO THE TERMS OF USE AS BELOW, DO NOT
          ACCESS THIS WEBSITE, OR ANY PAGES THEREOF. WE ENCOURAGE YOU READ THE TERMS OF USE
          ENTIRETY BEFORE YOU USE THE WEBSITE.
        </Text>
        <Text tag="p" typography="l" className={bemClass([blk, 'summary-text'])}>
          <>
            By using this website, you agree to be bound by the following: (1) the Loginext Terms
            of Use (hereinafter referred to as the &quot;Terms of Use&quot;); and (2) the
            Loginext <Link href="/privacy-policy" className={bemClass([blk, 'content-link'])}>Privacy Policy</Link> (hereinafter
            referred to as the &quot;Privacy Policy&quot;) including any future
            amendments herein. That the Terms of Use & Privacy Policy shall hereinafter be also
            referred collectively as the “Policies”. You also agree that by using this website or
            install or use any of the applications, made available on this website, you had read
            and understood the Policies mentioned herein, as together the said Policies forms a
            binding agreement (&quot;the Agreement&quot;) between you and Loginext Solutions Private Limited
            (the &quot;Company&quot;) regarding your use of this website and the applications provided herein.
          </>
        </Text>
      </div>
      <div className={bemClass([blk, 'content'])}>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          AGE CONFIRMATION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          You affirm that you are more than 18 (Eighteen) years of age having sound mind,
          with free will and without any coercion or undue influence and fully able and
          competent to enter into the Agreement, Policies, terms, conditions, obligations,
          affirmations, representations, and warranties set forth in these Terms of Use.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          ACCEPTANCE
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          The following Terms of Use govern your use of the website, maps, directions,
          information, applications, materials and documents being made available to you
          (collectively the “Products and Services”). By creating an account on the
          website or by using the Products and Services, you signify electronically your
          agreement to all Policies, terms, conditions, and notices contained or referenced
          herein and to resolve any disputes with Company in the manner as given in the present
          Terms of Use.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Further, you agree that the Company reserves the right, and has the sole discretion
          to amend any clauses by way of addition, variation or repeal or revise these Terms
          of Use and other policy at any time. Your continued use of the website and the
          Products and Services following the posting of any changes to the Terms of Use
          constitutes acceptance of those changes.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          USE OF WEBSITE
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          You may use the website and the Products and Services provided through it, only if you
          agree to be bound by terms of this Terms of Use, and only in compliance with this
          Agreement and all applicable local, state, national, and international laws, rules,
          regulations and Notifications. You agree to use the website and the Products and
          Services as provided on it, only in a manner which is permitted by law and agree to
          never misuse the same. In case the Company finds any non-compliance by you of the
          Policies, the Company may suspend your account on the website or stop providing you the
          Products and Services.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          It is agreed by you that by using our Products and Services, it does not give you
          ownership of any Intellectual Property Rights (defined below) in them or the content
          that you access. Further, by using the Products and Services you are not granted the
          right to use any branding or logos used in them and you are prohibited from removing,
          or altering any information displayed in or along with our Products and Services.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          YOUR REGISTRATION INFORMATION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Your account on the website gives you access to the services and functionality that
          the Company establishes and maintains from time to time. When creating your account,
          you must provide accurate and complete information. You are solely responsible for
          the activity that occurs on your account, and you must keep your account password
          secure. That Login ID and password, together with your mobile number or other contact
          information you provide form your &quot;Registration Information&quot;. We encourage you to use
          strong passwords (passwords that use a combination of upper and lower case letters,
          numbers and symbols) with your account. You must notify the Company immediately of any
          breach of security or unauthorized use of your account. The Company will not be liable
          for any losses caused by any unauthorized use of your account. You may control your
          user profile and how you interact through the website and through the use of Products
          and Services, by changing the settings therein. By providing your email address you
          consent to our using the email address to send you service-related notices, including
          any notices required by law, in lieu of communication by postal mail. We may also use
          your email address to send you other messages, such as changes to features of the
          Products and Services and special offers. If you do not want to receive promotional
          email messages, you may opt out by unsubscribing from such email communications.
          Opting out may prevent you from receiving email messages regarding updates, improvements,
          or offers.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          USER CONTENT
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Some areas of the website and the Products and Services, allow you to post content
          such your name, email address, phone number, current address or current location
          (in case of use of certain Products and Services that require the same), such
          information that you submit, post, display, or otherwise make available on the website
          or in the process of using any of the Products and Services shall constitute
          &quot;User Content&quot;. The Company claims no ownership rights over any User Content provided
          by you; however, by sharing such information, you agree to allow others to view and/or
          share your User Content in accordance with your settings in the use of Products and
          Services. Further, the Company shall not retain any of the User Content for longer than
          is required for the purposes for which the User Content may lawfully be used.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Further, you agree not to post or transmit any User Content that: (i) may create a risk
          of harm, loss, physical or mental injury, emotional distress, death, disability,
          disfigurement, or physical or mental illness to you, to any other person, or to any
          animal; (ii) may create a risk of any other loss or damage to any person or property;
          (iii) seeks to harm or exploit children by exposing them to inappropriate content,
          asking for personally identifiable details or otherwise; (iv) may constitute or
          contribute to a crime or tort; (v) contains any information or content that we deem
          to be unlawful, harmful, abusive, racially or ethnically offensive, defamatory,
          infringing, invasive of personal privacy or publicity rights, harassing, humiliating
          to other people (publicly or otherwise), libellous, threatening, profane, or otherwise
          objectionable; (vi) contains any information or content that is illegal (including,
          without limitation, the disclosure of insider information under securities law or of
          another party&apos;s trade secrets); (vii) contains any information or content that you do not
          have a right to make available under any law or under contractual or fiduciary relationships;
          (viii) contains any information or content that you know is not correct and current;
          (ix) violates any school or other applicable policy, including those related to cheating or ethics;
          (x) interferes with other users of the website or Products and Services including, without limitation,
          disrupting the normal flow of dialogue in an interactive area of the website, Product and Services and
          deleting or revising any content posted by another person or entity; (xi) except where expressly permitted,
          post or transmit charity requests, petitions for signatures, franchise arrangements, distributorship arrangements,
          sales representative agency arrangements or other business opportunities (including offers of employment or
          contracting arrangements), club memberships, chain letters or letters relating to pyramid schemes,
          any advertising or promotional materials or any other solicitation of other users to use goods or services
          except in those areas (e.g., a classified bulletin board) that are designated for such purpose. You agree that
          any information that you post does not and will not violate thirdparty rights of any kind, including without
          limitation any Intellectual Property Rights (as defined below) or rights of privacy. The Company reserves the right,
          but is not obligated, to reject and/or remove any such information that it believes, in its sole discretion, violates these provisions.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          SOFTWARE IN THE PRODUCTS AND SERVICES
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          When a Product and Service is in nature of downloadable software, this software may
          update automatically on the device on which the download has taken place, once a new
          version or feature is available. You consent to such automatic upgrading on your mobile
          device, and agree that the Terms of Use of this Agreement will apply to all such upgrades
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          You agree that the Company gives you a personal, royalty-free, non-assignable and non-exclusive
          license to use the Products and Services. This license is for the sole purpose of enabling
          you to use and enjoy the benefit of the Products and Services as provided by the Company,
          in the manner permitted by these terms. You may not: (i) modify, disassemble, decompile or
          reverse engineer the Mobile Software, except to the extent that such restriction is expressly
          prohibited by law; (ii) rent, lease, loan, resell, sublicense, distribute or otherwise
          transfer the Mobile Software to any third party or use the Mobile Software to provide
          time sharing or similar services for any third party; (iii) make any copies of the Mobile
          Software; (iv) remove, circumvent, disable, damage or otherwise interfere with security-related
          features of the Mobile Software, features that prevent or restrict use or copying of any content
          accessible through the Mobile Software, or features that enforce limitations on use of the Mobile
          Software; or (v) delete the copyright and other proprietary rights notices on the Mobile Software
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          RIGHTS YOU GRANT TO US
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          As the owner of any information, data, passwords, usernames, PINs, other log-in
          information, materials or other content (collectively, &quot;Accounts Content&quot;) you provide
          to us through the use of the website or any of the Products and Services, you are
          licensing the Accounts Content to the Company solely for the purpose of that use.
          The Company may use such Accounts Content, but only to provide the use of Products and
          Services to you. By submitting Accounts Content, you represent that you are entitled to
          submit it to the Company for use, without any obligation by the Company to pay any fees
          or other limitations. You hereby authorize and permit the Company to use information
          submitted by you to the website (such as account passwords and user’s names) to
          accomplish the foregoing and to configure the Products and Services so that it is
          compatible with the third party Websites for which you submit your information. For
          purposes of this Agreement and solely to provide the Account Information to you as part
          of the use of Products and Services, you grant the Company a limited power of attorney,
          and appoint the Company your attorney-in-fact and agent, to access third party Websites,
          retrieve and use your information with the full power and authority to do and perform each
          thing necessary in connection with such activities, as you could do in person. YOU ACKNOWLEDGE
          AND AGREE THAT WHEN THE COMPANY IS ACCESSING AND RETRIEVING ACCOUNT INFORMATION FROM THIRD PARTY
          WEBSITES, THE COMPANY IS ACTING AS YOUR AGENT, AND NOT AS THE AGENT OF OR ON BEHALF OF THE THIRD PARTY.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          ACCESS AND INTERFERENCE
        </Text>
        <Text tag="div" typography="s" fontWeight="bold" className={bemClass([blk, 'content-sub-title'])}>
          YOU AGREE THAT YOU WILL NOT:
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          a.) Use any robot, spider, scraper, deep link or other similar automated data
          gathering or extraction tools, program, algorithm or methodology to access, acquire,
          copy or monitor the website or the Products and Services or any portion of it, without
          the Company&apos;s express written consent, which may be withheld in the Company&apos;s sole
          discretion;
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          b.) Use or attempt to use any engine, software, tool, agent, or other device or mechanism
          (including without limitation browsers, spiders, robots, avatars or intelligent agents)
          to navigate or search the Company, other than the search engines and search agents
          available through the website and other than generally available third-party web browsers (such as Microsoft Explorer);
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          c.) Post or transmit any file which contains viruses, worms, Trojan horses or any other
          contaminating or destructive features, or that otherwise interfere with the proper working
          of the website or the Products and Services; or
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          d.) Attempt to decipher, decompile, disassemble, or reverse-engineer any of the software
          comprising or in any way making up a part of the website or Products and Services.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          e.) Users agree not to use or launch any automated system, including, without limitation,
          &quot;robots,&quot; &quot;spiders,&quot; &quot;offline readers,&quot; etc., that accesses the website or Products and
          Services in a manner that sends more request messages to its servers in a given period
          of time than a human can reasonably produce in the same period by using a conventional
          on-line web browser.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          INTELLECTUAL PROPERTY RIGHTS
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          For the purposes of this Agreement, &quot;Intellectual Property Rights&quot; means all patent rights,
          copyright rights, mask work rights, moral rights, rights of publicity, trademark, trade dress
          and service mark rights, goodwill, trade secret rights and other intellectual property rights
          as may now exist or hereafter come into existence, and all applications therefore and registrations,
          renewals and extensions thereof, under the laws of any state, country, territory or another jurisdiction.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          OUR PROPRIETARY RIGHTS
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Except for your User Content, the website and Products and Services and all materials
          therein or transferred thereby, including, without limitation, software, images, maps,
          text, graphics, illustrations, logos, patents, trademarks, service marks, copyrights,
          photographs, audio, videos, music, and User Content belonging to other Users
          (the &quot;Application Content&quot;), and all Intellectual Property Rights related thereto, are
          the exclusive property of the Company and its licensors (including other Users who post
          User Content to the Service).
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Further, some of the Products and Services may be offered by the Company in conjunction
          with a third partner such as Google Maps that provides the maps to the Company for its
          website and Products and Services. In such case, the third partner will have the right to
          seek damages from you in case there is any breach of its Intellectual Property Rights by you.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Except as explicitly provided herein, nothing in this Agreement shall be deemed to
          create a license in or under any such Intellectual Property Rights, and you agree
          not to sell, license, rent, modify, distribute, copy, reproduce, transmit, publicly
          display, publicly perform, publish, adapt, edit or create derivative works from any
          Application Content. Use of the Application Content for any purpose not expressly
          permitted by this Agreement is strictly prohibited.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          ALERT DISCLAIMER
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          You understand and agree that any alerts provided to you through the use of website and
          Products and Services may be delayed or prevented by a variety of factors. The Company
          does its best to provide alerts in a timely manner with accurate information. However,
          we neither guarantee the delivery nor the accuracy of the content of any alert. You also
          agree that the Company shall not be liable for any delays, failure to deliver, or misdirected
          delivery of any alert; for any errors in the content of an alert; or for any actions taken or
          not taken by you or any third party in reliance on an alert.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          PRIVACY
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Users of the website and Products and Services should refer to the Company&apos;s Privacy
          Policy for information about how The Company uses, collects and discloses information
          to third parties. The Companies Privacy Policy, which is hereby incorporated into this
          Agreement, explains how the Company treats your personal information, and protects your
          privacy, when you access the Application.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          THIRD-PARTY LINKS
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          <>
            The Products and Services may contain links to third-party websites, advertisers,
            services, special offers, or other events or activities that are not owned or
            controlled by the Company. The Company does not endorse or assume any responsibility
            for any such third-party Websites, information, materials, products, or services. If
            you access a third party website from the Products and Services, you do so at your own
            risk, and you understand that this Agreement and the Company&apos;s Privacy Policy do not
            apply to your use of such Websites. You expressly relieve the Company from any and all
            liability arising from your use of any third-party website, service, or content.
            Additionally, your dealings with or participation in promotions of advertisers found
            on the Products and Services, including payment and delivery of goods, and any other
            terms (such as warranties) are solely between you and such advertisers. You agree that
            the Company shall not be responsible for any loss or damage of any sort relating to
            your dealings with such advertisers. By using our website you are bound by the&nbsp;
            <a
              target="_blank"
              rel="nofollow"
              href="https://maps.google.com/help/terms_maps.html"
              className={bemClass([blk, 'content-link'])}
            >
              Google Maps/Google Earth Additional Terms of Service
            </a>
            &nbsp;(including the&nbsp;
            <a
              target="_blank"
              rel="nofollow"
              href="https://policies.google.com/privacy"
              className={bemClass([blk, 'content-link'])}
            >
              Google Privacy Policy
            </a>)
          </>
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          SECURITY
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          The Company cares about the integrity and security of your personal information.
          However, we cannot guarantee that unauthorized third parties will never be able to
          defeat our security measures or use your personal information for improper purposes.
          You acknowledge that you provide your personal information at your own risk.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          INDEMNITY
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          You agree to defend, indemnify and hold harmless the Company and its subsidiaries,
          agents, licensors, managers, and other affiliated companies, and their employees,
          contractors, agents, officers and directors, from and against any and all claims,
          damages, obligations, losses, liabilities, costs or debt, and expenses (including
          but not limited to attorney&apos;s fees) arising from: (i) your use of and access to the
          website and Products and Services, including any data or content transmitted or
          received by you; (ii) your violation of any term of this Agreement, including without
          limitation your breach of any of the representations and warranties above; (iii)
          your violation of any third-party right, including without limitation any right of
          privacy or Intellectual Property Rights; (iv) your violation of any applicable law,
          rule or regulation; (v) any claim or damages that arise as a result of any of your
          User Content or any that is submitted via your account; or (vi) any other party&apos;s
          access and use of the Service with your unique username, password or other appropriate
          security code.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Further, you agree that, if you are using our Products and Services on behalf of a
          business, that business accepts these terms. It will hold harmless and indemnify the
          Company and its affiliates, officers, agents, and employees from any claim, suit or
          action arising from or related to the use of the Products and Services or violation of
          any of these terms, including any liability or expense arising from claims, losses,
          damages, suits, judgments, litigation costs and attorney&apos;s fees.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          DISCLAIMER OF REPRESENTATIONS AND WARRANTIES
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          THE CONTENT ON THE WEBSITE AND ALL PRODUCTS AND SERVICES ARE PROVIDED TO YOU ON AN
          &quot;AS-IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. THE COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES
          OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE CONTENT OR OPERATION OF THE WEBSITE OR THE
          PRODUCTS AND SERVICES. YOU EXPRESSLY AGREE THAT YOUR USE OF THE PRODUCTS AND SERVICES
          IS AT YOUR SOLE RISK.THE COMPANY MAKES NO REPRESENTATIONS, WARRANTIES OR GUARANTEES,
          EXPRESS OR IMPLIED, REGARDING THE ACCURACY, RELIABILITY OR COMPLETENESS OF THE CONTENT
          ON THE WEBSITE OR PRODUCTS AND SERVICES, AND EXPRESSLY DISCLAIMS ANY WARRANTIES OF
          NON-INFRINGEMENT OR FITNESS FOR A PARTICULAR PURPOSE. THE COMPANY MAKES NO REPRESENTATION,
          WARRANTY OR GUARANTEE THAT THE CONTENT THAT MAY BE AVAILABLE THROUGH THE WEBSITE OR PRODUCTS
          AND SERVICES IS FREE OF INFECTION FROM ANY VIRUSES OR OTHER CODE OR COMPUTER PROGRAMMING
          ROUTINES THAT CONTAIN CONTAMINATING OR DESTRUCTIVE PROPERTIES OR THAT ARE INTENDED TO
          DAMAGE, SURREPTITIOUSLY INTERCEPT OR EXPROPRIATE ANY SYSTEM, DATA OR PERSONAL INFORMATION.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          COMPANY&apos;S LIABILITY FOR ITS PRODUCTS AND SERVICES
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          It is agreed by you that, when permitted by law, the Company, will not in any way be
          responsible for loss profits, revenues, or data, financial losses or indirect, special,
          consequential, exemplary, or punitive damages. In all cases, the Company, will not be
          liable for any loss or damage that is not reasonably foreseeable.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          INTERPRETATION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          The Company shall have the exclusive right to the interpret the Terms of Use & Privacy Policy including any future amendment.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          ARBITRATION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          All disputes arising out of or incidental to the Policies mentioned herein shall be
          settled through Arbitration before a sole Arbitrator appointed by the Company, under
          the Arbitration and Conciliation Act 1996 [Indian Government Act] or as amended.
          The place of arbitration shall be Mumbai, India
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          GOVERNING LAW AND JURISDICTION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          Any dispute or claim arising out of or in connection with the Policies shall be
          governed by and construed in accordance with the law of The Republic of India and
          the courts of Mumbai, Maharashtra Shall have the exclusive jurisdiction to entertain
          any disputes.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          LEGAL
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          The Company reserves the right in its sole discretion to investigate and take legal
          action against anyone who engages in any illegal or prohibited conduct or otherwise
          violates these Terms of Use, including without limitation, removing the User Content
          from the web-site and/or terminating the offending User&apos;s ability to access the
          web-site and/or use the services.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          NO OBJECTION
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          User hereby express that it has no objection upon any call/SMS/ Communication by the
          Company, any third party on its behalf or any other party authorized by the Company,
          communicating to User with regard to the Services. Notwithstanding User&apos;s registration
          with National Do Not Call Registry (In Fully or Partly blocked category under National
          Customer Preference Register set up under Telecom Regulatory Authority of India), User
          hereby expresses his interest and accord its willful consent to receive communication
          (including commercial communication) in relation to the Company&apos;s Services. User
          further confirms that any communication, as mentioned hereinabove, shall not be
          construed as Unsolicited Commercial Communication under the TRAI and other alike
          authorities in other country&apos;s guidelines and User has specifically opted to receive
          communication in this regard on the telephone number provided by the User
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          DEFAMING/THREAT
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          No customer shall threat or attempt to threat The Company or any agent/employee etc.,
          in any course or capacity to lodge or attempt to lodge any civil or criminal complaint
          in any forum/court/tribunal in order to receive any monetary or any other favour.
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          GRIEVANCE
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          The Company shall address any discrepancies and grievances that you may have regarding
          the use of the Products and Services in a time bound manner. For this purpose,
          the Company has designated a grievance officer who shall redress the grievances
          within one month from the date of receipt of grievance.
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          <>
            Grievance officer details <br />
            Name: Dhruvil Sanghvi <br />
            Contact Number:
            <a
              href="tel:+912261526300"
              className={bemClass([blk, 'content-link'])}
            > +91 22 6152 6300 </a>
            <br />
            Email ID:
            <a
              href="mailto:admin@loginextsolutions.com"
              className={bemClass([blk, 'content-link'])}
            > admin@loginextsolutions.com
            </a>
          </>
        </Text>
        <Text tag="div" typography="l" fontWeight="bold" className={bemClass([blk, 'content-title'])}>
          SECURITY
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'content-text'])}>
          We protects information both online and off-line. The transmission of information is
          encrypted and protected using Secure Sockets Layer (SSL).
        </Text>
      </div>
    </Container>
  </>
)

const title = 'Terms and Conditions - LogiNext'
const description = 'Terms and Conditions - Loginext solutions'
const url = 'https://www.loginextsolutions.com/terms-and-conditions'

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
  TermsAndConditions as default,
  metadata
}
