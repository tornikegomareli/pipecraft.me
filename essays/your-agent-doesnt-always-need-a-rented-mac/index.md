---
title: Your agent doesn't always need a rented Mac
date: '2026-11-06'
spoiler: Does an agent actually need another computer, or does it just need somewhere to work?
---
![](https://pbs.twimg.com/media/HWcjKNEWwAA9foT.jpg)

There's something strange about the way we're giving AI agents computers.

We want agents to use applications the way we do. Open windows, click buttons, type into fields, test interfaces, and figure out whether something works.

So naturally, we give them computers.

Some companies have taken this quite literally. Glasshand, for example, lets you rent real Macs and iPhones in a data center. You connect an agent to one of these devices, and it can use the device as if it were sitting in front of it.

This is a reasonable idea. There are plenty of situations where an agent needs a physical device.

But it made me wonder about something.

**Does an agent actually need another computer, or does it just need somewhere to work?**

These sound like the same problem, but they're not.

And I think the distinction will become increasingly important as more of us start using agents for everyday work.

## Why give an agent a computer?

Imagine you're building a macOS application.

You've just finished implementing a feature. You ask your coding agent to build the app, open it, interact with the new interface, and check whether everything works.

The agent can write the code. It can run the build. It can even understand what it's supposed to test.

But when it comes time to open the application, things get awkward.

You're using the same Mac.

If the agent starts clicking around, it takes over your screen. Windows appear over your editor. Focus changes. The agent tries to type something while you're typing something else.

You can't both use the same desktop independently.

So you have two choices. Stop working and wait for the agent to finish, or give it another computer.

Neither seems particularly satisfying.

The whole point of delegating work to an agent is that you shouldn't have to sit there watching it work. If you have to stop using your computer every time the agent needs to click a button, you've lost much of the benefit.

And buying or renting another Mac just so an agent can open a window seems like an expensive solution to a relatively small problem.

What the agent needs isn't necessarily another computer.

It needs its own desktop.

## A desktop isn't a computer

We tend to think of a desktop and a computer as the same thing because, for most of the history of personal computing, they effectively were.

One person, one computer, one interactive environment.

But operating systems have supported multiple users for decades. Unix was designed around the idea that different people could use the same machine independently.

Modern macOS still has this capability.

You can have multiple user sessions running on the same Mac. Each has its own applications, windows, preferences, and desktop.

This is an old idea, but AI agents give it a new purpose.

What if one of those users wasn't a person?

What if your agent had its own macOS account, could open applications there, and interact with them without disturbing anything happening in your account?

You could keep writing code while the agent tests the application.

You could read an article while it navigates a website.

You could have it reproduce a bug, collect screenshots, and report what happened, all without taking control of your mouse or keyboard.

And you wouldn't need another computer to do any of it.

This is the idea behind Atlas https://atlas.insanearts.io/

## Giving agents a place to work

We built Atlas to give AI agents a separate desktop on the Mac you already own.

It uses a second macOS login running in the background. The agent opens applications and interacts with them in that session, while you continue working in yours.

There's no virtual machine to configure and no second macOS installation to maintain. The applications run natively on the same hardware.

The interesting part isn't really that the agent has another desktop.

It's that you don't have to think about it.

You ask the agent to do something. It works in its own environment. When you want to see what it's doing, you open a viewer. You can watch, take control, or stop its input.

When you're done, you close the viewer and continue with whatever you were doing.

I think this is closer to how agents should work.

You don't stand behind a colleague watching every click they make. You give them a task, let them work, and check the result when they're finished or need help.

An agent should feel more like that.

There are some technical details that make this possible.

Atlas uses the macOS accessibility tree, which lets an agent find interface elements by their names and properties instead of guessing where to click from screenshots alone.

Its input is directed to the helper session. If that session becomes visible on your own screen, Atlas stops accepting agent actions until you switch back.

These might sound like implementation details, but they're important. The difference between a useful computer-use agent and an annoying one often comes down to whether it can interact with applications reliably without interfering with you.

## But what about renting a real device?

I don't think local desktops replace hosted devices.

Glasshand is solving a different problem, and in some situations it's exactly the problem you have.

Their devices are real Macs and iPhones, not simulators. You can install applications, sign into accounts, and keep the environment configured between tasks.

An iPhone can even have an eSIM with SMS capabilities.

That's useful.

If you're testing something that depends on actual iPhone hardware, an iOS simulator might not be enough. If an agent needs to receive verification messages or interact with iMessage, a second macOS login won't help.

And sometimes you simply don't want a task running on your personal machine.

A hosted computer makes sense when you need separate hardware, a persistent remote environment, or someone else to maintain the device.

But consider the local development example again.

You've built a macOS application on your Mac. The build is already there. The source code is already there. Everything the agent needs is already on the machine.

Why send the agent to another computer just to open the application and click a few buttons?

You could do that. But you're adding another machine, another environment to configure, and another place where things can go wrong.

Sometimes the simplest solution is to let the agent use the computer that's already doing the work.

Just not your desktop.

## Isolation is not security

There's an important limitation to this approach.

A separate macOS login is not a security sandbox.

Atlas keeps the agent's interactive environment separate from yours, but both sessions still run on the same machine.

They share hardware, network access, and system resources. Some filesystem locations, such as /Users/Shared, can be accessible to both accounts. Other files may also be readable depending on their permissions.

The helper account starts without your personal sign-ins and settings, but that doesn't mean the agent is completely isolated from everything on your Mac.

There's another distinction worth making.

Your coding agent may still be running in your main account, with whatever filesystem and tool permissions you've already granted it. Atlas moves the graphical interaction into another session. It doesn't magically remove permissions the agent already has.

So if your goal is to run completely untrusted software or give an untrusted agent a strong security boundary, a separate machine or properly isolated virtual machine may be the better choice.

Atlas solves interference, not every form of isolation.

And there are still some macOS limitations. Certain native file dialogs and Safari web views require a connected Screen Sharing session. Drag and drop isn't supported yet.

I think it's important to be clear about these things.

Computer use is one of those areas where a demo can look much more impressive than the underlying reliability. It's easy to show an agent clicking through a few screens. It's harder to make it work consistently across real applications, permission dialogs, and unusual interface behavior.

That's the part we're spending time on.

## Maybe we're thinking about agents the wrong way

I suspect we're still treating AI agents too much like humans.

A human needs a laptop, a screen, a keyboard, and a mouse. So when we imagine an agent doing human work, we imagine giving it the same things.

But an agent doesn't need a physical screen. It doesn't need a desk. It doesn't even need its own computer in many cases.

It needs access to the applications and information required to complete a task, along with an environment where its actions won't interfere with someone else's.

Sometimes that environment should be a real iPhone in a data center.

Sometimes it should be a virtual machine.

And sometimes it can be another login on the Mac sitting right in front of you.

I think we'll eventually stop thinking of computer-use agents as things that borrow our desktops.

They'll have their own working environments, and we'll interact with them when necessary.

The computer will become something we share with our agents, rather than something we take turns using.

That's a small change in how we think about personal computers, but potentially a big change in how we use them.

We built Atlas because we wanted to explore that idea.

Not every agent needs another computer.

**Sometimes it just needs you to get out of its way.**
