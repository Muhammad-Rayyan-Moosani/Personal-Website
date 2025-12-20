import "./StyleSheet.css";

export default function Contacts() {
  return (
    <section className="contacts" id="contacts">
      <h1>Contact</h1>
      <p>Let’s connect</p>

      <div
  className="contact-box"
  style={{
    maxWidth: '500px',
    width: '300px',
    margin: '15px auto 0',
    padding: '20px',
    borderRadius: '16px',
    backgroundColor: '#0a122a', // same as card
    border: '2px solid #00eaff', // same as card border
    display: 'flex',
    flexDirection: 'column',     // stack vertically
    alignItems: 'center',
    gap: '15px',
  }}
>
  {/* Top row: Links */}
  <div className="contact-links"
    style={{
      display: 'flex',
      gap: '20px',       // space between links
      justifyContent: 'center',
      flexWrap: 'wrap',  // wrap on small screens
    }}
  >
    <a
      href="https://www.linkedin.com/in/rayyan-moosani-64b4971aa/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#00eaff', textDecoration: 'none' }}
    >
      LinkedIn
    </a>
    <a
      href="https://github.com/Muhammad-Rayyan-Moosani"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#00eaff', textDecoration: 'none' }}
    >
      GitHub
    </a>
    <a href="mailto:mrayyanm411@gmail.com" style={{ color: '#00eaff', textDecoration: 'none' }}>
      Gmail
    </a>
  </div>

  {/* Bottom row: Webring logo with arrows */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '-15px' }}>
   <a
    href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/?nav=prev"
    style={{ color: 'white', textDecoration: 'none', fontSize: '18px', marginLeft: '-5px',marginTop: '5px' ,marginRight: '-5px'}}

  >
    ⤆
  </a>
    <a href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/" target="_blank">
      <img
        src="https://cs.uwatering.com/icon.white.svg"
        alt="CS Webring"
        style={{  width: '26px', height: '30px', opacity: 0.8, marginTop: '15px' ,marginLeft: '5px'}}
      />
    </a>
    <a
    href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/?nav=next"
    style={{ color: 'white', textDecoration: 'none', fontSize: '18px', marginLeft: '-5px',marginTop: '5px' }}
  >
    ⤇
  </a>
  </div>
</div>
      

    </section>
    
  );
}