'use client'
import Image from "next/image";
import { useState, useEffect } from "react";

const fetchedNames = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0');
  const rawData = await response.json();
  console.log("Single Result: " + JSON.stringify(rawData.results[0]));
  const totalCount = rawData.results.length;
  console.log("Array count: " + totalCount);
  const pokemonNames = rawData.results.map(result => result.name);
  pokemonNames.sort();
  console.log("Type: " + pokemonNames[0]);
  return {
    totalCount,
    pokemonNames
  };
}


export default function Home() {
  const [names, setNames] = useState([]);
  const [maxCount, setMaxCount] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [chunk, setChunk] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchedNames().then(pokemon => {
      setNames(pokemon.pokemonNames);
      setMaxCount(pokemon.totalCount);
      setChunk(pokemon.pokemonNames.slice(0, 10));   
      })
    }, []);  

  const previousChunk = async () => {
    console.log("Current index: " + startIndex);
    if (startIndex > 0){
      setChunk(names.slice(startIndex - 10, startIndex));
      setStartIndex(startIndex - 10);
      setPage(page-1);
    }
  }    
  
  const nextChunk = async () => {
    console.log("Current index: " + startIndex);
    if (startIndex < maxCount){
      setChunk(names.slice(startIndex + 10, startIndex + 20));
      setStartIndex(startIndex + 10);
      setPage(page+1);
    }
  }  


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>Pokemon Names</p>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          {chunk.map(name => <div key={name.url}>{name}</div>) }
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            target="_blank"
            rel="noopener noreferrer"
            onClick={previousChunk}
          >
            Previous
          </button>

        <div>
         <strong>{page}</strong>          
        </div>

          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            target="_blank"
            rel="noopener noreferrer"
            onClick={nextChunk}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
