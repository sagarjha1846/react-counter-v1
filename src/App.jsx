import { collection, getDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { database } from './config/firebase';

export default function App() {
  const [counter, setCounter] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
   const collectionRef = collection(database, "counter");
  const [statistics, setStatistics] = useState({
    totalBtnClicks: 0,
    incrementCount: 0,
    decrementCount: 0,
    zeroReached: 0,
    resetBtnClicks: 0,
    lowCounter: 0,
    highCounter: 0
  });

  useEffect(() => {
    (async() => {
     const querySnapshot = await getDocs(collectionRef);
      querySnapshot.forEach((doc) => {
        // setImages((prev) => [...prev, { ...doc.data(), id: doc.id }]);
        console.log('====================================');
        console.log(doc);
        console.log('====================================');
      });
   })()
  }, []);

  useEffect(() => {
    if (statistics) {
      updateStatisticsFile();
    }

    return () => {
      if (statistics) {
        updateStatisticsFile();
      }
    };
  }, [JSON.stringify(statistics)]);

  const updateStatisticsFile = () => {
    fetch("/statistics.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(statistics)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update statistics file");
        }
      })
      .catch((error) =>
        console.error("Error updating statistics file:", error)
      );
  };

  useEffect(() => {
    if (counter === 0) {
      setStatistics((prev) => ({
        ...prev,
        zeroReached: prev?.zeroReached + 1
      }));
    }
    if (counter < statistics?.lowCounter) {
      setStatistics((prev) => ({
        ...prev,
        lowCounter: counter
      }));
    }
    if (counter > statistics?.highCounter) {
      setStatistics((prev) => ({
        ...prev,
        highCounter: counter
      }));
    }
  }, [counter]);

  const handleStats = (type) => {
    const interactions = {
      increment: () =>
        setStatistics((prev) => ({
          ...prev,
          incrementCount: prev.incrementCount + 1
        })),
      decrement: () =>
        setStatistics((prev) => ({
          ...prev,
          decrementCount: prev.decrementCount + 1
        })),
      total: () =>
        setStatistics((prev) => ({
          ...prev,
          totalBtnClicks: prev.totalBtnClicks + 1
        })),
      reset: () =>
        setStatistics((prev) => ({
          ...prev,
          resetBtnClicks: prev.resetBtnClicks + 1
        })),
      zero: () =>
        setStatistics((prev) => ({
          ...prev,
          resetBtnClicks: prev.zeroReached + 1
        }))
    };
    if (interactions[type]) {
      interactions[type](); // Invoke the function corresponding to 'type'
    } else {
      console.error("Invalid stats type:", type);
    }
  };

  const handleIncrement = () => {
    setCounter((prev) => prev + 1);
    handleStats("total");
    handleStats("increment");
  };

  const handleDecrement = () => {
    setCounter((prev) => prev - 1);
    handleStats("total");
    handleStats("decrement");
  };

  const handleReset = () => {
    setCounter(0);
    handleStats("total");
    handleStats("reset");
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!statistics) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`font-bold h-[100vh] w-[100vw] ${
        !darkMode ? "bg-slate-200" : "bg-[#00111c]"
      } flex justify-center items-center align-middle content-center self-center place-items-center`}
    >
      <div
        className={` p-2 shadow-md rounded-md ${
          darkMode ? "bg-[#00253e] text-gray-300" : "bg-slate-200"
        } !absolute left-10 top-10 `}
      >
        <div>Updated: <span className=' text-blue-400 font-bold'>{statistics?.totalBtnClicks} times </span></div>
        <div>Incremented: <span className=' text-blue-400 font-bold'>{statistics?.incrementCount} times </span></div>
        <div>Decremented: <span className=' text-blue-400 font-bold'>{statistics?.decrementCount} times </span></div>
        <div>Restarted: <span className=' text-blue-400 font-bold'>{statistics?.resetBtnClicks} times </span></div>
        <div>Reached zero: <span className=' text-blue-400 font-bold'>{statistics?.zeroReached} times </span></div>
        <div>Lowest value: <span className=' text-blue-400 font-bold'>{statistics?.lowCounter} </span></div>
        <div>Highest value: <span className=' text-blue-400 font-bold'>{statistics?.highCounter} </span></div>
        <div>Thanks for using the counter app 😊!</div>
      </div>
      <button onClick={handleDarkMode} className=" absolute right-10 top-10">
        {!darkMode ? (
          <i className="text-5xl text-blue-700 fa-regular fa-moon"></i>
        ) : (
          <i className="text-5xl fa-regular text-yellow-300 fa-sun"></i>
        )}
      </button>
      <div className=" flex gap-4 flex-col">
        <div className="p-10 flex justify-evenly items-center self-center content-center flex-wrap sm:flex-1 sm:flex-nowrap gap-4">
          <button
            onClick={handleIncrement}
            className={`hidden sm:block w-[8rem] h-[8rem] px-2 text-xl ${
              darkMode ? "bg-[#00253e] text-gray-300" : "bg-blue-400"
            } rounded-md text-white shadow-2xl`}
          >
            <i className="text-[6rem] fa-solid fa-chevron-up"></i>
          </button>
          <div
            onClick={handleIncrement}
            className={`${
              darkMode ? "bg-[#00253e] text-gray-300" : "bg-slate-200"
            } w-full text-center p-4 sm:text-[10rem] text-[6rem] rounded-3xl cursor-pointer select-none shadow-2xl`}
          >
            <div
              className={`w-full text-center ${
                darkMode
                  ? "bg-[#00253e] text-gray-300"
                  : "bg-slate-200 text-gray-500"
              }  text-sm`}
            >
              The Count is{" "}
            </div>

            {counter}

            <div
              className={`w-full text-center ${
                darkMode
                  ? "bg-[#00253e] text-gray-300"
                  : "bg-slate-200 text-gray-500"
              }  text-sm`}
            >
              Click me to increment!👆👆
            </div>
          </div>
          <div>
            {" "}
            <button
              onClick={handleDecrement}
              className={` w-[8rem] h-[8rem] px-2 text-xl ${
                darkMode ? "bg-[#00253e] text-gray-300" : "bg-blue-400"
              } rounded-md text-white shadow-2xl`}
            >
              <i className="text-[6rem] fa-solid fa-chevron-down"></i>
            </button>{" "}
            <button
              onClick={handleIncrement}
              className={`sm:hidden w-[8rem] h-[8rem] px-2 text-xl ${
                darkMode ? "bg-[#00253e] text-gray-300" : "bg-blue-400"
              } rounded-md text-white shadow-2xl`}
            >
              <i className="text-[6rem] fa-solid fa-chevron-up"></i>
            </button>
          </div>
        </div>
        <div
          onClick={handleReset}
          className="  w-full flex justify-center align-middle content-center self-center"
        >
          <button
            disabled={counter === 0}
            className={`disabled:bg-gray-500 disabled:cursor-not-allowed px-20 py-4 text-2xl ${
              darkMode ? "bg-[#00253e] text-gray-300" : "bg-blue-400"
            } rounded-md text-white shadow-2xl`}
          >
            Reset Counter 🧹
          </button>
        </div>
      </div>
    </div>
  );
}
