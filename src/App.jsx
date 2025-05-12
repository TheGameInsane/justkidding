import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import axios from 'axios'

gsap.registerPlugin(useGSAP)

const App = () => {
  const main = useRef()
  const [emoji, setEmoji] = useState()
  const [joke, setJoke] = useState()
  const [loading, setLoading] = useState(true)
  const startTl = useRef()
  const jokeTl = useRef()

  useGSAP(() => {
    let tl = gsap.timeline()

    tl.fromTo('#title', {
      x: -100,
      autoAlpha: 0
    }, {
      x: 0,
      autoAlpha: 1,
      skewX: -15,
      ease: "bounce.out",
      duration: 1
    })
    tl.to('#title', {
      yPercent: -100,
      autoAlpha: 0,
      duration: 0.5,
      delay: 1
    })
    tl.fromTo('#cats', {
      autoAlpha: 0,
      y: 100
    }, {
      autoAlpha: 1,
      y: 0,
      ease: 'power1.in'
    })

    let jTl = gsap.timeline({ paused: true })
    jTl.to('#cats', {
      autoAlpha: 0,
      duration: 0.5
    })
    jTl.to('#emoji', {
      scale: 1,
      opacity: 1,
      rotateZ: 360,
      ease: 'back.inOut',
      duration: 3,
    })

    jTl.call(() => {
      if (loading) {
        jTl.addPause()
      }
    });

    jTl.to('#emoji', {
      scale: 0,
      autoAlpha: 0,
      rotateZ: -360,
      ease: 'back.inOut',
      duration: 1
    })
    jTl.to('#joke', {
      scale: 1,
      autoAlpha: 1,
      ease: 'power3.in',
      duration: 0.5
    })
    jTl.to('#brand', {
      delay: 1,
      autoAlpha: 1,
      duration: 0.5
    })

    startTl.current = tl
    jokeTl.current = jTl
  }, { scope: main })

  const getJoke = async (cat) => {
    try {
      const res = await axios.get(`https://v2.jokeapi.dev/joke/${cat}`)
      setJoke(res.data)
      console.log(res.data)
      setLoading(false)

      if (jokeTl.current.paused()) {
        jokeTl.current.resume();
      }

    } catch (error) {
      console.log(error)
    }
  }

  const getEmoji = (code) => {
    return String.fromCodePoint(parseInt(code, 10))
  }

  const handleClick = (e) => {
    let id = e.target.id
    switch (id) {
      case 'Dark': {
        setEmoji(getEmoji(128128))
        break
      }
      case 'Spooky': {
        setEmoji(getEmoji(129322))
        break
      }
      case 'Pun': {
        setEmoji(getEmoji(129299))
        break
      }
      default: {
        setEmoji(getEmoji(10067))
      }
    }
    jokeTl.current.play()
    getJoke(id)
  }

  return (
    <>
      <div ref={main} className="main overflow-hidden relative items-center justify-center min-h-screen">

        <h1 id='title' className='bg-clip-text bg-linear-to-r from-[#dbd9d6] to-[#ffffff] text-transparent font-wsans text-8xl font-bold absolute center z-10'>JustKiddin</h1>

        <div id='cats' className='flex flex-col absolute center z-5'>
          <h1 className='text-white text-6xl font-ubuntu'>What joke bud?</h1>
          <div className='flex'>
            <div onClick={handleClick} id='Dark' className='button from-[#232526] to-[#414345]'>
              <h1 id='Dark' className='text-black text-6xl font-bold font-dark'>Dark</h1>
            </div>
            <div onClick={handleClick} id='Spooky' className='button from-[#5c258d] to-[#4389a2]'>
              <h1 id='Spooky' className='text-black text-6xl font-spook'>Spooky</h1>
            </div>
            <div onClick={handleClick} id='Pun' className='button from-[#2bc0e4] to-[#eaecc6]'>
              <h1 id='Pun' className='text-black text-6xl font-pun'>Pun</h1>
            </div>
            <div onClick={handleClick} id='Any' className='button from-[#bec5c7] to-[#eaecc6]'>
              <h1 id='Any' className='text-black text-6xl font-wsans'>anything</h1>
            </div>
          </div>
        </div>

        <div id='emoji' className={`absolute center z-2 select-none opacity-0 text-9xl scale-0`}>
          {emoji}
        </div>

        <div id="joke" className='absolute center z-0 invisible'>
          {joke?.type == 'twopart' ? (
            <>
              <h1 className='text-white text-4xl font-semibold'>{joke?.setup}</h1>
              <h2 className='text-white text-2xl'>{joke?.delivery}</h2>
            </>
          ) : (
            <>
              <h1 className='text-white text-4xl font-semibold'>{joke?.joke}</h1>
            </>
          )}
        </div>

        <div id="brand" className='absolute bottom-0 right-0 p-2 flex invisible hover:cursor-pointer' onClick={() => {
          window.location.reload()
        }}>
          <h1 className='transform -skew-x-15 bg-clip-text bg-linear-to-r from-[#dbd9d6] to-[#ffffff] text-transparent font-wsans text-3xl font-semibold'>JustKiddin</h1><span className='text-3xl'>&#129315;</span>
        </div>
      </div>
    </>
  )
}

export default App
