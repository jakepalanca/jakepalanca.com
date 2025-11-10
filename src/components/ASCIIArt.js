const normalizeASCII = (art) => art.replace(/^\n/, '').replace(/\n\s*$/, '');

const desktopArt = normalizeASCII(String.raw`
     ██╗ █████╗ ██╗  ██╗███████╗    ██████╗  █████╗ ██╗      █████╗ ███╗   ██╗ ██████╗ █████╗ 
     ██║██╔══██╗██║ ██╔╝██╔════╝    ██╔══██╗██╔══██╗██║     ██╔══██╗████╗  ██║██╔════╝██╔══██╗
     ██║███████║█████╔╝ █████╗      ██████╔╝███████║██║     ███████║██╔██╗ ██║██║     ███████║
██   ██║██╔══██║██╔═██╗ ██╔══╝      ██╔═══╝ ██╔══██║██║     ██╔══██║██║╚██╗██║██║     ██╔══██║
╚█████╔╝██║  ██║██║  ██╗███████╗    ██║     ██║  ██║███████╗██║  ██║██║ ╚████║╚██████╗██║  ██║
 ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝
`);

const mobileFirstName = normalizeASCII(String.raw`
     ██╗ █████╗ ██╗  ██╗███████╗                          
     ██║██╔══██╗██║ ██╔╝██╔════╝                          
     ██║███████║█████╔╝ █████╗                            
██   ██║██╔══██║██╔═██╗ ██╔══╝                            
╚█████╔╝██║  ██║██║  ██╗███████╗                          
 ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝                          
`);

const mobileLastName = normalizeASCII(String.raw`
██████╗  █████╗ ██╗      █████╗ ███╗   ██╗ ██████╗ █████╗ 
██╔══██╗██╔══██╗██║     ██╔══██╗████╗  ██║██╔════╝██╔══██╗
██████╔╝███████║██║     ███████║██╔██╗ ██║██║     ███████║
██╔═══╝ ██╔══██║██║     ██╔══██║██║╚██╗██║██║     ██╔══██║
██║     ██║  ██║███████╗██║  ██║██║ ╚████║╚██████╗██║  ██║
╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝
`);

const ASCIIArt = () => (
  <>
    {/* Desktop version - full name on one line */}
    <div className="ascii-header desktop-header">{desktopArt}</div>

    {/* Mobile version - first name then last name */}
    <div className="ascii-header mobile-header">
      <div className="mobile-first-name">{mobileFirstName}</div>
      <div className="mobile-last-name">{mobileLastName}</div>
    </div>
  </>
);

export default ASCIIArt;
