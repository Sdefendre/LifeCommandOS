-- Migration: Knowledge Base Seed Data
-- Description: Initial knowledge base articles for AI agent

-- Insert knowledge base articles
INSERT INTO knowledge_base (title, content, category, tags, keywords, priority, is_active) VALUES
(
  'Understanding Your DD-214',
  'Your DD-214 (Certificate of Release or Discharge from Active Duty) is your official military service record. This document is critical for accessing VA benefits and filing disability claims.

Key sections to understand:
- Block 12: Record of Service - Shows your total active duty time
- Block 23: Type of Separation - Important for benefit eligibility
- Block 24: Character of Service - Must be "Honorable" or "General Under Honorable Conditions" for most benefits
- Block 25: Separation Authority and Reason - Explains why you separated
- Block 26: Separation Code - Three-letter code indicating separation reason
- Block 28: Narrative Reason for Separation - Detailed explanation

Your DD-214 is essential when:
- Filing VA disability claims
- Applying for VA healthcare
- Using GI Bill benefits
- Proving service connection for conditions
- Applying for veteran preference in federal jobs

Always keep multiple copies in safe places. You can request a replacement DD-214 through the National Archives if you lose yours.',
  'dd214',
  ARRAY['dd-214', 'service record', 'discharge', 'separation', 'military records'],
  ARRAY['dd-214', 'dd214', 'discharge papers', 'service record', 'separation document', 'military discharge'],
  10,
  TRUE
),
(
  'C&P Exam Preparation Guide',
  'A Compensation & Pension (C&P) exam is a medical examination conducted by the VA to evaluate your service-connected disabilities. This exam is crucial for your rating decision.

What to expect:
- The exam is conducted by a VA-contracted physician
- It typically lasts 30-60 minutes
- The examiner will review your medical records
- You''ll be asked about your symptoms and how they affect your daily life
- Physical examinations may be performed

How to prepare:
1. Review your medical records and service treatment records
2. Make a list of all symptoms and how they impact your daily activities
3. Bring a buddy statement or family member who can attest to your conditions
4. Document the worst days, not just average days
5. Be honest and thorough - don''t minimize your symptoms
6. Bring all relevant medical evidence and documentation

What to say:
- Describe your symptoms in detail
- Explain how your condition affects work, sleep, relationships, and daily activities
- Mention all related symptoms, even if they seem minor
- Use specific examples from your daily life
- Be consistent with your medical records

After the exam:
- Document everything that was discussed
- Request a copy of the exam report
- Follow up with your VSO or representative

Remember: The C&P exam is your opportunity to show the full impact of your service-connected conditions. Preparation is key to maximizing your rating.',
  'cp-exam',
  ARRAY['c&p exam', 'compensation', 'pension', 'medical exam', 'rating', 'disability evaluation'],
  ARRAY['c&p', 'c and p', 'compensation exam', 'pension exam', 'va exam', 'medical examination', 'rating exam'],
  10,
  TRUE
),
(
  'Service-Connected Disability Ratings Explained',
  'Service-connected disability ratings determine your monthly compensation from the VA. Ratings range from 0% to 100% in increments of 10%.

How ratings work:
- 0%: Condition is service-connected but not severe enough for compensation
- 10-90%: Monthly compensation based on severity
- 100%: Total disability rating with maximum compensation

Combined ratings:
- Multiple conditions combine using the VA''s combined rating table
- Ratings don''t simply add up (e.g., 50% + 50% ≠ 100%)
- The VA uses a specific formula to calculate combined ratings

Rating criteria:
- Each condition has specific criteria in the VA Schedule of Ratings
- Ratings are based on severity, frequency, and impact on daily life
- Medical evidence and C&P exam results determine the rating

Common rating percentages:
- 0%: Mild conditions with minimal impact
- 10%: Noticeable symptoms that require occasional treatment
- 30%: Moderate symptoms affecting daily activities
- 50%: Significant impact on work and daily life
- 70%: Severe symptoms requiring regular treatment
- 100%: Total disability preventing gainful employment

Increasing your rating:
- File for an increase if your condition worsens
- Submit new medical evidence
- Request a new C&P exam
- Consider secondary conditions related to your service-connected disabilities

The premium course provides a complete strategy for navigating from 0% to 100% rating, including detailed claim filing strategies and C&P exam preparation techniques.',
  'disability-claims',
  ARRAY['disability rating', 'service-connected', 'va rating', 'compensation', 'disability percentage'],
  ARRAY['rating', 'disability rating', 'service-connected', 'va rating', 'compensation', 'disability percentage', '0% to 100%'],
  10,
  TRUE
),
(
  'Filing a VA Disability Claim',
  'Filing a VA disability claim is the process of requesting compensation for conditions connected to your military service.

Steps to file:
1. Gather evidence: Medical records, service treatment records, DD-214, buddy statements
2. File your claim: Use VA.gov, eBenefits, or work with a VSO
3. VA review: The VA will review your claim and may request a C&P exam
4. Decision: You''ll receive a rating decision letter
5. Appeals: If denied or underrated, you can appeal

Types of claims:
- Initial claim: First time filing for a condition
- Increase claim: Requesting higher rating for existing condition
- New claim: Adding new conditions
- Secondary claim: Conditions caused by service-connected disabilities
- Presumptive claim: Conditions presumed to be service-connected

Required evidence:
- Service treatment records showing the condition
- Current medical evidence
- Nexus letter connecting condition to service (if needed)
- Buddy statements from fellow service members
- Personal statements describing your symptoms

Common mistakes to avoid:
- Not providing enough medical evidence
- Filing too early without sufficient documentation
- Not attending scheduled C&P exams
- Minimizing symptoms during exams
- Not following up on requests for information

Timeline:
- Initial review: 3-4 months
- C&P exam scheduling: 1-2 months after filing
- Rating decision: 2-4 months after exam
- Total process: 6-12 months typically

Working with a VSO (Veteran Service Officer) can help navigate the process and increase your chances of success.',
  'disability-claims',
  ARRAY['va claim', 'disability claim', 'filing claim', 'service-connected', 'compensation'],
  ARRAY['file claim', 'va claim', 'disability claim', 'how to file', 'claim process', 'service-connected claim'],
  9,
  TRUE
),
(
  'Military Transition Resources',
  'Transitioning from military service to civilian life is a significant change. Here are key resources and steps to ensure a smooth transition.

Pre-separation checklist:
1. Attend TAP (Transition Assistance Program) classes
2. Get copies of all medical records and your DD-214
3. Understand your VA benefits eligibility
4. Update your resume and LinkedIn profile
5. Network with other veterans in your desired field
6. Research education and training opportunities

VA benefits to explore:
- Healthcare: Enroll in VA healthcare within 180 days of separation
- Education: GI Bill benefits for college, trade school, or certification programs
- Home loans: VA home loan with no down payment required
- Disability compensation: File claims for service-connected conditions
- Vocational rehabilitation: If you have a service-connected disability

Financial planning:
- Build an emergency fund (3-6 months of expenses)
- Understand your new income situation
- Budget for healthcare costs
- Consider life insurance options
- Plan for retirement savings

Career transition:
- Translate military skills to civilian language
- Use veteran preference for federal jobs
- Explore veteran-friendly employers
- Consider entrepreneurship programs
- Leverage your security clearance if applicable

Mental health:
- Don''t hesitate to seek support
- Connect with other veterans
- Use VA mental health services
- Consider therapy or counseling
- Join veteran support groups

Education opportunities:
- Post-9/11 GI Bill: 36 months of education benefits
- Yellow Ribbon Program: Additional funding for expensive schools
- Vocational Rehabilitation: For service-connected disabilities
- State veteran benefits: Additional education benefits by state

Remember: Transition is a process, not an event. Take advantage of all available resources and don''t be afraid to ask for help.',
  'transition',
  ARRAY['transition', 'eas', 'separation', 'civilian life', 'veteran resources'],
  ARRAY['transition', 'eas', 'separating', 'getting out', 'civilian life', 'military transition', 'after service'],
  8,
  TRUE
),
(
  'Understanding VA Healthcare',
  'VA healthcare provides comprehensive medical services to eligible veterans. Understanding your eligibility and how to enroll is crucial.

Eligibility:
- Veterans with service-connected disabilities
- Veterans with low income
- Former POWs
- Veterans exposed to certain hazards (Agent Orange, burn pits, etc.)
- Veterans who served in combat zones

Enrollment priority groups:
- Priority Group 1: Service-connected disabilities rated 50% or more
- Priority Group 2: Service-connected disabilities rated 30-40%
- Priority Group 3: Service-connected disabilities rated 10-20%
- Priority Group 4: Receiving VA pension or eligible for Medicaid
- Priority Groups 5-8: Based on income and other factors

How to enroll:
1. Apply online at VA.gov
2. Apply by phone: 1-877-222-VETS
3. Apply in person at your local VA medical center
4. Apply by mail using VA Form 10-10EZ

Services provided:
- Primary care and preventive services
- Specialty care (cardiology, orthopedics, etc.)
- Mental health services
- Prescription medications
- Emergency care
- Long-term care for certain conditions

Community Care:
- If VA cannot provide timely care, you may be eligible for community care
- Requires approval from VA
- VA pays for approved community care services

Prescription medications:
- Medications prescribed by VA doctors are typically free or low-cost
- Can be filled at VA pharmacies or through mail-order
- Some medications may require copays based on priority group

Mental health services:
- Individual and group therapy
- Medication management
- PTSD treatment programs
- Substance abuse treatment
- Crisis support (Veterans Crisis Line: 988, press 1)

Remember: Enroll as soon as possible after separation. There''s a special enrollment period within 180 days of separation.',
  'benefits',
  ARRAY['va healthcare', 'va medical', 'healthcare enrollment', 'va benefits', 'medical care'],
  ARRAY['va healthcare', 'va medical', 'healthcare', 'enroll va', 'va hospital', 'va clinic', 'medical benefits'],
  8,
  TRUE
),
(
  'GI Bill Benefits Overview',
  'The GI Bill provides education benefits to help veterans pay for college, trade school, and other training programs.

Types of GI Bill:
- Post-9/11 GI Bill: For service after 9/10/2001
- Montgomery GI Bill: For service before 9/11/2001
- Forever GI Bill: Removed time limits for some veterans

Post-9/11 GI Bill benefits:
- 36 months of education benefits
- Tuition and fees paid directly to school
- Monthly housing allowance (based on school location)
- Book and supply stipend ($1,000/year)
- Yellow Ribbon Program for expensive schools

Eligibility:
- Served at least 90 days of active duty after 9/10/2001
- Received an honorable discharge
- Can transfer benefits to dependents (if eligible)

Using your benefits:
1. Choose an approved school or program
2. Apply for benefits through VA.gov
3. Submit Certificate of Eligibility to school
4. School certifies your enrollment
5. VA pays tuition and you receive housing allowance

Transferring benefits:
- Must have served at least 6 years
- Must agree to serve 4 more years
- Can transfer to spouse or children
- Benefits can be split among dependents

Yellow Ribbon Program:
- Additional funding for expensive schools
- School must participate in program
- VA matches school''s contribution
- Can cover remaining tuition costs

Time limits:
- Forever GI Bill removed 15-year time limit for some veterans
- Check your specific eligibility for time limits
- Benefits expire if not used within time limit

Vocational Rehabilitation (VR&E):
- For veterans with service-connected disabilities
- Provides education and training for employment
- Can be used in addition to or instead of GI Bill
- Includes job placement assistance

Tips for maximizing benefits:
- Use benefits for high-value programs
- Consider using for certifications and training
- Save some benefits for advanced degrees
- Research schools with veteran support services
- Take advantage of work-study programs',
  'benefits',
  ARRAY['gi bill', 'education benefits', 'post-9/11', 'montgomery gi bill', 'veteran education'],
  ARRAY['gi bill', 'education benefits', 'post-9/11 gi bill', 'montgomery gi bill', 'va education', 'school benefits'],
  7,
  TRUE
),
(
  'Secondary Service-Connected Conditions',
  'Secondary service-connected conditions are disabilities that are caused or aggravated by an existing service-connected condition.

How secondary conditions work:
- Must be caused or aggravated by a primary service-connected condition
- Requires medical evidence showing the connection (nexus)
- Can increase your overall disability rating
- Examples: Depression caused by chronic pain, sleep apnea caused by PTSD

Common secondary conditions:
- Mental health conditions secondary to physical disabilities
- Sleep disorders secondary to pain or mental health conditions
- Gastrointestinal issues secondary to medications
- Joint problems secondary to other joint conditions
- Skin conditions secondary to medications or other conditions

Filing for secondary conditions:
1. Get medical evidence showing the connection
2. Obtain a nexus letter from a doctor
3. File a claim for the secondary condition
4. Clearly explain how primary condition causes secondary
5. Provide medical records supporting the connection

Nexus letter requirements:
- Written by a qualified medical professional
- States the secondary condition is "at least as likely as not" caused by primary
- Explains the medical connection
- Based on medical evidence and examination

Examples:
- Depression secondary to chronic back pain (can''t work, social isolation)
- Sleep apnea secondary to PTSD (nightmares, anxiety)
- Erectile dysfunction secondary to medications for service-connected conditions
- Migraines secondary to neck injury

Benefits of filing secondary claims:
- Can increase your overall rating
- Provides compensation for additional conditions
- Establishes service connection for future complications
- May qualify you for additional benefits

Important considerations:
- Secondary conditions can be just as disabling as primary
- Don''t assume conditions aren''t connected - get medical opinions
- Multiple secondary conditions can significantly increase rating
- Keep detailed records of how conditions affect each other

The premium course includes detailed strategies for identifying and filing secondary condition claims.',
  'disability-claims',
  ARRAY['secondary conditions', 'secondary service-connected', 'nexus', 'related conditions'],
  ARRAY['secondary condition', 'secondary claim', 'nexus', 'related disability', 'caused by service-connected'],
  8,
  TRUE
);




