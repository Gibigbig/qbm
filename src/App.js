import React, { useEffect, useState } from 'react';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';

function App() {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState([]);
  const [arabicFontSize, setArabicFontSize] = useState(5);
  const [transliterationFontSize, setTransliterationFontSize] = useState(16);
  const [translationFontSize, setTranslationFontSize] = useState(16);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [chapter, setChapter] = useState(null);
  const [showBuyButton, setShowBuyButton] = useState(true);

  const getChapters = async () => {
    const response = await fetch('https://api.quran.com/api/v4/chapters');
    const data = await response.json();
    setChapters(data.chapters);
  };

  const getVerses = async () => {
    const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${selectedChapter}?words=true&fields=text_uthmani&word_fields=text_uthmani&per_page=300&page=1`);
    const data = await response.json();
    setVerses(data.verses);
    setLoading(false);
  };

  const changeChapter = (e) => {
    setVerses([]);
    setLoading(true);
    setSelectedChapter(e.target.value);
  };

  useEffect(() => {
    getChapters();
    getVerses();
  }, []);

  useEffect(() => {
    getChapterInfo();
  }, [chapters]);

  useEffect(() => {
    getVerses();
    getChapterInfo();
  }, [selectedChapter]);

  const options = {
    method: 'open',
    resolution: Resolution.LOW,
    page: {
      margin: Margin.MEDIUM,
      format: 'A4',
      orientation: 'portrait',
    },
    canvas: {
      mimeType: 'image/jpeg',
      qualityRatio: 1,
    },
    overrides: {
      pdf: { compress: false },
      canvas: { useCORS: true },
    },
  };

  const getChapterInfo = () => {
    const c = chapters.find(chapter => chapter.id === parseInt(selectedChapter))
    setChapter(c)
  }

  const getTargetElement = () => document.getElementById('content-id');

  return (
    <div className={`App flex flex-col h-full min-h-screen  transition-all ${darkMode ? 'bg-[#141414]' : 'text-black'}`}>
      <header className={`App-header flex flex-row flex-wrap justify-between items-center gap-4  flex-0 p-3 z-50 no-print border-b  ${darkMode ? 'bg-[#222] border-[#333]' : 'bg-gray-100 border-[#ddd]'}`}>
        <div className="flex flex-row flex-wrap gap-4">
          <div className="border rounded"><AddSubtract title="Transliteration Font Size" getValue={setTransliterationFontSize} defaultValue={transliterationFontSize} textfonts /></div>
          <div className="border rounded"><AddSubtract title="Translation Font Size" getValue={setTranslationFontSize} defaultValue={translationFontSize} textfonts /></div>
          <div className="border rounded"><AddSubtract title="Arabic Font Size" getValue={setArabicFontSize} defaultValue={arabicFontSize} /></div>
          <div className=" bg-white px-4 py-2 rounded cursor-pointer border" onClick={() => generatePDF(getTargetElement, options)}>
            Download PDF
          </div>

          <button
            className={`  px-4 py-2 rounded cursor-pointer transition-all ${darkMode ? "bg-white text-black" : "bg-[#333] text-white"}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
          </button>
        </div>
        <div className="px-4 py-2 rounded bg-white flex flex-row flex-wrap items-center gap-4 border">
          <div>
            <select onChange={changeChapter} className="py-2 h-full px-4 bg-white rounded">
              {chapters.map((chapter, index) => (
                <option key={`chapter` + chapter.id} value={chapter.id}>
                  {chapter.name_simple}
                </option>
              ))}
            </select>
          </div>
          <div className="border-l pl-4">{chapter && chapter.translated_name.name + ' (' + chapter.id + ')'} </div>
        </div>
      </header>
      <main className="flex-1 p-4 h-full" id="content-id">
        {loading && (
          <div className={`flex items-center  transition-all justify-center h-screen ${darkMode ? "text-white" : "text-black"}`}>
            <div><i className="fa-solid fa-sync fa-spin mr-2"></i> Loading...</div>
          </div>
        )}
        <div dir="rtl" className={`h-full ${darkMode ? 'text-white' : 'text-black'}`}>
          {verses.map(verse => (
            verse.words.map((word, index) => (
              <Textbit
                verseId={verse.id}
                arabicFontSize={arabicFontSize}
                key={`verse-${verse.id}-${index}`}
                arabic={word.text}
                transliteration={word.transliteration.text}
                translation={word.translation.text}
                translationFontSize={translationFontSize}
                transliterationFontSize={transliterationFontSize}
              />
            ))
          ))}
        </div>
      </main>
      {showBuyButton && (
        <div className={`fixed bottom-0 left-0 bg-white/30 p-4 border backdrop-blur-lg no-print rounded-lg ${darkMode && "bg-black/50 border-[#333]"}`}>
          <div className='text-right pb-4 text-2xl'>
            <i onClick={() => setShowBuyButton(false)} class={`fa-solid fa-rectangle-xmark text-black ${darkMode && "text-white"} hover:text-red-500 cursor-pointer transition-all`}></i>
          </div>
          <stripe-buy-button
            buy-button-id="buy_btn_1QHxGWDhKYlaBIy6KOZo13yo"
            publishable-key="pk_live_51M44AMDhKYlaBIy6vP7sDbCcKG4Z6GURG38p7FPd8dQ4HIc8rSpAZp8GR9wAtVW7sW8QMw3x7mT8jg78mUtIC7rt00XaRiNOPW"
          >
          </stripe-buy-button>
        </div>
      )}
    </div>
  );
}

function Textbit({ arabic, transliteration, translation, arabicFontSize, translationFontSize, transliterationFontSize, verseId }) {
  return (
    <div className={`px-4 py-2 text-center inline-block z-10 ${arabicFontSize > 7 && 'mb-8'}`} data-id={verseId}>
      <div className={`p-2 text-${arabicFontSize}xl  amiri-quran-regular`}>{arabic}</div>
      <div className={`p-1 text-[${transliterationFontSize}px] ${arabicFontSize > 7 ? 'mt-24' : 'mt-12'}`}>{transliteration}</div>
      <div className={`p-1 text-[${translationFontSize}px]`}>{translation}</div>
    </div>
  );
}

function AddSubtract({ title, getValue, defaultValue, textfonts }) {
  const allowed = textfonts ? [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] : [2, 3, 4, 5, 6, 7, 8];
  const [value, setValue] = useState(defaultValue);

  const add = () => {
    if (value < allowed[allowed.length - 1]) {
      setValue(value + 1);
      getValue(value + 1);
    }
  };
  const subtract = () => {
    if (value > allowed[0]) {
      setValue(value - 1);
      getValue(value - 1);
    }
  };

  return (
    <div className="flex bg-white px-4 py-2  items-center ">
      <div className="mr-4">{title}</div>
      <button onClick={add}><i className="fa-solid fa-square-plus hover:text-blue-400"></i></button>
      <div className="mx-2">{value}</div>
      <button onClick={subtract}><i className="fa-solid fa-square-minus hover:text-red-500"></i></button>
    </div>
  );
}

export default App;
