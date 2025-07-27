---
title: Emacs Start Kit 👨‍💻
date: '2017-08-31'
spoiler: First steps into Emacsizm
cta: 'Emacs'
---


# What is Emacs ?


![alt text](https://cdn-images-1.medium.com/max/800/1*N5Tsbi-6Nwn7x-HMT93oiw.jpeg)

**Emacs** is a family of text editors that are characterized by their extensibility. The manual for the most widely used variant, GNU Emacs, describes it as "the extensible, customizable, self-documenting, real-time display editor". Development of the first Emacs began in the mid-1970s, and work on its direct descendent, GNU Emacs, continues actively as of 2017.
In the next articles I will write about some most popular and powerful Emacs Modes.

**Emacs** is updating and maintaining in todays days and it's so amazing.
It's a very fun fact that Emacs is as old as my father. 47 year passed and Emacs is still one of the best text editor ever created.
And there is coming the question.

## Why it's so hard to learn Emacs ?

Once upon a time, I was reading some articles about functional programming and I saw very beautiful real life example. I will use this example for Emacs today.

### Learning to Drive

![alt text](https://cdn-images-1.medium.com/max/800/1*2qgrXk6doFZ0toflhjZ2kg.png)

When we first learned to drive, we struggled. It sure looked easy when we saw other people doing it. But it turned out to be harder than we thought.

We practiced in our parent's car and we really didn't venture out on the highway until we had mastered the streets in our own neighborhood.

With each trip, we got better and better and our confidence went up. Then came the day when we had to drive someone else's car or our car finally gave up the ghost and we had to buy a new one.

What was it like that first time behind the wheel of a different car? Was it like the very first time behind the wheel? Not even close. The first time, it was all so foreign. We've been in a car before that, but only as a passenger. This time we were in the driver seat. The one with all the controls.

But when we drove our second car, we simply asked ourselves a few simple questions like, where does the key go, where are the lights, how do you use the turn signals and how do you adjust the side mirrors.


After that, it was pretty smooth sailing. But why was this time so easy compared to the first time?

That's because the new car was pretty much like the old car. It had all the same basic things that a car needs and they were pretty much in the same place.

Well, learning text editors and different IDE's are sort of like this. First is hard to master and use like an expert, but once you have one under your belt, subsequent ones are easier.


### Your First Spaceship

![alt text](https://cdn-images-1.medium.com/max/800/1*Em9DPGUCDaqaSmyT9OP9rQ.png)

Whether you've been driving one car your whole life or dozens of cars, imagine that you're about to get behind the wheel of a spaceship.

If you were going to fly a spaceship, you wouldn't expect your driving ability on the road to help you much. You'd be starting over from square zero. *(We are programmers after all. We count starting at zero.)*

You would begin your training with the expectation that things are very different in space and that flying this contraption is very different than driving on the ground.

Physics hasn't changed. Just the way you navigate within that same Universe.

And it's the same with learning Emacs or Vim. You should expect that things will be very different. And that much of what you know about other editors and IDES will not translate.

------

So if you want to open the door of fantastic world of Emacs, forget everything you know about text editors and let's start talking about world's smartest text editor Emacs.

Emacs' name is actually derived from "E(ditor) MAC(ro)S". As that name suggests, macros or the ability to extend the editor's built in functionality is what gives it power and flexibility.

At the core of Emacs is Emacs Lisp - a dialect of Lisp which allows you to customize and extend Emacs. In fact, most of Emacs base functionality is written in Emacs Lisp.

Emacs is a complex beast with thousands of commands and even more settings that can be customized.

![alt text](https://cdn-images-1.medium.com/max/800/1*nJL4K9tNA0lwCL7km6P3Tg.jpeg)

There's a gap between what the Tutorial sets out to do (basic movement and editing) and what people need to actually get started. This guide will help you move past the tutorial and should hopefully explain away some of the more typical questions that people have about Emacs.

When I first started Emacs (and it wasn't long time ago, really I'm complete newbie), I was lost in terminology because I've never heard about them.

Let's start with Terminology

## The Buffer

In Emacs, a buffer is the area in which you write things. It's where your source code is displayed and it's where most of your time is spent.

A buffer need not point to a file; it can exist in the aether and never see the light of day on your filesystem. It can also be a transient thing (like the help file or the output from your compiler). In Emacs it is common to create and dispose of buffers as needed. If you need to do some quick string manipulation it's very common to simply create a throwaway buffer (usually named "12312eqwdowqjd" or something to that effect), do your thing and then kill it.

## The Window and The Frame

This is where Emacs terminology differs from the established standard. In Emacs a window is what people in other environments would call a frame - and vice versa.

A window is something a buffer is contained in. And windows, in turn, are contained in a frame. You can have multiple windows in a frame, but only one buffer in a window.

A buffer is said to be active when the point is in it; that is, if you were to type, your text would be input into that buffer.

## The Point

The point is the caret, or cursor, in other editors and in most operating systems. Don't confuse it with the mouse cursor though.

## Modes

Modes are Emacs' way of switching between key bindings, functionality, syntax highlighting and pretty much any other mutable item in Emacs. Modes are always buffer-specific, and they come in two flavors: major modes and minor modes.

In Emacs a buffer can only have one major mode, but any number of minor modes. That Emacs can only have one major mode is actually a serious obstacle in "multi-language" modes like a lot of web-based languages as they tend to mix very different languages in one file (HTML, CSS and Javascript for instance). There are some packages out there that provide support for this like nXhtml, an excellent package for most web-focused languages.

Minor modes are similar to major modes in that, when enabled in a buffer, provide a variety of changes and customizations. You tend to have lots of minor modes running in a buffer without necessarily noticing it. To get a complete list of all modes running and all the keybindings they introduce, type C-h m.

## Your .emacs file

The .emacs file is the place where all your emacs customizations are typically kept. The .emacs file is also called the init file. This file is different from your custom file as that is where your Customization settings are stored - but more on Customize later.

When Emacs is starting it will look for the init file in `~/.emacs`, `~/.emacs.el` or `~/.emacs.d/init.el`. As MS-DOS cannot have filenames beginning with a dot, an underscore is used instead (i.e., _emacs).

The tilde is obviously your home directory on Linux/Mac, but on Windows it will default to somewhere in your User's My Documents directory.

> The beauty of Emacs is that you can often have your cake and eat it (though you may have to write some emacs-lisp in order to do both.)

## Guide to Emacs Keybindings

Keyboard shortcuts are completely different from what you're probably familiar with, e.g. Ctrl-C for copy and Ctrl-V for paste. Despite the somewhat steep initial learning curve.
I remember how overwhelming it was to figure out how to do anything when I first got started.
There are two very important keys in Emacs.
The first is the **"meta"** key.
The second important key is the "Ctrl" key
I've the Macbook Pro so the **"meta"** key for me, is the ***"Alt" key (but it could also be the Windows key on windows, for example).
Like the meta key, you will see combinations with the key abbreviated as just "C", e.g. C-f means the "ctrl key f key" combination.


- **C-h C-h**: Help
- **C-g**: Quit
- **C-x b**: Switch buffers
- **C-x right**: Right-cycle through buffers
- **C-x left**: Left-cycle through buffers
- **C-x k**: Kill buffer
- **C-x 0**: Close the active window
- **C-x 1**: Close all windows except the active window
- **C-x 2**: Split the active window vertically into two horizontal windows
- **C-x 3**: Split the active window horizontally into two vertical windows
- **C-x o**: Change active window to next window
- **C-x C-f**: Open file
- **C-x C-s**: Save file
- **C-x C-w**: Save file as
- **C-space**: Set region mark
- **C-w**: Kill region
- **C-k**: Kill region between point and end of current line
- **M-w**: Kill region without deleting
- **C-y**: Yank region from kill ring
- **M-y**: Move to previous item in the kill ring
- **M-Y**: Move to next item in the kill ring
- **C-s**: Search forwards
- **C-r**: Search backwards
- **M-%**: Query replace ('space' to replace, 'n' to skip, '!' to replace all)
- **M-q**: Wrap text
- **C-left**: Move one word left
- **C-right**: Move one word right
- **C-up**: Move one paragraph up
- **C-down**: Move one paragraph down
- **home**: Move to the beginning of the line
- **end**: Move to the end of the line
- **page up**: Move up a page
- **page down**: Move down a page


I'm highly recommend you to visit Emacs tutorial in Emacs.


----

Users who has MacOS, I'll recommend you to do one great thing.
If you ever plan on making Emacs your home away from home, your first step is to rebind your CAPS LOCK key. I know some people actually use it, but I'm one of the people who do not. So to me, rebinding CAPS LOCK is a good way to avoid the dreaded emacs pinky (so named because your pinky has to contort itself to reach the CTRL key on most keyboards.)

![alt text](https://cdn-images-1.medium.com/max/800/1*b7DKHl6YR8x5mtHhH6IrXA.png)

# Epilogue
> Emacs is undoubtedly the most powerful programmer's editor in existence. It's a big, feature-laden program with a great deal of flexibility and customizability. As we observed in the Chapter 14 section on Emacs Lisp, Emacs has an entire programming language inside it that can be used to write arbitrarily powerful editor functions.

Should you give Emacs a shot? I have absolutely no idea… 
If you found something in my post intriguing - I guess you should. If it was to you like the ramblings of mad fanatic with no connection to the real world - probably not.

I truly believe that anyone could gain something positive by spending some time with Emacs and exploring its vision and culture.

Hope with this article I made your and emacs relationship more friendly and lovely.
