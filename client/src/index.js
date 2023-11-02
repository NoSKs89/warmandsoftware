import './styles.css'
import App from './App'
import WebFont from 'webfontloader'
import { createRoot } from 'react-dom/client';


WebFont.load({
    google: {
      families: ['Arvo', 'Abel', 'Oxygen', 'Quicksand', 'Cabin', 'Birthstone Bounce', 'Bonheur Royale', 'Dancing Script', 'Engagement', 'Fleur De Leah',  'Lobster', 'Love Light', 
    'Lovers Quarrel', 'Marck Script', 'Mea Culpa', 'Molle', 'Mr De Haviland', 'Ole', 'Ruthie', 'Tangerine', 'Twinkle Star', 'Montserrat', 'Playfair Display', 'Kanit', 'Syne', 'Josefin Sans', 'Dancing Script', 'Lobster', 'Mea Culpa', 'Marck Script', 'Dancing Script', 'Ole', 'Love Light', 'Mr De Haviland', 'Twinkle Star', 'Engagement', 'Birthstone Bounce', 'Fleur De Leah',
    'Lovers Quarrel', 'Bonheur Royale','Molle', 'Ruthie'  ]
      ,urls: ['/index.css']
  }
  })
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);