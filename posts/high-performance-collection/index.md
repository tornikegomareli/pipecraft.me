---
title: Creating Custom, High-Performance Collection Types with Swift
date: '2023-04-10'
spoiler: Custom Collections with high-performance usage
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kjAc_jUZbZK1jLLpW95_dA.png)

Intro
=====

Because Swift is a general-purpose, powerful, and flexible language, Swift is utilized in almost every element of Apple development as well as beyond the ecosystem. Even while the standard library offers a range of crucial collection types, such as arrays, dictionaries, and sets, developers often desire more specialized and effective data structures for specific usage circumstances. We will look at how to create distinctive, high-performance collection types in Swift by examining the core concepts, design decisions, and implementation details.

Understanding Collection Protocols in Swift
===========================================

You may have noticed that Swift’s built-in collection types, such as arrays, dictionaries, and sets, have a lot of similar characteristics and methods if you’ve ever used them. Swift uses collection protocols in its protocol-oriented architecture to provide this consistent behavior.

Before we can begin to create strong collections using collection protocols, we need to first have an understanding of Collection Protocols in Swift, including their hierarchy and the different degrees of abstraction they offer.

Swift offers a number of protocols that, collectively, describe the operations that are typical of collection types and their attributes. By accepting these protocols, we are able to take advantage of Swift’s robust features and guarantee that our custom collections are compatible with the functions provided by the standard library.

*   `Sequence`: The base protocol for all types that can be iterated over using a `for-in` loop. It provides basic operations like `map`, `filter`, and `reduce`.
*   `Collection`: Defines the core requirements for any collection, such as indexing, subscripting, and iteration.
*   `MutableCollection`: Conforms to `Collection` and allows modifying the elements of the collection.
*   `BidirectionalCollection`: Conforms to `Collection` and enables reverse traversal of the collection.
*   `RandomAccessCollection`: Conforms to `BidirectionalCollection` and allows constant-time indexing and slicing.

Everything starts from `Sequence !`

Let’s pretend a generic CustomArray exists and see how it might be used to create common collection techniques.

To create a custom collection type that can be iterated using a `for-in` loop, you must conform to the `Sequence` protocol. This requires implementing a single method, `makeIterator()`, which returns an iterator object that conforms to the `IteratorProtocol`.

```swift
struct CustomArray<Element>: Sequence {
    private var storage: [Element] = []
    func makeIterator() -> CustomArrayIterator<Element> {
        return CustomArrayIterator(storage: storage)
    }
}
struct CustomArrayIterator<Element>: IteratorProtocol {
    private let storage: [Element]
    private var currentIndex = 0
    mutating func next() -> Element? {
        guard currentIndex < storage.count else { return nil }
        let element = storage[currentIndex]
        currentIndex += 1
        return element
    }
}
```

The primary requirement of the `Sequence` the protocol is to provide an iterator, which is an instance of a type conforming to the `IteratorProtocol`. The iterator’s job is to supply a way to go sequentially through the sequence’s elements in a linear, sequential manner. The `IteratorProtocol` requires a `next()` method, which returns the next element in the sequence, or `nil` if there are no more elements to iterate over.

But, what is Iterator? Or why does it exists?

In computer science, an [iterator](https://refactoring.guru/design-patterns/iterator) is a design pattern that provides a way to access the elements of an aggregate object (a collection or container) sequentially without exposing its underlying representation. Iterators are a crucial aspect of many data structures, as they allow developers to process the elements of a collection in a uniform and consistent manner.

The iterator pattern has several advantages:

1.  Abstraction: The iterator abstracts the process of iterating over a collection, allowing the user to access elements without needing to know the internal details of the data structure. This makes it easier to work with different types of collections, as the same interface can be used to traverse them.
2.  Encapsulation: By providing a specific interface for traversing a collection, the iterator pattern helps to encapsulate the internal structure of the collection. This ensures that the user cannot directly modify the collection or access its elements in an unintended manner, which promotes data integrity and reliability.
3.  Flexibility: The iterator pattern allows developers to define custom traversal strategies for different collections. For example, a tree structure may require an in-order, pre-order, or post-order traversal, depending on the desired outcome. Using an iterator, developers can implement these traversal strategies without modifying the underlying data structure.

In the context of Swift’s `Sequence` protocol, the iterator plays a crucial role in enabling iteration over elements using a `for-in` loop, and other usefull benefits.

`Sequence` the protocol is an essential component of Swift’s collection framework. It offers a robust and standardized user interface for interacting with collections of elements, which makes it an indispensable component. By accepting this protocol, custom types will be able to take part in Swift’s extensive ecosystem of collection-based operations, which will make it much simpler to process and manipulate data in a wide variety of settings.

We still haven’t finished covering `Collection`, `MutableCollection`, `BidirectionalCollection`, and `RandomAccessCollection`, but I think you have a good idea of how `Sequence`, Iterator and Swift collections work at their core.

However, we will address them as we build our high-performance [Deque](https://www.javatpoint.com/ds-deque) from the ground up.

Designing a Custom Collection Type: Deque
=========================================

Let’s design a double-ended queue, sometimes known as a deque, as a way to illustrate the steps involved in developing a collection type. There are certain circumstances in which the performance of a deque is superior to that of an array. This is because a deque is a linear data structure that permits the insertion and removal of elements from both the front and the back.

Here is Deque Structure

```swift
struct Deque<Element> {
    private var storage: [Element] = []
}
```

We must conform with the `MutableCollection` and `BidirectionalCollection` protocols in order to make our deque a fully-functional collection type. In order to do this, we must write all necessary implementation, including the necessary properties and methods.

Conforming to `Collection`

```swift
extension Deque: Collection {
    typealias Index = Int
    var startIndex: Index {
        return storage.startIndex
    }
    var endIndex: Index {
        return storage.endIndex
    }
    subscript(index: Index) -> Element {
        return storage[index]
    }
    func index(after i: Index) -> Index {
        return storage.index(after: i)
    }
}
```

Here is the list of things what we’ve done here:

First, we define a `struct` called `Deque` with a generic `Element` type. This allows our deque to hold elements of any type. We create a private `storage` property, which is an array of `Element` values. This is where our deque's elements will be stored. The storage is marked `private` to encapsulate the underlying data structure and prevent direct manipulation from outside the `Deque`.

We define an associated type `Index` and set it to `Int`. This tells the compiler that our deque's indices will be integer values.

We implement two computed properties, `startIndex` and `endIndex`, which return the storage's `startIndex` and `endIndex`, respectively. These properties define the range of valid indices for our deque.

We implement a subscript that takes an `Index` as a parameter and returns the `Element` at that index in the storage array. This allows us to access elements in the deque using subscript notation (e.g., `deque[2]`).

We implement a method called `index(after:)` that takes an `Index` as a parameter and returns the next index in the deque. This is required by the `Collection` protocol to enable iteration over the deque's elements.

We have conformed `Collection` protocol successfully, but don’t forget that our Data Structure need to be Mutable and also Bidirectional, that is whole idea of Duque structure, so we still need to conform two protocols they are`MutableCollection` and `BidirectionalCollection`

```swift
extension Deque: MutableCollection, BidirectionalCollection {
    subscript(index: Index) -> Element {
        get {
            return storage[index]
        }
        set {
            storage[index] = newValue
        }
    }
    func index(before i: Index) -> Index {
        return storage.index(before: i)
    }
}
```

These protocols will enhance the functionality of our `Deque` by allowing for in-place modification of its elements and enabling efficient reverse traversal.

We create an extension for `Deque` and declare conformance to both `MutableCollection` and `BidirectionalCollection`. Since our `Deque` already conforms to the `Collection` protocol, we only need to add a few more methods and properties to satisfy the requirements of these new protocols.

We update the existing `subscript(index: Index) -> Element` to include a `get` and a `set` block:

`get`: This block is the same as the previous implementation, and it returns the element at the given index in the storage array.

`set`: This block allows us to modify the element at the given index in the storage array. The `newValue` parameter represents the new value that will replace the existing element at the specified index. This `set` block is required by the `MutableCollection` protocol, which enables in-place modification of elements in the deque.

We implement a new method called `index(before i: Index) -> Index`

`func index(before i: Index) -> Index`: This method takes an index as a parameter and returns the index immediately preceding it in the deque. This method is required by the `BidirectionalCollection` protocol, which allows for efficient reverse traversal of the deque's elements.

All the other protocol implementations was required to fill our data structure in Swift collections ecosystem, but for now we need specific implementations which deque need to be fully functional circular queue.

```swift
extension Deque {
    mutating func prepend(newElement: Element) {
        storage.insert(newElement, at: startIndex)
    }
    mutating func append(newElement: Element) {
        storage.insert(newElement, at: endIndex)
    }
    @discardableResult
    mutating func removeFirst() -> Element? {
        return storage.isEmpty ? nil : storage.removeFirst()
    }
    @discardableResult
    mutating func removeLast() -> Element? {
        return storage.isEmpty ? nil : storage.removeLast()
    }
}
```

**prepend** method takes an element and inserts it at the beginning of the deque. We use the `insert(_:at:)` method of the `storage` array to achieve this. Since this method modifies the `storage` array, the function is marked as `mutating`.

**append** takes an element and inserts it at the end of the deque. Similar to the `prepend` method, we use the `insert(_:at:)` method of the `storage` array. The function is also marked as `mutating` because it modifies the `storage` array.

**removeFirst** method removes and returns the first element in the deque. The `@discardableResult` attribute indicates that the return value can be ignored if it's not needed. The method first checks if the `storage` array is empty. If it is, the method returns `nil`. Otherwise, it removes and returns the first element using the `removeFirst()` method of the `storage` array. Since this method modifies the `storage` array, as above example it's also marked as `mutating`.

**removeLast** method removes and returns the last element in the deque. The `@discardableResult` attribute is used for the same reason as before. The method checks if the `storage` array is empty, returning `nil` if so, and otherwise removes and returns the last element using the `removeLast()` method of the `storage` array. As with the other methods, this one is also marked as `mutating`.

Optimisation
============

A queue built on an array has the drawback that while adding new items to the back of the queue is quick O(1), taking items out of the front of the queue takes time O(n). Removing takes time because the remaining array elements need to be moved around in memory.

Using a circular or ring buffer to implement a queue is more effective. There is no need to ever remove anything from this array because it conceptually goes all the way back to the beginning. Every operation is an O(1).

But first of all we need to answer to this question > What is circular buffer ?

A fixed-size data structure called a circular buffer, also referred to as a ring buffer or cyclic buffer, treats its memory as if it were circular. In situations where there is a producer and a consumer and the data is being processed or consumed at a different rate, it is used to store a small number of elements.
A circular buffer’s main benefit is that it effectively manages circumstances where the buffer might overflow. The oldest element is automatically overwritten when the buffer is full and a new element is added.
One pointer is used for reading (the “head”) and the other is used for writing in a circular buffer. (the “tail”). The write pointer advances as new data is added. The read pointer moves forward when data is consumed or read. Both pointers wrap around to the beginning of the buffer when they reach the end, producing the “circular” effect.

```swift
public struct CircularBuffer<Element> {
  var storage: [Element?]
  var capacity: Int
  var head: Int
  var tail: Int
  public init(capacity: Int) {
    self.capacity = capacity
    self.storage = Array<Element?>(repeating: nil, count: capacity)
    self.head = 0
    self.tail = 0
  }
  private func increment(_ index: Int) -> Int {
    return (index + 1) % storage.count
  }
  private func decrement(_ index: Int) -> Int {
    return (index - 1 + storage.count) % storage.count
  }
  public mutating func prepend(_ element: Element) {
    if capacity == 0 {
      resize()
    }
    head = decrement(head)
    storage[head] = element
    if head == tail {
      resize()
    }
  }
  public mutating func append(_ element: Element) {
    if capacity == 0 {
      resize()
    }
    storage[tail] = element
    tail = increment(tail)
    if head == tail {
      resize()
    }
  }
  @discardableResult
  public mutating func removeFirst() -> Element? {
    if storage.count == 0 {
      return nil
    }
    guard let first = storage[head] else {
      return nil
    }
    storage[head] = nil
    head = increment(head)
    return first
  }
  @discardableResult
  public mutating func removeLast() -> Element? {
    if storage.count == 0 {
      return nil
    }
    guard let last = storage[decrement(tail)] else { return nil }
    tail = decrement(tail)
    storage[tail] = nil
    return last
  }
  private mutating func resize() {
    let newCapacity = max(storage.count * 2, 1)
    var newStorage = Array<Element?>(repeating: nil, count: newCapacity)
    var index = head
    for i in 0..<capacity {
      newStorage[i] = storage[index]
      index = increment(index)
    }
    storage = newStorage
    capacity = newCapacity
    head = 0
    tail = capacity / 2
  }
}
```

`storage`: An array of optional elements that represents the underlying storage of the buffer.

`capacity`: The current capacity of the buffer. When the buffer is full, the capacity will be increased to accommodate new elements.

`head`: An index pointing to the first element in the buffer.

`tail`: An index pointing to the next available slot for inserting a new element in the buffer.

`init(capacity: Int)`: The initializer takes an initial capacity as a parameter and initializes the storage array with the specified capacity. It also sets the head and tail indices to 0.

The following private helper methods are used for index manipulation

`increment(_ index: Int) -> Int`: This method increments the given index and wraps it around the storage count if necessary.

`decrement(_ index: Int) -> Int`: This method decrements the given index and wraps it around the storage count if necessary.

Public methods for modifying the buffer

`prepend(_ element: Element)`: Adds an element to the beginning of the buffer. If the capacity is 0, it resizes the buffer before adding the element. If the buffer is full, it resizes the buffer to accommodate the new element.

`append(_ element: Element)`: Adds an element to the end of the buffer. If the capacity is 0, it resizes the buffer before adding the element. If the buffer is full, it resizes the buffer to accommodate the new element.

`removeFirst() -> Element?`: Removes and returns the first element in the buffer. Returns nil if the buffer is empty.

`removeLast() -> Element?`: Removes and returns the last element in the buffer. Returns nil if the buffer is empty.

The `resize()` private method is responsible for resizing the buffer. It doubles the current capacity (or sets it to 1 if the current capacity is 0), creates a new storage array with the updated capacity, and copies the existing elements from the old storage to the new storage. After resizing, it resets the head index to 0 and the tail index to half of the new capacity.

Now, we need to modify the `Deque` structure to use the `CircularBuffer` instead of a regular array. As well lets make possibility for our initialisation to get already predefined array and convert it to Deque.

```swift
struct Deque<Element> {
  private var storage: CircularBuffer<Element>
  public init(capacity: Int) {
    storage = CircularBuffer(capacity: capacity)
  }
  public init(elements: [Element]) {
    let requiredCapacity = elements.count
    self.init(capacity: requiredCapacity)

    for element in elements {
      self.append(element)
    }
  }
}
```

Next, we will update the implementation of `Deque` operations to leverage the circular buffer's efficient indexing and storage management

```swift
extension Deque: MutableCollection, BidirectionalCollection {
  public subscript(position: Int) -> Element {
    get {
      precondition(position >= startIndex && position < endIndex, "Index out of range")
      return storage.storage[position % storage.capacity]!
    }
    set {
      precondition(position >= startIndex && position < endIndex, "Index out of range")
      storage.storage[position % storage.capacity] = newValue
    }
  }
  public func index(before i: Index) -> Index {
    precondition(i > startIndex, "Index out of range")
    return (i - 1 + storage.capacity) % storage.capacity
  }
}
```

```swift
extension Deque: Collection {
  public typealias Index = Int
  public var startIndex: Index {
    return storage.head
  }
  public var endIndex: Index {
    return storage.tail
  }
  public func index(after i: Index) -> Index {
    precondition(i < endIndex, "Index out of range")
    return (i + 1) % storage.capacity
  }
}
```

```swift
extension Deque {
  public mutating func prepend(_ element: Element) {
    storage.prepend(element)
  }
  public mutating func append(_ element: Element) {
    storage.append(element)
  }
  @discardableResult
  public mutating func removeFirst() -> Element? {
    return storage.removeFirst()
  }
  @discardableResult
  public mutating func removeLast() -> Element? {
    return storage.removeLast()
  }
}
```

Performance and Functionality tests
===================================

After completing the fundamental implementations for our Deque data structure, it should now function efficiently and effectively. However, to ensure its robustness we will create some stress tests to assess the performance under various conditions, and also let’s write some tests to validate its correctness of functionality.

When testing the `Deque` implementation, we'll want to make sure to cover a wide range of scenarios to ensure that all functionalities are working correctly.

1.  **Initialisation**: Test that the deque is created with the correct initial state.
2.  **Appending**: Test appending elements to the deque and verify the correct order.
3.  **Prepending**: Test prepending elements to the deque and verify the correct order.
4.  **Removing firs**t: Test removing elements from the front of the deque and verify that the deque behaves as expected.
5.  **Removing last**: Test removing elements from the end of the deque and verify that the deque behaves as expected.
6.  **Indexing**: Test accessing elements by index and ensure that the deque returns the correct values.
7.  **Mutating elements**: Test modifying elements in the deque by index and verify that the changes are correctly applied.
8.  **Bidirectional indexing**: Test moving indices forward and backward using `index(after:)` and `index(before:)` methods.
9.  **Collection conformance**: Test iterating over the deque using a `for` loop or other collection methods and ensure that elements are in the correct order.
10.  **Empty deque behavior**: Test edge cases where the deque is empty, and ensure that the implementation handles them correctly (e.g., removing elements from an empty deque should return `nil`).
11.  **Deque resizing**: Test that the deque resizes correctly when needed, preserving the correct order of elements and maintaining the correct indices.

```swift
import XCTest
import Foundation
@testable import Deque
final class DequeTests: XCTestCase {
  func testInitialization() {
    let deque = Deque<Int>(capacity: 0)
    XCTAssertTrue(deque.isEmpty)
  }
  func testAppending() {
    var deque = Deque<Int>(capacity: 3)
    deque.append(1)
    deque.append(2)
    deque.append(3)
    XCTAssertEqual(Array(deque), [1, 2, 3])
  }
  func testPrepending() {
    var deque = Deque<Int>(capacity: 3)
    deque.prepend(1)
    deque.prepend(2)
    deque.prepend(3)
    XCTAssertEqual(Array(deque), [3, 2, 1])
  }
  func testRemovingFirst() {
    var deque = Deque<Int>(elements: [1, 2, 3])
    XCTAssertEqual(deque.removeFirst(), 1)
    XCTAssertEqual(Array(deque), [2, 3])
  }
  func testRemovingLast() {
    var deque = Deque<Int>(elements: [1, 2, 3])
    XCTAssertEqual(deque.removeLast(), 3)
    XCTAssertEqual(Array(deque), [1, 2])
  }
  func testIndexing() {
    let deque = Deque<Int>(elements: [1, 2, 3])
    XCTAssertEqual(deque[1], 2)
  }
  func testMutatingElements() {
    var deque = Deque<Int>(elements: [1, 2, 3])
    deque[1] = 4
    XCTAssertEqual(Array(deque), [1, 4, 3])
  }
  func testBidirectionalIndexing() {
    let deque = Deque<Int>(elements: [1, 2, 3])
    let index = deque.index(after: 0)
    XCTAssertEqual(index, 1)
    let beforeIndex = deque.index(before: index)
    XCTAssertEqual(beforeIndex, 0)
  }
  func testCollectionConformance() {
    let deque = Deque<Int>(elements: [1, 2, 3])
    XCTAssertEqual(Array(deque), [1, 2, 3])
  }
  func testEmptyDequeBehavior() {
    var deque = Deque<Int>(capacity: 0)
    XCTAssertNil(deque.removeFirst())
    XCTAssertNil(deque.removeLast())
  }
  func testDequeResizing() {
    var deque = Deque<Int>(capacity: 3)
    deque.append(1)
    deque.append(2)
    deque.append(3)
    deque.append(4) // This should trigger a resize
    XCTAssertEqual(Array(deque), [1, 2, 3, 4])
  }
  func testStressTest() {
    var deque = Deque<Int>(capacity: 100000)
    let largeNumber = 100_000
    for i in 1...largeNumber {
      deque.append(i)
    }
    XCTAssertEqual(deque.count, largeNumber)
    for i in 1...largeNumber {
      XCTAssertEqual(deque.removeFirst(), i)
    }
  }
}

```

![And woooha, everything works perfectly.](https://miro.medium.com/v2/resize:fit:534/format:webp/1*sfSbyP95xokb7M69XwFRPA.png)

Sincere to say, I discovered that the previously implemented Deque needed some changes while I was writing unit tests. This demonstrates the value of creating tests for one’s own implementations because they make it possible to find little details that might have been missed during the initial implementation stage. Writing tests ultimately aids in enhancing and perfecting the overall solution.

And lastly lets check performance of our Deque, and how it will handle to append million elements when capacity is 0 and it needs constant resizing.

```swift
import Foundation
import XCTest
@testable import Deque
class DequePerformanceTests: XCTestCase {
  func testAppendPerformance() {
    let largeArray = Array(0..<1000000)
    measure {
      var deque = Deque<Int>()
      for element in largeArray {
        deque.append(element)
      }
    }
  }
  func testPrependPerformance() {
    let largeArray = Array(0..<1000000)
    measure {
      var deque = Deque<Int>()
      for element in largeArray {
        deque.prepend(element)
      }
    }
  }
  func testRemoveFirstPerformance() {
    var deque = Deque<Int>()
    for i in 0..<1000000 {
      deque.append(i)
    }
    measure {
      while !deque.isEmpty {
        _ = deque.removeFirst()
      }
    }
  }
  func testRemoveLastPerformance() {
    var deque = Deque<Int>()
    for i in 0..<1000000 {
      deque.append(i)
    }
    measure {
      while !deque.isEmpty {
        _ = deque.removeLast()
      }
    }
  }
}
```

![testAppendPerformance for million elements when starting with zero capacity](https://miro.medium.com/v2/resize:fit:742/format:webp/1*W3jU-i20fUA2fqszEUVm1g.png)![testPrependPerformance for million elements when starting with zero capacity](https://miro.medium.com/v2/resize:fit:690/format:webp/1*i8iLNtU7tkS6e1NFeaa79w.png)![removeFirst](https://miro.medium.com/v2/resize:fit:568/format:webp/1*isoiYgoA5nx676HeKNZkKQ.png)![removeLast](https://miro.medium.com/v2/resize:fit:604/format:webp/1*mbXw16Gf0ANooYj2_pU6RA.png)

We can see that our circular buffer struggles with tasks like appending millions of elements, and although it could be optimised even further by creating lazy resizing and custom indexes to avoid lot of bound checkings, also we can make thresholding capacity, or periodically trim down the array.

But for this situation, I believe it is sufficient. Because creating a Deque with predefined capacity will help to have predefined allocated elements in storage and will prevent the need for additional resizing, which in this example is the most labor-intensive and not cheap operation.

As part of our research into Swift’s high-performance custom collection types, we built a Deque with a circular buffer that achieves O(1) operations. Check out the [repository](https://github.com/tornikegomareli/Deque) of the implementation of Deque if you want to learn more about the details. Your input is greatly appreciated. Feel free to submit a pull request or report an issue if you have any ideas for enhancements.

[GitHub - tornikegomareli/Deque: 🦸‍♂️A Deque collection type implemented with Swift's protocols…

------------------------------------------------------------------------------------------------

### 🦸‍♂️A Deque collection type implemented with Swift's protocols: Sequence, Collection, MutableCollection, and…

github.com](https://github.com/tornikegomareli/Deque?source=post_page-----1217b83a3fcc--------------------------------)

If you could take a moment to show your support by starring the repository on Github, following me on Medium, and applauding the article, I would truly appreciate it. Your involvement means a lot to me!

Thanks for reading, happy coding ⚡
