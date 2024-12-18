import React, {useState} from "react";

function App() {
    // use state returns an array of two indexes = variable of state // function used to update state
    const [count, setCount] = useState(0);

    function incrementCount() {
        setCount((prevCount) => prevCount + 1)
    }
    function decrementCount() {
        setCount((prevCount) => prevCount - 1)
    }

    // a grid of photos
    // use the counter and every photo has a counter
    // most popular photo
    // most voted pet is displayed first
    // 1 components need to updated based off of the other -- 2 components working off one state.
    
    // simple
    // picture in middle at top of page -- featured photo of the week thats one component
    // below that is a repeating grid {the picture, the title of the picture, and the increment counter with the current count.}

    return (
        <div>
            <button onClick={decrementCount}>-</button>
            <p>{count}</p>
            <button onClick={incrementCount}>+</button>
        </div>
    )
};

export default App