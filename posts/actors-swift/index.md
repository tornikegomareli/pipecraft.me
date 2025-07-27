---
title: Introduction to Actors in Swift, Origins and Background
date: '2023-04-24'
spoiler: History and Origins of Actor Models.
---
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ivC0DNOw218_V_bVCuCXyQ.png)

Intro 🔖
========

Sometimes audience thinks that Actors are a relatively new programming concept that has gained popularity in recent years due to their ability to simplify concurrent programming. But, Actors were first introduced by [Carl Hewitt](https://en.wikipedia.org/wiki/Carl_Hewitt) in the 1970s as a way to manage concurrency in distributed systems.

In traditional concurrency models, such as threads, it can be difficult to manage access to shared resources, leading to synchronization issues and race conditions. Actors offer a different approach to concurrency by isolating state and behavior within a single entity, which can only be accessed by passing messages.

The idea of message passing is not new in computer science and has similarities to other concepts, such as the Actor model and Communicating Sequential Processes (CSP). In the Actor model, which was introduced by Hewitt, there are independent entities, or actors, that communicate with each other through messages. In CSP, which was introduced by [Tony Hoare](https://en.wikipedia.org/wiki/Tony_Hoare), processes communicate with each other through channels.

The Actor model and CSP are similar in that they both offer a way to manage concurrency through message passing, and they both isolate state and behavior within individual entities. This isolation ensures that there are no synchronization issues or race conditions because access to shared resources is managed by passing messages, rather than through direct access.

In the context of Swift, actors provide a new way to manage concurrency that is more secure and easier to reason about than traditional concurrency models. By isolating state and behavior within a single entity, actors eliminate many of the synchronization issues and race conditions that can arise in traditional concurrency models.

actors have their roots in computer science and draw inspiration from concepts such as the Actor model and CSP. The use of message passing and state isolation makes actors a powerful tool for managing concurrency in modern programming languages such as Swift.

If you have never seen this video, you are lucky. Here is the three genius programmer talking about Actor models.

Actors in Swift 🕊️
===================

Prior to the introduction of Actors, developers relied on traditional synchronization mechanisms like locks, semaphores, and dispatch queues to coordinate access to shared resources in concurrent programming. However, these mechanisms have several drawbacks that can make concurrent programming difficult and error-prone.

For example:

1.  Deadlocks: If locks are not acquired and released in the correct order, it can lead to a deadlock where two threads are waiting for each other to release their respective locks.
2.  Race conditions: When multiple threads access shared resources concurrently, it can lead to race conditions where the behavior of the program becomes unpredictable and non-deterministic.
3.  Scalability: Traditional synchronization mechanisms can be difficult to use when scaling up to large numbers of threads or when coordinating access to highly concurrent data structures.
4.  Debugging: Debugging concurrency issues can be challenging and time-consuming, as the bugs may only occur intermittently and be difficult to reproduce.

To address these issues, Swift introduced a new concurrency model based on Actors. Actors as we already mentioned provide a higher-level abstraction for concurrent programming, making it easier to reason about and write correct concurrent code.

Actors as essential objects can encapsulate state dan can only be accessed by sending them messages. When an actor receives a message, it executes the message handler on its own thread, ensuring that its state is accessed in a serialized, thread-safe manner. This eliminates the need for locks and semaphores and makes it much easier to reason about concurrency.

If you know me, you know I love learning how things work behind the scenes. Let’s dive in and see how this is done in Swift.

While the exact implementation details of actors in Swift are not publicly available, we can make some educated guesses, based on the behaviour of actors and the language features that are available in Swift.

Let’s consider we have some kind of actor in Swift

```swift
actor MyActor {
    var count: Int = 0
    
    func increment() {
        count += 1
    }
    
    func getCount() -> Int {
        return count
    }
}
// Create an instance of the actor
let myActor = MyActor()
// Send messages to the actor
Task {
    await myActor.increment()
}
Task {
    let count = await myActor.getCount()
    print("Count: \(count)")
}
```

Under the hood, the `MyActor` the class would be transformed into a special kind of object that is managed by the Swift runtime. This object would encapsulate the actor's state (in this case, the `count` variable), and provide methods for interacting with that state (in this case, the `increment` and `getCount` methods).

When a message is sent to the actor (in this case, using the `await` keyword), the Swift compiler would generate code that constructs a message object and places it in the actor's message queue. The message object would contain a reference to the method that should be executed on the actor (in this case, either `increment` or `getCount`), along with any parameters that were passed to the method.

The Swift runtime would then manage the processing of messages in the actor’s queue. When the actor is ready to process messages, the runtime would acquire a lock on the actor’s message queue and remove the next message from the queue. The runtime would then execute the method that is associated with the message, passing in any parameters that were included in the message object. The runtime would also ensure that access to the actor’s state is thread-safe, using locks and memory barriers to ensure that the state is accessed in a consistent and predictable manner.

Once the method has been executed, the runtime would release the lock on the message queue, allowing other messages to be processed. If the method returns a value (as in the case of the `getCount` method), the value would be returned to the sender of the message using a callback mechanism.

The implementation of actors in Swift would be quite complex in reality, because of involving a combination of low-level synchronization primitives and high-level abstractions. However, by providing a simple and intuitive programming model for concurrent programming, actors in Swift really make it easier to write correct and thread-safe code.

Now that we have delved into the historical background and examined the technical intricacies of how actors function under the hood, we are well-equipped to construct a realistic problem simulation. We will consider the challenges we face and explain how actors can help solve these problems. Next, we will implement the solution. Finally, we can draw some conclusions.

Let’s think about a realistic concurrency problem that can lead to a race condition. Imagine an application that tracks the number of views for different articles. When a user views an article, the application increments the corresponding view count. If multiple users view the same article simultaneously, a race condition may occur, leading to an incorrect view count. (Remember, the examples are not platform-specific. They are just generic programming examples in a programming environment)

Consider the following non-actor code:

```swift
class Article {
    let id: Int
    var viewCount: Int
    init(id: Int) {
        self.id = id
        self.viewCount = 0
    }
    func incrementViewCount() {
        viewCount += 1
    }
}
let article = Article(id: 1)
DispatchQueue.concurrentPerform(iterations: 10) { _ in
    article.incrementViewCount()
}
print("Total view count: \(article.viewCount)")
```

In this example, we use `DispatchQueue.concurrentPerform` to simulate 10 concurrent requests to increment the view count for the same article. Since the `incrementViewCount` method is not thread-safe, the final view count may be incorrect due to the race condition.

Now, let’s refactor the code using actors to resolve the race condition:

```swift
actor Article {
    let id: Int
    private(set) var viewCount: Int
    init(id: Int) {
            self.id = id
            self.viewCount = 0
        }
        func incrementViewCount() {
            viewCount += 1
        }
}
let article = Article(id: 1)
DispatchQueue.concurrentPerform(iterations: 10) { _ in
    Task {
        await article.incrementViewCount()
    }
}
Task {
    let finalViewCount = await article.viewCount
    print("Total view count: \(finalViewCount)")
}
```

So the original problem demonstrated a race condition in a multi-threaded environment when incrementing the view count of an article. This issue occurred because multiple threads accessed and modified the shared `viewCount` variable without proper synchronization, leading to unexpected results.

To solve this problem, we introduced the `Article` actor to manage and protect access to the mutable state. By converting the `Article` class to an actor, we ensured that only one task could access the `viewCount` property at a time, eliminating the race condition and guaranteeing the correct view count.

The revised implementation using the `Article` actor effectively handles concurrency and provides a safer, more reliable solution for managing shared states in a multi-threaded environment.

If you are still having difficulty grasping the concept of race conditions, it is a separate topic, and I highly recommend visiting this Stack Overflow [thread](https://stackoverflow.com/questions/34510/what-is-a-race-condition) for further information. Afterward, you can conduct additional research and read more about it. However, for now, let’s focus on creating a real-world example to illustrate race conditions more effectively.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*cd_T_oGs7qJjjga66mTbMA.jpeg)

Busy Cofee shop ☕️
------------------

Consider a busy coffee shop where multiple baristas are preparing drinks for customers.

In this scenario, the coffee shop represents the application, baristas represent threads or tasks, and customers represent data or resources that need to be managed concurrently. Just like in a multi-threaded environment, multiple baristas work in parallel to handle customer orders more efficiently.

However, imagine that there is only one coffee machine available to make espresso. If multiple baristas try to use the coffee machine at the same time without any coordination, this could lead to chaotic situations or even accidents (similar to race conditions). To prevent this, the coffee shop could introduce a system to manage access to the machine, ensuring that only one barista uses it at a time.

In this analogy, the coffee machine represents a shared resource in a multi-threaded application, and the system managing access to it is similar to an actor. By using actors in our application, we can serialize access to shared resources and prevent race conditions, much like the coffee shop ensuring that only one barista uses the coffee machine at a time.

By understanding this analogy, beginners can appreciate how actors help manage concurrency and protect shared resources in a more intuitive way.

While actors in Swift offer many advantages for concurrent programming, there are also some drawbacks to consider before using it.

1.  Limited interoperability: Actors may not be easily integrated with existing codebases or libraries that don’t support Swift’s concurrency features. You may need to create wrappers or use other techniques to bridge the gap between the old and new code.
2.  Restrictive access control: Actors enforce strict isolation, which can sometimes be too restrictive. You may need to refactor your code to work within the constraints of actor isolation, which could lead to less flexible designs.
3.  Compatibility: As actors were introduced in Swift 5.5, they are not available in earlier versions of the language. If you’re targeting platforms or environments that require older versions of Swift, you won’t be able to use actors.

🙌 Even with a few drawbacks, actors are a fantastic feature for Swift developers. They add a unique Swift-like quality, making the code feel more in line with the Swift spirit. If you share my enthusiasm for Swift, you’ll understand this feeling.

I hope this article has helped you gain some understanding of actor models in Swift. Enjoy coding! 😊