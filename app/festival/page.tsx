"use client";
import React, { useState } from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';
import Link from 'next/link';
import ArtistCard, { Artist } from '../../src/components/ArtistCard';
import ArtistPopup from '../../src/components/ArtistPopup';

// Example artist data for each stage
const kirkenArtists: Artist[] = [
  {
    image: '/images/festival/brooke.png',
    title: 'Brooke Sharkey',
    time: '',
    description: 'Brooke Sharkey grew up in London before moving to France at the age of 9 inspiring her interest in songwriting in both English and French. Starting her musical journey as a street performer and session singer at 16, she has since released 2 Eps and 2 full length albums ‘One Dress’ (2012) and ‘Wandering Heart’ (V2 records- 2016). Her previous releases have gained recognition from The Guardian claiming her as one of the top 50 independent artists in the world in 2016.\n\nShe produces and co-producers her music with various artists and musicians, bringing a sense of place and encounter into each song. She uses her simple guitar sound and ethereal vocals to create a sense of space and openness in which collaborators can bring their own sound. Her unique vocal delivery and lyrics reach into the vast yet intricate themes of love, loss, hope, beauty, nature, seduction and wonder. Having relocated to Oslo in 2020 between 2 waves of Corona, she is currently releasing new songs with a her new album entitled ‘Under Stones’ to be released on September 4th this year, and touring with Aksel Undset (Isak’s island) in UK and Norway and Jean- Baptiste Soulard in France. \n\nHer first single, A place go to,  is already getting attention with a review in KLOFF mag in the Uk, and plays on BBC radio 3 and BBC Ulster, as well as a video premiere (filmed by Mina wang Anderson) shared by Arvid Skancke-Knutsen on Ballad.no (Norway).'
  },
  {
    image: '/images/festival/placeholder.png',
    title: 'Torstein og Tryllefløyta',
    time: '',
    description: ''
  },
  {
    image: '/images/festival/duetrost.png',
    title: 'Duetrost',
    time: '',
    description: 'Duetrost er en akustisk trio fra Oslo som skaper et unikt og sjarmerende musikalsk univers. Med en spennende besetning bestående av Håkon Aase på fiolin, Fredrik Karwowski på gitar og Knærten Simonsen på trommer, henter de inspirasjon fra folkemusikk, klassisk musikk og den nordiske jazzen.\n\nBandet er kjent for sine instrumentale skildringer av natur og dyreliv, hvor låttitler som "Røyskatten", "Seilfisk" og "Bever fra Mali" inviterer lytteren inn i en fantasifull og levende verden. Musikken deres er preget av improvisasjon, smittende spilleglede og et kammermusikalsk uttrykk som garantert får deg til å trekke på smilebåndet.\n\nEnten du er tilhenger av jazz, folkemusikk eller bare vakre, stemningsfulle melodier, er Duetrost et bekjentskap du ikke vil gå glipp av. Opplev deres originale komposisjoner og la deg forføre av et band som byr på både humor, sårbarhet og instrumental briljans. Hold ørene åpne for Duetrost – en trio som fargelegger norsk musikk med sine særegne og billedrike toner!'
  }
];
const hagenArtists: Artist[] = [
  {
    image: '/images/festival/korps.jpg',
    title: 'Lørenskog Barnekorps',
    time: '',
    description: 'Lørenskog skolekorps har musikanter i alder 8 til 19 år fra alle skolene i Lørenskog. I dag får vi underholdning av Hovedkorpset, som holder et høyt aktivitetsnivå og har mange ulike opptredener i løpet av året. Alle kjenner til spilling på 17. mai, men vi deltar også i NM for skolekorps og korpsbattle, holder showkonsert i Storstua LHUS og har flere spilleoppdrag i løpet av året. Nå får dere en smakebit av vårt show-repertoar.'
  },
  {
    image: '/images/festival/placeholder.png',
    title: 'Fosskok Skrangleorkester',
    time: '',
    description: ''
  },
  {
    image: '/images/festival/august.png',
    title: 'August Kann',
    time: '',
    description: 'August Kann er en norsk musiker og låtskriver fra Langhus i Ski kommune. Han debuterte i 2019 med albumet How Did All These People Get Into My Room, som ble godt mottatt for sitt personlige uttrykk og melankolske, men forfriskende visepop-sound.\n\nI 2021 ga han ut sitt andre album, This is the Sound, som ble beskrevet som en følelsesmessig berg-og-dalbane fra forelskelse til mørkere temaer. Albumet ble mikset av Joseph Lorge, kjent for sitt arbeid med artister som Bob Dylan og John Legend. Kann har blitt sammenlignet med Paul Simon og har en særegen, hese vokal kombinert med eksperimenterende instrumentering.\n\nHan har utdanning fra Toneheim Folkehøgskole, Norges musikkhøgskole og jazzlinja ved Universitetet i Stavanger. I tillegg til å skrive og produsere sin egen musikk, har han spilt konserter i Norge, England og Danmark, og har vært listet på NRK P1 og Spotify-spillelister som New Music Friday Norway'
  },
  {
    image: '/images/festival/endakaldere.jpg',
    title: 'Enda Kaldere',
    time: '',
    description: 'Hurra! Enda Kaldere kommer til Fosskok-festivalen!\nEnda Kaldere er ei sang- og spellemannsgruppe fra Lørenskog, og består av\nFinn Evensen, Ole Jørgen Holt Hanssen, Roar Vangen og Jon Haaland.\n\nGruppa ble unnfanget da det gikk av en sprengladning under byggingen av\nRiksvei 159, like ved det som en gang var Pokerskauen.\nNavnet Enda Kaldere rappet de fra en butikk på Visperud, som alltid\nreklamerte med enda kaldere drikke enn nabosjappa på heite\nsommerdager.\n\nOm det ringer en bjelle for deg, så er ikke det så rart; gruppas medlemmer\nhar alle en fortid i gruppa Bjelleklang. Lørenskog-kara forteller, at de alltid utfordrer seg sjøl, både med instrumentene (det er mange av dem!) og teknikken, og de legger sjela i å\nlåte lørenskausk, - selv om de også henter fram musikk som har seilt\nlangveisfra over mange landegrenser.\n\nNå gleder de seg til å hamre løs ved Hammersberget, og så kan vi jo\ndrømme om at det kommer til å fosskoke i selveste Olavskilden!'
  },
  {
    image: '/images/festival/placeholder.png',
    title: 'Soap',
    time: '',
    description: ''
  },
  {
    image: '/images/festival/heighchief.jpg',
    title: 'Heigh Chief',
    time: '',
    description: 'Oslobaserte Heigh Chief har gjennom de siste årene blitt synonymt med velspilt,\nfengende og solid rock og americana. Med sitt femte album i rekka, tilfører bandet ny\nenergi til et allerede gjennomarbeidet lydbilde, kruttsterkt låtmateriale og en vanvittig\ndynamikk. En konsert med Heigh Chief er bortimot så riktig som det kan få blitt: ingen\nmas om moshpit eller allsang, kun råbra låter ærlig presentert av et koppel med svært\nhabile musikere.'
  }
];
const stabburetArtists: Artist[] = [
  {
    image: '/images/festival/placeholder.png',
    title: 'Torstein og Tryllefløyta',
    time: '',
    description: ''
  },
  {
    image: '/images/festival/bortinatta.jpg',
    title: 'Borti Natta skyggeteater',
    time: '',
    description: 'Borti natta - en poesistund\nVelkommen til en varm og tankevekkende poesistund for hele familien! \nBasert på Ingvild H. Rishøi sin bok “Borti natta - rim for barn og voksne” inviterer skuespiller Ingeborg Larsen, gitarist Fredrik Karwowski og skyggefigurspiller Henriette Grøtting Kihle til en musikalsk og visuell poesistund på Lørenskog bibliotek. Diktene handler om alt fra livsvisdom og hypokondri til hodelus, sommerkvelder, og barn som har gått seg vill på kjøpesenter. Forestillingen varer i ca. 30 minutter og byr på poesi, skyggeteater og musikk i skjønn forening. \n\nPasser for alle mellom 0 og 100 år! \n\nMedvirkende: Henriette Grøtting Kihle, Ingeborg Larsen og Fredrik Karwowski\nDikt: Ingvild H. Rishøi \nMusikk: Fredrik Karwowski \nSkyggefigurer: Henriette Grøtting Kihle\nProdusent: Ingeborg Larsen  \nScenografi/lys: Henriette Grøtting Kihle, Ingeborg Larsen og Fredrik Karwowski\n\nForestillingen er støttet av Lørenskog kommune og Sparebankstiftelsen DNB. \n\nBildet er fra Henriettes tidligere prosjekt “Skyggetunnelen”.'
  }
];

export default function Festival() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  return (
    <ContentContainer>
      <div className={styles.container}>
        <div className={styles.posterContainer}>
          <img 
            src="/images/festival/festival-poster.jpg" 
            alt="Festival i hagen 2025 - 14. juni hos Fosskok" 
            className={styles.posterImage}
          />
        </div>
        <p className={styles.subheader}>
          Sommeren 2025 vender vi tilbake til røttene – og inviterer til festival på Hammer Prestegård! Det blir musikk, mat, drikke og glede. På dagtid blir det også gratis barneprogram. Vi løfter frem lokale og kortreiste artister, og skaper en inkluderende møteplass hvor hele nabolaget, kommunen og hvem som helst ellers er velkommen!
          <br /><br />
          Mer info om programmet kommer.
          Hold deg oppdatert på fosskok.no, og følg med på instagram og facebook for artistslipp.
        </p>
        
        <div className={styles.festivalContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kjøp festivalpass</h2>
            <div className={styles.ticketInfo}>
              <div className={styles.ticketType}>
                <h3>Dagspass</h3>
                <p className={styles.price}>kr 350,-</p>
                <p className={styles.earlyBird}>Første 30 billetter: kr 300,-</p>
                <p>Under 16 år: <strong>Gratis!</strong></p>
                <Link href="https://tikkio.com/events/56347" target="_blank" rel="noopener noreferrer" className={styles.button}>Kjøp nå</Link>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Line-up <span style={{fontSize: '1rem', fontWeight: 400, marginLeft: 8}}>(med forbehold om endringer)</span></h2>
            
            <div className={styles.lineup}>
              <div className={styles.stage}>
                <h3>Lørenskog Kirke</h3>
                <div className={styles.stageTable}>
                  {kirkenArtists.map((artist, idx) => (
                    <ArtistCard
                      key={artist.title + idx}
                      artist={artist}
                      onClick={() => setSelectedArtist(artist)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.stage}>
                <h3>Hagescenen</h3>
                <div className={styles.stageTable}>
                  {hagenArtists.map((artist, idx) => (
                    <ArtistCard
                      key={artist.title + idx}
                      artist={artist}
                      onClick={() => setSelectedArtist(artist)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.stage}>
                <h3>Stabburet</h3>
                <div className={styles.stageTable}>
                  {stabburetArtists.map((artist, idx) => (
                    <ArtistCard
                      key={artist.title + idx}
                      artist={artist}
                      onClick={() => setSelectedArtist(artist)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Mat og drikke</h2>
            <p className={styles.foodDrinkText}>
             Informasjon kommer!
            </p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Praktisk info</h2>
            <div className={styles.practicalInfo}>
              <p><strong>Parkering:</strong> Parkering på gravplassen rett ved kirken fra 12-16. Fra 16 kan man stå på den store parkeringsplassen utenfor kirken.</p>
              <p><strong>Dato:</strong> Lørdag 14. juni</p>
              <p><strong>Start:</strong> 14:00</p>
              <p><strong>Slutt:</strong> 23:59</p>
              <p><strong>Transport:</strong> Buss 110 stopper 2 minutter unna og går nesten hele døgnet.</p>
            </div>
          </section>
        </div>
      </div>
      {selectedArtist && (
        <ArtistPopup
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
        />
      )}
    </ContentContainer>
  );
}
