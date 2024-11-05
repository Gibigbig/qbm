import React, { useEffect, useState } from 'react';


function App() {

  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState([]);

  const getChapters = async () => {
    const response = await fetch('https://api.quran.com/api/v4/chapters');
    const data = await response.json();
    setChapters(data.chapters);
    console.log(data.chapters);
  }

  const getVerses = async () => {
    const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${selectedChapter}?words=true&fields=text_uthmani&word_fields=text_uthmani&per_page=300&page=1`);
    const data = await response.json();
    setVerses(data.verses);
  }

  const changeChapter = (e) => {
    setVerses([]);
    setSelectedChapter(e.target.value);
  }

  useEffect(() => {
    getChapters();
    getVerses();
  }, []);

  useEffect(() => {
    getVerses();
  }, [selectedChapter]);


  return (
    <div className="App flex flex-col" dir="rtl">
      <header className="App-header flex-0 bg-gray-100 p-3">
        <div>
          <select onChange={changeChapter} class="py-2 px-4 bg-white rounded">
            {chapters.map(chapter => (
              <option key={chapter.id} value={chapter.id}>{chapter.name_simple} ({chapter.translated_name.name
              })</option>
            ))}
          </select>
        </div>
      </header>
      <main className="flex-1 p-4 table">
        {verses.map(verse => (
          verse.words.map(word => {
            return <Textbit key={verse.id + word.transliteration.text} arabic={word.text} transliteration={word.transliteration.text} translation={word.translation.text} />
          })
        ))}
      </main>
    </div>
  );
}

function Textbit({ arabic, transliteration, translation }) {
  return (
    <div className="px-4 py-2 text-center inline-block">
      <div className="p-2 text-5xl  amiri-quran-regular">{arabic}</div>
      <div className="p-1 text-sm mt-8">{transliteration}</div>
      <div className="p-1 text-sm">{translation}</div>
    </div>
  )
}


export default App;
