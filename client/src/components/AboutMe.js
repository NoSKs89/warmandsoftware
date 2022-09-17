import {useState, useCallback, useEffect} from 'react'
import { config, useSpring, a} from 'react-spring'

const fillArray = (array, arrayLength) => {
   if(array.length < arrayLength){
      for(let i = array.length; i < arrayLength; i++){
         array.push('&nbsp;')
      }
   }
   return array
}

//a component that spaces out words into a div full of 'tiles'
//the tiles will 'flip' between various words and colorsnpm 
const AboutMeTiles = () => {


   const sWords = ['SOUND','SOFTWARE','STORY', 'SEXY', 'SAVANT', 'SAVAGE', 'SAVORY', 'SONIC', 'SENSIBLE'] //SAWTOOTH, 'SAFETY', 'SAGA','SAUCY', 'SINCERE','SAGE'
   const eWords = ['ECLECTIC', 'EXPERT', 'ENRICHER', 'ENGINEER', 'ELEVATOR', 'EXCITER', 'EMITTER', 'ENCHANTER', 'ENERGIZER'] //'EMBOLDENER', 'ENTERTAINER', 'ELECTRIFIER'
   const topWords = ['I', 'S', 'A']
   const topLetterSequence = ['&nbsp;', topWords[0], topWords[1], '&nbsp;', '&nbsp;', topWords[2], '&nbsp;', '&nbsp;','&nbsp;']
   
   //will fill 'empty' tiles to match the longest word
   let lCount = sWords.concat(eWords).reduce(
      function (a, b) {
         let member = a.length > b.length ? a : b
         return member.length
      }
   ) 
   let longestArrayMemberCount = lCount > 9 ? lCount : 9
   if(topLetterSequence.length < longestArrayMemberCount){
      for(let i = topLetterSequence.length; i < longestArrayMemberCount; i++){
         topLetterSequence.push('&nbsp;')
      }
   }

   const stephen = fillArray(Array.from('STEPHEN'), longestArrayMemberCount)
   const erickson = fillArray(Array.from('ERICKSON'), longestArrayMemberCount)

   const [middleWord, setMiddleWord] = useState(stephen)
   const [lowerWord, setLowerWord] = useState(erickson)

   let middleArray = middleWord
   let lowerArray = lowerWord
   useEffect(() => {
      setInterval(() => {
         setMiddleWord(fillArray(Array.from(sWords[Math.floor(Math.random() * sWords.length)]), longestArrayMemberCount))
         setLowerWord(fillArray(Array.from(eWords[Math.floor(Math.random() * eWords.length)]), longestArrayMemberCount))
         console.log(middleWord + ' ' + lowerWord)
      }, 2500)
   }, [])

   //maps
   let topTileMap = topLetterSequence.map((item, i) => {
      return (
         <div className="aboutTileTop" key={i}>{item.replace('&nbsp;', ' ')}</div>
      )
   })
   let middleTileMap = middleWord.map((item, i) => {
      return (
         <div className="aboutTileMiddle" key={i}>{item.replace('&nbsp;', ' ')}</div>
      )
   })
   let lowerTileMap = lowerWord.map((item, i) => {
      return (
         <div className='aboutTileBottom' key={i}>{item.replace('&nbsp;', ' ')}</div>
      )
   })
   
   return (
      <div className="aboutBackground">
         {topTileMap}
         {middleTileMap}
         {lowerTileMap}
      </div>
   )
}

export default AboutMeTiles