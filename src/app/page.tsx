'use client'

import newspaperImage from '@/assets/newspaper.png'
import searchIcon from '@/assets/search.png'
import { Skeleton } from "@nextui-org/skeleton"
import Image from 'next/image'
import { FormEvent, useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pexels?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();

      // Ajustar para pegar apenas a primeira imagem
      if (data.photos && data.photos.length > 0) {
        setImages([data.photos[0]]); // Define apenas a primeira imagem
      } else {
        setImages([]); // Se não houver imagens, define um array vazio
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSearchNews = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const search = `${query} Brasil`;
      const res = await fetch(`/api/factcheck?query=${search}&languageCode=pt`);
      const data = await res.json();

      const formattedResults = data.claims.map((claim: any) => {
        const { text, claimDate, claimReview } = claim;
        const { title, url, textualRating } = claimReview[0];

        // Formatando a data
        const formattedDate = new Date(claimDate).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        return {
          titulo: title,
          data: formattedDate,
          noticia: textualRating,
          link: url,
          texto: text // Incluindo a alegação original
        };
      });

      console.log(formattedResults);
      setResults(formattedResults);
    } catch (error) {
      console.log(error);
      setResults([]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <section className="w-full flex flex-col bg-white items-center justify-center">
      <div className="max-w-screen-xl h-20 bg-white w-full flex gap-24 items-center justify-center">
        <span className="h-full w-24 bg-blue-800"></span>
        <div className="flex-1 h-full flex justify-end items-center gap-16 ">
          <h3 className="font-bold h-full flex items-center justify-center text-[#224D78] hover:text-black cursor-pointer">
            CONHEÇA NOSSO PROJETO
          </h3>
          <h3 className="font-bold h-full flex items-center justify-center text-[#224D78] hover:text-black cursor-pointer">
            BUSQUE POR UMA NOTICIA
          </h3>
          <h3 className="font-bold h-full flex items-center justify-center text-[#224D78] hover:text-black cursor-pointer">
            VEJA NOSSA PESQUISA
          </h3>
        </div>
      </div>
      <div className="w-full h-[700px] flex items-center justify-center bg-gradient-to-l  from-[#1E4C78] to-[#1E4C78] via-[#1E4C78]">
        <div className="max-w-screen-xl flex-1 h-full flex gap-8">
          <span className="w-[30%] h-full flex flex-col justify-center gap-8">
            <h2 className="text-6xl font-bold leading-snug text-white -mt-8">
              Sua fonte completa de noticias verdadeiras.
            </h2>
            <button className="w-44 h-11 rounded-full text-sm font-bold bg-white border border-black">
              BUSQUE AGORA
            </button>
          </span>

          <div className="-ml-8 w-[70%] h-full flex items-center justify-end">
            <Image src={newspaperImage} alt="Logo" width={600} height={600} />
          </div>
        </div>
      </div>

      <div className="w-full h-[700px] flex items-center justify-center">
        <div className="max-w-screen-xl w-full bg-white flex h-full items-center justify-center">
          <span className="w-[500px] flex items-center justify-center">
            <h2 className="w-80 text-[#224D78] font-bold text-4xl leading-snug">
              Checkology empowers students to identify credible information and
              understand the importance of a free press.
            </h2>
          </span>

          <div className="flex-1 h-full flex flex-col gap-16 p-24">
            <h2 className="font-bold text-3xl">Sobre nosso projeto</h2>
            <div className="flex flex-col gap-9">
              <p className="text-base font-bold">
                News literacy is an essential life skill
              </p>
              <p className="text-base font-bold">
                Equip your students with the skills and knowledge they need to
                be informed, critical consumers of news and other content they
                encounter in our complex digital landscape.
              </p>
              <p className="text-base font-bold">
                Equip your students with the skills and knowledge they need to
                be informed, critical consumers of news and other content they
                encounter in our complex digital landscape. Equip your students
                with the skills and knowledge they need to be informed, critical
                consumers of news and other content they encounter in our
                complex digital landscape.
              </p>
            </div>
            <button className="w-52 h-11 rounded-full text-sm font-bold bg-white border border-black">
              VEJA NOSSA PESQUISA
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-80 flex items-center justify-center bg-gradient-to-l from-[#1E4C78] to-[#1E4C78] via-[#1E4C78] mb-4">
        <div className="max-w-screen-xl h-full p-10 w-full flex flex-col gap-14 items-center justify-center">
          <h2 className="font-bold text-4xl text-white">
            Faça uma busca da noticia que deseja checar
          </h2>
          <form
            className="relative flex items-center justify-center"
            onSubmit={(e) => handleSearchNews(e)}
          >
            <input
              placeholder="Buscar..."
              type="text"
              className="w-[700px] h-14 rounded-xl border border-black pl-8 bg-white outline-none"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <button className="absolute right-6" type="submit">
              <Image src={searchIcon} alt="Search" width={20} height={20} />
            </button>
          </form>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 items-center justify-center">
        {results.map((claim, index) => (
          <div
            className="w-full max-w-screen-xl h-full flex gap-14 bg-white shadow-3xl rounded-lg"
            key={index}
          >
            <div className="w-[30%] h-[400px] flex items-center justify-center p-9">
              {images.map((image) => (
                <span className="w-full h-full bg-white shadow-3xl rounded-lg" key={image.id}>
                  <Image src={image.src.medium} alt={image.alt} width={20} height={20} />
                </span>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-9 justify-center p-4">
              {loading ? <Skeleton className="flex rounded-lg w-full h-4" /> :
                <span className="flex gap-2 items-baseline">
                  <h2 className="font-bold text-lg whitespace-nowrap">Noticia buscada:</h2>
                  <p className="text-base">{claim.texto}</p>
                </span>
              }
              {loading ? <Skeleton className="flex rounded-lg w-full h-4" /> :
                <span className="flex gap-2 items-baseline">
                  <h2 className="font-bold text-lg whitespace-nowrap">Veracidade:</h2>
                  <p className="text-base">{claim.noticia}</p>
                </span>
              }
              {loading ? <Skeleton className="flex rounded-lg w-full h-4" /> :
                <span className="flex gap-2 items-baseline">
                  <h2 className="font-bold text-lg whitespace-nowrap">Noticia checada:</h2>
                  <p className="text-base">{claim.titulo}</p>
                </span>
              }
              {loading ? <Skeleton className="flex rounded-lg w-full  h-20" /> :
                <span className="flex gap-2 items-baseline">
                  <h2 className="font-bold text-lg whitespace-nowrap">Data da noticia:</h2>
                  <p className="text-base">{claim.data}</p>
                </span>
              }
              {loading ? <Skeleton className="flex rounded-lg w-full h-40" /> :
                <span className="flex gap-2 items-baseline">
                  <h2 className="font-bold text-lg whitespace-nowrap">Link:</h2>
                  <p className="text-base">{claim.link}</p>
                </span>
              }
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
