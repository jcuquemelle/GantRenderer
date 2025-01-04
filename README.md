This is a project to test doing some real stuff with the help of an AI-enabled IDE, namely bolt.new in that case

# Run
tested with node.js v20.x.x

```
npm install
npm run dev
```

# Features
The main use of this app is to render Gantt charts, primarily defined with [Mermaid syntax](https://mermaid.js.org/intro/syntax-reference.html) 
Example Gantt chart in Mermaid syntax:
```
gantt
    title A Sample Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2024-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2024-01-12, 12d
    another task     :24d
```

The app also supports the [Dot syntax](https://graphviz.org/doc/info/lang.html).
In that case, the graph definition will be converted on the fly to a Mermaid gantt diagram, using an `effort` attribute
on Dot nodes to convert it into a task duration in days. Example:
```
digraph {
A [label="Task A", effort="3"];
B [label="Task B", effort="2"];
C [label="Task C", effort="4"];
D [label="Task D", effort="3"];

A -> B;
A -> C;
B -> D;
C -> D;
}
```

You can open a file with the `Load File` button, or directly paste code in the left edit box. 
In the case of Dot syntax, the result of Mermaid conversion is shown on the right in a readonly panel. This for debugging  
purpose as long as the app is under development.
