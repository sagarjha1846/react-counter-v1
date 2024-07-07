import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { database } from './config/firebase';
import axios from 'axios';

export default function App() {
  const collectionRef = collection(database, "statistics");
  const id = import.meta.env.VITE_DOC_ID
  const IP_ACCESS = import.meta.env.VITE_IP_ACCESS_KEY
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    (async () => {
      const docRef = doc(collectionRef, id);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setStatistics(data);
          } 
    })()
    
    const fetchGeoData = async () => {
      try {
        const response = await axios.get(`https://ipinfo.io?token=${IP_ACCESS}`);
        setStatistics(prev => ({ ...prev, lastUsedLocation: `${response.data.city} ${response.data.region} ${response.data.country}` }));
      } catch (error) {
        console.error('Error fetching geo data:', error);
      }
    };

    fetchGeoData();
  }, []);

  useEffect(() => {
    
    if (statistics) {
      updateStatisticsFile({id});
    }

    return () => {
      if (statistics) {
        updateStatisticsFile({id});
      }
    };
  }, [JSON.stringify(statistics)]);

  const updateStatisticsFile = ({id}) => {
    (async () => {
      if (id) {
        const docRef = doc(database, "statistics", id);
        await updateDoc(docRef, statistics)
      }
   })()
  };

  useEffect(() => {
    if (statistics?.counter === 0) {
      setStatistics((prev) => ({
        ...prev,
        zeroReached: prev?.zeroReached + 1
      }));
    }
    if (statistics?.counter < statistics?.lowCounter) {
      setStatistics((prev) => ({
        ...prev,
        lowCounter: statistics?.counter
      }));
    }
    if (statistics?.counter > statistics?.highCounter) {
      setStatistics((prev) => ({
        ...prev,
        highCounter: statistics?.counter
      }));
    }
  }, [statistics?.counter]);

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
    setStatistics((prev) => ({...prev,counter:prev.counter + 1}));
    handleStats("total");
    handleStats("increment");
  };

  const handleDecrement = () => {
    setStatistics((prev) => ({...prev,counter:prev.counter - 1}));
    handleStats("total");
    handleStats("decrement");
  };

  const handleReset = () => {
    setStatistics(0);
    handleStats("total");
    handleStats("reset");
  };

  const handleDarkMode = () => {
    setStatistics((prev) => ({...prev,darkMode:!prev.darkMode}));
  };

  if (!statistics) {
    return <div>Loading...</div>;
  }

  const {darkMode}=statistics
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
        <div>Current Location: <span className=' text-blue-400 font-bold'>{statistics?.lastUsedLocation} </span></div>
        <div>Thanks for using the statistics?.counter app 😊!</div>
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

            {statistics?.counter}

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
            disabled={statistics?.counter === 0}
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
