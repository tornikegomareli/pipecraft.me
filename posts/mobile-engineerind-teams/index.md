---
title: The foundational elements of scalability in mobile engineering teams
date: '2024-04-26'
spoiler: Scaling mobile teams is not funny though
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3KUxMR1t_iMGnOfkOylAsA.jpeg)

Scaling a mobile app involves more than just addressing technical complexities. It’s also critical to consider the evolving needs of the mobile team and to strategize for sustainable expansion. Essential tasks such as enhancing features, broadening localization options, and facilitating more dynamic app delivery are important, but so is the overarching structure of the team.

For effective scaling, it’s imperative that mobile teams strategically organize their structure, rigorously evaluate the scalability of their codebase, and adopt an application architecture that allows engineers to contribute independently without jeopardizing the entire application. These strategic choices are key in helping mobile teams navigate the technical challenges of scaling effectively.

Compact, more dedicated teams
=============================

Transitioning from a centralized team with a unified codebase to multiple autonomous teams managing distinct segments is a familiar progression. Initially, mobile teams typically operate collectively, drawing from a single data repository. Over time, as the organization matures, it commonly divides into smaller, more dedicated teams, each tasked with specific functions or components.

Once, I was involved with a team that created a virtual piano application tailored for educational purposes. Initially, our balanced team of six, split evenly between iOS and Android engineers, managed every point of the application — from ensuring user login functionalities to overseeing the lesson content and tooling. As the user base expanded and the demand for additional features escalated, so did our team, doubling in size to twelve engineers. This growth introduced significant challenges. Coordinating updates became increasingly complicated, task allocation grew more dramatically, and even simple daily stand-ups turned into hard discussions. To address these issues, we started organizing into smaller, specialized groups, each dedicated to distinct areas of the application.

Adopting this approach not only simplifies the lives of engineers but also streamlines their focus, as it reduces the need to manage every detail. With a well-structured technical architecture, each engineer can specialize in a specific domain of the application, becoming an expert in their designated area. For instance, within that team, my specialty was managing how the piano parsed note sheets from a JavaScript library and converted them into Swift, and how Core Graphics rendered the piano animations in real-time. This specialization allowed me to concentrate deeply on my segment without the need to master every other aspect of the app.

However, narrowing the focus can have its drawbacks. Smaller, specialized teams need robust cross-team communication to ensure effective collaboration on intersecting features. If my team is solely in charge of the X process, but we also need to integrate the device’s X feature on the app’s some page, we must understand if the team handling that section can accommodate the change, and how their priorities and timelines might differ.

In contrast to a web application, a feature within a mobile app cannot be launched separately from the entirety of the app. Therefore, it’s essential for multiple teams to collaborate closely and for comprehensive regression testing cycles to be conducted.

Maintaining clear documentation of updates in each app release, ensuring that pull requests are open for review by anyone, organizing weekly platform-specific stand-ups (one for iOS and another for Android), and setting up joint design reviews for all client-side engineers are effective strategies to foster ongoing communication among teams while avoiding overwhelming developers with minor details.

Well written, organized, composable and testable code
=====================================================

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*GdKkNDTkMOALEuddkNr9cA.jpeg)

Discussing the importance of well-structured, testable code can sometimes feel cliché because it’s a well-understood principle among professionals that quality coding practices are crucial for long-term team functionality and sustained feature development. However, it’s alarming how often this principle is deprioritized in favor of immediate results choosing today’s egg over tomorrow’s chicken, so to speak.

Imagine if during the construction of an airplane, the lead manager urged engineers to rush the installation of the air conditioning system just to speed up the first flight and draw in new customers. Such a scenario is unlikely because the risk to human lives is direct and clear. Yet, in software development, we frequently encounter similar pressures from management, pushing for quick fixes and quick features that compromise long-term quality.

What should we do as senior engineers, when faced with such management? The key is to shift the conversation from technical to business impacts. Avoid technical jargons like “bad practice” or “suboptimal patterns,” which may not resonate with managerial concerns. Instead, articulate the business consequences of deploying unmaintainable code. Illustrate how future modifications and maintenance will consume more developer time, thus increasing costs significantly demonstrated by estimating the additional financial burden based on developer salaries.

By framing the discussion in terms of business outcomes highlighting the cost implications and potential delays, management can better appreciate why investing in high-quality, testable code is not just a technical necessity but a strategic business decision. This approach makes it easier to advocate for best practices that ensure sustainable development and long-term gains.

Modular, orchestrated and reasonable architecture
=================================================

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2FYLlc-JRyUyQ6r7BMl9kw.jpeg)

Good Architecture is key when aiming for a testable app with various components and modules. Building such an architecture requires meticulous planning and ongoing improvement. Without regular updates and adaptations, any architecture will eventually become outdated. It’s important to recognize that there is no one-size-fits-all solution in architecture — whether it’s Clean, MVP, MVC, VIPER, MVVM, MVU, or any other model.

The choice of architecture depends on several factors: the team’s composition, the developers’ level of expertise, business needs, and scalability requirements. These elements dictate the architectural framework that will best suit a project. After understanding these needs and assessing your team’s capabilities, you can develop a flexible architecture tailored to your specific circumstances.

Personally, I find value in adapting aspects from various architectural models depending on the project’s requirements. For instance, I am currently a proponent of the Composable Architecture by PointFree, which, while powerful, demands a higher level of understanding, a steep learning curve, and a fundamentally different approach to programming. It may be well-suited to some environments but not universally applicable.

When thinking about architecture, avoid adopting a one-size-fits-all approach as seen in typical project templates. Every team adapts architectural principles in unique ways that best fit their context. The most crucial attributes of any effective architecture include modularity, composability, robust tooling, and reusability. Aim to enhance the developer experience by avoiding redundant code — instead, provide modules and tools that streamline their workflows.

Structure your architecture with composable units to allow for easy replacement and update of components. Implement dependency inversion with type erasure to ensure flexibility in how components and tools interact. It’s also vital to develop accessible testing tools and frameworks, particularly to aid less experienced developers who may struggle with testing methodologies.

As your team and codebase grow, so too will your build times. This increase affects not just the developers who build the code frequently each day but also extends to CI/CD pipelines processing every pull request and QA testers awaiting new builds. An increase in build times can subtly shift your team into a waiting mode, which may significantly reduce overall performance. Therefore, it’s crucial to focus on optimizing and reducing these times.

A practical approach is to adopt horizontal modularization instead of vertical modularization, as this can help manage dependencies more efficiently and reduce build times. For a deeper understanding of these concepts, consider reading this insightful article on modularization in iOS using Swift Package Manager: [Modularisation in iOS](https://medium.com/@sashensingh/modularisation-in-ios-using-swift-package-manager-and-some-approaches-we-may-take-vertical-vs-9e445ad72af3).

It’s also essential to evaluate your current development tools. If you’re using xcodeproj or workspace to manage multiple frameworks or modules, there might be more efficient methodologies available. Tools like Tuist, Xcodegen, and Bazel offer alternative ways to structure and build projects that might better suit your needs.

Further, minimize the use of extensive type inference and avoid dynamic dispatch where possible, as these can significantly slow down your build processes. Implementing tools that can measure and monitor build times is also crucial. Regular monitoring allows you to identify and address inefficiencies proactively, keeping your development process as agile and effective as possible.

Lastly, and most importantly, guard against overengineering. In the current landscape, there is a tendency to complicate solutions unnecessarily. Strive for simplicity in your architectural decisions, as it often leads to more elegant and manageable solutions. This philosophy is eloquently discussed by Rich Hickey in his 2011 talk, “Simple Made Easy,” which I highly recommend for deeper insights into simplicity in software engineering. You can watch it here: [Rich Hickey’s Talk on Simplicity](https://www.youtube.com/watch?v=SxdOUGdseq4&ab_channel=StrangeLoopConference). This talk is one of the most impactful and insightful technical discussions I have encountered.

Ongoing development and refinement
==================================

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*VF_5TbkDC7aj9uf2gkSptg.jpeg)

Even if you’re currently working in a legacy codebase, the journey towards implementing new ideas and methodologies within your team is entirely possible. By gradually introducing these concepts and practices, both you and your colleagues will begin to witness significant improvements. No one enjoys working under stressful conditions, and there’s everyones desire for simplicity and ease in our daily work routines.

Establishing a flexible and scalable team structure, codebase, and architecture is a very challenging task. Especially when dealing with a monolithic mobile app, this demands extra attention and care. Achieving an ideal architecture for large teams is a long process, as it’s an ongoing journey rather than a destination. There will always be room for improvement, whether it’s refining processes or addressing unforeseen edge cases.

However, if each engineer is dedicated to delivering quality code, adhering to architectural guidelines, and feeling a sense of ownership over both technical and non-technical improvements, the evolution of your team can become your collective culture. This commitment enables teams to scale efficiently, to scale as quickly and efficiently as the apps they build.

Thanks for reading, and happy coding.