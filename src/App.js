import React, { useEffect, useState } from 'react';


function App() {

  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState([]);

  const getChapters = async () => {
    const response = await fetch('https://api.quran.com/api/v4/chapters');
    const data = await response.json();
    setChapters(data.chapters);
  }

  const getVerses = async () => {
    const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${selectedChapter}?words=true`);
    const data = await response.json();
    setVerses(data.verses);
  }

  useEffect(() => {
    getChapters();
    getVerses();
  }, []);

  console.log(verses);

  return (
    <div className="App flex flex-col">
      <header className="App-header flex-0 bg-gray-100 p-3">
        <div>
          <select>
            {chapters.map(chapter => (
              <option key={chapter.id} value={chapter.id}>{chapter.name_simple}</option>
            ))}
          </select>
        </div>
      </header>
      <main className="flex-1 p-4 flex flex-wrap flex-row">
        {verses.map(verse => (
          verse.words.map(word => {
            return <Textbit key={verse.id} arabic={word.text} transliteration={word.transliteration.text} translation={word.translation.text} />
          })
        ))}
      </main>
    </div>
  );
}

function Textbit({ arabic, transliteration, translation }) {
  return (
    <div className="px-4 py-2 text-center">
      <div className="p-2 text-2xl font-bold noto-sans-arabic">{arabic}</div>
      <div className="p-1 text-md">{transliteration}</div>
      <div className="p-1 text-md">{translation}</div>
    </div>
  )
}


export default App;
